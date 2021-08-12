import { editor } from 'monaco-editor';
import { EditorTheme } from '@/Theming/DarkTheme';
export const JsTheme = ({
  colors: {
    disabled,
    info,
    success,
    hover,
    text,
    background: { mainFurthest, mainFurther },
  },
}: EditorTheme) =>
  ({
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment.js', foreground: disabled },
      { token: 'keyword.js', foreground: info },
      { token: 'number.js', foreground: success },
      { token: 'string.js', foreground: hover },
      { token: 'indentifier.js', foreground: text },
      {
        token: 'type.indentifier.js',
        foreground: text,
      },
    ],
    colors: {
      'editor.foreground': text,
      'editor.background': mainFurthest,
      'minimap.background': mainFurther,
    },
  } as editor.IStandaloneThemeData);
