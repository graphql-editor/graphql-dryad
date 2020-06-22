import { Utils } from 'graphql-zeus';

export const getParsedSchema = async ({
  url,
  headers,
}: {
  url: string;
  headers: Record<string, string>;
}) =>
  Utils.getFromUrl(
    url,
    Object.keys(headers).map((k) => `${k}: ${headers[k]}`),
  );
