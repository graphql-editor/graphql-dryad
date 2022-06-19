import { GraphQLDryad } from '@/GraphQLDryad';
import React, { useState } from 'react';

export const ReactHeadersApp = () => {
  const [value, setValue] = useState({
    js: reactExample.js,
    css: reactExample.css,
  });

  return (
    <div style={{ height: `100%` }}>
      <GraphQLDryad
        settings={{
          url: reactExample.schemaUrl,
          headers: reactExample.headers,
        }}
        libs={libs}
        value={value}
        setValue={setValue}
      />
    </div>
  );
};

const libs = [
  {
    content: `import React from 'https://cdn.skypack.dev/react@17.0.2';
    export const Select:React.FC<{options:Array<{label:string;value:string}>}> = (props) => {
        return  <select>
            {props.options.map( o => <option key={o.value} value={o.value}>
                {o.label}
            </option>)}
        </select>
    }`,
    filePath: 'file:///Select.tsx',
  },
];
const reactExample = {
  js: `import React from 'https://cdn.skypack.dev/react@17.0.2';
  import { Select } from './Select.js'
  
 export const data = async () => {
      const values = await Gql("query")({
          adminQuery:{
              sources:{
                  name:true,
                  _id:true
              }
          }
      })
      return values
  }
  
  export default (values:ReturnType<typeof data> extends Promise<infer R> ? R:never) => {
      return <Select options={values?.adminQuery?.sources?.map(
          s => ({label:s.name,value:s._id})
      ) || []} />
  }`,
  css: `@import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.3/tailwind.min.css'`,
  schemaUrl:
    'https://proxy.graphqleditor.com/?url=https%3A%2F%2Fcompanym-api.azurewebsites.net%2Fgraphql',
  headers: {
    Authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Iis0ODg4NzcyMzk2NSIsImlhdCI6MTYzNzkxOTAxNX0.YSeOjNpfBz6vWVsya6HW_bd2I9BJOIZW-P6gdwZK--E',
  },
};
