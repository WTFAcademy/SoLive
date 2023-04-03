/**
 * Copyright (c) 2023 Christian Bromann
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path'

import webpack from 'webpack';

export default () => ({
  name: 'solive-docusaurus-theme-code',

  getThemePath() {
    return path.resolve(__dirname, './theme')
  },

  configureWebpack() {
    return {
      resolve: {
        fallback: {
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "path": require.resolve("path-browserify"),
          "process": require.resolve("process/browser"),
          "os": require.resolve("os-browserify/browser"),
          "buffer": require.resolve("buffer/"),
          "fs": false,
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: 'process/browser',
        }),
      ]
    };
  },
})
