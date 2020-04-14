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

const RenderFieldTOC = (field) => {
  const rt = realType(returnFieldKinds(field.type), determineType(field.type));
  const argsRender =
    field.args && field.args.length > 0
      ? `(${field.args
          .map((a) => {
            const rtt = realType(returnFieldKinds(a.type), determineType(a.type));
            return `<span class="ArgumentName">${a.name}:</span><span class="FieldType">${rtt}</span>`;
          })
          .join(', ')})`
      : '';
  return `
     <a class="TableOfContentsLink" href="#${field.name}"><span class="FieldName">${field.name}:</span> <span class="FieldArgs">${argsRender}</span> <span class="FieldType">${rt}</span></a>
  `;
};

const RenderField = (field) => {
  const argsRender =
    field.args && field.args.length > 0
      ? `(${field.args
          .map((a) => {
            const rtt = realType(returnFieldKinds(a.type), determineType(a.type));
            return `<span class="ArgumentName">${a.name}:</span><span class="FieldType">${rtt}</span>`;
          })
          .join(', ')})`
      : '';
  return `
  <div class="Field">
      <div class="FieldParams">
          <div id="${field.name}" class="FieldName FieldName--field">${field.name}${argsRender}</div>
          <a href="${determineType(field.type)}.html" class="FieldType">${realType(
    returnFieldKinds(field.type),
    determineType(field.type),
  )}</a>
      </div>
      <div class="FieldDescription">${field.description}</div>
  </div>
  `;
};

const RenderPossibleTypes = (types) => `
<div class="__Type-possibleTypes">
    <h3>Possible Types</h3>
    <div class="Fields">
        ${types
          .map((field) => {
            return `
            <a href="${field.name}.html" class="FieldName FieldName--unionType">${field.name}</a>
            `;
          })
          .join('')}
    </div>
</div>
`;

const RenderEnums = (enums) => `
    <div class="__Type-fields">
        <h3>Enum Values</h3>
        <div class="Fields">
          ${enums
            .map((field) => {
              return `
              <div class="Field">
                  <div class="FieldParams">
                      <div class="FieldName FieldName--enum">${field.name}</div>
                  </div>
                  <div class="FieldDescription">${field.description}</div>
              </div>
            `;
            })
            .join('')}
        </div>`;

const RenderFields = (fields) => `
    <div class="__Type-fields">
        <h3>Table of Contents</h3>
        <div class="TableOfContents">
        ${fields
          .map((field) => {
            return RenderFieldTOC(field);
          })
          .join('')}
        </div>
        <h3>Fields</h3>
        <div class="Fields">
            ${fields.map(RenderField).join('')}
        </div>
    </div>
`;

export const dryad = (type) => ({
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
                    ${typeLinks(schemaTypes, 'Schema', type)}
                </div>
                ${MenuCategory('OBJECT')(mainTypes, 'Types', type)}
                ${MenuCategory('INTERFACE')(mainTypes, 'Interfaces', type)}
                ${MenuCategory('UNION')(mainTypes, 'Unions', type)}
                ${MenuCategory('INPUT_OBJECT')(mainTypes, 'Inputs', type)}
                ${MenuCategory('ENUM')(mainTypes, 'Enums', type)}
                ${MenuCategory('SCALAR')(mainTypes, 'Scalars', type)}
            </div>
            `;
    },
    __type: (v) => {
      const { fields, enumValues, inputFields, possibleTypes, description, name, kind } = v.value;
      return `
        <div class="__Type">
          <div class="__Type-name">${name}</div>
          <div class="__Type-kind">${kind}</div>
          <div class="__Type-description">${description ? v.md.render(description) : ''}</div>
          ${fields ? RenderFields(fields) : ''} 
          ${inputFields ? RenderFields(inputFields) : ''} 
          ${enumValues ? RenderEnums(enumValues) : ''} 
          ${possibleTypes ? RenderPossibleTypes(possibleTypes) : ''} 
        </div>
      `;
    },
  },
  __Type: {
    fields: (v) => (v.value ? RenderFields(v.value) : ``),
    inputFields: (v) => (v.value ? RenderInputValues(v.value) : ``),
    enumValues: (v) => (v.value ? RenderEnums(v.value) : ``),
    possibleTypes: (v) => (v.value ? RenderPossibleTypes(v.value) : ``),
  },
});