import React, { useEffect, useState } from 'react';
import { HalfCode } from '../src';
import DetailView from '../src/livedoc/views/detail';
import { LiveDocHtml } from '../src/livedoc';
const pasted = require('./paster.txt');

export const Main = () => {
  const [currentType, setCurrentType] = useState('Company');
  useEffect(() => {
    //@ts-ignore
    window.route = (typeName: string) => {
      console.log('Setting');
      setCurrentType(typeName);
    };
  }, []);
  return (
    <>
      <div style={{ height: `100%` }}>
        <button
          style={{ position: 'absolute', top: 5, right: 30, zIndex: 100 }}
          onClick={() => {
            LiveDocHtml({
              url:
                'https://faker.graphqleditor.com/a-team/finance-manager/graphql',
              initial: 'Company',
            });
          }}
        >
          export
        </button>
        <HalfCode
          name="https://faker.graphqleditor.com/a-team/finance-manager/graphql"
          exportEnabled={true}
          settings={{
            url:
              'https://faker.graphqleditor.com/a-team/finance-manager/graphql',
            headers: {},
          }}
          editorOptions={{
            fontFamily: `'Fira Mono'`,
          }}
          initial={{
            graphql: DetailView.gql(currentType),
            css: DetailView.css,
            js: pasted.default,
          }}
        />
      </div>
    </>
  );
};
