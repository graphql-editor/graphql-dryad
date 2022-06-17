export const HtmlSkeletonStatic = ({
  body,
  style,
  script,
  head = '',
  hydrate,
  scriptName,
}: {
  body: string;
  style?: string;
  script?: string;
  head?: string;
  hydrate?: boolean;
  scriptName?: string;
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
          const m = await import("${scriptName}");
          const Component = m.default;
        ${
          hydrate
            ? `
            const ReactDOM = await import('https://cdn.skypack.dev/react-dom@^17.0.2');
            ReactDOM.hydrate(Component(await m.data?.()),document.body)`
            : `
        if(m && m.hydrate){
          m.hydrate()
        }`
        }
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
