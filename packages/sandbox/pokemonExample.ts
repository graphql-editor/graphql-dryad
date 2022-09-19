export const PokemonExample = {
  schemaUrl: 'https://graphql-pokemon2.vercel.app/',
  css: `@import "https://fonts.googleapis.com/css?family=Press+Start+2P";
  @import "https://unpkg.com/nes.css@2.3.0/css/nes.min.css";
  @import "https://unpkg.com/pyloncss@latest/css/pylon.css";
  img{
      width: 100px;
      height: auto;
  }
  .DryadBody{
      font-family: "Press Start 2P";
  }
  .Pokemon{
      font-size: 11px;
      padding: 30px;
  }
  .Pokemon.Selected{
      background: black !important;
      color: white !important;
  }
  .Pokemon .Name {
      padding: 5px;
  }
  .Pokemon img{
      mix-blend-mode: multiply;
  }
  #PokeSearch{
      padding: 10px;
      position: fixed;
      width: 100%;
      background: white;
      z-index: 2 ;
      border: 0;
      border-bottom: #ddd solid 2px;
  }
  #Pokemons{
      padding-top: 30px;
  }
  
  .Grass{
      color:darkgreen;
  }
  
  .Fire{
      color: red;
  }
  
  .Water{
      color: royalblue;
  }
  
  .Electric{
      color:#aa0;
  }
  
  .Ground{
      background-color: tan;
  }
  
  .Bug{
      background-color: #fec;
      color: yellowgreen
  }
  
  .Poison .Name{
      font-style: italic;
  }
  
  .Flying .Name{
      background-color: #aef;
      color:white;
  }
  
  .Psychic{
      background: #fdf;
  }
  
  .Dragon{
      color: #f0f;
  }
  
  .Ghost{
      color: #777 ;
  }`,
  code: `import { render as r } from 'https://cdn.skypack.dev/preact-render-to-string';
import { html as htm, h } from 'https://unpkg.com/htm/preact/index.mjs?module';

const Fetch = Chain("https://graphql-pokemon2.vercel.app/", {
    "Content-Type": "application/json"
})

html = htm

const Pokemon = ({ number, name, image, weaknesses, resistant, types }) => {
    return html\`
     <hstack class="Pokemon \${types.join(" ")}">
        <vstack spacing=xs>
            <img title="\${name}"src="\${image}" />
            <span class="Name">\${number}.\${name}</span>
        </vstack>
        <\${DisplayCategory} title="Types" textArray=\${types} />
        <\${DisplayCategory} title="Weaknesses" textArray=\${weaknesses} />
        <\${DisplayCategory} title="Resistance" textArray=\${resistant} />
    </hstack>
    \`
}

const DisplayCategory = ({ title, textArray }) => html\`
    <vstack spacing=xs>
            <span>\${title}</span>\${textArray.map(m => html\`
                <span>\${m}</span>
            \`)}
    </vstack>
\`


function App({ response }) {
    return html\`<vstack>
    <list id="Pokemons">
    \${response.pokemons.map(Pokemon)}
    </list>
</vstack>\`;
}
// Create your app

export default async () => {
    const response = await Fetch.query({
        pokemons: [{ first: 151 }, {
            number: true,
            name: true,
            image: true,
            types: true,
            resistant: true,
            weaknesses: true
        }]
    })
    const app = html\`<\${App} response=\${response} />\`
    return r(app)
}`,
};
