import React, { useState, useEffect } from 'react';
import { TypeMap, getGraphQL, GraphQLInfo } from './TypeMapResolver';
import { OperationType } from 'graphql-zeus';
import { Placehold } from './components';
export const DryadElement = (props: {
  dryad?: any;
  fieldName?: string;
  o: any;
  parent?: string;
  prefix: string;
  typemap: TypeMap;
  withLabels?: boolean;
}) => {
  const {
    // Replace with dryad options later
    dryad,
    fieldName = '',
    o,
    parent,
    prefix,
    typemap,
    withLabels,
  } = props;

  const className = [parent, fieldName].filter((d) => !!d).join('-');
  if (dryad && dryad.render && fieldName) {
    try {
      const dryadRender = dryad.render as any;
      if (parent && parent in dryadRender) {
        const scalarFields = dryadRender[parent];
        if (fieldName in scalarFields && typeof scalarFields[fieldName] === 'function') {
          return (
            <div
              style={{ display: 'contents' }}
              dangerouslySetInnerHTML={{
                __html: scalarFields[fieldName]({
                  name: fieldName,
                  value: o,
                  className,
                }),
              }}
            />
          );
        }
      }
    } catch (error) {
      console.error('Dryad error', error.message);
    }
  }
  if (Array.isArray(o)) {
    return (
      <div className={`${prefix} ${className} d-list`}>
        {o.map((vv: any, index: number) => (
          <DryadElement
            key={index}
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
          .map((k, i) => {
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
                key={`${fieldName}-${i}`}
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
  const [backendErrors, setBackendErrors] = useState<string[]>([]);

  useEffect(() => {
    setResponse(undefined);
    if (gql.length === 0) {
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
    <DryadElement withLabels={withLabels} typemap={graphqlInfo.typeMap} prefix={operation} o={response} dryad={dryad} />
  );
};
