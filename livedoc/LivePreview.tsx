import React from 'react';
import { LiveDoc } from '../src/livedoc';

export const Main = () => {
  return (
    <>
      <div style={{ height: `100%` }}>
        <LiveDoc url="https://faker.graphqleditor.com/a-team/finance-manager/graphql" />
      </div>
    </>
  );
};
