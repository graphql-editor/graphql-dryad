import type * as monaco from 'monaco-editor';

const BaseTheme = {
  shadow: `#000000 88 2px 2px 10px, #F3F3F4 11 0 0 30px`,
  backgroundedText: '#F3F3F4',
  disabled: '#999999',
  inactive: '#bbbbbb',
  dimmed: '#eeeeee',
  text: '#F3F3F4',
  info: '#A3E7FC',
  success: '#acf7c1',
  error: '#de3c4b',
  contra: '#000000',
  title: '#d897b1',
  hover: '#e6bccd',
  secondaryHover: '#17bebb',
  main: '#d966ff',
  background: {
    mainClosest: '#9900cc',
    mainCloser: '#730099',
    mainClose: '#39004d',
    mainMiddle: '#270033',
    mainFar: '#130019',
    mainFurther: '#0f0014',
    mainFurthest: '#0b000f',
    success: '#0a6624',
    error: '#831621',
  },
};

type ToThemeDict<T> = {
  [P in keyof Omit<T, 'base'>]: T[P] extends string
    ? string
    : T[P] extends Record<string, any>
    ? ToThemeDict<T[P]>
    : never;
} & {
  base: monaco.editor.IStandaloneThemeData['base'];
};
export type EditorTheme = ToThemeDict<typeof BaseTheme>;
export const DarkTheme = BaseTheme as EditorTheme;
