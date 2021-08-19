import React, { useRef, useEffect, useState } from 'react';
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
import { DryadFunction, DryadDeclarations, HtmlSkeletonStatic } from '../ssg';
import styled from '@emotion/styled';
import * as themes from './themes';
import { tree } from '@/cypressTree';
import { ErrorIcon } from './icons';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/useTheme';
import { EditorTheme } from '@/Theming/DarkTheme';

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
  tryToLoadOnFirstRun?: boolean;
  onTabChange?: (e: Editors) => void;
  reloadDryad?: boolean;
  theme?: EditorTheme;
}
const root = tree.tree.main;

export const HalfCode = ({
  className = '',
  value,
  setValue,
  settings,
  style = {},
  tryToLoadOnFirstRun,
  onTabChange,
  reloadDryad,
}: HalfCodeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const allEditors = [Editors.css, Editors.js];

  const [editor, setEditor] = useState<Editors>(Editors.js);
  const [schemaString, setSchema] = useState('');
  const [errors, setErrors] = useState<any>();

  const [dryad, setDryad] = useState<string>('');
  const [dryadPending, setDryadPending] = useState<
    'yes' | 'no' | 'unset' | 'empty'
  >('unset');
  const [providerJS, setProviderJS] = useState<monaco.IDisposable>();
  const [currentMonacoInstance, setCurrentMonacoInstance] =
    useState<typeof monaco>();

  const [view, setView] = useState<'split' | 'code' | 'display'>('split');
  const [{ width, height }, setSize] = useState({
    width: '50%',
    height: '100%',
  });
  const { theme: editorTheme } = useTheme();

  const currentConfig = Config[editor];
  const openBlob = () => {
    const url = URL.createObjectURL(
      new Blob([dryad], { type: 'text/html;charset=utf-8' }),
    );
    // eslint-disable-next-line
    window?.open(url);
  };

  useEffect(() => {
    return () => {
      setCurrentMonacoInstance(undefined);
    };
  }, []);

  useEffect(() => {
    refreshDryad();
  }, [reloadDryad]);

  useEffect(() => {
    return () => {
      providerJS?.dispose();
    };
  }, [providerJS]);

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
      const typings = TreeToTS.javascriptSplit(graphqlTree).definitions.replace(
        /export /gm,
        '',
      );
      setProviderJS((p) => {
        p?.dispose();
        return currentMonacoInstance?.languages.typescript.javascriptDefaults.addExtraLib(
          `
          ${DryadDeclarations}
          ${typings}`,
        );
      });
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
          script: r.script,
          style: css,
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
      executeDryad(js, css, schemaString, settings.url);
    }
  };

  useEffect(() => {
    if (tryToLoadOnFirstRun && !dryad && schemaString) {
      refreshDryad();
    }
  }, [tryToLoadOnFirstRun, schemaString]);

  useEffect(() => {
    const f = () => {};
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

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
            path={editor}
            onChange={(e) => {
              setValue({
                ...value,
                [editor]: e,
              });
            }}
            theme={currentConfig.themeModule}
            options={currentConfig.options}
            language={currentConfig.options.language}
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
