import { TreeToTS } from 'graphql-zeus';
import { Parser } from 'graphql-js-tree';
// @ts-ignore
import path from 'path-browserify';

export interface DryadFunctionProps {
  schema: string;
  url: string;
  js: string;
  libs?: Array<{ content: string; filePath: string }>;
}

export interface DryadFunctionResult {
  body: string;
  head?: string;
  script: string;
}
export interface DryadFunctionFunction {
  (): Promise<DryadFunctionResult>;
}
const PACKAGE_IMPORT_REGEX = new RegExp(
  /^((?:import|export).* from[^('|")]*(?:"|'))(\.(?:[^('|")]*))("|')/gm,
);

export const parseDocumentToFindPackages = (content: string) => {
  return [...content.matchAll(PACKAGE_IMPORT_REGEX)]
    .filter((m) => m.length > 0)
    .map((m) => m);
};

const blobelizeWithLibs = (
  filePath: string,
  content: string,
  libs?: Array<{ content: string; filePath: string }>,
): { blobUrl: string; content: string } => {
  let blobCache: Record<string, string | undefined> = {};
  const contentWithoutRelatives = content.replaceAll(
    PACKAGE_IMPORT_REGEX,
    (substr, ...args) => {
      const packageToImportKey = (
        path.join(filePath, args[1]) as string
      ).replace(/\.\w+$/, '');
      const keyFromCache = blobCache[packageToImportKey];
      if (!keyFromCache) {
        const findLibraryKey = libs?.find(
          (l) => l.filePath === packageToImportKey,
        );
        if (!findLibraryKey) {
          throw new Error(
            `Invalid import path in file ${filePath}. Cant find ${keyFromCache}`,
          );
        }
        blobCache[packageToImportKey] = blobelizeWithLibs(
          findLibraryKey.filePath,
          findLibraryKey.content,
          libs,
        ).blobUrl;
      }
      const refreshedKeyFromCache = blobCache[packageToImportKey];
      if (!refreshedKeyFromCache) {
        throw new Error('Possible circular reference');
      }
      return args[0] + refreshedKeyFromCache + args[2];
    },
  );
  const blobUrl = URL.createObjectURL(
    new Blob([contentWithoutRelatives], { type: 'text/javascript' }),
  );
  return {
    blobUrl,
    content: contentWithoutRelatives,
  };
};

export const DryadFunction = async ({
  schema,
  url,
  js,
  libs,
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

  const replacedJS = blobelizeWithLibs('', functionBody, libs);

  const esmUrl = URL.createObjectURL(
    new Blob([replacedJS.content], { type: 'text/javascript' }),
  );

  const imported = await eval(`import("${esmUrl}")`);
  const body = imported.default ? await imported.default() : '';
  const head = imported.head ? await imported.head() : undefined;

  return {
    body,
    script: functionBody,
    head,
  };
};
