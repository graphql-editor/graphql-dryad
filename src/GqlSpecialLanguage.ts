import { OperationType } from 'graphql-zeus';
import { languages } from 'monaco-editor';

export const GqlSpecialLanguage: languages.IMonarchLanguage = <languages.IMonarchLanguage>{
  defaultToken: 'string',
  keywords: ['null', 'true', 'false', 'query', 'mutation', 'subscription', 'schema', 'implements', 'fragment', 'on'],

  tokenizer: {
    root: [
      [new RegExp(OperationType.query), 'operation'],
      [new RegExp(OperationType.mutation), 'operation'],
      [new RegExp(OperationType.subscription), 'operation'],
      [/fragment/, 'fragment'],
      [/@[^\s]*/, 'directive'],
      [/[\s]?(\d+)/, 'number'],
      [/[\s]?"[^[^\]"]*"/, 'stringinner'],
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        },
      ],
      [
        /[A-Z][\w\$]*/,
        {
          cases: {
            '@default': 'identifier',
          },
        },
      ],
    ],
  },
};

export const GqlLanguageConfiguration: languages.LanguageConfiguration = {
  comments: {
    lineComment: '#',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['stringinner'] },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  folding: {
    offSide: true,
  },
};
