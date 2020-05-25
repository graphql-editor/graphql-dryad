const css = (t: TemplateStringsArray): string => {
  console.log(t.toString());
  return t.toString();
};
export const EditorRestyle = css`
  .editor-widget {
    position: fixed !important;
  }
  .context-view {
    position: fixed !important;
  }
  .monaco-aria-container {
    bottom: 0;
  }
`;
