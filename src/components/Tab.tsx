import React from 'react';
import { Colors, EditorColors } from '../Colors';

export interface TabProps {
  onClick: () => void;
  active: boolean;
}

export const Tab: React.FC<TabProps> = ({ children, onClick, active }) => {
  return (
    <div
      style={{
        background: active ? EditorColors.background : 'transparent',
        color: active ? Colors.grey[0] : Colors.grey[3],
        opacity: active ? 1.0 : 0.5,
        fontSize: 11,
        padding: 15,
        cursor: 'pointer',
        borderRight: `1px dotted ${Colors.grey[0]}11`,
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
