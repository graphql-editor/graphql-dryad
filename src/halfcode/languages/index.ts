import * as monaco from 'monaco-editor';
export const initLanguages = () => {
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
};
