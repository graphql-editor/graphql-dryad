export const DocSkeletonStatic = ({
  body,
  style,
}: {
  body: string;
  style: string;
}) => `
  <html>
      <head>
        <style>
            body{
              margin: 0;
              height:100%
            }
        </style>
        <style>
            ${style}
        </style>
        <script>
            window.scrollDocs = (name) => {
                const element = document.getElementById(name);
                document.getElementById('__Type').scrollTo({
                behavior: 'smooth',
                top: element.offsetTop,
                });
            };
        </script>  
      </head>
      <body>
          ${body}
      </body>
  </html>
  `;
