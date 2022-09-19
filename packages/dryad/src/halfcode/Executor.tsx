import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';
import { getParsedSchema } from '../schema';
import { Place, Placehold, LoadingDots, RNoop } from '../components';
import { Values, Editors } from './Config';
import { Settings } from '../models';
import { DryadFunction, HtmlSkeletonStatic } from '../ssg';
import styled from '@emotion/styled';
import { ErrorIcon } from './icons';
import { useTheme } from '@/hooks/useTheme';
import { initialize } from 'esbuild-wasm';

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

const HelpText = styled.div`
  display: flex;
  align-items: center;
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

export interface DryadExecutorApi {
  openBlob: () => void;
  refreshDryad: () => void;
}
export const DryadExecutor = React.forwardRef<
  DryadExecutorApi,
  DryadExecutorProps
>(({ value, settings, libs, path }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [schemaString, setSchema] = useState('');
  const [errors, setErrors] = useState<any>();
  const [wasmStarted, setWasmStarted] = useState(false);

  const [dryad, setDryad] = useState<string>('');
  const [dryadPending, setDryadPending] = useState<
    'yes' | 'no' | 'unset' | 'empty'
  >('unset');

  const { theme: editorTheme } = useTheme();

  const openBlob = useCallback(() => {
    const url = URL.createObjectURL(
      new Blob([dryad], { type: 'text/html;charset=utf-8' }),
    );
    // eslint-disable-next-line
    window?.open(url);
  }, [dryad]);

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

  const executeDryad = useCallback(
    async ({
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
    },
    [libs],
  );
  const refreshDryad = useCallback(async () => {
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
  }, [executeDryad, value, schemaString, settings]);

  useEffect(() => {
    if (schemaString && wasmStarted && path && path !== pathInitialized) {
      pathInitialized = path;
      refreshDryad();
    }
  }, [schemaString, wasmStarted, path]);

  useImperativeHandle(
    ref,
    () => ({ refreshDryad, openBlob } as DryadExecutorApi),
    [refreshDryad, openBlob],
  );

  return (
    <Place>
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
              <HelpText>
                <span>Click</span>
                <RNoop variant="play" /> to run the code.
              </HelpText>
              <HelpText>
                <span>Click</span>
                <RNoop variant="eye" /> to preview in new tab.
              </HelpText>
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
});
