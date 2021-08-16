import styled from '@emotion/styled';

export const Placehold = styled.div<{ color?: string }>`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  display: flex;
  padding: 3rem;
  white-space: pre-line;
  text-align: center;
  color: ${({ color, theme }) => color || theme.colors.inactive};
`;
