import { editor } from 'monaco-editor';
import { EditorTheme } from '@/Theming/DarkTheme';
export const JsTheme = ({
  disabled,
  info,
  success,
  hover,
  text,
  background: { mainFurthest, mainFurther },
}: EditorTheme) =>
  ({
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment.ts', foreground: disabled },
      { token: 'keyword.ts', foreground: info },
      { token: 'number.ts', foreground: success },
      { token: 'string.ts', foreground: hover },
      { token: 'indentifier.ts', foreground: text },
      {
        token: 'type.indentifier.ts',
        foreground: text,
      },
    ],
    colors: {
      'editor.foreground': text,
      'editor.background': mainFurthest,
      'minimap.background': mainFurther,
    },
  } as editor.IStandaloneThemeData);
