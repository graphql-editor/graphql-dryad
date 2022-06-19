import React, { useRef, useEffect, useState } from 'react';
import { getParsedSchema } from '../schema';
import { R, Place, Placehold, LoadingDots } from '../components';
import { Values, Editors } from './Config';
import { Settings } from '../models';
import { DryadFunction, HtmlSkeletonStatic } from '../ssg';
import styled from '@emotion/styled';
import { tree } from '@/cypressTree';
import { ErrorIcon } from './icons';
import { useTheme } from '@/hooks/useTheme';
import { initialize } from 'esbuild-wasm';

const IconsDiv = styled.div`
  position: absolute;
  top: 47px;
  height: 100px;
  width: 60px;
  margin-left: -60px;
  align-items: end;
  justify-content: start;
  display: flex;
  flex-flow: column nowrap;
`;

const ErrorWithIcon = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 3rem;
`;

const ErrorText = styled.div<{ color?: string }>`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  display: flex;
  padding: 2rem 3rem;
  white-space: pre-line;
  text-align: center;
  color: ${({ color, theme: { text } }) => color || text};
`;

const MainFrame = styled.iframe`
  width: 100%;
  height: 100%;
  background: ${({
    theme: {
      background: { mainFar },
    },
  }) => mainFar};
  border: 0;
`;

export interface DryadExecutorProps {
  value: Values;
  settings: Settings;
  path?: string;
  libs?: Array<{ content: string; filePath: string }>;
}
let WASM_INITIALIZED = false;
let pathInitialized = '';

const startService = async () => {
  await initialize({
    worker: true,
    wasmURL: 'https://unpkg.com/esbuild-wasm@0.14.45/esbuild.wasm',
  });
};
export const DryadExecutor = ({
  value,
  settings,
  libs,
  path,
}: DryadExecutorProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [schemaString, setSchema] = useState('');
  const [errors, setErrors] = useState<any>();
  const [wasmStarted, setWasmStarted] = useState(false);

  const [dryad, setDryad] = useState<string>('');
  const [dryadPending, setDryadPending] = useState<
    'yes' | 'no' | 'unset' | 'empty'
  >('unset');

  const { theme: editorTheme } = useTheme();

  const openBlob = () => {
    const url = URL.createObjectURL(
      new Blob([dryad], { type: 'text/html;charset=utf-8' }),
    );
    // eslint-disable-next-line
    window?.open(url);
  };

  useEffect(() => {
    if (!WASM_INITIALIZED) {
      WASM_INITIALIZED = true;
      startService().then(() => setWasmStarted(true));
    }
  }, []);

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          refreshDryad();
        }
      }
    };
    document.addEventListener('keydown', keyListener);
    return () => document.removeEventListener('keydown', keyListener);
  }, [schemaString, value]);
  useEffect(() => {
    if (iframeRef.current) {
      const style =
        iframeRef.current.contentWindow?.document.getElementById('styleTag');
      if (style) {
        style.innerHTML = value[Editors.css];
      }
    }
  }, [value[Editors.css], iframeRef.current]);

  useEffect(() => {
    getParsedSchema(settings).then((fetchedSchema) => {
      setSchema(fetchedSchema);
    });
  }, [settings.url]);

  const executeDryad = async ({
    css,
    js,
    schema,
    url,
    headers,
  }: {
    js: string;
    css: string;
    schema: string;
    url: string;
    headers?: Record<string, string>;
  }) => {
    try {
      setDryadPending('yes');
      const r = await DryadFunction({
        js,
        schema,
        url,
        libs,
        headers,
      });
      setErrors(undefined);
      if (!r || !r.body) {
        setDryadPending('empty');
        return;
      }
      setDryadPending('no');
      setDryad(
        HtmlSkeletonStatic({
          head: r.head,
          body: r.body,
          script: r.localScript,
          style: css,
          scriptName: r.esmUrl,
          hydrate: r.hydrate,
        }),
      );
    } catch (error) {
      setErrors(error);
    }
  };
  const refreshDryad = async () => {
    const js = value[Editors.js];
    const css = value[Editors.css];
    if (js && schemaString && settings.url) {
      executeDryad({
        js,
        css,
        schema: schemaString,
        url: settings.url,
        headers: settings.headers,
      });
    }
  };

  useEffect(() => {
    if (schemaString && wasmStarted && path && path !== pathInitialized) {
      pathInitialized = path;
      refreshDryad();
    }
  }, [schemaString, wasmStarted, path]);

  return (
    <Place>
      <IconsDiv>
        <R
          title="Run GraphQL Query( Cmd/Ctrl + S )"
          about="Run Query"
          variant={'play'}
          onClick={refreshDryad}
          cypressName={tree.tree.main.execute.play.element}
        />
        <R
          title="Preview in new tab"
          about="Preview HTML"
          variant={'eye'}
          cypressName={tree.tree.main.execute.preview.element}
          onClick={openBlob}
        />
      </IconsDiv>
      {errors && (
        <ErrorWithIcon>
          <ErrorIcon iconColor={editorTheme.error} size={4} />
          <ErrorText color={editorTheme.error}>{errors.message}</ErrorText>
        </ErrorWithIcon>
      )}
      {!errors && (
        <>
          {dryadPending === 'unset' ? (
            <Placehold>
              Click play to run the code. {'\n'} Click eye to preview in new
              tab.
            </Placehold>
          ) : dryadPending === 'empty' ? (
            <Placehold>Empty string returned from function</Placehold>
          ) : dryadPending === 'yes' ? (
            <Placehold>
              Loading{' '}
              <LoadingDots
                color={editorTheme.text}
                dotSizeInPx={5}
                heightOfBounce={4}
              />
            </Placehold>
          ) : (
            <MainFrame ref={iframeRef} srcDoc={dryad} />
          )}
        </>
      )}
    </Place>
  );
};
