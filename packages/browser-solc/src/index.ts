import setupMethods from "solc/wrapper";

import { browserSolidityCompiler } from "./browser.worker";

export * from "./types";

export const solidityCompiler = async ({
  version,
  input,
}: {
  version: string;
  input: any;
}) => {
  const worker = new Worker(
    URL.createObjectURL(
      new Blob([`(${browserSolidityCompiler})()`], {
        type: "module",
      })
    )
  );
  return new Promise((resolve, reject) => {
    worker.postMessage({ input: JSON.stringify(input), version });
    worker.onmessage = function ({ data }) {
      resolve(data);
    };
    worker.onerror = reject;
  });
};

export const getCompilerVersions = async () => {
  const worker = new Worker(
    URL.createObjectURL(
      new Blob([`(${browserSolidityCompiler})()`], { type: "module" })
    )
  );
  return new Promise((resolve, reject) => {
    worker.postMessage("fetch-compiler-versions");
    worker.onmessage = function ({ data }) {
      resolve(data);
    };
    worker.onerror = reject;
  });
};
