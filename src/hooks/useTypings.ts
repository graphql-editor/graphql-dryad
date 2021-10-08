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

const constructTypingsDefsUrl = ({
  packageName,
  baseUrl,
}: {
  packageName: string;
  baseUrl: string;
}) => `${baseUrl}/@types/${packageName}/index.d.ts`;

const constructTypingsUrl = ({
  packageName,
  baseUrl,
  typingsPath,
}: {
  packageName: string;
  baseUrl: string;
  typingsPath: string;
}) => `${baseUrl}/${packageName}/${typingsPath}`;

const fetchTypingsForUrl = async (url: string) => {
  const module = await fetch(url).then((r) => {
    if (r.status === 404) {
      return;
    }
    return r.text();
  });
  return module;
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

const fetchTypings = async (packages: PackageDetails[]) => {
  if (packages.length === 0) {
    return [];
  }
  message(
    'Starting streaming types for packages: ' +
      packages.map((p) => p.packageName).join(', '),
    'blueBright',
  );
  const packagesWithTypings = await Promise.all(
    packages.map(async (p) => {
      let lookForTypings = await fetchTypingsForUrl(
        constructTypingsUrl({
          baseUrl: p.url,
          packageName: p.packageName,
          typingsPath: 'types/index.d.ts',
        }),
      );
      lookForTypings =
        lookForTypings ||
        (await fetchTypingsForUrl(
          constructTypingsDefsUrl({
            baseUrl: p.url,
            packageName: p.packageName,
          }),
        ));
      if (!lookForTypings) {
        message(
          `Can't find typings on "${p.packageName}" Package will remain untyped`,
          'redBright',
        );
      }
      return {
        p,
        typings: lookForTypings,
      };
    }),
  );
  message('Successfully fetched the types', 'greenBright');
  return packagesWithTypings.filter((p) => p.typings) as Array<{
    p: PackageDetails;
    typings: string;
  }>;
};

let packageCache: Record<string, { typings: string; url: string }> = {};

const downloadTypings = async ({
  filesContent,
}: {
  filesContent: string[];
}) => {
  const packages = mergePackages(filesContent).filter(
    (p) => !packageCache[`${p.packageName}`],
  );
  const ts = await fetchTypings(packages);
  const paths: Record<string, { typings: string; url: string }> = {};
  ts.forEach((t) => {
    // const typingsPath = [t.p.packageName, 'index.d.ts'].join('/');
    message(`Installing typings for "${t.p.packageName}"`, 'yellowBright');
    paths[`${t.p.packageName}`] = {
      typings: t.typings,
      url: t.p.url,
    };
  });
  packageCache = { ...packageCache, ...paths };
  return packageCache;
};

export const useTypings = () => {
  return {
    downloadTypings,
  };
};
