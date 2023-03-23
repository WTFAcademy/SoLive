export * from "./types";

export const solidityCompiler = async (
  {
    version,
    input,
  }: {
    version: string;
    input: any;
  }
) => {
  const worker = new Worker(new URL('./worker.js', import.meta.url), {type: 'module'});
  return new Promise((resolve, reject) => {
    worker.postMessage({input: JSON.stringify(input), version});
    worker.onmessage = function ({data}) {
      resolve(data);
    };
    worker.onerror = reject;
  });
};

export const getCompilerVersions = async () => {
  const worker = new Worker(new URL('./worker.js', import.meta.url), {type: 'module'});
  return new Promise((resolve, reject) => {
    worker.postMessage("fetch-compiler-versions");
    worker.onmessage = function ({data}) {
      resolve(data);
    };
    worker.onerror = reject;
  });
};
