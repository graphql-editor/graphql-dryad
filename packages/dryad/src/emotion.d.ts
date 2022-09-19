import { EditorTheme } from '@/Theming/DarkTheme';
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends EditorTheme {}
}
