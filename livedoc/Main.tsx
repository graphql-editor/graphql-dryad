import React, { useEffect } from 'react';
import { LiveDocHtml } from '../src/livedoc';

export const Main = () => {
  useEffect(() => {
    LiveDocHtml({
      url: 'https://faker.graphqleditor.com/a-team/olympus/graphql',
    });
  }, []);
  return <></>;
};
