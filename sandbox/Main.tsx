import { reactExample } from '@/../sandbox/reactExample';
import React, { useState } from 'react';
import { GraphQLDryad } from '../src';

export const Main = () => {
  const [value, setValue] = useState({
    js: reactExample.js,
    css: reactExample.css,
  });

  return (
    <div style={{ height: `100%` }}>
      <GraphQLDryad
        settings={{
          url: reactExample.schemaUrl,
          headers: {},
        }}
        tryToLoadOnFirstRun
        value={value}
        setValue={setValue}
      />
    </div>
  );
};
