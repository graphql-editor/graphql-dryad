import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Colors } from './Colors';
import { Resizable } from 're-resizable';
import { Utils, Parser, TypeDefinition } from 'graphql-zeus';
import { GqlSpecialLanguage, GqlLanguageConfiguration } from './languages';
import { GqlSpecialTheme } from './themes';
import { GqlSuggestions, CSSSuggestions } from './suggestions';
import { DryadGQL } from './DryadGQL';
import { R, Tabs, Name } from './components';
import { JSTypings } from './typings';

export interface HalfCodeProps {
  name?: string;
  initialCss?: string;
  initialGql?: string;
  initialJS?: string;
  schemaURL: string;
  schema?: string;
  className?: string;
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

export const HalfCode = ({
  className = '',
  initialCss = '',
  initialGql = '',
  initialJS = `// CTRL/CMD + space in dryad
// to write injects in
// string html templates

dryad = {
    
}`,
  name,
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

  const [monacoCss, setMonacoCss] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [monacoGql, setMonacoGql] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [monacoJS, setMonacoJS] = useState<monaco.editor.IStandaloneCodeEditor>();

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
    if (cssRef.current?.style.display !== 'none') {
      if (monacoGql) {
        monacoGql.dispose();
        setMonacoGql(undefined);
      }
      if (monacoJS) {
        monacoJS.dispose();
        setMonacoJS(undefined);
      }
      const m = monaco.editor.create(cssRef.current!, {
        language: 'css',
        value: css,
        fixedOverflowWidgets: true,
        parameterHints: {
          enabled: true,
        },
        theme: 'vs-dark',
      });
      m.onDidChangeModelContent((e) => {
        setCss(m.getModel()?.getValue() || '');
      });
      setMonacoCss(m);
    }
    if (gqlRef.current?.style.display !== 'none') {
      if (monacoCss) {
        monacoCss.dispose();
        setMonacoCss(undefined);
      }
      if (monacoJS) {
        monacoJS.dispose();
        setMonacoJS(undefined);
      }
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
      m.onCompositionEnd(() => {
        console.log('Ended');
      });
      m.onDidBlurEditorText(() => {
        const value = m.getModel()?.getValue();
        setGql(value || '');
      });
      setMonacoGql(m);
    }
    if (jsRef.current?.style.display !== 'none') {
      if (monacoCss) {
        monacoCss.dispose();
        setMonacoCss(undefined);
      }
      if (monacoGql) {
        monacoGql.dispose();
        setMonacoGql(undefined);
      }
      const m = monaco.editor.create(jsRef.current!, {
        language: 'javascript',
        value: js,
        theme: 'vs-dark',
      });
      m.onDidBlurEditorText(() => {
        const value = m.getModel()?.getValue();
        console.log(value);
        if (value) {
          try {
            const isMatching = value.match(/(dryad\s?=\s?{)/);
            if (!isMatching) {
              throw new Error("Cannot find 'dryad = {'");
            }
            const dryadPart = value.replace(/(dryad\s?=\s?{)/, 'const $1');
            const dryadFunction = new Function([dryadPart, `return dryad`].join('\n'));
            const dryadResult = dryadFunction();
            console.log(dryadResult);
            setDryad({
              render: dryadResult,
            });
          } catch (error) {
            console.log(error);
          }
        }
        setJs(value || '');
      });
      setMonacoJS(m);
    }
  }, [editor]);

  return (
    <>
      <div
        className={className}
        style={{
          height: `100%`,
          width: `100%`,
          display: 'flex',
          flexFlow: 'row nowrap',
          alignItems: 'stretch',
          ...style,
        }}
      >
        <Resizable
          defaultSize={{
            width: 340,
            height: '100%',
          }}
          style={{ background: '#333', color: '#aaa', overflowY: 'hidden' }}
          onResize={() => {
            const currentEditor = monacoCss || monacoGql || monacoJS;
            currentEditor?.layout();
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

        <div
          className="Place"
          style={{
            flex: 1,
            background: Colors.grey[7],
            padding: 30,
            overflowY: 'auto',
          }}
        >
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
          <div
            style={{
              flex: 1,
              background: Colors.grey[0],
              boxShadow: `${Colors.grey[10]}11 3px 5px 4px`,
            }}
          >
            <DryadGQL dryad={dryad} url={schemaURL} gql={gql}>
              Type Gql Query to see data here
            </DryadGQL>
          </div>
          <div style={{ marginBottom: 40 }}></div>
        </div>
      </div>
      <style>{css}</style>
    </>
  );
};
