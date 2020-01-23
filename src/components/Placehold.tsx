import React, { FunctionComponent } from 'react';
import { Colors } from '../Colors';

export const Placehold: FunctionComponent = ({ children }) => (
  <div
    style={{
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      padding: 50,
      color: Colors.grey[3],
    }}
  >
    {children}
  </div>
);
