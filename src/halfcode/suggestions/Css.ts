import * as monaco from 'monaco-editor';
import { ParserField } from 'graphql-zeus';
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
      const builtInStyles: BuiltInStyle[] = [
        {
          detail: 'string',
          insertText: '.string',
          description: `Class added if value is string`,
        },
        {
          detail: 'number',
          insertText: '.number',
          description: `Class added if value is number`,
        },
        {
          detail: 'boolean',
          insertText: '.boolean',
          description: 'Class added if value is boolean',
        },
        {
          detail: 'body',
          insertText: '.null',
          description: 'Class added when value is empty',
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
        suggestions: [...suggestions, ...builtInStylesSuggestions],
      };
    },
  };
};
