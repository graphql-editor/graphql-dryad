import { Main } from '@/../sandbox/Main';
import React from 'react';
import { render } from 'react-dom';
import * as apps from '@/../sandbox/apps';

export type AppType = keyof typeof apps;
export const App = () => {
  const [, ls] = window.location.search.split('?');
  if (!ls) {
    return <Main />;
  }
  const [, appType] = ls.split('=');
  if (!appType) {
    return <Main />;
  }
  return <>{(apps as any)[appType]()}</>;
};

render(<App />, document.getElementById('root'));
