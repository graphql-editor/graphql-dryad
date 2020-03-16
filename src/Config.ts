import React from 'react';
import * as monaco from 'monaco-editor';
import * as icons from './icons';
export enum Editors {
  css = 'css',
  graphql = 'graphql',
  js = 'js',
  settings = 'settings',
}

export type Values = Record<Editors, string>;
export type Refs = Record<Editors, React.RefObject<HTMLDivElement>>;
interface ConfigurationLanguage {
  options: monaco.editor.IStandaloneEditorConstructionOptions;
  icon: keyof typeof icons;
}
export const Config: Record<Editors, ConfigurationLanguage> = {
  css: {
    options: {
      language: 'css',
      fixedOverflowWidgets: true,
      parameterHints: {
        enabled: true,
      },
      theme: 'css',
    },
    icon: 'Css',
  },
  settings: {
    options: {
      language: 'json',
      theme: 'faker',
    },
    icon: 'Settings',
  },
  js: {
    options: {
      language: 'javascript',
      theme: 'js',
    },
    icon: 'Js',
  },
  graphql: {
    options: {
      language: 'gqlSpecial',
      theme: 'gqlSpecialTheme',
    },
    icon: 'GraphQL',
  },
};
