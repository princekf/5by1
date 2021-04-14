import path = require('path');
import nodeExternals = require('webpack-node-externals');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NodemonPlugin = require('nodemon-webpack-plugin');
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';

const { NODE_ENV = 'production' } = process.env;
module.exports = {
  entry: './src/server.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  resolve: {
    plugins: [ new TsconfigPathsPlugin() ],
    extensions: [ '.webpack.js', '.web.js', '.ts', '.tsx', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/u,
        include: __dirname,
        use: [ 'ts-loader' ],
      },
    ],
  },
  externals: [ nodeExternals() ],
  plugins: [ new NodemonPlugin() ],
};
