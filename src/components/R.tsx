import React, { FunctionComponent } from 'react';
import { Colors } from '../Colors';
import { RefreshCw, Play, Eye } from 'react-feather';
import styled from '@emotion/styled';
import { darken, toHex } from 'color2k';

const Main = styled.div`
  color: ${toHex(darken(Colors.grey, 0.15))};
  width: 40px;
  cursor: pointer;
  height: 40px;
  border-radius: 10px;
  margin: 5px;
  display: flex;
  transform: rotate(0deg);
  transition: 0.25s all;
  align-items: center;
  justify-content: center;
  :hover {
    color: ${Colors.grey};
  }
`;

export interface RProps {
  onClick: () => void;
  isRefreshing?: boolean;
  variant: 'refresh' | 'play' | 'eye';
  title: string;
  about: string;
  backgroundColor: string;
}

export const R: FunctionComponent<RProps> = ({
  onClick,
  variant,
  title,
  about,
  backgroundColor,
}) => {
  return (
    <Main
      style={{ backgroundColor }}
      title={title}
      onClick={onClick}
      about={about}
    >
      {variant === 'refresh' && <RefreshCw size={15} />}
      {variant === 'play' && <Play size={15} />}
      {variant === 'eye' && <Eye size={15} />}
    </Main>
  );
};
