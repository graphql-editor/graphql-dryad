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
            name="https://faker.graphqleditor.com/showcase/fake-twitter/graphql"
            schemaURL="https://faker.graphqleditor.com/showcase/fake-twitter/graphql"
            editorOptions={{
              fontFamily: `'Fira Mono'`,
            }}
            initialGql={`{
      Twits{
          Author{
              username
              avatar
          }
          sentence
          retweets{
              username
          }
      }
  }`}
          />
        )}
      </div>
    </>
  );
};
