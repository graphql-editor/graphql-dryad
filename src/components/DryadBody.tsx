import React, { FunctionComponent } from 'react';
import { Colors } from '../Colors';

export interface DryadBodyProps {
  style?: React.CSSProperties;
}

export const DryadBody: FunctionComponent<DryadBodyProps> = ({
  children,
  style = {},
}) => (
  <div
    className="DryadBody"
    style={{
      flex: 1,
      background: Colors.grey[0],
      boxShadow: `${Colors.grey[10]}11 3px 5px 4px`,
      ...style,
    }}
  >
    {children}
  </div>
);
