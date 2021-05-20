# GraphQL Dryad

Live custom framework based js and css ide. This is a new approach to create and bundle browser apps inside browser.

## Installation

```sh
npm i graphql-dryad
```

Install peer dependencies

```sh
npm i react react-dom monaco-editor hydra-ide
```

```sh
npm i -D webpack monaco-editor-webpack-plugin worker-loader file-loader css-loader
```

add monaco plugin to webpack.

```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
module.exports = {
  plugins: [
    new MonacoWebpackPlugin({
      // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      // Add your languages here
      languages: ['javascript'],
    }),
  ],
};
```

You can check exact webpack configuration in `sandbox` folder.

## How to use

```tsx
import React, { useState } from 'react';
import { GraphQLDryad } from 'graphql-dryad';

const initialValues = {
  js: 'return html`<div>Hello world</div>`',
  css: '@import "https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css";',
};

export const Main = () => {
  const [v, setValue] = useState(initialValues);

  return (
    <div style={{ height: `100%` }}>
      <GraphQLDryad
        settings={{
          url:
            'https://faker.graphqleditor.com/explore-projects/twitter/graphql',
          headers: {},
        }}
        value={value}
        setValue={setValue}
      />
    </div>
  );
};
```

## How to write in dryad editor

You are writing regular esmodule which default part is used during static site generation.

```js
// You can use esmodules imports
export const head = () => {
  return html`
    <title>My website title</title>
  `;
};

export default async () => {
  const someMarkdown = md`
# hello world
  `;
  return html`
    <div class="container">
      ${someMarkdown}
    </div>
  `;
};
```
