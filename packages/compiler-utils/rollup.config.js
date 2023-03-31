const typescript = require('@rollup/plugin-typescript');
const nodeResolve = require('@rollup/plugin-node-resolve');

export default {
  input: {
    index: 'src/index.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    typescript(),
    nodeResolve(),
  ],
  external: ["semver"]
};
