// import { Dryad } from '../src/Detail';
// import React from 'react';
// import { SpecialSkills } from '../src/generated/graphql-zeus';
// export const exampleCSS = `
// .Title{
//   text-align: center
// }
// .Card.d-list{
//   column-count: 2;
// }
// .Card.d-object{
//   width: 350px;
//   padding: 30px;
//   display: grid;
//   grid-template-areas:
//       "name ."
//       "Attack Defense"
//       "skills ."
//       "attack .";
//   break-inside: avoid;
// }
// .Card-name{
//   font-size: 18px;
//   grid-area: name;
//   margin-bottom: 10px;
//   text-align: center
// }
// .Card-Attack{
//   grid-area: Attack
// }
// .Card-Defense{
//   grid-area: Defense
// }
// .Card-attack{
//   grid-area: attack;
// }
// .Card-skills{
//   grid-area: skills;
// }
// `;
// export const MockFrontend = () => {
//   return (
//     <>
//       <h1 className="Title">List of zeus cards</h1>
//       <Dryad.listCards
//         Attack
//         name
//         Defense
//         id
//         skills
//         attack={[
//           {
//             cardID: ['12'],
//           },
//           {
//             name: true,
//           },
//         ]}
//         dryad={{
//           render: {
//             Card: {
//               id: () => <></>,
//               Attack: ({ value, className }) => <div className={className}>{`🍢 ${value}`}</div>,
//               Defense: ({ value, className }) => <div className={className}>{`🛡 ${value}`}</div>,
//               skills: ({ value, className }) => (
//                 <div className={className}>
//                   <b>Superpowers: </b>
//                   {value &&
//                     value.slice(0, 4).map(
//                       (vv) =>
//                         ({
//                           [SpecialSkills.FIRE]: '🔥',
//                           [SpecialSkills.THUNDER]: '⚡',
//                           [SpecialSkills.RAIN]: '🌧️',
//                         }[vv]),
//                     )}
//                 </div>
//               ),
//               attack: ({ value, className }) => {
//                 return (
//                   <div className={className}>
//                     <details>
//                       <summary>Attack history:</summary>
//                       <div style={{ marginLeft: 20, fontSize: 10 }}>
//                         {value && value.map((a) => <div>Attacked {a.name}</div>)}
//                       </div>
//                     </details>
//                   </div>
//                 );
//               },
//             },
//           },
//         }}
//       >
//         Wait until objects load
//       </Dryad.listCards>
//     </>
//   );
// };
