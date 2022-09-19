import { HalfCode, HalfCodeApi, HalfCodeProps } from '@/halfcode';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import React from 'react';

const GraphQLDryadEmotionInject = React.forwardRef<HalfCodeApi, HalfCodeProps>(
  (props, ref) => {
    const { theme } = useTheme();
    return (
      <EmotionThemeProvider theme={theme}>
        <HalfCode ref={ref} {...props} />
      </EmotionThemeProvider>
    );
  },
);

export const GraphQLDryad = React.forwardRef<HalfCodeApi, HalfCodeProps>(
  ({ theme, ...props }, ref) => {
    return (
      <ThemeProvider initialState={theme}>
        <GraphQLDryadEmotionInject ref={ref} {...props} />
      </ThemeProvider>
    );
  },
);
