import { HalfCodeApi } from '@/../dryad/lib/halfcode';
import { useImperativeRef } from '@/useImperativeRef';
import { GraphQLDryad } from 'graphql-dryad';
import React, { useState } from 'react';

export const ReactWidget = () => {
  const [value, setValue] = useState({
    js: reactExample.js,
    css: reactExample.css,
  });

  const [api, setApi] = useImperativeRef<HalfCodeApi>();

  return (
    <div style={{ height: `100%` }}>
      <GraphQLDryad
        ref={setApi}
        settings={{
          url: reactExample.schemaUrl,
          headers: {},
        }}
        value={value}
        setValue={setValue}
      />
      {api?.areTypesLoading && (
        <div
          style={{
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000a',
            position: 'absolute',
            inset: 0,
          }}
        >
          Loading
        </div>
      )}
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
  
  const AuthorTag:React.FC<AuthorType & { selected?:boolean; onClick:() => void }> = ({
      avatar,
      baseColor,
      selected,
      username,
      onClick
  }) => {
      return <a 
                onClick={onClick}
                className={\`
                    flex flex-row items-center 
                    p-2 rounded 
                    bg-\${baseColor}-600
                    hover:bg-\${baseColor}-400
                    \${selected ? 'w-full' : 'w-48'}
                    transition-all
                    cursor-pointer\`}>
          <img className={\`
              w-8 h-8 mr-2 rounded-full
          \`} src={avatar} />
          <div className="text-white font-bold">
              {username}
          </div>
      </a>
  }

  const Widget = () => {
      const [selected, setSelected] = React.useState("")
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
          onClick={()=>setSelected(a.username)}
              selected={a.username === selected}
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
