import React, { useState, useEffect } from 'react';
import { getGraphQL, GraphQLInfo } from './TypeMapResolver';
import { OperationType } from 'graphql-zeus';
import { Placehold } from '../components';
import { ParseQuery } from './QueryParser';
import { DryadElementPlain } from './DryadPlainHtml';

export const DryadGQL = ({
  children,
  dryad,
  gql,
  headers = {},
  url,
  withLabels,
}: {
  // Replace with DryadOptions Later
  children: React.ReactNode;
  dryad?: any;
  gql: string;
  headers?: Record<string, string>;
  url: string;
  withLabels?: boolean;
}) => {
  const [response, setResponse] = useState(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [graphqlInfo, setGraphQLInfo] = useState<GraphQLInfo>();
  const [operationType, setOperationType] = useState<OperationType>(
    OperationType.query,
  );
  const [operation, setOperation] = useState<string>();
  const [backendErrors, setBackendErrors] = useState<string[]>([]);

  useEffect(() => {
    setResponse(undefined);
    if (gql.length === 0 || !graphqlInfo) {
      return;
    }
    setIsFetching(true);
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
    setOperationType(operationType);
    //IIFE
    (async () => {
      try {
        const parsedGql = ParseQuery(gql);
        const response = await (
          await fetch(url, {
            body: JSON.stringify({ query: parsedGql }),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
          })
        ).json();
        if (response.errors) {
          setBackendErrors(response.errors.map((e: any) => e.message));
          setResponse(undefined);
          return;
        }
        setBackendErrors([]);
        setResponse(response.data);
        setIsFetching(false);
      } catch (error) {
        setBackendErrors([error.message]);
      }
    })();
  }, [gql, graphqlInfo]);

  useEffect(() => {
    setGraphQLInfo(undefined);
    (async () => {
      const info = await getGraphQL(
        url,
        Object.keys(headers).map((h) => `${h}: ${headers[h]}`),
      );
      setGraphQLInfo(info);
    })();
  }, [url, headers]);

  useEffect(() => {
    if (graphqlInfo && graphqlInfo.typeMap && operationType) {
      const ot = graphqlInfo.root[operationType];
      setOperation(ot);
    }
  }, [operationType, JSON.stringify(graphqlInfo || {})]);

  if (backendErrors.length) {
    return <Placehold>{backendErrors.join('\n')}</Placehold>;
  }
  if (isFetching) {
    return <Placehold>Fetching data...</Placehold>;
  }
  if (!response || !graphqlInfo?.typeMap || !operation) {
    return <Placehold>{children}</Placehold>;
  }
  if (response === null) {
    return <Placehold>response is null</Placehold>;
  }
  return (
    <div
      style={{ display: 'contents' }}
      dangerouslySetInnerHTML={{
        __html: DryadElementPlain({
          withLabels,
          parent: operation,
          o: response,
          dryad,
        }),
      }}
    />
  );
};
