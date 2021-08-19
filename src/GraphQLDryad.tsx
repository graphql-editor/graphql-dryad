import { HalfCode, HalfCodeProps } from '@/halfcode';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import React from 'react';

const GraphQLDryadEmotionInject = (props: HalfCodeProps) => {
  const { theme } = useTheme();
  return (
    <EmotionThemeProvider theme={theme}>
      <HalfCode {...props} />
    </EmotionThemeProvider>
  );
};

export const GraphQLDryad = ({ theme, ...props }: HalfCodeProps) => {
  return (
    <ThemeProvider initialState={theme}>
      <GraphQLDryadEmotionInject {...props} />
    </ThemeProvider>
  );
};
