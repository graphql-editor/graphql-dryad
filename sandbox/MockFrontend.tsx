export const exampleCSS = `
.Main{
  background: #9999ff;
  padding: 20px;
}
.Card.d-list::before{
  content: "My card stack";
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px;  
  color: #222;
  text-decoration: underline;
  font-size: 18px;
  font-weight: 700;
  font-family: 'Fira Sans';
}
.Card.d-list{
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;  
}
.Card.d-object{
  width: 150px;
  padding: 30px;
  display: grid;
  grid-template-areas: 
      "image image"
      "name name"
      "description description"
      "Attack Defense"
      "skills skills";
  break-inside: avoid;
  margin: 10px;
  box-shadow: #0002 2px 5px 10px;
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 1.5s;
}
.Card.d-object:hover{
  background: #000;
  color: #fff;
}
.Card.d-object:active{
  transform: scale(2.0);
  z-index: 2;
  border-radius: 20px;
}
.Card.d-object:active .Card-description, .Card.d-object:hover .Card-description{
  color: #ffa;
}
.Card.d-object:nth-of-type(3n):active{
  background: #8af;
  color: #fff;
}
.Card.d-object:nth-of-type(4n):active{
  background: #0f5;
  color: #fff;
}
.Card.d-object:nth-of-type(5n):active{
  background: #f33;
  color: #fff;
}
.Card-image{
  font-size: 4px;
  grid-area: image;
  text-align: center;
  font-weight: bold;
  color: #111 default;
}
.Card-name{
  font-size: 18px;
  grid-area: name;
  text-align: center;
  font-weight: bold;
  color: #111 default;
}

.Card-description{
  grid-area: description;
  text-align: center;
  margin-bottom: 10px;
  font-size: 10px;
  letter-spacing: -1px;
  color: #aaa;
  transform: scaleY(1.2);
  font-weight: 100;
}
.Card-Attack{
  grid-area: Attack;
  text-align: center;
  color:#ff8484
}
.Card-Attack::before{
  content: "🍢"
}
.Card-Defense{
  color: #9e9eff;
  grid-area: Defense;
  text-align: center;
}
.Card-Defense::before{
  content: "🛡"
}
.Card-skills{
  grid-area: skills;
  margin-top:20px;
  height: 34px;
  line-height: 8px;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  align-content: flex-start;
  overflow-y: hidden;
  justify-content: space-between
}
.Card-skills .d-item  {
  font-size: 8px;
  display: inline-block;
  margin: 2px;
}
.Card-id{
  display: none; 
}

`;
