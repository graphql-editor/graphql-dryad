import React from 'react';
import ReactDOM from 'react-dom';
import { HalfCode } from '../src';
import { DefaultCSS } from './DefaultCss';

ReactDOM.render(
  <HalfCode initialCss={DefaultCSS} schemaURL="https://faker.graphqleditor.com/a-team/finance-manager/graphql" />,
  document.getElementById('root'),
);
