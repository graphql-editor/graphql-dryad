export const HtmlSkeletonStatic = ({
  body,
  style,
  script,
  head = '',
}: {
  body: string;
  style: string;
  script?: string;
  head?: string;
}) => `
<html>
    <head>
        ${head}
        <style>
            ${style}
        </style>
        ${
          script
            ? `<script>
            ${script}
        </script>`
            : ''
        }
    </head>
    <body>
        ${body}
    </body>
</html>
`;
export const HtmlSkeletonDynamic = ({
  body,
  style,
}: {
  body: string;
  style: string;
}) => `
<html>
    <head>
        <style>${style}</style>
    </head>
    <script>
        function fetchQuery(gql) {
            fetch(url, {
            body: JSON.stringify({ query: gql }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers
            }
            }).then(
                response => response.json()
            ).then(
                response => response.data
            )
        }
    </script>
    <body>
        ${body}
    </body>
</html>
`;
