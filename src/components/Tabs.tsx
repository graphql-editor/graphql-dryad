import React, { FunctionComponent } from 'react';
import { Colors } from '../Colors';

export interface TabProps {
  name: string;
  onClick: () => void;
}

export interface TabsProps {
  tabs: TabProps[];
  active: string;
}

export const Tabs: FunctionComponent<TabsProps> = ({ tabs, active }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
      }}
    >
      {tabs.map((t) => (
        <div
          key={t.name}
          style={{
            background: active === t.name ? Colors.grey[7] : Colors.grey[8],
            color: active === t.name ? Colors.grey[1] : Colors.grey[3],
            fontSize: 11,
            padding: 10,
            cursor: 'pointer',
          }}
          onClick={() => {
            t.onClick();
          }}
        >
          {t.name}
        </div>
      ))}
    </div>
  );
};
