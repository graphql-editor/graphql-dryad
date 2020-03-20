import React, { FunctionComponent } from 'react';
import { Colors } from '../Colors';
import { RefreshCw, Play } from 'react-feather';
import { createUseStyles } from 'react-jss';

export interface RProps {
  onClick: () => void;
  isRefreshing?: boolean;
  variant: 'refresh' | 'play';
}

const useStyle = createUseStyles({
  main: {
    position: 'absolute',
    top: 'calc(50% - 35px)',
    height: 40,
    width: 40,
    justifyContent: 'center',
    marginLeft: -60,
    display: 'flex',
    alignItems: 'center',
    background: Colors.green[6],
    color: Colors.grey[3],
    borderRadius: `100%`,
    cursor: 'pointer',
    zIndex: 2,
    transform: 'rotate(0deg)',
    transition: '0.25s all',
    '&:hover': {
      color: Colors.grey[0],
      background: Colors.green[2],
    },
  },
});

export const R: FunctionComponent<RProps> = ({ onClick, variant }) => {
  const { main } = useStyle();
  return (
    <div title="Run GraphQL Query" className={main} onClick={onClick} about="Run query">
      {variant === 'refresh' && <RefreshCw size={15} />}
      {variant === 'play' && <Play size={15} />}
    </div>
  );
};
