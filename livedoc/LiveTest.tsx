import React from 'react';
import { HalfCode } from '../src';
import DetailView from '../src/livedoc/views/detail';
import { LiveDocHtml } from '../src/livedoc';
const pasted = require('./paster.txt');

export const Main = () => {
  return (
    <>
      <div style={{ height: `100%` }}>
        <button
          style={{ position: 'absolute', top: 5, right: 30, zIndex: 100 }}
          onClick={() => {
            LiveDocHtml({
              url: 'https://faker.graphqleditor.com/a-team/olympus/graphql',
            });
          }}
        >
          export
        </button>
        <HalfCode
          name="https://faker.graphqleditor.com/aexol/olympus/graphql"
          exportEnabled={true}
          settings={{
            url: 'https://faker.graphqleditor.com/aexol/olympus/graphql',
            headers: {},
          }}
          editorOptions={{
            fontFamily: `'Fira Mono'`,
          }}
          initial={{
            graphql: DetailView.gql('Query'),
            css: DetailView.css,
            js: pasted.default,
          }}
        />
      </div>
    </>
  );
};
