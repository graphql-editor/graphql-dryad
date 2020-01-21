import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Colors } from './Colors';
import { Resizable } from 're-resizable';
import { Utils } from 'graphql-zeus';
import { GqlSpecialLanguage } from './GqlSpecialLanguage';
import { GqlSpecialTheme } from './GqlSpecialTheme';
import { GqlSuggestions } from './GqlSuggestions';
import { DryadGQL } from './Detail';
import { Tabs } from './components/Tabs';

export interface HalfCodeProps {
  initialCss?: string;
  initialGql?: string;
  schemaURL: string;
  schema?: string;
}

enum Editors {
  css = 'css',
  graphql = 'graphql',
}
monaco.languages.register({ id: 'gqlSpecial' });

// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider('gqlSpecial', GqlSpecialLanguage);
monaco.editor.defineTheme('gqlSpecialTheme', GqlSpecialTheme);

export const HalfCode = ({ initialCss = '', initialGql = '', schemaURL, schema }: HalfCodeProps) => {
  const cssRef = useRef<HTMLDivElement>(null);
  const gqlRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState<Editors>(Editors.graphql);
  const [css, setCss] = useState(initialCss);
  const [gql, setGql] = useState(initialGql);
  const [monacoCss, setMonacoCss] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [monacoGql, setMonacoGql] = useState<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (cssRef.current?.style.display !== 'none') {
      if (monacoGql) {
        monacoGql.dispose();
        setMonacoGql(undefined);
      }
      const m = monaco.editor.create(cssRef.current!, {
        language: 'css',
        value: css,
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
      if (schema) {
        monaco.languages.registerCompletionItemProvider('gqlSpecial', GqlSuggestions(schema));
      }
      if (!schema) {
        Utils.getFromUrl(schemaURL).then((fetchedSchema) => {
          monaco.languages.registerCompletionItemProvider('gqlSpecial', GqlSuggestions(fetchedSchema));
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
        setGql(m.getModel()?.getValue() || '');
      });
      setMonacoGql(m);
    }
  }, [editor]);

  return (
    <>
      <div style={{ height: `100%`, width: `100%`, display: 'flex', flexFlow: 'row nowrap', alignItems: 'stretch' }}>
        <Resizable
          defaultSize={{
            width: 340,
            height: '100%',
          }}
          style={{ background: '#333', color: '#aaa' }}
          onResize={() => {
            const currentEditor = monacoCss || monacoGql;
            currentEditor?.layout();
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
          {editor === Editors.graphql && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(50% - 20px)',
                height: 40,
                width: 40,
                justifyContent: 'center',
                right: -15,
                display: 'flex',
                alignItems: 'center',
                background: Colors.blue[3],
                color: Colors.grey[0],
                cursor: 'pointer',
              }}
              onClick={() => {
                const spaces = Math.floor(Math.random() * 200);
                const spacestring = new Array(spaces).fill(' ').join('');
                setGql(gql + spacestring);
              }}
            >
              R
            </div>
          )}
        </Resizable>

        <div
          className="Place"
          style={{
            flex: 1,
            background: Colors.grey[7],
            padding: 40,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              background: Colors.grey[0],
              boxShadow: `${Colors.grey[10]}99 3px 5px 4px`,
              display: 'flex',
            }}
          >
            <DryadGQL url={schemaURL} gql={gql}>
              Type Gql Query to see data here
            </DryadGQL>
          </div>
        </div>
      </div>
      <style>{css}</style>
    </>
  );
};
