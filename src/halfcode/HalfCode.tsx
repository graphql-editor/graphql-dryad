import React, { useRef, useEffect, useState } from 'react';
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

  const initialValues: Values = {
    css: initialParameters.initialCss,
    js: initialParameters.initialJS,
    ...initial,
  };
  const [value, setValue] = useState(initialValues);

  const [dryad, setDryad] = useState<string>('');
  const [dryadPending, setDryadPending] = useState(false);
  const [providerJS, setProviderJS] = useState<monaco.IDisposable>();

  const [monacoInstance, setMonacoInstance] = useState<
    monaco.editor.IStandaloneCodeEditor
  >();
  const [monacoSubscription, setMonacoSubscription] = useState<
    monaco.IDisposable
  >();

  const currentRef = refs[editor];
  const currentValue = value[editor];
  const currentInitialValue = initialValues[editor];
  const currentConfig = Config[editor];

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
      setDryadPending(true);
      const r = await DryadFunction({
        js,
        schema,
        url,
      });
      setDryadPending(false);
      if (!r) {
        return;
      }
      setDryad(
        HtmlSkeletonStatic({
          body: r.body,
          script: r.script,
          style: css,
        }),
      );
    } catch (error) {
      console.error(error);
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
          onResize={() => {
            monacoInstance?.layout();
          }}
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
          minWidth="1"
        >
          <Tabs>
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
            <div
              key={e}
              style={{
                height: `calc(100% - 30px)`,
                display: editor === e ? 'block' : 'none',
              }}
              ref={refs[e]}
            ></div>
          ))}
          <style>{EditorRestyle}</style>
        </Resizable>

        <Place>
          <R variant={'play'} onClick={refreshDryad} />
          {dryadPending ? (
            <Placehold>Loading...</Placehold>
          ) : (
            <iframe
              ref={iframeRef}
              style={{ width: '100%', height: '100%' }}
              srcDoc={dryad}
            />
          )}
        </Place>
      </Container>
    </>
  );
};
