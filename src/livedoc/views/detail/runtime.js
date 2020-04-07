// @eslint-ignore
const determineType = (type) => {
  return type.name || type.ofType.name || type.ofType.ofType.name || type.ofType.ofType.ofType.name;
};
const returnFieldKinds = (type, params = []) => {
  if (type.kind) {
    params.push(type.kind);
  }
  if (type.ofType) {
    return returnFieldKinds(type.ofType, params);
  }
  return params;
};
const realType = (kinds, type) => {
  let rt = type;
  while (kinds.length > 0) {
    const kind = kinds.pop();
    if (kind === 'NON_NULL') {
      rt = `${rt}!`;
    }
    if (kind === 'LIST') {
      rt = `[${rt}]`;
    }
  }
  return rt;
};
const typeLinks = (types, title, activeType) => {
  return `
  <div class="MenuTypes">
      <h4>${title}</h4>
      ${types
        .map(
          (t) => `
      <a href="${t}.html" class="Link ${t === activeType ? 'Active' : ''}" >${t}</a>
      `,
        )
        .join('')}
  </div>
  `;
};

const LinksForKind = (kind) => (types, title, activeType) => typeLinks(types, title, activeType);
const MenuCategory = (kind) => (types, title, activeType) => {
  const filteredTypes = types.filter((t) => t.kind === kind).map((t) => t.name);
  if (filteredTypes.length === 0) {
    return ``;
  }
  return `
  <div class="MenuSection">
    ${LinksForKind(kind)(filteredTypes, title, activeType)}
  </div>
  `;
};

export const dryad = (activeCategory) => ({
  Query: {
    __schema: (v) => {
      if (!v.value) {
        return ``;
      }
      const { queryType, mutationType, subscriptionType } = v.value;
      const schemaTypes = [queryType, mutationType, subscriptionType].filter((t) => !!t).map((t) => t.name);
      const types = v.value.types.filter((t) => !schemaTypes.includes(t.name));
      types.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      const mainTypes = types.filter((t) => t.name.indexOf('__') === -1);

      return `
            <div class="Menu">
                <div class="MenuHeader">
                    <img class="Logo" src="https://graphqleditor.com/static/logoText-4ce01b90dc0eba15154a66bdee8f67d6.png" />
                </div>
                <div class="MenuSection">
                    ${typeLinks(schemaTypes, 'Schema', activeCategory)}
                </div>
                ${MenuCategory('OBJECT')(mainTypes, 'Types', activeCategory)}
                ${MenuCategory('INTERFACE')(mainTypes, 'Interfaces', activeCategory)}
                ${MenuCategory('UNION')(mainTypes, 'Unions', activeCategory)}
                ${MenuCategory('INPUT')(mainTypes, 'Inputs', activeCategory)}
                ${MenuCategory('ENUM')(mainTypes, 'Enums', activeCategory)}
                ${MenuCategory('SCALAR')(mainTypes, 'Scalars', activeCategory)}
            </div>
            `;
    },
  },
  __Type: {
    fields: (v) => `
    <div class="__Type-fields">
        <h3>Fields</h3>
        <div class="Fields">
            ${v.value
              .map((field) => {
                return `
                <div class="Field">
                    <div class="FieldParams">
                        <div class="FieldName">${field.name}</div>
                        <a href="${determineType(field.type)}.html" class="FieldType">${realType(
                  returnFieldKinds(field.type),
                  determineType(field.type),
                )}</a>
                    </div>
                    <div class="FieldDescription">${field.description}</div>
                </div>
                `;
              })
              .join('')}
        </div>
    </div>
            `,
    enumValues: (v) =>
      v.value
        ? `
    <div class="__Type-fields">
        <h3>Enum Values</h3>
        <div class="Fields">
          ${v.value
            .map((field) => {
              return `
              <div class="Field">
                  <div class="FieldParams">
                      <div class="FieldName">${field.name}</div>
                  </div>
                  <div class="FieldDescription">${field.description}</div>
              </div>
            `;
            })
            .join('')}
        </div>`
        : ``,
  },
});
