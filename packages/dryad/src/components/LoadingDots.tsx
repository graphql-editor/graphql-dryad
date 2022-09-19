import { useTheme } from '@/hooks/useTheme';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

const bounceAnimation = (heightOfBounce: number) => keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: ${heightOfBounce ? heightOfBounce : 10}px }
  100% { margin-bottom: 0 }
`;
const DotWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin: auto 5px 5px;
`;
const Dot = styled.div<{
  delay: string;
  color: string;
  size: number;
  heightOfBounce: number;
}>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  margin: ${({ size }) => `0 ${size / 2}px`};
  /* Animation */
  animation: ${({ heightOfBounce }) => bounceAnimation(heightOfBounce)} 0.5s
    linear infinite;
  animation-delay: ${(props) => props.delay};
`;

export const LoadingDots: React.FC<{
  color?: string;
  dotSizeInPx?: number;
  heightOfBounce?: number;
}> = ({ color: c, dotSizeInPx = 10, heightOfBounce = 15 }) => {
  const {
    theme: { text },
  } = useTheme();
  const color = c || text;
  return (
    <DotWrapper>
      <Dot
        delay="0s"
        color={color}
        size={dotSizeInPx}
        heightOfBounce={heightOfBounce}
      />
      <Dot
        delay=".1s"
        color={color}
        size={dotSizeInPx}
        heightOfBounce={heightOfBounce}
      />
      <Dot
        delay=".2s"
        color={color}
        size={dotSizeInPx}
        heightOfBounce={heightOfBounce}
      />
    </DotWrapper>
  );
};
