import React from 'react';
import { DryadBody } from '../components';

export const Display: React.FC<{
  dryad: string;
}> = ({ dryad }) => {
  return (
    <DryadBody>
      <div
        style={{ display: 'contents' }}
        dangerouslySetInnerHTML={{
          __html: dryad,
        }}
      />
    </DryadBody>
  );
};
