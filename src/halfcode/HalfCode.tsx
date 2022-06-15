import React, { useRef, useEffect, useState } from 'react';
import { TreeToTS } from 'graphql-zeus';
import { Parser } from 'graphql-js-tree';
import { getParsedSchema } from '../schema';
import { R, Container, Place, Placehold, LoadingDots } from '../components';
import { Settings } from '../models';
import { DryadFunction, HtmlSkeletonStatic } from '../ssg';
import styled from '@emotion/styled';
import { tree } from '@/cypressTree';
import { useTheme } from '@/hooks/useTheme';
import { EditorTheme } from '@/Theming/DarkTheme';
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

export interface HalfCodeProps {
  className?: string;
  value: string;
  css: string;
  onDryad: (dryad: string) => void;
  onZeus: (zeus: string) => void;
  style?: React.CSSProperties;
  settings: Settings;
  theme?: EditorTheme;
  path?: string;
  readOnly?: boolean;
  libs?: Array<{ content: string; filePath: string }>;
}
const root = tree.tree.main;
let WASM_INITIALIZED = false;
let pathInitialized = '';

const startService = async () => {
  await initialize({
    worker: true,
    wasmURL: 'https://unpkg.com/esbuild-wasm@0.13.5/esbuild.wasm',
  });
};
export const HalfCode = ({
  className = '',
  value,
  css,
  settings,
  style = {},
  libs,
  path,
  readOnly,
  onDryad,
  onZeus,
}: HalfCodeProps) => {
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
        style.innerHTML = css;
      }
    }
  }, [css, iframeRef.current]);

  useEffect(() => {
    if (schemaString) {
      const graphqlTree = Parser.parse(schemaString);
      const typings = TreeToTS.resolveTree({
        tree: graphqlTree,
      }).replace(/export /gm, '');
      onZeus(typings);
    }
  }, [schemaString]);

  useEffect(() => {
    getParsedSchema(settings).then((fetchedSchema) => {
      setSchema(fetchedSchema);
    });
  }, [settings.url]);

  const executeDryad = async (
    js: string,
    css: string,
    schema: string,
    url: string,
  ) => {
    try {
      setDryadPending('yes');
      const r = await DryadFunction({
        js,
        schema,
        url,
        libs,
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
        }),
      );
    } catch (error) {
      setErrors(error);
    }
  };
  const refreshDryad = async () => {
    if (value && schemaString && settings.url) {
      executeDryad(value, css, schemaString, settings.url);
    }
  };

  useEffect(() => {
    if (schemaString && wasmStarted && path && path !== pathInitialized) {
      pathInitialized = path;
      refreshDryad();
    }
  }, [schemaString, wasmStarted, path]);

  return (
    <Container data-cy={root.element} className={className} style={style}>
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
    </Container>
  );
};
