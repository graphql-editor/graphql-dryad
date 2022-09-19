import { GraphQLDryad } from 'graphql-dryad';
import React, { useState } from 'react';

export const Company = () => {
  const [value, setValue] = useState({
    js: reactExample.js,
    css: reactExample.css,
  });

  return (
    <div style={{ height: `100%` }}>
      <GraphQLDryad
        settings={{
          url: reactExample.schemaUrl,
          headers: {},
        }}
        libs={[]}
        value={value}
        setValue={setValue}
      />
    </div>
  );
};

const reactExample = {
  js: `import React from 'https://cdn.skypack.dev/react@17.0.2';
  import ReactDOM from 'https://cdn.skypack.dev/react-dom@17.0.2';
  const Main:React.FC<{options:Array<{label:string;value:string}>}> = (props) => {
      return  <select>
          {props.options.map( o => <option key={o.value} value={o.value}>
              {o.label}
          </option>)}
      </select>
  }
  export default async () => {
      const values = await Gql("query")({
          adminQuery:{
              sources:{
                  name:true,
                  _id:true
              }
          }
      })
      const divek = document.createElement('div')
      ReactDOM.render(<Main options={values?.adminQuery?.sources?.map(
          s => ({label:s.name,value:s._id})
      ) || []} />, divek)
      return divek.innerHTML
  }`,
  css: `@import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.3/tailwind.min.css'`,
  schemaUrl:
    'https://faker.graphqleditor.com/aexol-internal/company-manager/graphql',
};
