import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Resizable } from 're-resizable';
import { Utils, Parser, TreeToTS } from 'graphql-zeus';
import { initLanguages } from './languages';
import { R, Tabs, Name, Container, Place, DryadBody, Tab } from '../components';
import * as initialParameters from './initial';
import { Values, Editors, Config, Refs } from './Config';
import { Settings } from '../models';
import * as icons from './icons';
import { Menu } from '../components/Menu';
import { HtmlSkeletonStatic, DryadFunction } from '../ssg';
import FileSaver from 'file-saver';

initLanguages();

export interface HalfCodeProps {
  className?: string;
  editorOptions?: monaco.editor.IEditorOptions;
  initial?: Exclude<Partial<Values>, Editors.settings>;
  name?: string;
  onChange?: (props: Values) => void;
  style?: React.CSSProperties;
  settings: Settings;
  disabled?: Editors[];
  exportEnabled?: boolean;
  tryToLoadOnFirstRun?: boolean;
}

export const HalfCode = ({
  className = '',
  editorOptions,
  initial = {},
  name,
  onChange,
  settings,
  style = {},
  disabled = [],
  exportEnabled = false,
  tryToLoadOnFirstRun,
}: HalfCodeProps) => {
  const refs: Refs = {
    css: useRef<HTMLDivElement>(null),
    js: useRef<HTMLDivElement>(null),
    settings: useRef<HTMLDivElement>(null),
  };

  const allEditors = [Editors.css, Editors.js, Editors.settings].filter(
    (e) => !disabled.includes(e),
  );

  const [editor, setEditor] = useState<Editors>(Editors.js);
  const [schemaString, setSchema] = useState('');
  const [currentSettings, setCurrentSettings] = useState({ ...settings });
  const [passedSettings, setPassedSettings] = useState({ ...settings });

  const initialValues: Values = {
    css: initialParameters.initialCss,
    js: initialParameters.initialJS,
    settings: JSON.stringify(settings, null, 4),
    ...initial,
  };
  const [value, setValue] = useState(initialValues);

  const [dryad, setDryad] = useState<string>('');
  const [, setScript] = useState<string>();
  const [providerJS, setProviderJS] = useState<monaco.IDisposable>();

  const [monacoInstance, setMonacoInstance] = useState<
    monaco.editor.IStandaloneCodeEditor
  >();
  const [monacoSubscription, setMonacoSubscription] = useState<
    monaco.IDisposable
  >();

  const [menuOpen, setMenuOpen] = useState(false);

  const currentRef = refs[editor];
  const currentValue = value[editor];
  const currentInitialValue = initialValues[editor];
  const currentConfig = Config[editor];

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
          declare const useCustomElement: <T>(classDefinition:T) => void
          ${typings}`,
        );
      });
    }
  }, [schemaString]);

  useEffect(() => {
    Utils.getFromUrl(
      passedSettings.url,
      Object.keys(passedSettings.headers).map(
        (k) => `${k}: ${passedSettings.headers[k]}`,
      ),
    ).then((fetchedSchema) => {
      setSchema(fetchedSchema);
    });
  }, [passedSettings.url]);

  useEffect(() => {
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
    if (currentSettings.url !== passedSettings.url) {
      setPassedSettings({ ...currentSettings });
    }
  }, [editor]);

  const getDryadFunctionResult = async (build: boolean = false) => {
    const js = value[Editors.js];
    if (js) {
      const result: {
        body: string;
        script?: string;
      } = await DryadFunction({
        js,
        schema: schemaString,
        url: passedSettings.url,
        build,
      })();
      if (typeof result.body !== 'string') {
        throw new Error('Js has to return string');
      }
      return result;
    }
    return;
  };
  const executeDryad = () => {
    const js = value[Editors.js];
    if (js) {
      try {
        getDryadFunctionResult().then((r) => {
          if (!r) {
            return;
          }
          setDryad(r.body);
          setScript(r.script);
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const settingsValue = value[Editors.settings];
    if (settingsValue) {
      try {
        const newSettings = JSON.parse(settingsValue);
        setCurrentSettings(newSettings);
      } catch (error) {}
    }
  }, [value[Editors.settings]]);

  useEffect(() => {
    if (tryToLoadOnFirstRun && !dryad && schemaString) {
      setPassedSettings({ ...currentSettings });
      executeDryad();
    }
  }, [tryToLoadOnFirstRun, schemaString]);

  return (
    <>
      <Container className={className} style={style}>
        <Resizable
          defaultSize={{
            width: 400,
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
          {menuOpen && (
            <Menu
              categories={[
                {
                  name: 'Export Static Website',
                  description:
                    'Export your GraphQL query together with CSS as static website with prefetched data',
                  onClick: async () => {
                    const result = await getDryadFunctionResult(true);
                    if (!result) {
                      throw new Error('Cannot generate html');
                    }
                    const { body, script } = result;
                    const compiled = HtmlSkeletonStatic({
                      body,
                      style: value[Editors.css],
                      script,
                    });
                    FileSaver.saveAs(new Blob([compiled]), 'dryad.html');
                  },
                },
              ]}
            />
          )}
          <Tabs>
            {allEditors.map((t) => {
              const Icon = icons[Config[t].icon];
              return (
                <Tab active={editor === t} onClick={() => setEditor(t)} key={t}>
                  <Icon size={12} />.{t}
                </Tab>
              );
            })}
            {exportEnabled && (
              <Tab
                style={{ marginLeft: 'auto' }}
                active={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <icons.More size={12} />
              </Tab>
            )}
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
          <style>
            {`.editor-widget{
              position:fixed !important;
            }
            .context-view{
              position:fixed !important;
            }
            .monaco-aria-container{
              bottom: 0;
            }
            `}
          </style>
        </Resizable>

        <Place>
          <Name>{name}</Name>
          <R
            variant={'play'}
            onClick={() => {
              setPassedSettings({ ...currentSettings });
              executeDryad();
            }}
          />
          <DryadBody>
            <div
              style={{ display: 'contents' }}
              dangerouslySetInnerHTML={{
                __html: dryad,
              }}
            />
          </DryadBody>
        </Place>
      </Container>
      <style>{value[Editors.css]}</style>
    </>
  );
};
