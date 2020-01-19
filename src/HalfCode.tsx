import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Colors } from './Colors';
import { Resizable } from 're-resizable';
import { Utils } from 'graphql-zeus';
import { GqlSpecialLanguage } from './GqlSpecialLanguage';
import { GqlSpecialTheme } from './GqlSpecialTheme';
import { GqlSuggestions } from './GqlSuggestions';
import { DryadGQL } from './Detail';
enum Editors {
  css = 'css',
  graphql = 'graphql',
}
monaco.languages.register({ id: 'gqlSpecial' });

// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider('gqlSpecial', GqlSpecialLanguage);
monaco.editor.defineTheme('gqlSpecialTheme', GqlSpecialTheme);
export const HalfCode = (props: { schemaURL: string }) => {
  const cssRef = useRef<HTMLDivElement>(null);
  const gqlRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editors>(Editors.graphql);
  const [css, setCss] = useState('');
  const [gql, setGql] = useState('');
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
      Utils.getFromUrl(props.schemaURL).then((schema) => {
        monaco.languages.registerCompletionItemProvider('gqlSpecial', GqlSuggestions(schema));
      });
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
          <div style={{ height: 30, display: 'flex', alignItems: 'center' }}>
            <a
              style={{
                marginRight: 5,
                cursor: 'pointer',
                background: Colors.grey[10],
                padding: `4px 8px`,
                fontSize: 10,
              }}
              onClick={() => setEditor(Editors.css)}
            >
              CSS
            </a>
            <a
              style={{
                marginRight: 5,
                cursor: 'pointer',
                background: Colors.grey[10],
                padding: `4px 8px`,
                fontSize: 10,
              }}
              onClick={() => setEditor(Editors.graphql)}
            >
              GQL
            </a>
          </div>
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

        <div className="Main" style={{ flex: 1, overflowY: 'auto' }}>
          <DryadGQL url="https://faker.graphqleditor.com/a-team/olympus/graphql" gql={gql}>
            wait for objects to load
          </DryadGQL>
        </div>
      </div>
      <style>{css}</style>
    </>
  );
};
