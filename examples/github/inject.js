const response = await Gql.query({
  site: [
    {},
    {
      host: true,
      port: true,
    },
  ],
  allMarkdownRemark: [
    {},
    {
      nodes: {
        excerpt: true,
        frontmatter: {
          custom: true,
          title: true,
          date: [
            {
              formatString: 'DD/MM/YYYY',
            },
            true,
          ],
          image: {
            publicURL: true,
          },
          author: {
            id: true,
            avatar: {
              publicURL: true,
            },
          },
        },
      },
    },
  ],
});
const posts = response.allMarkdownRemark.nodes.filter(
  (n) => !n.frontmatter.custom,
);
const addHost = (publicURL) =>
  `http://${response.site.host}:${response.site.port}${publicURL}`;
return `
  <div class="Feed">
      ${posts
        .map(
          (p) => `
      <vstack class="PostCard">
          <div 
              class="Image"
              style="background-image:url('${addHost(
                p.frontmatter.image.publicURL,
              )}'" 
          ></div>
          <text class="title">${p.frontmatter.title}</text>
          <text class="desc">${p.excerpt || ''}</text>
          <hstack class="Footer" spacing=xs>
              <text>${p.frontmatter.date}</text>
              <spacer></spacer>
              <text class="Written">Written by,<br> ${
                p.frontmatter.author.id
              }</text>
              <div 
              style="background-image: url(${addHost(
                p.frontmatter.author.avatar.publicURL,
              )});" 
              class="Avatar"
              ></div>
          </hstack>
      </vstack>
      `,
        )
        .join('')}
  </div>
`;
