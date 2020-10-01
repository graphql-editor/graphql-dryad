import { Colors } from '../../Colors';
import { editor } from 'monaco-editor';

export const JsTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment.js', foreground: Colors.grey[5] },
    { token: 'keyword.js', foreground: Colors.main[0] },
    { token: 'number.js', foreground: Colors.green[0] },
    { token: 'string.js', foreground: Colors.red[0] },
    { token: 'indentifier.js', foreground: Colors.grey[1] },
    { token: 'type.indentifier.js', foreground: Colors.grey[1] },
  ],
  colors: {
    'editor.foreground': Colors.grey[0],
    'editor.background': `#0b050d`,
    'minimap.background': '#0b050d',
  },
};
