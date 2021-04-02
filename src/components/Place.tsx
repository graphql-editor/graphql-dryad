import styled from '@emotion/styled';
import { darken, toHex } from 'color2k';
import { Colors } from '../Colors';

export const Place = styled.div`
  flex: 1;
  background: ${toHex(darken(Colors.main, 0.66))};
  overflow-y: auto;
`;
