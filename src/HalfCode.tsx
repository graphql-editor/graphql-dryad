import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Resizable } from 're-resizable';
import { Utils, Parser, TypeDefinition } from 'graphql-zeus';
import { GqlSpecialLanguage, GqlLanguageConfiguration } from './languages';
import { GqlSpecialTheme, CssTheme, JsTheme, SettingsTheme } from './themes';
import { GqlSuggestions, CSSSuggestions } from './suggestions';
import { DryadGQL } from './DryadGQL';
import { R, Tabs, Name, Container, Place, DryadBody, Tab } from './components';
import * as initialParameters from './initial';
import { JSTypings } from './typings';
import { Values, Editors, Config, Refs } from './Config';
import { Settings } from './models';
import { useThrottledState } from './Throttle';
import * as icons from './icons';

export interface HalfCodeProps {
  className?: string;
  editorOptions?: monaco.editor.IEditorOptions;
  initial?: Exclude<Partial<Values>, Editors.settings>;
  name?: string;
  onChange?: (props: Values) => void;
  style?: React.CSSProperties;
  settings: Settings;
  disabled?: Editors[];
}

monaco.languages.register({ id: 'gqlSpecial' });

monaco.languages.setLanguageConfiguration('gqlSpecial', GqlLanguageConfiguration);
// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider('gqlSpecial', GqlSpecialLanguage);

monaco.editor.defineTheme('gqlSpecialTheme', GqlSpecialTheme);
monaco.editor.defineTheme('js', JsTheme);
monaco.editor.defineTheme('css', CssTheme);
monaco.editor.defineTheme('faker', SettingsTheme);

