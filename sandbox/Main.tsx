import { simpleExample } from '@/../sandbox/simpleExample';
import React, { useState } from 'react';
import { GraphQLDryad } from '../src';

export const Main = () => {
  const [value, setValue] = useState({
    js: '',
    css: '',
  });

  return (
    <div style={{ height: `100%` }}>
      <GraphQLDryad
        settings={{
          url: simpleExample.schemaUrl,
          headers: {},
        }}
        value={value.js}
        css={value.css}
        onDryad={(d) => console.log(d)}
        onZeus={(d) => console.log(d)}
      />
    </div>
  );
};
