import React from 'react';
import { TypeMap } from './TypeMapResolver';

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
      <div className={`${prefix}-list ${className} d-list`}>
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
      <div className={`${prefix} ${className} d-object`}>
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
