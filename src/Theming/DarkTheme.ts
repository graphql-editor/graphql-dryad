import { darken, toHex } from 'color2k';
import { Colors } from '../Colors';

const BaseTheme = {
  shadow: `${toHex(darken(Colors.grey, 0.95))} 2px 2px 10px`,
};

type ToThemeDict<T> = {
  [P in keyof T]: T[P] extends string
    ? string
    : T[P] extends Record<string, any>
    ? ToThemeDict<T[P]>
    : never;
};
export type EditorTheme = ToThemeDict<typeof BaseTheme>;
export const DarkTheme = BaseTheme as EditorTheme;
