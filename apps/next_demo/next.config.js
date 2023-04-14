/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (webpackConfig, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
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
  },
}

module.exports = nextConfig
