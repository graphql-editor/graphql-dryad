import { Colors } from '../Colors';
import { editor } from 'monaco-editor';

export const GqlSpecialTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: Colors.grey[5] },
    { token: 'operation', foreground: Colors.main[0] },
    { token: 'fragment', foreground: Colors.blue[0] },
    { token: 'directive', foreground: Colors.green[0] },
    { token: 'identifier', foreground: Colors.grey[0] },
    { foreground: Colors.red[0], token: 'stringinner' },
    { foreground: Colors.green[0], token: 'number' },
    { foreground: Colors.grey[0], token: 'string' },
    { fontStyle: 'bold', token: 'function', foreground: Colors.grey[2] },
    { foreground: Colors.grey[3], token: 'bracket' },
  ],
  colors: {
    'editor.foreground': Colors.grey[0],
  },
};
