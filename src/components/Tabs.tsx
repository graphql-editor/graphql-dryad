import React from 'react';
import { Colors } from '../Colors';

export const Tabs: React.FC = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: Colors.main[10],
      }}
    >
      {children}
    </div>
  );
};
