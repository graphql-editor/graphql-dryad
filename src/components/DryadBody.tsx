import styled from '@emotion/styled';

export const DryadBody = styled.div`
  flex: 1;
  background: ${({
    theme: {
      colors: { text },
    },
  }) => text};
  box-shadow: ${({ theme: { shadow } }) => shadow};
`;
