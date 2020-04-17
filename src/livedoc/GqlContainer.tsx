import React, { useState, useEffect } from 'react';
import { getGraphQL, GraphQLInfo } from '../dryad/TypeMapResolver';
import { OperationType } from 'graphql-zeus';
import { Placehold } from '../components';
import { ParseQuery } from '../dryad/QueryParser';
import { DryadElementPlain } from '../dryad/DryadPlainHtml';
import { CssReplace } from './CssReplace';

export const GqlContainer = ({
  children,
  dryad,
  gql,
  headers = {},
  url,
  withLabels,
  css,
}: {
  // Replace with DryadOptions Later
  children: React.ReactNode;
  dryad?: any;
  gql: string;
  headers?: Record<string, string>;
  url: string;
  withLabels?: boolean;
  css: string;
}) => {
  const [response, setResponse] = useState(undefined);
  const [graphqlInfo, setGraphQLInfo] = useState<GraphQLInfo>();
  const [operationType, setOperationType] = useState<OperationType>(
    OperationType.query,
  );
  const [operation, setOperation] = useState<string>();
  const [backendErrors, setBackendErrors] = useState<string[]>([]);

  useEffect(() => {
    if (gql.length === 0 || !graphqlInfo) {
      return;
    }
    const parts = gql.split('{').flatMap((g) => g.split('}'));
    let operationType = OperationType.query;
    for (const part of parts) {
      const trimmed = part.replace(/\s/g, '');
      if (trimmed === OperationType.mutation) {
        operationType = OperationType.mutation;
        break;
      }
      if (trimmed === OperationType.subscription) {
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
      } catch (error) {
        setBackendErrors([error.message]);
      }
    })();
  }, [gql, graphqlInfo]);

  useEffect(() => {
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
  if (!response || !graphqlInfo?.typeMap || !operation) {
    return <Placehold>{children}</Placehold>;
  }
  if (response === null) {
    return <Placehold>response is null</Placehold>;
  }
  return (
    <>
      <div
        style={{ display: 'contents' }}
        dangerouslySetInnerHTML={{
          __html: DryadElementPlain({
            withLabels,
            parent: operation,
            o: response,
            dryad: { render: dryad(operation) },
          }),
        }}
      />
      <style>{CssReplace(css, operation)}</style>
    </>
  );
};
