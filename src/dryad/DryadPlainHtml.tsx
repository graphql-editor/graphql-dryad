import { TypeMap } from './TypeMapResolver';

export const DryadElementPlain = (props: {
  dryad?: any;
  fieldName?: string;
  o: any;
  parent?: string;
  prefix: string;
  typemap: TypeMap;
  withLabels?: boolean;
}): string => {
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
          return `<div style="display: contents" >${scalarFields[fieldName]({
            name: fieldName,
            value: o,
            original: DryadElementPlain({ ...props, dryad: decoupledDryad }),
            className,
          })}</div>`;
        }
      }
    } catch (error) {
      console.error('Dryad error', error.message);
    }
  }
  if (Array.isArray(o)) {
    return `<div class="${prefix}-list ${className} d-list">
        ${o
          .map((vv: any) =>
            DryadElementPlain({
              typemap,
              dryad,
              fieldName: 'd-item',
              prefix,
              o: vv,
              withLabels,
            }),
          )
          .join('')}
      </div>`;
  }
  if (o !== null && typeof o === 'object') {
    return `<div class="${prefix} ${className} d-object">
        ${Object.keys(o)
          .filter((k) => k !== '__typename')
          .map((k, i) => {
            const p = o.__typename || prefix;
            const rp = typemap[p];
            if (!rp) {
              throw new Error('Cannot detect type for union/interface types, please include __typename in your query');
            }
            return DryadElementPlain({
              typemap,
              dryad,
              fieldName: k,
              parent: prefix,
              prefix: typemap[p][k],
              o: o[k],
              withLabels,
            });
          })
          .join('')}
        ${dryad?.inject && fieldName in dryad.inject ? (dryad.inject as any)[fieldName]!(o) : ''}
      </div>`;
  }
  return `
    <div class="${prefix} ${className} d-field">
      ${withLabels && fieldName ? `<span class="d-label">${fieldName}</span>` : ''}
      <span class="d-value">${o}</span>
    </div>`;
};
