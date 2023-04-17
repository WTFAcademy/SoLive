const cracoAlias = require("craco-alias");
const nodeExternals = require('webpack-node-externals');

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
      webpackConfig.externalsPresets = {node: true};
      webpackConfig.externals = [nodeExternals()];
      return webpackConfig;
    }
  }
};
