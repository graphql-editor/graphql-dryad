export const reactExample = {
  js: `import React from 'https://cdn.skypack.dev/react@17.0.2'
  import ReactDOM from 'https://cdn.skypack.dev/react-dom@17.0.2'
  
  const Post = ({
      avatar,
      username,
      sentence
  }) => <div className="flex bg-white p-10 shadow-md space-x-4 transform hover:scale-105 transition-transform duration-200 cursor-pointer mx-5">
          <div className="order-1">
              <img className="rounded-full" style={{width:50}} src={avatar} />
          </div>
          <div className="order-2">
              <div className="font-bold font-serif">
                  {username}
              </div>
              <p>{sentence}</p>
          </div>
      </div>
  
  
  const Posts = ({ posts }) => {
      return <div id="PostList" className="container mx-auto space-y-5">
          {posts.map(p => <Post avatar={p.Author.avatar} sentence={p.sentence} username={p.Author.username} />)}
      </div>
  }
  
  const Body = ({children}) => {
      return <div className="p-4 bg-gray-100">{children}</div>
  }
  
  
  export default async () => {
      const response = await Gql.query({
          Twits: {
              sentence: true,
              Author: {
                  username: true,
                  avatar: true
              },
          },
          Me: {
              avatar: true,
              username: true
          }
      })
      const renderBody = document.createElement('div');
      ReactDOM.render(<Body><Posts posts={response.Twits} /></Body>, renderBody);
      return renderBody.innerHTML;
  }`,
  css: `@import 'http://esm.sh/tailwindcss/dist/tailwind.min.css'`,
  schemaUrl: `api.graphql.jobs`,
};
