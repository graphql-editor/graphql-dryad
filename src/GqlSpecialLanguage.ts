import { OperationType } from 'graphql-zeus';
import { languages } from 'monaco-editor';

export const GqlSpecialLanguage: languages.IMonarchLanguage = {
  defaultToken: 'string',
  tokenizer: {
    root: [
      [new RegExp(OperationType.query), 'operation'],
      [new RegExp(OperationType.mutation), 'operation'],
      [new RegExp(OperationType.subscription), 'operation'],
      [/fragment/, 'fragment'],
      [/@[^\s]*/, 'directive'],
      [/[\s]?(\d+)/, 'number'],
      [/{/, 'bracket'],
      [/}/, 'bracket'],
      [/[\s]?"[^[^\]"]*"/, 'stringinner'],
    ],
  },
};
