import React from 'react';
import { Colors, mix } from '../Colors';

export const Tabs: React.FC = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        height: 30,
        alignItems: 'center',
        background: mix(Colors.grey[9], Colors.grey[8]),
      }}
    >
      {children}
    </div>
  );
};
