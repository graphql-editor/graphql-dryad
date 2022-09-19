import styled from '@emotion/styled';

export const Placehold = styled.div<{ color?: string }>`
  flex: 1;
  align-self: stretch;
  display: flex;
  padding: 3rem;
  white-space: pre-line;
  flex-direction: column;
  color: ${({ color, theme }) => color || theme.inactive};
`;
