export const css = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
    :root {
        --grey100: #FFFFFF;
        --grey90: #E6E6E6;
        --grey80: #CCCCCC;
        --grey70: #B3B3B3;
        --grey40: #666666;
        --grey20: #333333;
        --grey10: #1A1A1A;
        --grey0_1: #0D0D0D;
        --grey0: #030303;
        --green100: #31FFC8;
        --blue100: #30C1FF;
        --yellow100: #FED531;
        --light: 300;
        --normal: 400;
        --bold: 700;
    }
    html {
        box-sizing: border-box;
    }
    *, *:before, *:after {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: inherit;
    }
    a {
        cursor: pointer;
        color: inherit;
        text-decoration: none;
    }
    a:hover {
        color: var(--grey100);
    }
    ul {
        margin: 0;
        padding-left: 0;
        list-style: none;
    }
    img {
        display: block;
        max-width: 100%;
    }
    p, h1, ,h2, h3, h4, h5 {
        margin: 0;
    }
    p {
        color: var(--grey70);
        font-weight: var(--light);
    }
    h1 {
        font-size: 1.875rem;
        font-weight: var(--bold);
        line-height: 1.16;
        color: var(--grey70);
    }
    h2 {
        font-size: 1.5rem;
    }
    h3 {
        color: var(--grey70);
        font-size: 1.375rem;
        font-weight: var(--bold);
        line-height: 1.18;
        margin: 0 0 1.125rem 0;
    }
    h4 {
        font-size: 0.75rem;
        margin: 0 0 0.5rem 0;
        color: var(--grey40);
        text-transform: uppercase;
    }
    h5 {
        font-size 0.75rem;
    }
    .Query{
        display: flex;
        flex-flow: row nowrap;
        height: 100%;
        background: var(--grey0_1);
        font-family: "Roboto";
        font-size: 16px;
        font-weight: var(--normal);
        line-height: 1.5;
        color: var(--grey100);
    }
    .Menu{
        min-width: 12.5rem;
        max-width: 13.75rem;
        width:100%;
        order:0;
        height: 100%;
        background: var(--grey0);
        word-break: break-all;
        box-shadow: 0.25rem 0.25rem 1rem rgba(0, 0, 0, 0.25);
    }
    .Menu .MenuHeader{
        padding: 1.875rem 1.875rem 2.25rem 1.875rem;
        display: flex;
        align-items: center;
    }
    .Menu .MenuSection{
        padding: 1.25rem 1.875rem 0.625rem 1.875rem;
        border-bottom: 1px solid var(--grey10);
    }
    .Menu .Logo{
        max-width: 10.25rem;
        margin: auto;
    }
    .Link{
        position: relative;
        display: block;
        font-size: 0.875rem;
        line-height: 2.3;
        color: var(--grey90);
        transition: 170ms ease-in-out;
    }
    .Link.Active::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 0.1875rem;
        height: 100%;
        background: var(--green100);
    }
    .Link.Active{
        font-weight: var(--bold);
        color: var(--grey100);
        padding-left: 0.625rem;
    }
    .__Type{
        order: 1;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        padding: 4.75rem 1.875rem 5.375rem 1.875rem;
        overflow: auto;
    }
    .__Type-kind{
        order: 2;
        font-size: 0.875rem;
        margin-bottom: 1.25rem;
        color: var(--green100);
        font-weight: var(--bold);
    }
    .__Type-name{
        order: 1;
        font-size: 1.875rem;
        font-weight: var(--bold);
        line-height: 1.16;
        color: var(--grey70);
    }
    .__Type-description{
        order: 3;
        color: var(--grey70);
        font-weight: var(--light);
        margin-bottom: 3rem;
    }
    .__Type-fields{
        order: 4;
    }
    .__Type-possibleTypes{
        order: 5;
    }
    .Field{
        max-width: 40rem;
        width: 100%;
        padding: 1.125rem;
        background: var(--grey10);
    }
    .Field:not(:last-child) {
        margin-bottom: 0.75rem;
    }
    .FieldParams{
        display: flex;
        margin-bottom: 0.25rem;
    }
    .FieldType{
        color: var(--yellow100);
        font-weight: var(--bold);
        transition: 170ms ease-in-out;
    }
    a.FieldType:hover {
        opacity: 0.85;
    }
    .FieldArgs{
        margin-right: 0.1875rem;
    }
    .FieldName{
        display: inline-flex;
        flex-wrap: wrap;
        font-weight: var(--bold);
        color: var(--blue100);
        margin-right: 0.1875rem;
    }
    .TableOfContentsLink > .FieldName {
        background-image: linear-gradient(currentColor, currentColor);
        background-position: 0% 100%;
        background-repeat: no-repeat;
        background-size: 0% 0.0625rem;
        transition: background-size .3s;
        transition: 170ms ease-in-out;
    }
    .TableOfContentsLink:hover > .FieldName {
        background-size: 100% 0.0625rem;
    }
    .ArgumentName {
        margin-right: 0.1875rem;
    }
    .FieldDescription{
        color: var(--grey70);
        font-weight: var(--light);
    }
    .PossibleUnionType{
        display: block;
    }
    .TableOfContents{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 2.875rem;
    }
    .TableOfContentsLink{
        position: relative;
        display: inline-flex;
        color: var(--blue100);
        font-weight: var(--bold);
        margin-bottom: 0.5rem;
        margin-left: 0.875rem;
    }
    .TableOfContentsLink::before{
        content: '';
        position: absolute;
        top: 0.625rem;
        left: -0.75rem;
        display: flex;
        flex-shrink: 0;
        width: 0.3125rem;
        height: 0.3125rem;
        border-radius: 100%;
        background: currentColor;
    }
`;
