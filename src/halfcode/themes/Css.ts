import { editor } from 'monaco-editor';
import { EditorTheme } from '@/Theming/DarkTheme';

export const CssTheme = ({
  disabled,
  info,
  success,
  hover,
  text,
  background: { mainFurthest, mainFurther, mainClosest },
}: EditorTheme) =>
  ({
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'tag.css', foreground: mainClosest },
      { token: 'comment.css', foreground: disabled },
      { token: 'attribute.name.css', foreground: info },
      { token: 'attribute.value.number.css', foreground: success },
      {
        token: 'attribute.value.unit.css',
        foreground: text,
      },
      { token: 'string.css', foreground: hover },
    ],
    colors: {
      'editor.foreground': text,
      'editor.background': mainFurthest,
      'minimap.background': mainFurther,
    },
  } as editor.IStandaloneThemeData);
