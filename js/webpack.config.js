const path = require('path');

module.exports = {
  entry: './feedback.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};