import React, { FunctionComponent } from 'react';
import { Colors, EditorColors, mix } from '../Colors';

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
        height: 30,
        alignItems: 'center',
        background: mix(Colors.grey[9], Colors.grey[8]),
      }}
    >
      {tabs.map((t) => (
        <div
          key={t.name}
          style={{
            background: active === t.name ? EditorColors.background : 'transparent',
            color: active === t.name ? Colors.grey[0] : Colors.grey[3],
            fontSize: 11,
            padding: 10,
            cursor: 'pointer',
            borderRight: `1px dotted ${Colors.grey[0]}11`,
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
