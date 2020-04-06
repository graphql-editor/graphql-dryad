import React, { useState } from 'react';
import { HalfCode } from '../src';
import DetailView from '../src/livedoc/views/detail';
const pasted = require('./paster.txt');

export const Main = () => {
  const [hide, setHide] = useState(false);
  return (
    <>
      <div style={{ height: `100%` }}>
        <button onClick={() => setHide((hidden) => !hidden)}>hide</button>
        {!hide && (
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
        )}
      </div>
    </>
  );
};
