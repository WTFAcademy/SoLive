import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";

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
    typescript({ useTsconfigDeclarationDir: true }),
    resolve(),
  ],
};
