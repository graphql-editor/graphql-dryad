import { Colors } from '../Colors';
import { editor } from 'monaco-editor';

export const CssTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'tag.css', foreground: Colors.main[0] },
    { token: 'comment.css', foreground: Colors.grey[5] },
    { token: 'attribute.name.css', foreground: Colors.blue[0] },
    { token: 'attribute.value.number.css', foreground: Colors.green[0] },
    { token: 'attribute.value.unit.css', foreground: Colors.grey[2] },
    { token: 'string.css', foreground: Colors.red[0] },
  ],
  colors: {
    'editor.foreground': Colors.grey[0],
  },
};
