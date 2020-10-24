import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Resizable } from 're-resizable';
import { Parser, TreeToTS } from 'graphql-zeus';
import { getParsedSchema } from '../schema';
import { initLanguages } from './languages';
import { R, Tabs, Container, Place, Tab, Placehold } from '../components';
import * as initialParameters from './initial';
import { Values, Editors, Config, Refs, extendJs } from './Config';
import { Settings } from '../models';
import * as icons from './icons';
import { DryadFunction, DryadDeclarations, HtmlSkeletonStatic } from '../ssg';
import { EditorRestyle } from './styles/editor';
import styled from '@emotion/styled';
import { Colors } from '../Colors';

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

const MainFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;

const EditorRef = styled.div`
  height: calc(100% - 30px);
`;

initLanguages();

export interface HalfCodeProps {
  className?: string;
  editorOptions?: monaco.editor.IEditorOptions;
  initial?: Partial<Values>;
  onChange?: (props: Values) => void;
  style?: React.CSSProperties;
  settings: Settings;
  tryToLoadOnFirstRun?: boolean;
}

export const HalfCode = ({
  className = '',
  editorOptions,
  initial = {},
  onChange,
  settings,
  style = {},
  tryToLoadOnFirstRun,
}: HalfCodeProps) => {
  const refs: Refs = {
    css: useRef<HTMLDivElement>(null),
    js: useRef<HTMLDivElement>(null),
  };
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const allEditors = [Editors.css, Editors.js];

  const [editor, setEditor] = useState<Editors>(Editors.js);
  const [schemaString, setSchema] = useState('');
  const [errors, setErrors] = useState<any>();

  const initialValues: Values = {
    css: initialParameters.initialCss,
    js: initialParameters.initialJS,
    ...initial,
  };
  const [value, setValue] = useState(initialValues);

  const [dryad, setDryad] = useState<string>('');
  const [dryadPending, setDryadPending] = useState<
    'yes' | 'no' | 'unset' | 'empty'
  >('unset');
  const [providerJS, setProviderJS] = useState<monaco.IDisposable>();

  const [monacoInstance, setMonacoInstance] = useState<
    monaco.editor.IStandaloneCodeEditor
  >();
  const [monacoSubscription, setMonacoSubscription] = useState<
    monaco.IDisposable
  >();
  const [view, setView] = useState<'split' | 'code' | 'display'>('split');
  const [{ width, height }, setSize] = useState({
    width: '50%',
    height: '100%',
  });

  const currentRef = refs[editor];
  const currentValue = value[editor];
  const currentInitialValue = initialValues[editor];
  const currentConfig = Config[editor];

  const openBlob = () => {
    const url = URL.createObjectURL(
      new Blob([dryad], { type: 'text/html;charset=utf-8' }),
    );
    // eslint-disable-next-line
    window?.open(url);
  };

  useEffect(() => {
    setValue(initialValues);
    monacoInstance?.setValue(initialValues[editor]);
    if (schemaString && settings.url) {
      executeDryad(
        initialValues.js,
        initialValues.css,
        schemaString,
        settings.url,
      );
    }
  }, [initialValues.css, initialValues.js]);
  useEffect(() => {
    return () => {
      monacoInstance?.dispose();
      monacoSubscription?.dispose();
    };
  }, [monacoInstance, monacoSubscription]);

  useEffect(() => {
    return () => {
      providerJS?.dispose();
    };
  }, [providerJS]);

  useEffect(() => {
    if (currentValue !== currentInitialValue && onChange) {
      onChange(value);
    }
  }, [currentValue]);
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
  }, [value[Editors.js], schemaString]);
  useEffect(() => {
    if (iframeRef.current) {
      const style = iframeRef.current.contentWindow?.document.getElementById(
        'styleTag',
      );
      if (style) {
        style.innerHTML = value[Editors.css];
      }
    }
  }, [value[Editors.css], iframeRef.current]);

  useEffect(() => {
    if (schemaString) {
      const graphqlTree = Parser.parse(schemaString);
      const typings = TreeToTS.javascript(graphqlTree).definitions.replace(
        /export /gm,
        '',
      );
      setProviderJS((p) => {
        p?.dispose();
        return monaco.languages.typescript.javascriptDefaults.addExtraLib(
          `
          ${DryadDeclarations}
          ${typings}`,
        );
      });
    }
  }, [schemaString]);

  useEffect(() => {
    getParsedSchema(settings).then((fetchedSchema) => {
      setSchema(fetchedSchema);
    });
  }, [settings.url]);

  useEffect(() => {
    resetEditor();
  }, [editor]);

  useLayoutEffect(() => {
    monacoInstance?.layout();
  }, [width]);

  const resetEditor = () => {
    if (editor === Editors.js) {
      extendJs();
    }
    const m = monaco.editor.create(currentRef.current!, {
      ...currentConfig.options,
      value: currentValue,
    });
    if (editorOptions) {
      m.updateOptions(editorOptions);
      monaco.editor.remeasureFonts();
    }

    monacoSubscription?.dispose();
    monacoInstance?.getModel()?.dispose();
    monacoInstance?.dispose();
    const subscription = m.onDidChangeModelContent(() => {
      const model = m.getModel();
      if (model) {
        const modelValue = model.getValue();
        if (modelValue) {
          setValue((value) => ({ ...value, [editor]: modelValue }));
        }
      }
    });
    setMonacoInstance(m);
    setMonacoSubscription(subscription);
  };
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
    if (js) {
      executeDryad(js, css, schemaString, settings.url);
    }
  };

  useEffect(() => {
    if (tryToLoadOnFirstRun && !dryad && schemaString) {
      refreshDryad();
    }
  }, [tryToLoadOnFirstRun, schemaString]);
  return (
    <>
      <Container className={className} style={style}>
        <Resizable
          defaultSize={{
            width: '50vw',
            height: '100%',
          }}
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
          onResizeStop={(e, direction, ref, d) => {
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
                <Tab active={editor === t} onClick={() => setEditor(t)} key={t}>
                  <Icon size={12} />.{t}
                </Tab>
              );
            })}
          </Tabs>
          {allEditors.map((e) => (
            <EditorRef
              key={e}
              style={{
                display: editor === e ? 'block' : 'none',
              }}
              ref={refs[e]}
            ></EditorRef>
          ))}
          <style>{EditorRestyle}</style>
        </Resizable>

        <Place>
          <IconsDiv>
            <R
              title="Run GraphQL Query( Cmd/Ctrl + S )"
              about="Run Query"
              variant={'play'}
              onClick={refreshDryad}
              backgroundColor={Colors.blue[5]}
            />
            <R
              backgroundColor={Colors.main[5]}
              title="Preview in new tab"
              about="Preview HTML"
              variant={'eye'}
              onClick={openBlob}
            />
          </IconsDiv>
          {errors && <Placehold>{errors.message}</Placehold>}
          {!errors && (
            <>
              {dryadPending === 'unset' ? (
                <Placehold>
                  Click <b>play</b> to run the code
                </Placehold>
              ) : dryadPending === 'empty' ? (
                <Placehold>Empty string returne from function</Placehold>
              ) : dryadPending === 'yes' ? (
                <Placehold>Loading...</Placehold>
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
