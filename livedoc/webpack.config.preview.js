/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config');
module.exports = {
  ...config,
  entry: {
    app: './preview.tsx',
  },
};
