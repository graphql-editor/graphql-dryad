import styled from '@emotion/styled';
import { darken, toHex } from 'color2k';
import { Colors } from '../Colors';

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
  color: ${({ color }) => toHex(darken(color ? color : Colors.grey, 0.3))};
`;
