const typescript = require('@rollup/plugin-typescript');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const json = require('@rollup/plugin-json');

export default {
  input: {
    worker: 'src/worker-vm.ts',
    index: 'src/index.ts',
  },
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    json(),
    typescript(),
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**'
    }),
    commonjs()
  ],
};
