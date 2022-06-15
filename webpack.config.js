import { resolve } from 'node:path';

const config = {
  mode: 'production',
  entry: resolve('./src/index.ts'),
  output: {
    filename: 'bundle.js',
    path: resolve('dist')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/,}
    ]
  },
  devtool: 'inline-source-map'
};


export default config;