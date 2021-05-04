import React, { useState } from 'react';
import { GraphQLDryad } from '../src';

export const Main = () => {
  const [value, setValue] = useState({
    js: `const render = () => {
    return html\`<div style="background: #fff;">Hello world</div>\`
}`,
    css: '',
  });

  return (
    <div style={{ height: `100%` }}>
      <GraphQLDryad
        settings={{
          url:
            'https://faker.graphqleditor.com/explore-projects/twitter/graphql',
          headers: {},
        }}
        tryToLoadOnFirstRun
        value={value}
        setValue={setValue}
      />
    </div>
  );
};
