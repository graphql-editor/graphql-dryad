import styled from '@emotion/styled';
import { darken, toHex } from 'color2k';
import { Colors } from '../Colors';

export const Tab = styled.div<{ active?: boolean }>`
  color: ${({ active }) =>
    active ? Colors.grey : toHex(darken(Colors.grey, 0.3))};
  opacity: ${({ active }) => (active ? 1.0 : 0.5)};
  font-size: 11px;
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  border-bottom: ${({ active }) => (active ? `solid 1px ${Colors.main}` : 0)};
`;
