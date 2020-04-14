import React, { useEffect } from 'react';
import { LiveDocHtml } from '../src/livedoc';

export const Main = () => {
  useEffect(() => {
    LiveDocHtml({
      url: 'https://app.graphqleditor.com/a-team/finance-manager',
    });
  }, []);
  return <></>;
};
