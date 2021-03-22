import { HalfCode, HalfCodeProps } from '@/halfcode';
import { ThemeProvider } from '@/hooks/useTheme';
import React from 'react';

export const GraphQLDryad = (props: HalfCodeProps) => {
  return (
    <ThemeProvider>
      <HalfCode {...props} />
    </ThemeProvider>
  );
};
