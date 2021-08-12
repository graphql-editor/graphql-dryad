import styled from '@emotion/styled';

export const Tab = styled.div<{ active?: boolean }>`
  color: ${({
    active,
    theme: {
      colors: { text, disabled },
    },
  }) => (active ? text : disabled)};
  opacity: ${({ active }) => (active ? 1.0 : 0.5)};
  font-size: 11px;
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  border-bottom: ${({
    active,
    theme: {
      colors: {
        background: { mainClosest },
      },
    },
  }) => (active ? `solid 1px ${mainClosest}` : 0)};
`;
