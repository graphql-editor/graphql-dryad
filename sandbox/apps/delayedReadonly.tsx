import { GraphQLDryad } from '@/GraphQLDryad';
import React, { useEffect, useState } from 'react';

export const delayedReadonly = () => {
  const [value, setValue] = useState({
    js: reactExample.js,
    css: reactExample.css,
  });
  const [readOnly, setReadonly] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setReadonly(true);
    }, 5000);
  }, []);

  return (
    <div style={{ height: `100%` }}>
      <GraphQLDryad
        readOnly={readOnly}
        settings={{
          url: reactExample.schemaUrl,
          headers: {},
        }}
        value={value.js}
        css={value.css}
        onDryad={(d) => console.log(d)}
        onZeus={(d) => console.log(d)}
      />
    </div>
  );
};

const reactExample = {
  js: `import React from 'https://cdn.skypack.dev/react@17.0.2';
  import ReactDOM from 'https://cdn.skypack.dev/react-dom@17.0.2';
  
  const Post = ({
      avatar,
      username,
      sentence,
      color = "indigo"
  }) => <div className={\`
      flex
      bg-white
      p-10
      shadow-md
      space-x-4
      transform
      hover:scale-105
      transition-transform
      rounded-2xl
      duration-200
      cursor-pointer
      mx-5
  \`}>
          <div className="order-1">
              <img className={\`rounded-full ring-2 ring-\${color}-500\`} style={{ width: 50 }} src={avatar} />
          </div>
          <div className="order-2">
              <div className="font-bold font-serif">
                  {username}
              </div>
              <p>{sentence}</p>
          </div>
      </div>
  
  const MainComponent = ({me,posts}) => {
      return <div className="bg-gray-100 min-h-full pb-20">
          <div className="container mx-auto p-5 space-y-2">
              <div className="flex space-x-2">
                  <img className="w-6 rounded-full border-4  border-pink-300" src={me.avatar} />
                  <div>
                      Hello, <b className="font-serif">{me.username}</b>
                  </div>
              </div>
          </div>
          <div
              id="PostList"
              className="container mx-auto space-y-5">
              {posts.map(p => <Post username={p.Author.username} avatar={p.Author.avatar} sentence={p.sentence} color={p.Author.baseColor} />)}
          </div>
      </div>
  }
  export default async () =>{
       const response = await Gql.query({
          Twits: {
              sentence: true,
              Author: {
                  username: true,
                  avatar: true,
                  baseColor: true
              },
          },
          Me: {
              avatar: true,
              username: true
          }
      })
  
      const posts = response.Twits
      const me = response.Me
      const divek = document.createElement('div')
      ReactDOM.render(<MainComponent posts={posts} me={me} />,divek)
      return divek.innerHTML
  }`,
  css: `@import 'http://esm.sh/tailwindcss/dist/tailwind.min.css'`,
  schemaUrl: 'https://faker.graphqleditor.com/explore-projects/twitter/graphql',
};
