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
        --pink100: #FF59C5;

        --light: 300;
        --normal: 400;
        --bold: 700;
    }

    html {
        box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: inherit;
    }

    a {
        cursor: pointer;
        color: inherit;
        text-decoration: none;
        transition: 170ms ease-in-out;
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

    p,
    h1,
    ,
    h2,
    h3,
    h4,
    h5 {
        margin: 0;
    }

    p {
        color: var(--grey70);
        font-weight: var(--light);
    }

    p+h2 {
        margin-top: 2.875rem;
    }

    h1 {
        font-size: 1.75rem;
        font-weight: var(--bold);
        line-height: 1.16;
        color: var(--grey70);
    }

    h2 {
        font-size: 1.5rem;
        margin: 0 0 1rem 0;
    }

    h3 {
        color: var(--grey70);
        font-size: 1.25rem;
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

    .Query {
        position: relative;
        display: flex;
        flex-direction: column;
        background: var(--grey0_1);
        font-family: "Roboto", sans-serif;
        font-size: 16px;
        font-weight: var(--normal);
        line-height: 1.5;
        color: var(--grey100);
        height: 100%;
        overflow: hidden;
    }

    .Menu {
        position: absolute;
        min-width: 12.5rem;
        width: 100%;
        max-height: 100%;
        order: 0;
        background: var(--grey0);
        word-break: break-all;
        padding-bottom: 2rem;
        box-shadow: 0.25rem 0.25rem 1rem rgba(0, 0, 0, 0.25);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        transform: translateX(-100%);
        transition: transform 350ms ease-in-out 0s;
        z-index: 1;
    }

    .Menu.ShowToggle {
        transform: translateX(0);
    }

    .Menu,
    .Query,
    .__Type {
        scrollbar-color: var(--grey20) var(--grey10);
    }

    .Menu::-webkit-scrollbar,
    .Query::-webkit-scrollbar,
    .__Type::-webkit-scrollbar {
        background: var(--grey10);
    }

    .Menu::-webkit-scrollbar-track,
    .Query::-webkit-scrollbar-track,
    .__Type::-webkit-scrollbar-track {
        background: var(--grey10);
    }

    .Menu::-webkit-scrollbar-thumb,
    .Query::-webkit-scrollbar-thumb,
    .__Type::-webkit-scrollbar-thumb {
        background: var(--grey0);
    }

    .Menu .MenuHeader {
        padding: 1.25rem;
        display: flex;
        align-items: center;
    }

    .Menu .MenuSection {
        padding: 1.25rem 1.25rem 0.625rem 1.25rem;
    }

    .Menu .MenuSection:not(:last-child) {
        border-bottom: 1px solid var(--grey10);
    }

    .Menu .Logo {
        width: 100%;
        max-width: 10.25rem;
        filter: invert(100%) brightness(150%);
    }

    .Link {
        position: relative;
        display: block;
        font-size: 0.875rem;
        line-height: 2.3;
        color: var(--grey90);
    }

    .Link:hover {
        color: var(--green100);
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

    .Link.Active {
        font-weight: var(--bold);
        color: var(--grey100);
        padding-left: 0.625rem;
    }

    .__Type {
        order: 1;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        margin-top: 2.5rem;
    }

    .__Type-inner {
        padding: 0 1.25rem 1rem 1.25rem;
    }

    .__Type-kind {
        order: 2;
        font-size: 0.875rem;
        margin-bottom: 1.25rem;
        color: var(--green100);
        font-weight: var(--bold);
    }

    .__Type-kind+.__Type-description {
        margin-top: 2.875rem;
    }

    .__Type-name {
        order: 1;
        font-size: 1.75rem;
        font-weight: var(--bold);
        line-height: 1.16;
        color: var(--grey70);
        margin-bottom: 0.125rem;
    }

    .__Type-description {
        order: 3;
        color: var(--grey70);
        font-weight: var(--light);
        margin-bottom: 2rem;
    }

    .__Type-fields {
        order: 4;
    }

    .__Type-possibleTypes {
        order: 5;
    }

    .__Type-fields,
    .__Type-possibleTypes {
        margin-bottom: 2.875rem;
    }

    .Field {
        max-width: 40rem;
        width: 100%;
        padding: 1rem;
        background: var(--grey10);
    }

    .Field:not(:last-child) {
        margin-bottom: 0.75rem;
    }

    .FieldParams {
        display: flex;
        margin-bottom: 0.25rem;
    }

    .FieldType {
        color: var(--yellow100);
        font-weight: var(--bold);
    }

    .FieldArgs {
        margin-right: 0.1875rem;
    }

    .FieldName {
        display: block;
        font-weight: var(--bold);
        margin-right: 0.1875rem;
    }

    .FieldName:not(:first-child) {
        margin-top: 0.5rem;
    }

    .FieldName--field {
        color: var(--blue100)
    }

    .FieldName--enum {
        color: var(--pink100);
    }

    .FieldName--unionType {
        color: var(--green100);
    }

    a.FieldName:hover,
    a.FieldType:hover {
        color: var(--grey100);
    }

    .ArgumentName {
        margin-right: 0.1875rem;
    }

    .FieldDescription {
        color: var(--grey70);
        font-weight: var(--light);
    }

    .TableOfContents {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 2.5rem;
    }

    .TableOfContentsLink {
        position: relative;
        display: inline-flex;
        color: var(--blue100);
        font-weight: var(--bold);
        margin-bottom: 0.5rem;
        margin-left: 0.875rem;
    }

    .TableOfContentsLink:hover .FieldName {
        text-decoration: underline;
    }

    burger-menu {
        position: absolute;
        top: 0.75rem;
        right: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;
        z-index: 10;
        background: transparent;
    }

    burger-bar {
        width: 1.5rem;
        height: 0.1875rem;
        position: relative;
        transform-origin: 1px center;
        background: var(--grey100);
        transition: width .170s ease, transform .3s ease-in-out, background .270s;
    }

    burger-menu:hover burger-bar {
        background: var(--yellow100);
    }

    burger-bar:first-child {
        transform: rotate(0deg);
    }

    burger-bar:nth-child(2) {
        width: 1.5rem;
    }

    burger-bar:last-child {
        transform: rotate(0deg);
    }

    burger-menu.ShowToggle burger-bar:first-child {
        transform: rotate(45deg)
    }

    burger-menu.ShowToggle burger-bar:nth-child(2) {
        width: 0;
    }

    burger-menu.ShowToggle burger-bar:last-child {
        transform: rotate(-45deg);
    }

    @media (min-width: 768px) {
        .Query {
            flex-direction: row;
            flex-wrap: nowrap;
        }
        .__Type {
            margin-top: 0;
        }
        .__Type-inner {
            padding-top: 2.5rem;
            min-width: 18.75rem;
        }
        .Menu {
            transform: translateX(0);
            width: 100%;
            max-width: 13.75rem;
            position: relative;
            transition: none;
        }
        .Menu .Logo {
            margin: auto;
        }
        .TableOfContents {
            margin-bottom: 2.875rem;
        }
        burger-menu {
            display: none;
        }
    }

    @media (min-width: 1050px) {
        h1 {
            font-size: 1.875rem;
        }
        h3 {
            font-size: 1.375rem;
        }
        .Menu .MenuHeader {
            padding: 1.875rem 1.875rem 2.25rem 1.875rem;
        }
        .Menu .MenuSection {
            padding-left: 1.875rem;
            padding-right: 1.875rem;
        }
        .__Type-inner {
            padding: 4.75rem 1.875rem 4rem 1.875rem;
        }
        .__Type-description {
            margin-bottom: 3rem;
        }
        .__Type-name {
            font-size: 1.875rem;
        }
    }
`;
