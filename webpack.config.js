const path = require('path');
const pkg = require('./package.json');

let output = {
  path: path.resolve(__dirname, 'dist'),
  filename: process.env.UMD ? 'obg.js' : 'index.js',
  library: 'OBG'
};
if (process.env.UMD) {
  output.libraryTarget = 'umd';
} else {
  output.libraryTarget = 'commonjs';
}

module.exports = {
  entry: './src/index.js',
  output,
};
