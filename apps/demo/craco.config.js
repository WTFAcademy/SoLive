const cracoAlias = require("craco-alias");
const webpack = require("webpack");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  plugins: [
    {
      plugin: cracoAlias,
      options: {
        source: "options",
        baseUrl: "./src",
        aliases: {
          "@": "./"
        }
      }
    }
  ],
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // eslint-disable-next-line no-param-reassign
      webpackConfig.resolve.fallback = {
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "events": require.resolve("events/"),
        "crypto": require.resolve("crypto-browserify"),
        "assert": require.resolve("assert/"),
        "buffer": require.resolve("buffer/"),
        "util": require.resolve("util/"),
        "path": require.resolve("path-browserify"),
        "tty": require.resolve("tty-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "punycode": require.resolve("punycode/"),
        "fs": false,
        "url": require.resolve("url/"),
        "net": require.resolve("net-browserify"),
        "child_process": false,
        async_hooks: false,
        rawBody: false,
      };

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"]
        })
      );
      return webpackConfig;
    }
  }
};
