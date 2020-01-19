import React, { useState, useEffect } from 'react';
import { TypeMap, getTypeMap } from './TypeMapResolver';
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
  const [response, setResponse] = useState(null);
  const [typemap, setTypemap] = useState<TypeMap>();

  useEffect(() => {
    fetch(url, {
      body: JSON.stringify({ query: gql }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
      .then((r) => r.json())
      .then((r) => setResponse(r.data));
  }, [gql]);
  useEffect(() => {
    (async () => {
      setTypemap(await getTypeMap(url));
    })();
  }, []);
  if (!response || !typemap) {
    return <>{children}</>;
  }
  return <DryadElement withLabels={withLabels} typemap={typemap} prefix={'Root'} o={response} dryad={dryad} />;
};
