import React from 'react';
import ReactDOM from 'react-dom';
import { HalfCode } from '../src';

ReactDOM.render(
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
  />,
  document.getElementById('root'),
);
