import { simpleExample } from '@/simpleExample';
import React, { useState } from 'react';
import { GraphQLDryad } from 'graphql-dryad';

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
        value={value}
        setValue={setValue}
      />
    </div>
  );
};
