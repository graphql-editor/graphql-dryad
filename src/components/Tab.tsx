import React from 'react';
import { Colors } from '../Colors';

export interface TabProps {
  onClick: () => void;
  active: boolean;
  style?: React.CSSProperties;
}

export const Tab: React.FC<TabProps> = ({
  children,
  onClick,
  active,
  style = {},
}) => {
  return (
    <div
      style={{
        color: active ? Colors.grey[0] : Colors.grey[3],
        opacity: active ? 1.0 : 0.5,
        fontSize: 11,
        padding: 15,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        borderBottom: active ? `solid 1px ${Colors.main[0]}` : 0,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
