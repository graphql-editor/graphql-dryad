import { Colors } from '../../Colors';
import { editor } from 'monaco-editor';
import { darken, toHex } from 'color2k';

export const CssTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'tag.css', foreground: Colors.main },
    { token: 'comment.css', foreground: toHex(darken(Colors.grey, 0.5)) },
    { token: 'attribute.name.css', foreground: Colors.blue },
    { token: 'attribute.value.number.css', foreground: Colors.green },
    {
      token: 'attribute.value.unit.css',
      foreground: toHex(darken(Colors.grey, 0.2)),
    },
    { token: 'string.css', foreground: Colors.red },
  ],
  colors: {
    'editor.foreground': Colors.grey,
    'editor.background': toHex(darken(Colors.main, 0.61)),
    'minimap.background': toHex(darken(Colors.main, 0.62)),
  },
};
