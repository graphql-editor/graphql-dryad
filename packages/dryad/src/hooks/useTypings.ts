import { Chain } from '@/bundle-typings-types/zeus';
//@ts-ignore
import path from 'path-browserify';

const URL_REGEX = new RegExp(/import.*(https:\/\/.*)\/(.*)['|"]/gm);

interface PackageDetails {
  packageName: string;
  url: string;
}

const message = (...m: string[]) => {
  console.log(...m);
};

const parseDocumentToFindPackages = (content: string) => {
  return [...content.matchAll(URL_REGEX)]
    .filter((m) => m.length > 1)
    .map((m) => ({
      packageName: m[2],
      url: m[1],
    }));
};

const mergePackages = (filesContent: string[]) => {
  return filesContent
    .map(parseDocumentToFindPackages)
    .reduce<Array<PackageDetails>>((a, b) => {
      b.forEach((p) => {
        if (
          !a.find(
            (alreadyInArray) => alreadyInArray.packageName === p.packageName,
          )
        ) {
          a.push(p);
        }
      });
      return a;
    }, []);
};

export type PackageCache = {
  [packageName: string]: {
    content: string;
    path: string;
    url: string;
    name: string;
    packageName: string;
  }[];
};

const packageNameSplit = (pName: string): { name: string; version: string } => {
  const splitted = pName.split('@').filter((p) => !!p);
  if (splitted.length === 1) {
    return { name: pName, version: 'latest' };
  }
  return {
    name: splitted[0],
    version: splitted[1],
  };
};

const getPackages = ({
  filesContent,
  packageCache,
}: {
  filesContent: string[];
  packageCache: PackageCache;
}) => {
  return mergePackages(filesContent)
    .filter((p) => !packageCache[`${p.packageName}`])
    .map((p) => ({
      ...p,
      ...packageNameSplit(p.packageName),
      url: `${p.url}/${p.packageName}`,
    }));
};

const downloadTypings = async ({
  packages,
  typingsURL = 'https://bt-api.azurewebsites.net/graphql',
}: {
  packages: ReturnType<typeof getPackages>;
  typingsURL?: string;
}) => {
  try {
    const ts = await fetchTypingsFromBundleTypings({ packages, typingsURL });
    const paths: PackageCache = {};
    ts.forEach((t) => {
      // const typingsPath = [t.p.packageName, 'index.d.ts'].join('/');
      message(`Installing typings for "${t.name}"`, 'yellowBright');
      paths[`${t.packageName}`] ||= [];
      paths[`${t.packageName}`].push(t);
    });
    return paths;
  } catch (error) {
    return;
  }
};

export const useTypings = () => {
  return {
    downloadTypings,
    getPackages,
  };
};

const fetchTypingsFromBundleTypings = async ({
  packages,
  typingsURL,
}: {
  packages: Array<{
    name: string;
    version: string;
    url: string;
    packageName: string;
  }>;
  typingsURL: string;
}) => {
  const chain = Chain(typingsURL);
  const typingsFiles: Array<{
    content: string;
    path: string;
    url: string;
    name: string;
    packageName: string;
  }> = [];
  const deps: string[] = [];
  await Promise.all(
    packages.map(async (p) => {
      const response = await chain.query({
        bundle: [{ filter: p }, { jsonUrl: true }],
      });
      let jsonURL = response.bundle?.jsonUrl;
      if (!jsonURL) {
        const response = await chain.query({
          bundle: [
            {
              filter: {
                ...p,
                name: `@types/${p.name}`,
              },
            },
            { jsonUrl: true },
          ],
        });
        jsonURL = response.bundle?.jsonUrl;
      }
      if (jsonURL) {
        const jsonContent = await fetch(jsonURL).then((r) => r.text());
        const jsonDefinitions = JSON.parse(jsonContent) as {
          name: string;
          version: string;
          dependencies: string[];
          typings: Array<{ content: string; path: string }>;
        };
        typingsFiles.push(
          ...jsonDefinitions.typings.map((t) => ({
            ...t,
            path: t.path.replace(`@${jsonDefinitions.version}`, ''),
            url: p.url,
            name: p.name,
            packageName: p.packageName,
          })),
        );
        deps.push(...jsonDefinitions.dependencies);
      }
    }),
  );
  if (packages.length === 0) {
    return [];
  }
  return typingsFiles;
};
