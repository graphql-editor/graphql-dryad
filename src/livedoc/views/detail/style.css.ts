export const css = `
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap');
.Query{
    display: flex;
    flex-flow: row nowrap;
    font-family: "Roboto Condensed";
    height: 100%;
}
.Menu{
    width: 200px;
    order:0;
    height: 100%;
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
    overflow: auto;
}
.__Type-kind{
    order: 2;
    font-size: 1rem;
    margin-bottom: 15px;
    color: #5a5;
}
.__Type-name{
    order: 1;
    font-size: 2rem;
}
.__Type-description{
    order: 3;
    padding: 20px;
    border:2px #eee dashed
}
.__Type-fields{
    order: 4;
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
    color: #d70;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
}
.FieldName{
    font-weight: 400;
    color: #06e;
    margin-right: 5px;
}
.FieldDescription{
    font-weight: 100;
}
`;
