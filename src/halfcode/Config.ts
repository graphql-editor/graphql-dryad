import React from 'react';
import * as monaco from 'monaco-editor';
import * as icons from './icons';
import * as themes from './themes';
export enum Editors {
  css = 'css',
  js = 'js',
  settings = 'settings',
}

export type Values = Record<Editors, string>;
export type Refs = Record<Editors, React.RefObject<HTMLDivElement>>;
interface ConfigurationLanguage {
  options: monaco.editor.IStandaloneEditorConstructionOptions &
    Required<
      Pick<
        monaco.editor.IStandaloneEditorConstructionOptions,
        'theme' | 'language'
      >
    >;
  icon: keyof typeof icons;
  themeModule: keyof typeof themes;
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
    themeModule: 'CssTheme',
  },
  settings: {
    options: {
      language: 'json',
      theme: 'faker',
    },
    icon: 'Settings',
    themeModule: 'SettingsTheme',
  },
  js: {
    options: {
      language: 'javascript',
      theme: 'js',
    },
    themeModule: 'JsTheme',
    icon: 'Js',
  },
};

Object.values(Config).forEach((v) => {
  monaco.editor.defineTheme(v.options.theme, themes[v.themeModule]);
});
