import { darken, toHex } from 'color2k';
import React, { FunctionComponent } from 'react';
import { Colors } from '../Colors';

export interface PlaceProps {
  style?: React.CSSProperties;
}

export const Place: FunctionComponent<PlaceProps> = ({
  children,
  style = {},
}) => (
  <div
    className="Place"
    style={{
      flex: 1,
      background: toHex(darken(Colors.main, 0.66)),
      overflowY: 'auto',
      ...style,
    }}
  >
    {children}
  </div>
);
