export enum TokenType {
  BRACKETS = 'BRACKETS',
  COLON = 'COLON',
  KEYWORD = 'KEYWORD',
  NUMBER = 'NUMBER',
  PARENTHESES = 'PARENTHESES',
  SQUARE_PARENTHESES = 'SQUARE_PARENTHESES',
  STRING = 'STRING',
}

export interface Token {
  type: TokenType;
  value: string;
}

export const tokenizer = (input: string): Token[] => {
  let current = 0;

  const tokens: Token[] = [];

  while (current < input.length) {
    let char = input[current];
    if (char === ':') {
      tokens.push({
        type: TokenType.COLON,
        value: ':',
      });
      current++;
      continue;
    }
    if (char === '[') {
      tokens.push({
        type: TokenType.SQUARE_PARENTHESES,
        value: '[',
      });

      current++;

      continue;
    }

    if (char === ']') {
      tokens.push({
        type: TokenType.SQUARE_PARENTHESES,
        value: ']',
      });
      current++;
      continue;
    }
    if (char === '(') {
      tokens.push({
        type: TokenType.PARENTHESES,
        value: '(',
      });

      current++;

      continue;
    }

    if (char === ')') {
      tokens.push({
        type: TokenType.PARENTHESES,
        value: ')',
      });
      current++;
      continue;
    }

    if (char === '{') {
      tokens.push({
        type: TokenType.BRACKETS,
        value: '{',
      });

      current++;

      continue;
    }

    if (char === '}') {
      tokens.push({
        type: TokenType.BRACKETS,
        value: '}',
      });
      current++;
      continue;
    }

    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    const COMMA = /,/;
    if (COMMA.test(char)) {
      current++;
      continue;
    }

    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: TokenType.NUMBER, value });
      continue;
    }

    if (char === '"') {
      let value = '';
      char = input[++current];

      // Then we'll iterate through each character until we reach another
      // double quote.
      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // Skip the closing double quote.
      char = input[++current];

      // And add our `string` token to the `tokens` array.
      tokens.push({ type: TokenType.STRING, value });

      continue;
    }

    // The last type of token will be a `field` token.
    const LETTERS = /[a-z_.]/i;
    if (LETTERS.test(char)) {
      let value = '';

      // Again we're just going to loop through all the letters pushing them to
      // a value.
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // And pushing that value as a token with the type `name` and continuing.
      tokens.push({ type: TokenType.KEYWORD, value });

      continue;
    }
    throw new TypeError('I dont know what this character is: ' + char);
  }
  return tokens;
};

export const generate = (tokens: Token[]): string => {
  return tokens
    .map((t) => {
      if (t.type === TokenType.STRING) {
        return `"${t.value}"`;
      }
      return t.value;
    })
    .join(' ');
};
