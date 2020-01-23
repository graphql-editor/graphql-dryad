import React, { FunctionComponent } from 'react';

export interface ContainerProps {
  style?: React.CSSProperties;
  className?: string;
}

export const Container: FunctionComponent<ContainerProps> = ({ children, className, style = {} }) => (
  <div
    className={className}
    style={{
      height: `100%`,
      width: `100%`,
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'stretch',
      ...style,
    }}
  >
    {children}
  </div>
);
