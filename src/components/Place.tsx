import React, { FunctionComponent } from 'react';
import { Colors } from '../Colors';

export interface PlaceProps {
  style?: React.CSSProperties;
}

export const Place: FunctionComponent<PlaceProps> = ({ children, style = {} }) => (
  <div
    className="Place"
    style={{
      flex: 1,
      background: Colors.grey[7],
      padding: 30,
      overflowY: 'auto',
      ...style,
    }}
  >
    {children}
    <div style={{ marginBottom: 30 }}></div>
  </div>
);
