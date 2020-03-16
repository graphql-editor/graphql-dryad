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
            name="https://api.github.com/graphql"
            settings={{
              url: 'https://api.github.com/graphql',
              headers: {
                Authorization: 'bearer ea3bb6b3614e3827d56399e7607c866e8bcc3ba3',
              },
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
