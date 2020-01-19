import React, { useState, useEffect } from 'react';
import { TypeMap, getGraphQL, GraphQLInfo } from './TypeMapResolver';
import { OperationType } from 'graphql-zeus';
export const DryadElement = ({
  // Replace with dryad options later
  dryad,
  fieldName = '',
  o,
  parent,
  prefix,
  typemap,
  withLabels,
}: {
  dryad?: any;
  fieldName?: string;
  o: any;
  parent?: string;
  prefix: string;
  typemap: TypeMap;
  withLabels?: boolean;
}) => {
  const className = [parent, fieldName].filter((d) => !!d).join('-');
  if (dryad && dryad.render && parent && fieldName) {
    const dr = dryad.render as any;
    if (parent in dr) {
      const scalarFields = dr[parent];
      if (fieldName in scalarFields) {
        return (
          <>
            {scalarFields[fieldName]({
              name: fieldName,
              value: o,
              className,
            })}
          </>
        );
      }
    }
  }
  if (Array.isArray(o)) {
    return (
      <div className={`${prefix} ${className} d-list`}>
        {o.map((vv: any, index: number) => (
          <DryadElement
            withLabels={withLabels}
            typemap={typemap}
            fieldName={`d-item`}
            dryad={dryad}
            prefix={`${prefix}`}
            o={vv}
          />
        ))}
      </div>
    );
  }
  if (o !== null && typeof o === 'object') {
    return (
      <div className={`${prefix} d-object`}>
        {Object.keys(o)
          .filter((k) => k !== '__typename')
          .map((k) => {
            const p = o.__typename || prefix;
            const rp = typemap[p];
            if (!rp) {
              throw new Error(`Cannot detect type for union/interface types, please include __typename in your query`);
            }
            return (
              <DryadElement
                typemap={typemap}
                parent={prefix}
                dryad={dryad}
                fieldName={k}
                prefix={typemap[p][k]}
                o={o[k]}
                key={fieldName}
                withLabels={withLabels}
              />
            );
          })}
        {dryad?.inject && fieldName in dryad.inject && (dryad.inject as any)[fieldName]!(o)}
      </div>
    );
  }
  return (
    <div className={`${prefix} ${className} d-field`}>
      {withLabels && fieldName && <span className={`d-label`}>{fieldName}</span>}
      <span className={`d-value`}>{o}</span>
    </div>
  );
};

export const DryadGQL = ({
  children,
  dryad,
  gql,
  headers = {},
  url,
  withLabels,
}: {
  // Replace with DryadOptions Later
  dryad?: any;
  children: React.ReactNode;
  gql: string;
  headers?: Record<string, string>;
  url: string;
  withLabels?: boolean;
}) => {
  const [response, setResponse] = useState(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [graphqlInfo, setGraphQLInfo] = useState<GraphQLInfo>();
  const [operationType, setOperationType] = useState<OperationType>(OperationType.query);
  const [operation, setOperation] = useState<string>();
  useEffect(() => {
    setIsFetching(true);
    setResponse(undefined);
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
          throw new Error((response.errors as any).map((e: any) => e.message).join('\n'));
        }
        setResponse(response.data);
        setIsFetching(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [gql]);
  useEffect(() => {
    (async () => {
      setGraphQLInfo(await getGraphQL(url));
    })();
  }, []);
  useEffect(() => {
    if (graphqlInfo && graphqlInfo.typeMap && operationType) {
      const ot = graphqlInfo.root[operationType];
      setOperation(ot);
    }
  }, [operationType, JSON.stringify(graphqlInfo || {})]);
  if (isFetching) {
    return <>Fetching data...</>;
  }
  if (!response || !graphqlInfo?.typeMap || !operation) {
    return <>{children}</>;
  }
  if (response === null) {
    return <>response is null</>;
  }
  return (
    <DryadElement withLabels={withLabels} typemap={graphqlInfo.typeMap} prefix={operation} o={response} dryad={dryad} />
  );
};
