/* CTRL/CMD + space in dryad
to write overrides in
string html templates
inject function format is:

(v:{
    name: string
    value: type of value
    className: class assigned
})
    => string containing html

(v) =>
    `<div>${v.value}</div>` */
const determineType = (type: any) => {
  return type.name || type.ofType.name || type.ofType.ofType.name;
};
export const dryad: any = {
  __Schema: {
    types: (v: any) => {
      v.value.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      return `
            <div class="Menu">
                <div class="MenuHeader">
                    <img class="Logo" src="https://graphqleditor.com/static/logoText-4ce01b90dc0eba15154a66bdee8f67d6.png" />
                </div>
                <div class="MenuSection">
                    <h4>Types</h4>
                    <div class="MenuTypes">
                        ${v.value
                          .filter((t: any) => t.name.indexOf('__') === -1)
                          .map(
                            (t: any) => `
                        <a href="${t.name}.html" class="Link ${t.name === 'Card' ? 'Active' : ''}" >${t.name}</a>
                        `,
                          )
                          .join('')}
                    </div>
                </div>
            </div>
            `;
    },
  },
  __Type: {
    fields: (v: any) => `
    <div class="__Type-fields">
        <h3>Fields</h3>
        <div class="Fields">
           ${v.value
             .map((field: any) => {
               return `
                <div class="Field">
                    <div class="FieldParams">
                        <div class="FieldName">${field.name}</div>
                        <div class="FieldType">${determineType(field.type)}</div>
                        <div class="FieldKind">${field.type.kind}</div>
                    </div>
                    <div class="FieldDescription">${field.description}</div>
                </div>
               `;
             })
             .join('')}
        </div>
    </div>
            `,
  },
};
