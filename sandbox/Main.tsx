import React, { useState } from 'react';
import { HalfCode } from '../src';

export const Main = () => {
  const [hide, setHide] = useState(false);
  return (
    <>
      <div style={{ height: `100%` }}>
        <button onClick={() => setHide((hidden) => !hidden)}>hide</button>
        {!hide && (
          <HalfCode
            name="https://faker.graphqleditor.com/aexol/olympus/graphql"
            exportEnabled={true}
            settings={{
              url: 'https://faker.graphqleditor.com/aexol/olympus/graphql',
              headers: {},
            }}
            editorOptions={{
              fontFamily: `'Fira Mono'`,
            }}
            initial={{
              js: `
const response = await Gql.query({
    listCards:{
        name:true,
        Attack:true,
        description:true
    }
})
const cards = response.listCards
return \`
    <list spacing=xs>
        \${cards.map(c => \`
        <hstack spacing=s>
            <text>\${c.name}</text>
            <divider></divider>
            <text>\${c.description}</text>
            <text>\${c.Attack}</text>
        </hstack>
        \`).join('')}
    </list>
\``,
              css: `@import "https://unpkg.com/pyloncss@latest/css/pylon.css"`,
            }}
          />
        )}
      </div>
    </>
  );
};
