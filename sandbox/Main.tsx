import React, { useState } from 'react';
import { HalfCode } from '../src';

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
              graphql: ``,
            }}
          />
        )}
      </div>
    </>
  );
};
