import styled from '@emotion/styled';
import { darken, toHex } from 'color2k';
import { Colors } from '../Colors';

export const Placehold = styled.div`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 50px;
  color: ${toHex(darken(Colors.grey, 0.3))};
`;
