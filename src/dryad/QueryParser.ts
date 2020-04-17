import { tokenizer, Token, TokenType, generate } from './tokenizer';

const insertTypeName = (tokens: Token[]): Token[] => {
  const filteredTokens = tokens.filter((t) => t.value !== '__typename');
  const newTokens: Token[] = [];
  for (let index = 0; index < filteredTokens.length; index++) {
    const left = index > 0 ? filteredTokens[index - 1] : undefined;
    // const right = index < filteredTokens.length - 1 ? filteredTokens[index + 1] : undefined;
    const token = filteredTokens[index];
    newTokens.push(token);
    if (
      token.value === '{' &&
      (!left || (left.value !== ':' && left.value !== '}'))
    ) {
      newTokens.push({
        type: TokenType.KEYWORD,
        value: '__typename',
      });
    }
  }
  return newTokens;
};

export const ParseQuery = (gql: string) => {
  const parsedGql = tokenizer(gql);
  const withInserted = insertTypeName(parsedGql);
  return generate(withInserted);
};
