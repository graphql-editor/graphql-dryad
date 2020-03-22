import { OperationType } from 'graphql-zeus';
import { DryadElementPlain, getGraphQL } from '../dryad';

export const RenderToHTML = async ({
  dryad,
  gql,
  headers = {},
  url,
  withLabels,
}: {
  // Replace with DryadOptions Later
  dryad?: any;
  gql: string;
  headers?: Record<string, string>;
  url: string;
  withLabels?: boolean;
}) => {
  const parts = gql.split('{').flatMap((g) => g.split('}'));
  let operationType = OperationType.query;
  for (const part of parts) {
    if (part.indexOf(OperationType.mutation) !== -1) {
      operationType = OperationType.mutation;
      break;
    }
    if (part.indexOf(OperationType.subscription) !== -1) {
      operationType = OperationType.subscription;
      break;
    }
  }
  const graphqlInfo = await getGraphQL(
    url,
    Object.keys(headers).map((h) => `${h}: ${headers[h]}`),
  );
  const ot = graphqlInfo.root[operationType];
  if (gql.length === 0 || !graphqlInfo) {
    return;
  }
  try {
    const response = await (
      await fetch(url, {
        body: JSON.stringify({ query: gql }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })
    ).json();
    if (response.errors) {
      return;
    }

    if (response === null) {
      return 'response is null';
    }
    const res = response.data;
    return DryadElementPlain({
      withLabels,
      typemap: graphqlInfo.typeMap,
      prefix: ot!,
      o: res,
      dryad,
    });
  } catch (error) {
    console.log(error);
  }
};
