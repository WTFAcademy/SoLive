import nodeResolve from "@rollup/plugin-node-resolve";
import babel from 'rollup-plugin-babel';
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const extensions = ['.js', '.ts'];

export default {
  input: {
    worker: 'src/worker.ts',
    index: 'src/index.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    peerDepsExternal(),
    nodeResolve({
      extensions,
      modulesOnly: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
  ],
  external: ['@ethereumjs/common', 'ethers', '@remix-project/remix-simulator'],
};
