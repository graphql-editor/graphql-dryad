import styled from '@emotion/styled';

export const Place = styled.div`
  flex: 1;
  background: ${({
    theme: {
      background: { mainFurther },
    },
  }) => mainFurther};
  overflow-y: auto;
`;
