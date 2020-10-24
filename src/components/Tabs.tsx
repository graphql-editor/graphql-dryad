import React from 'react';
import { Colors } from '../Colors';
import { ChevronRight, ChevronLeft } from 'react-feather';
import styled from '@emotion/styled';

const Main = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: ${Colors.main[10]};
`;

const Chevron = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 8px;
  svg {
    stroke: ${Colors.grey[2]};
    transition: stroke 0.25s ease-in-out;
  }
  :hover {
    svg {
      stroke: ${Colors.pink[0]};
    }
  }
`;

export const Tabs: React.FC<{
  toggle: () => void;
  toggled?: boolean;
}> = ({ children, toggle, toggled }) => {
  return (
    <Main>
      {children}
      <Chevron onClick={() => toggle()}>
        {!toggled && <ChevronRight />}
        {toggled && <ChevronLeft />}
      </Chevron>
    </Main>
  );
};
