import React, { FunctionComponent } from 'react';
import { Colors } from '../Colors';

export const Name: FunctionComponent = ({ children }) => (
  <div
    style={{
      position: 'relative',
      marginTop: -30,
      fontSize: 11,
      color: Colors.grey[4],
      height: 30,
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);
