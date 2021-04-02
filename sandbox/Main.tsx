import React, { useState } from 'react';
import { GraphQLDryad } from '../src';

export const Main = () => {
  const [value, setValue] = useState({ js: '', css: '' });

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
