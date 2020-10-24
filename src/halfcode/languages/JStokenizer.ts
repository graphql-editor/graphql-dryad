export const tokenizer = {
  string_backtick: [
    [
      /\$\{/,
      {
        token: 'delimiter.bracket',
        next: '@bracketCounting',
      },
    ],
    [/[^\\`$]+/, 'string'],
    [/@escapes/, 'string.escape'],
    [/\\./, 'string.escape.invalid'],
    [/`/, 'string', '@pop'],
  ],
};
