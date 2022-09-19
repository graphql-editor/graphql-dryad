import React from 'react';
import styled from '@emotion/styled';
import { tree } from '@/cypressTree';
import { R } from '@/components/R';

const Main = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: ${({
    theme: {
      background: { mainFar },
    },
  }) => mainFar};
`;

const Actions = styled.div`
  display: flex;
  margin-left: auto;
  display: flex;
  align-items: center;
  padding-right: 10px;
`;

export const Tabs: React.FC<{
  refresh: () => void;
  openBlob: () => void;
}> = ({ children, refresh, openBlob }) => {
  return (
    <Main data-cy={tree.tree.main.code.tabs.element}>
      {children}
      <Actions>
        <R
          title="Run GraphQL Query( Cmd/Ctrl + S )"
          about="Run Query"
          variant={'play'}
          onClick={refresh}
          cypressName={tree.tree.main.execute.play.element}
        />
        <R
          title="Preview in new tab"
          about="Preview HTML"
          variant={'eye'}
          cypressName={tree.tree.main.execute.preview.element}
          onClick={openBlob}
        />
      </Actions>
    </Main>
  );
};
