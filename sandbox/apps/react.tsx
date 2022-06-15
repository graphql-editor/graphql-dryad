import { GraphQLDryad } from '@/GraphQLDryad';
import React, { useState } from 'react';

export const ReactApp = () => {
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
import { Avatar } from './components/Avatar';

export const Post = ({
    avatar,
    username,
    sentence
}:{
  avatar:string;
  username:string;
  sentence:string;
}) => <div onClick={() => console.log("DDDD")} className="flex bg-white p-10 shadow-md space-x-4 transform hover:scale-105 transition-transform duration-200 cursor-pointer mx-5">
        <div className="order-1">
            <img className="rounded-full" style={{width:50}} src={avatar} />
        </div>
        <div className="order-2">
            <div className="font-bold font-serif">
                {username}
            </div>
            <p>{sentence}</p>
        </div>
    </div>`,
    filePath: 'file:///Post.tsx',
  },
  {
    content: `import React from 'https://cdn.skypack.dev/react@17.0.2';

export const Avatar = ({
    avatar,
}:{
  avatar:string;
}) => <img className="rounded-full" style={{width:50}} src={avatar} />`,
    filePath: 'file:///components/Avatar.tsx',
  },
];
const reactExample = {
  js: `import React from 'https://cdn.skypack.dev/react@17.0.2'
import ReactDOM from 'https://cdn.skypack.dev/react-dom@17.0.2'

import {Post} from './Post.js'

const PostSelector = Selector("Twit")({
    sentence: true,
    Author: {
        username: true,
        avatar: true
    }
})
type PostType = InputType<GraphQLTypes["Twit"],typeof PostSelector>

const Posts = ({ posts }:{posts: PostType[]}) => {
    return <div id="PostList" className="container mx-auto space-y-5">
        {posts.map(p => <Post avatar={p.Author.avatar} sentence={p.sentence} username={p.Author.username} />)}
    </div>
}

const Body = ({children}) => {
    return <div className="p-4 bg-gray-100">{children}</div>
}


export default async () => {
    const response = await Gql("query")({
        Twits: PostSelector,
        Me: {
            avatar: true,
            username: true
        }
    })
    return <Body><Posts posts={response.Twits} /></Body>
}`,
  css: `@import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.3/tailwind.min.css'`,
  schemaUrl: 'https://faker.graphqleditor.com/explore-projects/twitter/graphql',
};
