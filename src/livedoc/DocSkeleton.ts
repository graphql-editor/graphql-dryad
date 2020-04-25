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
            window.toggleMenu = () => {
              const menuElement = document.getElementById('Menu');
              const nextToggle = menuElement.classList.contains('ShowToggle');
              if (nextToggle) {
                menuElement.classList.remove('ShowToggle');
              } else {
                menuElement.classList.add('ShowToggle');
              }
            };
        </script>  
      </head>
      <body>
          ${body}
      </body>
  </html>
  `;
