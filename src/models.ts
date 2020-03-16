// import { ReturnTypes, PartialObjects } from './generated/graphql-zeus';

// export const ReturnTypesRecord = ReturnTypes as Record<string, Record<string, string>>;

// type ReturnTypesType = typeof ReturnTypes;

// export interface DryadOptions {
//   render?: {
//     [P in keyof ReturnTypesType]?: {
//       [R in keyof ReturnTypesType[P]]?: (props: {
//         name: string;
//         value: P extends keyof PartialObjects
//           ? R extends keyof PartialObjects[P]
//             ? PartialObjects[P][R]
//             : never
//           : never;
//         className: string;
//       }) => string;
//     };
//   };
//   inject?: {
//     [P in keyof PartialObjects['Query']]: (
//       o: PartialObjects['Query'][P] extends Array<infer R> ? R : PartialObjects['Query'][P],
//     ) => string;
//   };
// }

export interface BuiltInStyle {
  detail: string;
  description: string;
  insertText: string;
}
export interface Settings {
  url: string;
  headers: Record<string, string>;
}
