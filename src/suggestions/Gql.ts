import * as monaco from 'monaco-editor';
import { getAutocompleteSuggestions } from 'graphql-language-service-interface';
import { buildSchema } from 'graphql';

type Position = {
  character: number;
  line: number;
  lessThanOrEqualTo: (p: Position) => boolean;
};

const getSuggestions = (props: {
  queryText: string;
  position: Position;
  schema: string;
}): monaco.languages.ProviderResult<monaco.languages.CompletionList> => {
  const graphqlSchema = buildSchema(props.schema);
  const suggestions = getAutocompleteSuggestions(graphqlSchema, props.queryText, props.position);

  return {
    suggestions: suggestions.map(
      (ci) =>
        ({
          insertText: ci.label,
          documentation: ci.documentation,
          detail: ci.detail,
          label: ci.label,
        } as monaco.languages.CompletionItem),
    ),
  };
};
export const GqlSuggestions = (schema: string): monaco.languages.CompletionItemProvider => ({
  provideCompletionItems: function(model, position) {
    const line = position.lineNumber - 1;
    const character = position.column - 1;
    return getSuggestions({
      queryText: model.getValue(),
      schema,
      position: {
        character,
        line,
        lessThanOrEqualTo: (p) => {
          const ret = p.line <= line && p.character <= character;
          return ret;
        },
      },
    });
  },
});
