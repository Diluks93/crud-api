import { resolve } from 'node:path';

const config = {
  entry: resolve('./index.ts'),
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: resolve('dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }],
  },
};

export default (env, argv) => {
  if (argv.mode === 'development') {
    config.mode = 'development';
    config.devtool = 'inline-source-map';
  }

  if (argv.mode === 'production') {
    config.mode = 'production';
  }

  return config;
};
