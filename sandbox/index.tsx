import React from 'react';
import ReactDOM from 'react-dom';
import { HalfCode } from '../src';

ReactDOM.render(
  <HalfCode
    name="https://faker.graphqleditor.com/a-team/finance-manager/graphql"
    schemaURL="https://faker.graphqleditor.com/a-team/finance-manager/graphql"
    editorOptions={{
      fontFamily: `'Fira Mono'`,
    }}
  />,
  document.getElementById('root'),
);
