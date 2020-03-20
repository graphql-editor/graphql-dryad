import { TypeDefinition, ParserField, Utils, Parser, OperationType } from 'graphql-zeus';
import { buildASTSchema, parse, GraphQLSchema } from 'graphql';

export interface TypeMap {
  [x: string]: Record<string, string>;
}
export interface GraphQLInfo {
  GraphQLSchema: GraphQLSchema;
  typeMap: TypeMap;
  root: { [OperationType.query]: string; [OperationType.mutation]?: string; [OperationType.subscription]?: string };
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

export const getGraphQL = async (url: string, headers?: string[]): Promise<GraphQLInfo> => {
  const schemaSting = await Utils.getFromUrl(url, headers);
  const GraphQLSchema = buildASTSchema(parse(schemaSting));
  const schemaTree = Parser.parse(schemaSting);
  return {
    GraphQLSchema,
    typeMap:
      schemaTree.nodes
        .map(resolveTypeMapType)
        .filter((b) => !!b)
        .reduce((a, b) => {
          a = {
            ...a,
            ...b,
          };
          return a;
        }, {}) || {},
    root: {
      [OperationType.query]: schemaTree.nodes.find((n) => n.type.operations?.find((o) => o === OperationType.query))!
        .name,
      [OperationType.mutation]: schemaTree.nodes.find((n) =>
        n.type.operations?.find((o) => o === OperationType.mutation),
      )?.name,
      [OperationType.subscription]: schemaTree.nodes.find((n) =>
        n.type.operations?.find((o) => o === OperationType.subscription),
      )?.name,
    },
  };
};
