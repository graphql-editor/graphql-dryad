export const initialValues = {
  js: `
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

const posts = response.Twits
const me = response.Me

const Post = ({
avatar,
username,
sentence
}) => \`
<div class="
flex
bg-white
p-10
shadow-md
space-x-4
transform
hover:scale-105
transition-transform
duration-200
cursor-pointer
mx-5
">
<div class="order-1">
  <img class="
      rounded-full
  " style="width:50px" src="\${avatar}" />
</div>
<div class="order-2">
  <div class="font-bold font-serif">
      \${username}
  </div>
  <p>\${sentence}</p>
</div>
</div>
\`


const addPost = () =>{
const list = document.getElementById("PostList")
const sentence = document.getElementById("Tweet").value
list.innerHTML = \`\${Post({
  avatar: me.avatar,
  username: me.username,
  sentence
})}\${list.innerHTML}\`
}
useDynamic({
addPost,
me,
Post
})

useAfterRender(()=>{
document.getElementById("AddPost").addEventListener("click", addPost)
})

return \`
<div class="bg-gray-100">
<div class="container
          mx-auto
          p-5
          space-y-2
">  
  <div class="flex space-x-2">
      <img class="
          w-6 
          rounded-full 
          border-4 
          border-pink-300
      " src="\${me.avatar}">
      <div>
          Hello, <b class="
                      font-serif
                  ">
                      \${me.username}
                  </b>
      </div>
  </div>
  <div class="
      flex
      w-full
      space-x-2
  " >
      <input 
          class="
              p-5
              flex-1
          "
          type="text"
          id="Tweet"
          placeholder="Tweet something"
      />
      <add-post 
      id="AddPost"
      class="
          bg-pink-500 
          hover:bg-pink-400 
          text-white 
          font-bold 
          py-2 
          px-4 
          border-b-4 
          border-pink-700 
          hover:border-pink-500 
          rounded
          flex
          items-center
          cursor-pointer
          transition-bg
          duration-200
          "
      >
          Sweet 🐤
      </add-post>
  </div>
</div>
<div 
  id="PostList" 
  class="container
          mx-auto
          space-y-5
">
  \${posts.map(p => Post({
username: p.Author.username,
avatar: p.Author.avatar,
sentence: p.sentence
})).join("")}
</div>
</div>
\`
`,
  css: `@import "https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css";`,
};
