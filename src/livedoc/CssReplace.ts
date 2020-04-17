export const CssReplace = (css: string, operation: string) =>
  css
    .replace(/.Query\{/g, `.${operation}{`)
    .replace(/.Query\:\:/g, `.${operation}::`);
