import React from 'react';
import { Colors } from '../Colors';
import { ChevronRight, ChevronLeft } from 'react-feather';
import styled from '@emotion/styled';
import { darken, toHex } from 'color2k';
import { tree } from '@/cypressTree';

const Main = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: ${toHex(darken(Colors.main, 0.64))};
`;

const Chevron = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 8px;
  svg {
    stroke: ${toHex(darken(Colors.grey, 0.2))};
    transition: stroke 0.25s ease-in-out;
  }
  :hover {
    svg {
      stroke: ${Colors.pink};
    }
  }
`;

export const Tabs: React.FC<{
  toggle: () => void;
  toggled?: boolean;
}> = ({ children, toggle, toggled }) => {
  return (
    <Main data-cy={tree.tree.main.code.tabs.element}>
      {children}
      <Chevron onClick={() => toggle()}>
        {!toggled && <ChevronRight />}
        {toggled && <ChevronLeft />}
      </Chevron>
    </Main>
  );
};
