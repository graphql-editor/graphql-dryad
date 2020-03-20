import { GqlLanguageConfiguration, GqlSpecialLanguage } from './GqlSpecial';
import * as monaco from 'monaco-editor';
export const initLanguages = () => {
  monaco.languages.register({ id: 'gqlSpecial' });

  monaco.languages.setLanguageConfiguration('gqlSpecial', GqlLanguageConfiguration);
  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('gqlSpecial', GqlSpecialLanguage);

  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
};
