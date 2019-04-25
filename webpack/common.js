const path = require('path');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader', },
          { loader: 'css-loader', },
          { loader: 'sass-loader', },
        ]
      },
      {
        test: /\.html$/,
        use: [ 'html-loader' ],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif|json)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader', },
          { loader: 'eslint-loader', },
        ]
      },
    ],
  },
};
