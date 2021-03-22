import { darken, toHex } from 'color2k';
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
      background: Colors.grey,
      boxShadow: `${toHex(darken(Colors.grey, 0.91))}11 3px 5px 4px`,
      ...style,
    }}
  >
    {children}
  </div>
);
