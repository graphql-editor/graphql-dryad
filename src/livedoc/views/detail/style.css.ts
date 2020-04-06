export const css = `
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap');
.Query{
    display: flex;
    flex-flow: row nowrap;
}
.__Schema{
    width: 200px;
    order:0;
    background: #fafafa;
}
.Menu .MenuHeader{
    padding: 0 20px;
    height: 70px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
}
.Menu .MenuSection{
    padding: 20px;
    border-bottom: 1px solid #eee;
}
.Menu .Logo{
    max-width: 100%;
}
.Menu h4{
    margin:0;
    font-size: 10px;
    margin-bottom: 10px;
}
.Menu .MenuTypes{
    padding-left:0px;
}
.Link{
    display: block;
    font-size: 13px;
    font-weight:500;
    color: #aaa;
    cursor: pointer;
    transition: color .25s;
    padding: 5px 0;
    text-decoration: none;
}
.Link:hover{
    color: #66a;
}
.Link.Active{
    color: #66a;
}
.__Type{
    order: 1;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    padding: 0 40px;
    padding-top:70px;
    height:100vh;
    overflow: auto;
}
.__Type-name{
    order: 1;
    font-size: 2rem;
    margin-bottom: 15px;
}
.__Type-description{
    order: 2;
    padding: 20px;
    border:2px #eee dashed
}
.__Type-fields{
    order: 3;
}
.__Type-fields h3{
    color: #334;
}
.Field{
    font-size: 1rem;
    padding: 20px;
    background: #fafafa;
    margin: 10px 0;
}
.FieldParams{
    display: flex;
    margin-bottom: 10px;
}
.FieldType{
    color: #88b;
    cursor: pointer;
    font-weight: 500;
}
.FieldType, .FieldKind{
    margin-right: 5px;
    font-size: 0.75rem;
}
.FieldKind{
    color: #8b8;
}
.FieldName{
    font-weight: 400;
    color: #06e;
    margin-right: 5px;
}
.FieldDescription{
    font-weight: 100;
}
.Query{
    font-family: "Roboto Condensed";
}
`;
