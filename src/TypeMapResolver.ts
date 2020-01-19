import { TypeDefinition, ParserField, Utils, Parser } from 'graphql-zeus';

export interface TypeMap {
  [x: string]: Record<string, string>;
}

const resolveTypeMapType = (i: ParserField) => {
  if (i.data!.type === TypeDefinition.UnionTypeDefinition) {
    return;
  }
  if (i.data!.type !== TypeDefinition.ObjectTypeDefinition && i.data!.type !== TypeDefinition.InterfaceTypeDefinition) {
    return;
  }
  if (!i.args) {
    return;
  }
  return {
    [i.name]: i.args.reduce<Record<string, string>>((a, b) => {
      a[b.name] = b.type.name;
      return a;
    }, {}),
  };
};
export const getTypeMap = async (url: string) => {
  const schemaSting = await Utils.getFromUrl(url);
  const schemaTree = Parser.parse(schemaSting);
  return schemaTree.nodes
    .map(resolveTypeMapType)
    .filter((b) => !!b)
    .reduce((a, b) => {
      a = {
        ...a,
        ...b,
      };
      return a;
    }, {});
};
