import React from 'react';
import * as monaco from 'monaco-editor';
import * as icons from './icons';
import * as themes from './themes';
export enum Editors {
  css = 'css',
  js = 'js',
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
  js: {
    options: {
      language: 'javascript',
      theme: 'js',
    },
    themeModule: 'JsTheme',
    icon: 'Js',
  },
};

export const extendJs = async () => {
  const extendConf:
    | monaco.languages.IMonarchLanguage
    | monaco.Thenable<monaco.languages.IMonarchLanguage> = {
    tokenizer: {
      root: [
        [
          /html\`/,
          { token: 'function', next: '@htmlstring', nextEmbedded: 'html' },
        ],
        [
          /css\`/,
          { token: 'function', next: '@cssstring', nextEmbedded: 'css' },
        ],
        [
          /md\`/,
          { token: 'function', next: '@mdstring', nextEmbedded: 'markdown' },
        ],
      ],
      htmlstring: [
        [/`/, { token: 'htmlstring', next: '@pop', nextEmbedded: '@pop' }],
        [
          /\$\{/,
          { token: 'delimiter', next: '@jsstring', nextEmbedded: '@pop' },
        ],
      ],
      jsstring: [
        [/\}/, { token: 'delimiter', next: '@pop', nextEmbedded: 'html' }],
        { include: '@root' },
      ],
      cssstring: [
        [/`/, { token: 'cssstring', next: '@pop', nextEmbedded: '@pop' }],
      ],
      mdstring: [
        [/`/, { token: 'mdstring', next: '@pop', nextEmbedded: '@pop' }],
      ],
    },
  };
  const allLangs = monaco.languages.getLanguages();
  if (allLangs) {
    const js = allLangs.find(({ id }) => id === 'javascript');
    await newFunction(js, extendConf);
  }
};
async function newFunction(
  js: monaco.languages.ILanguageExtensionPoint | undefined,
  extendConf: monaco.languages.IMonarchLanguage,
) {
  if (js) {
    const { language: jsLang } = await ((js as any).loader() as Promise<any>);
    for (const key in extendConf) {
      const value = (extendConf as any)[key];
      if (key === 'tokenizer') {
        for (const category in value) {
          const tokenDefs = value[category];
          if (!jsLang.tokenizer.hasOwnProperty(category)) {
            jsLang.tokenizer[category] = [];
          }
          if (Array.isArray(tokenDefs)) {
            jsLang.tokenizer[category].unshift.apply(
              jsLang.tokenizer[category],
              tokenDefs,
            );
          }
        }
      } else if (Array.isArray(value)) {
        if (!jsLang.hasOwnProperty(key)) {
          jsLang[key] = [];
        }
        jsLang[key].unshift.apply(jsLang[key], value);
      }
    }
  }
}
