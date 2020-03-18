export const HtmlSkeleton = ({ body, style }: { body: string; style: string }) => `
<html>
    <head>
        <style>${style}</style>
    </head>
    <body>
        ${body}
    </body>
</html>
`;
