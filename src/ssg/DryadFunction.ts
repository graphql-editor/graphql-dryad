import { Parser, TreeToTS } from 'graphql-zeus';
// @ts-ignore
import { Remarkable } from 'remarkable';
// @ts-ignore

export interface DryadFunctionProps {
  schema: string;
  url: string;
  js: string;
}

export interface DryadFunctionResult {
  body: string;
  script: string;
}
export interface DryadFunctionFunction {
  (remarkableRenderer: (markdownString: string) => string): Promise<
    DryadFunctionResult
  >;
}

export const DryadDeclarations = `
// Return html string from this function fo ssg;
declare const render: <T>(fn:Function) => void;
declare var html: (strings: TemplateStringsArray, ...expr: string[]) => string
declare var css: (strings: TemplateStringsArray, ...expr: string[]) => string
declare var md: (strings: TemplateStringsArray, ...expr: string[]) => string
`;
export const DryadFunction = async ({
  schema,
  url,
  js,
}: DryadFunctionProps): Promise<DryadFunctionResult> => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit(graphqlTree, 'browser', url);
  const jsString = jsSplit.const.concat('\n').concat(jsSplit.index);
  const functions = jsString.replace(/export /gm, '');
  const addonFunctions = `
  import {Remarkable} from 'https://cdn.skypack.dev/remarkable';
  var html = typeof html === "undefined" ? (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  } : html
  var css = typeof css === "undefined" ? (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  } : css
  var md = typeof md === "undefined" ? (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return new Remarkable().render(str);
  } : md
  `;

  const functionBody = [addonFunctions, functions, js].join('\n');
  const esmUrl = URL.createObjectURL(
    new Blob([functionBody], { type: 'text/javascript' }),
  );
  const imported = await eval(`import("${esmUrl}")`);
  const body = imported.default;
  return {
    body: await body(),
    script: functionBody,
  };
};
