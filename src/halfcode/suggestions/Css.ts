import * as monaco from 'monaco-editor';
import { ParserField, ScalarTypes } from 'graphql-zeus';
import { BuiltInStyle } from '../../models';
const getSuggestions = ({ fields, range }: { fields: ParserField[]; range: any }) =>
  fields.flatMap((ci) => {
    return [
      {
        insertText: `.${ci.name}`,
        documentation: `${ci.description}`,
        detail: `${ci.name}`,
        label: `.${ci.name}`,
        range,
      } as monaco.languages.CompletionItem,
      ...(ci.args || []).map(
        (a) =>
          ({
            insertText: `.${ci.name}-${a.name}`,
            documentation: `${[a.description || '', `Field of type object: ${ci.name}`].join('\n')}`,
            detail: `${ci.name}: ${a.name}`,
            label: `.${ci.name}-${a.name}`,
            range,
          } as monaco.languages.CompletionItem),
      ),
    ];
  });

export const CSSSuggestions = (fields: ParserField[]): monaco.languages.CompletionItemProvider => {
  return {
    provideCompletionItems: function(model, position) {
      const line = position.lineNumber;
      const character = position.column;
      var textUntilPosition = model.getValueInRange({
        startLineNumber: line,
        startColumn: 1,
        endLineNumber: line,
        endColumn: character,
      });
      var match = textUntilPosition.match(/\.[\w-]*$/);
      if (!match) {
        return { suggestions: [] };
      }
      const word = model.getWordUntilPosition({
        column: character,
        lineNumber: line,
      });
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      const suggestions = getSuggestions({ fields, range });
      const builtInScalarsSuggestions = Object.keys(ScalarTypes).map(
        (scalar) =>
          ({
            insertText: `.${scalar}`,
            detail: `${scalar} type`,
            label: `.${scalar}`,
            documentation: `Scalar field style. It appears on every field of type: ${scalar}`,
            range,
          } as monaco.languages.CompletionItem),
      );
      const builtInStyles: BuiltInStyle[] = [
        {
          detail: 'Object',
          insertText: '.d-object',
          description: `Returned for all fields returning GraphQL type`,
        },
        {
          detail: 'List',
          insertText: '.d-list',
          description: `Returned for fields returning List`,
        },
        {
          detail: 'body',
          insertText: '.DryadBody',
          description: 'Body of mock frontend( white element with shadow )',
        },
      ];
      const builtInStylesSuggestions = builtInStyles.map(
        (bs) =>
          ({
            insertText: bs.insertText,
            label: bs.insertText,
            detail: bs.detail,
            documentation: bs.description,
            range,
          } as monaco.languages.CompletionItem),
      );
      return {
        suggestions: [...suggestions, ...builtInScalarsSuggestions, ...builtInStylesSuggestions],
      };
    },
  };
};
