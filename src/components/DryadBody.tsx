import styled from '@emotion/styled';
import { darken, toHex } from 'color2k';
import { Colors } from '../Colors';

export const DryadBody = styled.div`
  flex: 1;
  background: ${Colors.grey};
  box-shadow: ${toHex(darken(Colors.grey, 0.91))}11 3px 5px 4px;
`;
