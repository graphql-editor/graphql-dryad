import styled from '@emotion/styled';

export const DryadBody = styled.div`
  flex: 1;
  background: ${({ theme: { text } }) => text};
  box-shadow: ${({ theme: { shadow } }) => shadow};
`;
