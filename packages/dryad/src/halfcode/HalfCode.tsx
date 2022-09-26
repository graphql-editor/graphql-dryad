import React, {
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
} from 'react';
import type * as monaco from 'monaco-editor';
import { Resizable } from 're-resizable';
import { TreeToTS } from 'graphql-zeus';
import { Parser } from 'graphql-js-tree';
import { getParsedSchema } from '../schema';
import { Tabs, Container, Tab } from '../components';
import { Values, Editors, Config, extendJs } from './Config';
import { Settings } from '../models';
import * as icons from './icons';
import * as themes from './themes';
import { tree } from '@/cypressTree';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';
import { EditorTheme } from '@/Theming/DarkTheme';
import { PackageCache, useTypings } from '@/hooks/useTypings';
import { DryadExecutor, DryadExecutorApi } from '@/halfcode/Executor';
import { useImperativeRef } from '@/hooks/useImperativeRef';

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
  typingsURL?: string;
  libs?: Array<{ content: string; filePath: string }>;
}
const root = tree.tree.main;
const ZEUS_TYPINGS_PATH = 'file:///node_modules/@types/typings-zeus/index.d.ts';
const REACT_RUNTIME_PATH = 'file:///node_modules/react/jsx-runtime.d.ts';

export interface HalfCodeApi {
  areTypesLoading?: boolean;
}

export const HalfCode = React.forwardRef<HalfCodeApi, HalfCodeProps>(
  (
    {
      className = '',
      value,
      setValue,
      settings,
      style = {},
      onTabChange,
      libs,
      path,
      readOnly,
      typingsURL,
    },
    ref,
  ) => {
    const allEditors = [Editors.css, Editors.js];

    const [editor, setEditor] = useState<Editors>(Editors.js);
    const [schemaString, setSchema] = useState('');

    const [zeusTypings, setZeusTypings] = useState('');
    const [currentMonacoInstance, setCurrentMonacoInstance] =
      useState<typeof monaco>();
    const [currentTsConfig, setCurrentTsConfig] =
      useState<monaco.languages.typescript.CompilerOptions>({
        jsx: 4,
      });
    const [currentLibraries, setCurrentLibraries] =
      useState<Array<{ filePath?: string; content: string }>>();

    const { theme: editorTheme } = useTheme();
    const { downloadTypings, getPackages } = useTypings();
    const [api, setApi] = useImperativeRef<DryadExecutorApi>();
    const [typesLoading, setTypesLoading] = useState(false);
    const [packageCache, setPackageCache] = useState<PackageCache>({});

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
          [
            ...currentLibraries,
            {
              content: zeusTypings,
              filePath: ZEUS_TYPINGS_PATH,
            },
          ],
        );
      }
    }, [currentMonacoInstance, currentLibraries, zeusTypings]);

    useEffect(() => {
      return () => {
        setCurrentMonacoInstance(undefined);
      };
    }, []);

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

    useEffect(() => {
      const f = () => {};
      window.addEventListener('resize', f);
      return () => window.removeEventListener('resize', f);
    }, []);

    const packages = useMemo(() => {
      if (!currentMonacoInstance) return [];
      return getPackages({ packageCache, filesContent: [value[Editors.js]] });
    }, [value[Editors.js], currentMonacoInstance, packageCache]);

    useEffect(() => {
      if (!packages.length) {
        return;
      }
      setTypesLoading(true);
      downloadTypings({ packages, typingsURL }).then((paths) => {
        setPackageCache((pc) => ({ ...pc, ...paths }));
        setTypesLoading(false);
      });
    }, [packages, libs, zeusTypings]);

    useEffect(() => {
      if (Object.keys(packageCache).length) {
        if (currentMonacoInstance) {
          const extralibs: typeof currentLibraries = [];
          const mergedLibs = Object.entries(packageCache).flatMap(
            ([, content]) => {
              return content.map((c) => {
                return {
                  filePath: `file:///${c.path}`,
                  ...c,
                };
              });
            },
          );
          const reactLib = mergedLibs.find(({ name }) => name === 'react');
          if (reactLib) {
            extralibs.push({
              filePath: REACT_RUNTIME_PATH,
              content: `import "${reactLib.url}";`,
            });
          }
          setCurrentLibraries([...mergedLibs, ...extralibs, ...(libs || [])]);

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
    }, [packageCache]);

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
    useImperativeHandle(
      ref,
      () => ({
        areTypesLoading: typesLoading,
      }),
      [typesLoading],
    );

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
              refresh={() => {
                api?.refreshDryad();
              }}
              openBlob={() => {
                api?.openBlob();
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
                monaco.editor.defineTheme(
                  'JsTheme',
                  themes.JsTheme(editorTheme),
                );
                setCurrentMonacoInstance(monaco);
              }}
              path={
                editor === Editors.js
                  ? `file:///index.tsx`
                  : `file:///index.css`
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
          <DryadExecutor
            ref={setApi}
            settings={settings}
            value={value}
            libs={libs}
            path={path}
          />
        </Container>
      </>
    );
  },
);
