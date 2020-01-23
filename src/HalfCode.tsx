import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Resizable } from 're-resizable';
import { Utils, Parser, TypeDefinition } from 'graphql-zeus';
import { GqlSpecialLanguage, GqlLanguageConfiguration } from './languages';
import { GqlSpecialTheme, CssTheme, JsTheme } from './themes';
import { GqlSuggestions, CSSSuggestions } from './suggestions';
import { DryadGQL } from './DryadGQL';
import { R, Tabs, Name, Container, Place, DryadBody } from './components';
import { JSTypings } from './typings';
import * as initialParameters from './initial';

export interface HalfCodeProps {
  className?: string;
  editorOptions?: monaco.editor.IEditorOptions;
  initialCss?: string;
  initialGql?: string;
  initialJS?: string;
  name?: string;
  onChange?: (props: { css: string; gql: string; js: string }) => void;
  schema?: string;
  schemaURL: string;
  style?: React.CSSProperties;
}

enum Editors {
  css = 'css',
  graphql = 'graphql',
  js = 'js',
}
monaco.languages.register({ id: 'gqlSpecial' });
monaco.languages.setLanguageConfiguration('gqlSpecial', GqlLanguageConfiguration);
// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider('gqlSpecial', GqlSpecialLanguage);
monaco.editor.defineTheme('gqlSpecialTheme', GqlSpecialTheme);
monaco.editor.defineTheme('js', JsTheme);
monaco.editor.defineTheme('css', CssTheme);

export const HalfCode = ({
  className = '',
  editorOptions,
  initialCss = initialParameters.initialCss,
  initialGql = initialParameters.initialGql,
  initialJS = initialParameters.initialJS,
  name,
  onChange,
  schemaURL,
  schema,
  style = {},
}: HalfCodeProps) => {
  const cssRef = useRef<HTMLDivElement>(null);
  const gqlRef = useRef<HTMLDivElement>(null);
  const jsRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState<Editors>(Editors.graphql);
  const [schemaString, setSchema] = useState(schema);

  const [css, setCss] = useState(initialCss);
  const [gql, setGql] = useState(initialGql);
  const [js, setJs] = useState(initialJS);
  const [dryad, setDryad] = useState<any>({});

  const [monacoInstance, setMonacoInstance] = useState<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if ((css !== initialCss || gql !== initialGql || js !== initialJS) && onChange) {
      onChange({ css, gql, js });
    }
  }, [css, gql, js]);

  useEffect(() => {
    if (schemaString) {
      monaco.languages.registerCompletionItemProvider('gqlSpecial', GqlSuggestions(schemaString));
      const graphqlTree = Parser.parse(schemaString);
      const typings = JSTypings(graphqlTree.nodes);
      monaco.languages.typescript.javascriptDefaults.addExtraLib(typings);
      const fields = graphqlTree.nodes.filter(
        (n) =>
          n.data?.type === TypeDefinition.ObjectTypeDefinition ||
          n.data?.type === TypeDefinition.ScalarTypeDefinition ||
          n.data?.type === TypeDefinition.EnumTypeDefinition,
      );
      monaco.languages.registerCompletionItemProvider('css', CSSSuggestions(fields));
    }
  }, [schemaString]);

  useEffect(() => {
    if (initialGql !== gql) {
      setGql(initialGql);
      if (editor === Editors.graphql) {
        monacoInstance?.getModel()?.setValue(initialGql);
      }
    }
  }, [initialGql]);

  useEffect(() => {
    if (initialCss !== css) {
      setGql(initialCss);
      if (editor === Editors.css) {
        monacoInstance?.getModel()?.setValue(initialCss);
      }
    }
  }, [initialCss]);

  useEffect(() => {
    if (initialJS !== js) {
      setGql(initialJS);
      if (editor === Editors.js) {
        monacoInstance?.getModel()?.setValue(initialJS);
      }
    }
  }, [initialJS]);

  useEffect(() => {
    if (monacoInstance) {
      monacoInstance.dispose();
      setMonacoInstance(undefined);
    }
    if (editor === Editors.css) {
      const m = monaco.editor.create(cssRef.current!, {
        language: 'css',
        value: css,
        fixedOverflowWidgets: true,
        parameterHints: {
          enabled: true,
        },
        theme: 'css',
      });
      if (editorOptions) {
        m.updateOptions(editorOptions);
      }
      m.onDidChangeModelContent((e) => {
        setCss(m.getModel()?.getValue() || '');
      });
      setMonacoInstance(m);
    }
    if (editor === Editors.graphql) {
      if (!schemaString) {
        Utils.getFromUrl(schemaURL).then((fetchedSchema) => {
          setSchema(fetchedSchema);
        });
      }
      const m = monaco.editor.create(gqlRef.current!, {
        language: 'gqlSpecial',
        value: gql,
        theme: 'gqlSpecialTheme',
      });
      if (editorOptions) {
        m.updateOptions(editorOptions);
      }
      m.onDidBlurEditorText(() => {
        const value = m.getModel()?.getValue();
        setGql(value || '');
      });
      setMonacoInstance(m);
    }
    if (editor === Editors.js) {
      const m = monaco.editor.create(jsRef.current!, {
        language: 'javascript',
        value: js,
        theme: 'js',
      });
      m.onDidBlurEditorText(() => {
        const value = m.getModel()?.getValue();
        if (value) {
          try {
            const isMatching = value.match(/(dryad\s?=\s?{)/);
            if (!isMatching) {
              throw new Error("Cannot find 'dryad = {'");
            }
            const dryadPart = value.replace(/(dryad\s?=\s?{)/, 'const $1');
            const dryadFunction = new Function([dryadPart, `return dryad`].join('\n'));
            const dryadResult = dryadFunction();
            setDryad({
              render: dryadResult,
            });
          } catch (error) {
            console.error(error);
          }
        }
        setJs(value || '');
      });
      if (editorOptions) {
        m.updateOptions(editorOptions);
      }
      setMonacoInstance(m);
    }
  }, [editor]);

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
          <Tabs
            active={editor}
            tabs={[
              {
                name: Editors.graphql,
                onClick: () => setEditor(Editors.graphql),
              },
              {
                name: Editors.css,
                onClick: () => setEditor(Editors.css),
              },
              {
                name: Editors.js,
                onClick: () => setEditor(Editors.js),
              },
            ]}
          />
          <div
            style={{ height: `calc(100% - 30px)`, display: editor === Editors.css ? 'block' : 'none' }}
            ref={cssRef}
          ></div>
          <div
            style={{ height: `calc(100% - 30px)`, display: editor === Editors.graphql ? 'block' : 'none' }}
            ref={gqlRef}
          ></div>
          <div
            style={{ height: `calc(100% - 30px)`, display: editor === Editors.js ? 'block' : 'none' }}
            ref={jsRef}
          ></div>
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
              onClick={() => {
                const spaces = Math.floor(Math.random() * 200);
                const spacestring = new Array(spaces).fill(' ').join('');
                setGql(gql + spacestring);
              }}
            />
          )}
          <DryadBody>
            <DryadGQL dryad={dryad} url={schemaURL} gql={gql}>
              Type Gql Query to see data here
            </DryadGQL>
          </DryadBody>
        </Place>
      </Container>
      <style>{css}</style>
    </>
  );
};
