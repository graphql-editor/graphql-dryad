// @ts-ignore
import { Remarkable } from 'remarkable';
// @ts-ignore
const md = new Remarkable();

export const DryadElementPlain = (props: {
  dryad?: any;
  fieldName?: string;
  o: any;
  parent?: string;
  withLabels?: boolean;
  isStatic?: boolean;
}): string => {
  const {
    // Replace with dryad options later
    dryad,
    fieldName = '',
    o,
    parent,
    withLabels,
    isStatic,
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
          return `${scalarFields[fieldName]({
            name: fieldName,
            value: o,
            original: DryadElementPlain({ ...props, dryad: decoupledDryad }),
            className,
            md,
            isStatic,
          })}`;
        }
      }
    } catch (error) {
      console.error('Dryad error', error.message);
    }
  }
  if (Array.isArray(o)) {
    return `<div class="${className}">
        ${o
          .map((vv: any) =>
            DryadElementPlain({
              parent: className,
              dryad,
              fieldName: 'd-item',
              o: vv,
              withLabels,
              isStatic,
            }),
          )
          .join('')}
      </div>`;
  }
  if (o !== null && typeof o === 'object') {
    return `<div class="${o.__typename!}">
        ${Object.keys(o)
          .filter((k) => k !== '__typename')
          .map((k, i) => {
            return DryadElementPlain({
              dryad,
              fieldName: k,
              parent: o.__typename!,
              o: o[k],
              withLabels,
              isStatic,
            });
          })
          .join('')}
        ${dryad?.inject && fieldName in dryad.inject ? (dryad.inject as any)[fieldName]!(o) : ''}
      </div>`;
  }
  return `
    <div class="${className} ${o && typeof o}">
      ${withLabels && fieldName ? `<span class="d-label">${fieldName}</span>` : ''}
      <span class="d-value">${o}</span>
    </div>`;
};
