export const HtmlSkeletonStatic = ({
  body,
  style,
  script,
  head = '',
}: {
  body: string;
  style?: string;
  script?: string;
  head?: string;
}) => `
<html>
    <head>
        ${head}
        ${
          style
            ? `<style id="styleTag">
            ${style}
        </style>`
            : ''
        }
        ${
          script
            ? `<script type="module">
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
