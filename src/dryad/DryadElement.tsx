import React from 'react';
import ReactDOMServer from 'react-dom/server';

export const DryadElement = (props: {
  dryad?: any;
  fieldName?: string;
  o: any;
  parent?: string;
  withLabels?: boolean;
}) => {
  const {
    // Replace with dryad options later
    dryad,
    fieldName = '',
    o,
    parent,
    withLabels,
  } = props;

  const className = [parent, fieldName].filter((d) => !!d).join('-');
  if (dryad && dryad.render && fieldName) {
    try {
      const dryadRender = dryad.render as any;
      if (parent && parent in dryadRender) {
        const scalarFields = dryadRender[parent];
        if (fieldName in scalarFields && typeof scalarFields[fieldName] === 'function') {
          const decoupledDryad = {
            ...dryad,
            render: {
              ...dryad.render,
              [parent]: {
                ...dryad.render[parent],
                [fieldName]: undefined,
              },
            },
          };
          return (
            <div
              style={{ display: 'contents' }}
              dangerouslySetInnerHTML={{
                __html: scalarFields[fieldName]({
                  name: fieldName,
                  value: o,
                  original: ReactDOMServer.renderToString(<DryadElement {...props} dryad={decoupledDryad} />),
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
      <div className={`${className}`}>
        {o.map((vv: any, index: number) => (
          <DryadElement
            parent={className}
            key={index}
            withLabels={withLabels}
            fieldName={`d-item`}
            dryad={dryad}
            o={vv}
          />
        ))}
      </div>
    );
  }
  if (o !== null && typeof o === 'object') {
    return (
      <div className={`${o.__typename!}`}>
        {Object.keys(o)
          .filter((k) => k !== '__typename')
          .map((k, i) => {
            return (
              <DryadElement
                parent={o.__typename!}
                dryad={dryad}
                fieldName={k}
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
    <div className={`${className} ${o && typeof o}`}>
      {withLabels && fieldName && <span className={`d-label`}>{fieldName}</span>}
      {o && <span className={`d-value`}>{o}</span>}
    </div>
  );
};
