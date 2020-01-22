import React, { FunctionComponent } from 'react';

export const Placehold: FunctionComponent = ({ children }) => (
  <div
    style={{
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      padding: 50,
    }}
  >
    {children}
  </div>
);
