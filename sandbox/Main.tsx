import React, { useState, useEffect } from 'react';
import { HalfCode } from '../src';
import { initialValues } from './initial';

export const Main = () => {
  const [initial, setInitial] = useState(initialValues);
  const [, setValues] = useState(initialValues);
  useEffect(() => {
    setTimeout(() => {
      setInitial({
        css: '',
        js: '',
      });
    }, 5000);
  }, []);
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
