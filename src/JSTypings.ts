import { ParserField, TypeDefinition, Options, TypeSystemDefinition, Helpers } from 'graphql-zeus';

const typeScriptMap: Record<string, string> = {
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  ID: 'string',
  String: 'string',
};
const toTypeScriptPrimitive = (a: string): string => typeScriptMap[a] || a;

export const JSTypings = (fields: ParserField[]) => {
  const fieldParse = (f: ParserField, parentName: string) => {
    let typeDeclared = `PartialObjects["${parentName}"]["${f.name}"]`;
    return `${f.name}: Func<(${typeDeclared})>`;
  };
  const typeParse = (f: ParserField) => {
    if (f.data?.type === TypeDefinition.ObjectTypeDefinition) {
      return `${f.name}: {
        ${(f.args || []).map((child) => fieldParse(child, f.name)).join(',\n')}
      }`;
    }
  };
  const parsedObjectTypes = fields.filter((f) => f.data?.type === TypeDefinition.ObjectTypeDefinition).map(typeParse);

  return `
${fields
  .filter((n) => n.data?.type === TypeDefinition.EnumTypeDefinition)
  .map(resolveEnum)
  .join('\n')}
${resolvePartialObjects(fields, fields)}
type Func<T> = (props: { name: string; value: T; className: string }) => string;
declare let dryad: {
    ${parsedObjectTypes.join(',\n')}
};
    
    `;
};

export const PLAINOBJECTS = 'PartialObjects';

const resolveValueType = (t: string): string => `${PLAINOBJECTS}["${t}"]`;

const plusDescription = (description?: string, prefix = ''): string =>
  description ? `${prefix}/** ${description} */\n` : '';

const resolveField = (f: ParserField, optional = false): string => {
  const {
    type: { options },
  } = f;
  const isArray = !!(options && options.find((o) => o === Options.array));
  const isArrayRequired = !!(options && options.find((o) => o === Options.arrayRequired));
  const isRequired = !!(options && options.find((o) => o === Options.required));
  const isRequiredName = (name: string): string => {
    if (isArray) {
      if (isArrayRequired && !optional) {
        return name;
      }
      return `${name}?`;
    }
    if (isRequired && !optional) {
      return name;
    }
    return `${name}?`;
  };
  const concatArray = (name: string): string => {
    if (isArray) {
      if (!isRequired) {
        return `(${name} | undefined)[]`;
      }
      return `${name}[]`;
    }
    return name;
  };
  const resolveArgsName = (name: string): string => {
    return isRequiredName(name) + ':';
  };
  return `${plusDescription(f.description, '\t')}\t${resolveArgsName(f.name)}${concatArray(
    f.type.name in typeScriptMap ? toTypeScriptPrimitive(f.type.name) : resolveValueType(f.type.name),
  )}`;
};

const resolveValueTypeFromRoot = (i: ParserField, rootNodes: ParserField[]): string => {
  if (i.data!.type === TypeSystemDefinition.DirectiveDefinition) {
    return '';
  }
  if (i.data!.type === Helpers.Comment) {
    return '';
  }
  if (!i.args || !i.args.length) {
    return `${plusDescription(i.description)}["${i.name}"]:any`;
  }
  if (i.data!.type === TypeDefinition.UnionTypeDefinition) {
    return `${plusDescription(i.description)}["${i.name}"]: ${i.args.map((a) => resolveValueType(a.name)).join(' | ')}`;
  }
  if (i.data!.type === TypeDefinition.EnumTypeDefinition) {
    return `${plusDescription(i.description)}["${i.name}"]:${i.name}`;
  }
  if (i.data!.type === TypeDefinition.InterfaceTypeDefinition) {
    const typesImplementing = rootNodes.filter((rn) => rn.interfaces && rn.interfaces.includes(i.name));
    return `${plusDescription(i.description)}["${i.name}"]:{
\t${i.args.map((f) => resolveField(f, true)).join(';\n')}\n} & (${`${typesImplementing
      .map((a) => resolveValueType(a.name))
      .join(' | ')}`})`;
  }
  if (i.data!.type === TypeDefinition.ObjectTypeDefinition) {
    return `${plusDescription(i.description)}["${i.name}"]: {\n\t\t__typename?: "${i.name}";\n\t\t${i.args
      .map((f) => resolveField(f, true))
      .join(',\n\t\t')}\n\t}`;
  }
  return '';
};

export const resolvePartialObjects = (fields: ParserField[], rootNodes: ParserField[]): string => {
  return `type ${PLAINOBJECTS} = {
    ${fields
      .map((f) => resolveValueTypeFromRoot(f, rootNodes))
      .filter((v) => v)
      .join(',\n\t')}
  }`;
};

export const resolveEnum = (i: ParserField): string => {
  if (!i.args) {
    return '';
  }
  if (i.data!.type === TypeDefinition.EnumTypeDefinition) {
    return `${plusDescription(i.description)}enum ${i.name} {\n${i.args
      .map((f) => `\t${f.name} = "${f.name}"`)
      .join(',\n')}\n}`;
  }
  return '';
};
