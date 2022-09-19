export const tree = {
  tree: {
    main: {
      element: 'tree-main-element',
      code: {
        element: 'tree-main-code-element',
        tabs: {
          element: 'tree-main-code-tabs-element',
          css: {
            element: 'tree-main-code-tabs-css-element',
          },
          js: {
            element: 'tree-main-code-tabs-js-element',
          },
        },
      },
      execute: {
        play: {
          element: 'tree-main-execute-play-element',
        },
        preview: {
          element: 'tree-main-execute-preview-element',
        },
      },
      result: {
        element: 'tree-main-result-element',
      },
    },
  },
} as const;
