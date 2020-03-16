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
    background: Colors.grey[9],
    color: Colors.grey[3],
    borderRadius: `100%`,
    cursor: 'pointer',
    zIndex: 2,
    transform: 'rotate(0deg)',
    transition: '0.25s all',
    '&:hover': {
      transform: 'rotate(360deg)',
      color: Colors.grey[0],
    },
  },
});

export const R: FunctionComponent<RProps> = ({ onClick, variant }) => {
  const { main } = useStyle();
  return (
    <div title="Refresh" className={main} onClick={onClick}>
      {variant === 'refresh' && <RefreshCw size={15} />}
      {variant === 'play' && <Play size={15} />}
    </div>
  );
};
