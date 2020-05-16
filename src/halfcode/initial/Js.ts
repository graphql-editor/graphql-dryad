export const initialJS = `/* CTRL/CMD + space after Gql
to write Graphql query,
then return result at
the end of the file.
for example:
const response = await Gql.query({
    drawCard:{
        name:true
    }
})
const card = response.drawCard
return \`
    <div>
        Hello \${card.name}
    </div>
\`
*/
`;
