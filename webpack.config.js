const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    main: path.join(__dirname, 'src/main.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: {
    ws: 'ws',
    'node-fetch': 'node-fetch',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compiler: 'typescript',
              configFile: 'tsconfig.json',
            },
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
};
