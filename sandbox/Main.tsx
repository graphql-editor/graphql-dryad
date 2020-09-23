import React, { useState } from 'react';
import { HalfCode } from '../src';
import { initialValues } from './initial';

export const Main = () => {
  const [initial] = useState(initialValues);
  const [, setValues] = useState(initialValues);

  return (
    <div style={{ height: `100%` }}>
      <HalfCode
        settings={{
          url:
            'https://faker.graphqleditor.com/explore-projects/twitter/graphql',
          headers: {},
        }}
        tryToLoadOnFirstRun
        editorOptions={{
          fontFamily: `'Fira Mono'`,
        }}
        initial={initial}
        onChange={setValues}
      />
    </div>
  );
};
