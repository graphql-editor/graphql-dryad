export const url =
  'https://faker.graphqleditor.com/a-team/finance-manager/graphql';
export const css = `
.d-object{
    padding: 10px;
}


.Company-expenses{
    color: red;
    display: flex;
    flex-flow: row wrap;
}
.Company-expenses::before{
    content: "Expenses";
    display: block;
    background: #333;
    color: white;
    padding: 5px;
    font-size: 10px;
    flex-basis: 100%;
}
.Company-incomes{
    display: flex;
    flex-flow: row wrap;
    color: green;
}
.Company-incomes::before{
    content: "Incomes";
    display: block;
    background: #333;
    color: white;
    padding: 5px;
    font-size: 10px;
    flex-basis: 100%;
}

.Company-name{
    text-transform: uppercase;

}
`;
