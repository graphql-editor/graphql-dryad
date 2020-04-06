import React from 'react';
import { LiveDoc } from '../src/livedoc';

export const Main = () => {
  // useEffect(() => {
  //   LiveDocHtml({
  //     url: 'https://faker.graphqleditor.com/a-team/olympus/graphql',
  //   });
  // }, []);
  return (
    <>
      <LiveDoc url={'https://faker.graphqleditor.com/a-team/olympus/graphql'} />
    </>
  );
};