export const HalfCode = ({
  className = '',
  editorOptions,
  initial = {},
  name,
  onChange,
  settings,
  style = {},
  disabled = [],
}: HalfCodeProps) => {
  const refs: Refs = {
    css: useRef<HTMLDivElement>(null),
    graphql: useRef<HTMLDivElement>(null),
    js: useRef<HTMLDivElement>(null),
    settings: useRef<HTMLDivElement>(null),
  };

  const allEditors = [Editors.graphql, Editors.css, Editors.js, Editors.settings].filter((e) => !disabled.includes(e));

  const [editor, setEditor] = useState<Editors>(Editors.graphql);
  const [schemaString, setSchema] = useState('');
  const [currentSettings, setCurrentSettings] = useState(settings);

  const initialValues: Values = {
    css: initialParameters.initialCss,
    graphql: initialParameters.initialGql,
    js: initialParameters.initialJS,
    settings: JSON.stringify(settings, null, 4),
    ...initial,
  };
  const [value, setValue] = useState(initialValues);

  const [dryad, setDryad] = useState<any>({});
  const [providerCSS, setProviderCSS] = useState<monaco.IDisposable>();
  const [providerGql, setProviderGql] = useState<monaco.IDisposable>();
  const [providerJS, setProviderJS] = useState<monaco.IDisposable>();
  const [gqlRefresher, setGqlRefresher] = useState('');

  const [monacoInstance, setMonacoInstance] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [monacoSubscription, setMonacoSubscription] = useState<monaco.IDisposable>();

  const currentRef = refs[editor];
  const currentValue = value[editor];
  const currentInitialValue = initialValues[editor];
  const currentConfig = Config[editor];
  const [graphQLCall, setGraphQLCall] = useThrottledState({
    value: value[Editors.graphql],
    delay: 10000,
  });

  useEffect(() => {
    setGraphQLCall(value[Editors.graphql] + gqlRefresher);
  }, [gqlRefresher]);

  useEffect(() => {
    return () => {
      monacoInstance?.dispose();
      monacoSubscription?.dispose();
    };
  }, [monacoInstance, monacoSubscription]);

  useEffect(() => {
    return () => {
      providerCSS?.dispose();
      providerGql?.dispose();
      providerJS?.dispose();
    };
  }, [providerGql, providerCSS, providerJS]);

  useEffect(() => {
    if (currentValue !== currentInitialValue && onChange) {
      onChange(value);
    }
  }, [currentValue]);

  useEffect(() => {
    if (schemaString) {
      const graphqlTree = Parser.parse(schemaString);
      const typings = JSTypings(graphqlTree.nodes);
      const fields = graphqlTree.nodes.filter(
        (n) =>
          n.data?.type === TypeDefinition.ObjectTypeDefinition ||
          n.data?.type === TypeDefinition.ScalarTypeDefinition ||
          n.data?.type === TypeDefinition.EnumTypeDefinition,
      );
      setProviderGql((p) => {
        p?.dispose();
        return monaco.languages.registerCompletionItemProvider('gqlSpecial', GqlSuggestions(schemaString));
      });
      setProviderCSS((p) => {
        p?.dispose();
        return monaco.languages.registerCompletionItemProvider('css', CSSSuggestions(fields));
      });
      setProviderJS((p) => {
        p?.dispose();
        return monaco.languages.typescript.javascriptDefaults.addExtraLib(typings);
      });
    }
  }, [schemaString]);

  useEffect(() => {
    if (currentInitialValue !== initialValues[editor]) {
      setValue((value) => ({
        ...value,
        [editor]: currentInitialValue,
      }));
    }
  }, [currentInitialValue]);

  useEffect(() => {
    Utils.getFromUrl(
      currentSettings.url,
      Object.keys(currentSettings.headers).map((k) => `${k}: ${currentSettings.headers[k]}`),
    ).then((fetchedSchema) => {
      setSchema(fetchedSchema);
    });
  }, [currentSettings.url]);

  useEffect(() => {
    const m = monaco.editor.create(currentRef.current!, { ...currentConfig.options, value: currentValue });
    if (editorOptions) {
      m.updateOptions(editorOptions);
      monaco.editor.remeasureFonts();
    }
    setMonacoSubscription((s) => {
      if (s) {
        s.dispose();
      }
      return m.onDidChangeModelContent((e) => {
        const model = m.getModel();
        if (model) {
          setValue((value) => ({ ...value, [editor]: model.getValue() }));
        }
      });
    });
    setMonacoInstance((i) => {
      if (i) {
        const model = i.getModel();
        if (model) {
          model.dispose();
        }
        i.dispose();
      }
      return m;
    });
  }, [editor]);

  useEffect(() => {
    const js = value[Editors.js];
    if (js) {
      try {
        const isMatching = js.match(/(dryad\s?=\s?{)/);
        if (!isMatching) {
          throw new Error("Cannot find 'dryad = {'");
        }
        const dryadPart = js.replace(/(dryad\s?=\s?{)/, 'const $1');
        const dryadFunction = new Function([dryadPart, `return dryad`].join('\n'));
        const dryadResult = dryadFunction();
        setDryad({
          render: dryadResult,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [value[Editors.js]]);

  useEffect(() => {
    const settingsValue = value[Editors.js];
    if (settingsValue) {
      try {
        const newSettings = JSON.parse(settingsValue);
        setCurrentSettings(newSettings);
      } catch (error) {}
    }
  }, [value[Editors.settings]]);

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
              style={{ height: `calc(100% - 30px)`, display: editor === e ? 'block' : 'none' }}
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
          {editor === Editors.graphql && (
            <R
              variant="refresh"
              onClick={() => {
                const spaces = Math.floor(Math.random() * 200);
                const spacestring = new Array(spaces).fill(' ').join('');
                setGqlRefresher(spacestring);
              }}
            />
          )}
          <DryadBody>
            <DryadGQL headers={currentSettings.headers} dryad={dryad} url={currentSettings.url} gql={graphQLCall || ''}>
              Type Gql Query to see data here
            </DryadGQL>
          </DryadBody>
        </Place>
      </Container>
      <style>{value[Editors.css]}</style>
    </>
  );
};
