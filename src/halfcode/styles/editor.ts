const css = (t: TemplateStringsArray): string => {
  console.log(t.toString());
  return t.toString();
};
export const EditorRestyle = css`
  .monaco-aria-container {
    bottom: 0;
  }
`;
