import React, { FunctionComponent } from 'react';
import { RefreshCw, Play, Eye } from 'react-feather';
import styled from '@emotion/styled';

const Main = styled.div`
  color: ${({ theme: { backgroundedText } }) => backgroundedText};
  width: 40px;
  background: ${({
    theme: {
      background: { mainClose },
    },
  }) => mainClose};
  cursor: pointer;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  margin: 7px;
  display: flex;
  transform: rotate(0deg);
  transition: 0.25s all;
  align-items: center;
  justify-content: center;
  :hover {
    background: ${({
      theme: {
        background: { mainClosest },
      },
    }) => mainClosest};
  }
`;

export interface RProps {
  onClick: () => void;
  isRefreshing?: boolean;
  variant: 'refresh' | 'play' | 'eye';
  title: string;
  about: string;
  cypressName: string;
}

export const R: FunctionComponent<RProps> = ({
  onClick,
  variant,
  title,
  about,
  cypressName,
}) => {
  return (
    <Main title={title} onClick={onClick} about={about} data-cy={cypressName}>
      {variant === 'refresh' && <RefreshCw size={15} />}
      {variant === 'play' && <Play size={15} />}
      {variant === 'eye' && <Eye size={15} />}
    </Main>
  );
};

export const RNoop: FunctionComponent<Pick<RProps, 'variant'>> = ({
  variant,
}) => {
  return (
    <Main>
      {variant === 'refresh' && <RefreshCw size={15} />}
      {variant === 'play' && <Play size={15} />}
      {variant === 'eye' && <Eye size={15} />}
    </Main>
  );
};
