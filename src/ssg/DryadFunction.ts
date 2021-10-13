import { TreeToTS } from 'graphql-zeus';
import { Parser } from 'graphql-js-tree';
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
  head?: string;
  script: string;
}
export interface DryadFunctionFunction {
  (): Promise<DryadFunctionResult>;
}

export const DryadFunction = async ({
  schema,
  url,
  js,
}: DryadFunctionProps): Promise<DryadFunctionResult> => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit({
    tree: graphqlTree,
    env: 'browser',
    host: url,
  });
  const jsString = jsSplit.const.concat('\n').concat(jsSplit.index);
  const functions = jsString.replace(/export /gm, '');

  const functionBody = [functions, js].join('\n');
  const esmUrl = URL.createObjectURL(
    new Blob([functionBody], { type: 'text/javascript' }),
  );
  const imported = await eval(`import("${esmUrl}")`);
  const body = imported.default;
  const head = imported.head ? await imported.head() : undefined;
  return {
    body: await body(),
    script: functionBody,
    head,
  };
};
