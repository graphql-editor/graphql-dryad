import { GraphQLDryad } from '@/GraphQLDryad';
import React, { useState } from 'react';

export const ReactWidget = () => {
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
  js: `import React from 'https://cdn.skypack.dev/react@17.0.2'
  import ReactDOM from 'https://cdn.skypack.dev/react-dom@17.0.2'
  
  const Author = Selector("Profile")({
      avatar: true,
      username:true,
      baseColor:true
  })
  
  
  type AuthorType = FromSelector<typeof Author,"Profile">
  
  const AuthorTag:React.FC<AuthorType> = ({
      avatar,
      baseColor,
      username
  }) => {
      return <a className={\`
          flex flex-row items-center 
          px-6 py-2 rounded 
          bg-\${baseColor}-600
          hover:bg-\${baseColor}-400
      \`}>
          <img className={\`
              w-12 h-12 mr-2 rounded-full
          \`} src={avatar} />
          <div className="text-white font-bold">
              {username}
          </div>
      </a>
  }

  const Widget = () => {
      const [authors,setAuthors] = React.useState<
          AuthorType[]
      >([])
      React.useEffect(() => {
          Gql("query")({
              Twits:{
                  Author
              }
          }).then(data => {
              setAuthors(data.Twits.map(t => t.Author))
          })
      },[])
      return <div className="flex flex-row flex-wrap gap-4 p-4">
          {authors.map(a => <AuthorTag 
              key={a.username} 
              {...a} 
          />)}
      </div>

  }
  
  
  export default () => {
      return <Widget />
  }`,
  css: `@import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.3/tailwind.min.css'`,
  schemaUrl: 'https://faker.graphqleditor.com/explore-projects/twitter/graphql',
};
