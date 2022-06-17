import React, { useRef, useEffect, useState, useMemo } from 'react';
import type * as monaco from 'monaco-editor';
import { Resizable } from 're-resizable';
import { TreeToTS } from 'graphql-zeus';
import { Parser } from 'graphql-js-tree';
import { getParsedSchema } from '../schema';
import {
  R,
  Tabs,
  Container,
  Place,
  Tab,
  Placehold,
  LoadingDots,
} from '../components';
import { Values, Editors, Config, extendJs } from './Config';
import { Settings } from '../models';
import * as icons from './icons';
import { DryadFunction, HtmlSkeletonStatic } from '../ssg';
import styled from '@emotion/styled';
import * as themes from './themes';
import { tree } from '@/cypressTree';
import { ErrorIcon } from './icons';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';
import { EditorTheme } from '@/Theming/DarkTheme';
import { initialize } from 'esbuild-wasm';
import { useTypings } from '@/hooks/useTypings';

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
  value: Values;
  setValue: (props: Values) => void;
  style?: React.CSSProperties;
  settings: Settings;
  onTabChange?: (e: Editors) => void;
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
    wasmURL: 'https://unpkg.com/esbuild-wasm@0.14.45/esbuild.wasm',
  });
};
export const HalfCode = ({
  className = '',
  value,
  setValue,
  settings,
  style = {},
  onTabChange,
  libs,
  path,
  readOnly,
}: HalfCodeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const allEditors = [Editors.css, Editors.js];

  const [editor, setEditor] = useState<Editors>(Editors.js);
  const [schemaString, setSchema] = useState('');
  const [errors, setErrors] = useState<any>();
  const [wasmStarted, setWasmStarted] = useState(false);

  const [zeusTypings, setZeusTypings] = useState('');
  const [dryad, setDryad] = useState<string>('');
  const [dryadPending, setDryadPending] = useState<
    'yes' | 'no' | 'unset' | 'empty'
  >('unset');
  const [currentMonacoInstance, setCurrentMonacoInstance] =
    useState<typeof monaco>();
  const [currentTsConfig, setCurrentTsConfig] =
    useState<monaco.languages.typescript.CompilerOptions>({
      jsx: 4,
    });
  const [currentLibraries, setCurrentLibraries] =
    useState<Array<{ filePath?: string; content: string }>>();

  const [view, setView] = useState<'split' | 'code' | 'display'>('split');
  const [{ width, height }, setSize] = useState({
    width: '50%',
    height: '100%',
  });
  const { theme: editorTheme } = useTheme();
  const { downloadTypings } = useTypings();

  const openBlob = () => {
    const url = URL.createObjectURL(
      new Blob([dryad], { type: 'text/html;charset=utf-8' }),
    );
    // eslint-disable-next-line
    window?.open(url);
  };

  useEffect(() => {
    if (currentTsConfig && currentMonacoInstance) {
      currentMonacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions(
        currentTsConfig,
      );
    }
  }, [currentTsConfig, currentMonacoInstance]);

  useEffect(() => {
    if (currentMonacoInstance && currentLibraries) {
      currentMonacoInstance.languages.typescript.typescriptDefaults.setExtraLibs(
        currentLibraries,
      );
    }
  }, [currentMonacoInstance, currentLibraries]);

  useEffect(() => {
    if (!WASM_INITIALIZED) {
      WASM_INITIALIZED = true;
      startService().then(() => setWasmStarted(true));
    }
  }, []);

  useEffect(() => {
    return () => {
      setCurrentMonacoInstance(undefined);
    };
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
    if (schemaString) {
      const graphqlTree = Parser.parse(schemaString);
      const typings = TreeToTS.resolveTree({
        tree: graphqlTree,
      }).replace(/export /gm, '');
      setZeusTypings(typings);
    }
  }, [schemaString, currentMonacoInstance]);

  useEffect(() => {
    getParsedSchema(settings).then((fetchedSchema) => {
      setSchema(fetchedSchema);
    });
  }, [settings.url]);

  useEffect(() => {
    if (editor === Editors.js && currentMonacoInstance) {
      extendJs(currentMonacoInstance);
    }
  }, [editor, currentMonacoInstance]);

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

  useEffect(() => {
    const f = () => {};
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

  useEffect(() => {
    downloadTypings({ filesContent: [value[Editors.js]] }).then((types) => {
      if (Object.keys(types).length) {
        if (currentMonacoInstance) {
          const extralibs: typeof currentLibraries = [];
          const mergedLibs = Object.entries(types).flatMap(([, content]) => {
            return content.map((c) => {
              return {
                filePath: `file:///${c.path}`,
                ...c,
              };
            });
          });
          const reactLib = mergedLibs.find(({ name }) => name === 'react');
          if (reactLib) {
            extralibs.push({
              filePath: 'file:///node_modules/react/jsx-runtime.d.ts',
              content: `import "${reactLib.url}";`,
            });
          }
          setCurrentLibraries([
            ...mergedLibs,
            ...extralibs,
            ...(libs || []),
            {
              content: zeusTypings,
              filePath: 'file:///node_modules/@types/typings-zeus/index.d.ts',
            },
          ]);

          const paths = mergedLibs.reduce<Record<string, string[]>>((a, b) => {
            a[b.url] ||= [];
            a[b.url].push(`file:///${b.path}`);
            return a;
          }, {});
          setCurrentTsConfig((tsconfig) => ({
            ...tsconfig,
            baseUrl: './',
            paths,
            types: ['typings-zeus'],
            rootDir: './',
            jsx: currentMonacoInstance.languages.typescript.JsxEmit.ReactJSX,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
          }));
        }
      }
    });
  }, [value[Editors.js], currentMonacoInstance, libs, zeusTypings]);

  useEffect(() => {
    if (currentMonacoInstance && editorTheme) {
      currentMonacoInstance.editor.defineTheme(
        'CssTheme',
        themes.CssTheme(editorTheme),
      );
      currentMonacoInstance.editor.defineTheme(
        'JsTheme',
        themes.JsTheme(editorTheme),
      );
    }
  }, [currentMonacoInstance, editorTheme]);

  const currentConfig = useMemo(() => {
    return {
      theme: Config[editor].themeModule,
      options: {
        ...Config[editor].options,
        readOnly: readOnly,
        theme: Config[editor].themeModule,
      },
      language: Config[editor].options.language,
    };
  }, [editor, readOnly]);

  return (
    <>
      <Container data-cy={root.element} className={className} style={style}>
        <Resizable
          defaultSize={{
            width: '50vw',
            height: '100%',
          }}
          data-cy={root.code.element}
          style={{ background: '#333', color: '#aaa', overflowY: 'hidden' }}
          enable={{
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            left: false,
            right: true,
            top: false,
            topLeft: false,
            topRight: false,
          }}
          size={{ width, height }}
          onResize={(e, direction, ref, d) => {
            setSize({
              width: width + d.width,
              height: height + d.height,
            });
          }}
          handleStyles={{
            right: {
              width: 5,
              right: 0,
            },
          }}
          maxWidth="100%"
          minWidth="30%"
        >
          <Tabs
            toggled={view === 'code'}
            toggle={() => {
              if (view !== 'code') {
                setSize({
                  height,
                  width: '100%',
                });
                setView('code');
                return;
              }
              setSize({
                height,
                width: '50%',
              });
              setView('split');
            }}
          >
            {allEditors.map((t) => {
              const Icon = icons[Config[t].icon];
              return (
                <Tab
                  data-cy={root.code.tabs[t].element}
                  active={editor === t}
                  onClick={() => {
                    onTabChange?.(t);
                    setEditor(t);
                  }}
                  key={t}
                >
                  <Icon size={12} />.{t}
                </Tab>
              );
            })}
          </Tabs>
          <Editor
            value={value[editor]}
            beforeMount={(monaco) => {
              monaco.languages.typescript.typescriptDefaults.setEagerModelSync(
                true,
              );
              monaco.editor.defineTheme(
                'CssTheme',
                themes.CssTheme(editorTheme),
              );
              monaco.editor.defineTheme('JsTheme', themes.JsTheme(editorTheme));
              setCurrentMonacoInstance(monaco);
            }}
            path={
              editor === Editors.js ? `file:///index.tsx` : `file:///index.css`
            }
            onChange={(e) => {
              setValue({
                ...value,
                [editor]: e,
              });
            }}
            {...currentConfig}
          />
        </Resizable>

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
      </Container>
    </>
  );
};
