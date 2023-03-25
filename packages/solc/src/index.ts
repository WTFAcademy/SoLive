export * from "./types";

const workerMap = new Map();

export const solidityCompiler = async (
  {
    version,
    input,
  }: {
    version: string;
    input: any;
  }
) => {
  // eslint-disable-next-line prefer-const
  let oldWorkerInfo = workerMap.get(version);
  let worker: Worker = {} as Worker;
  if (oldWorkerInfo) {
    const timestamp = oldWorkerInfo.timestamp;
    worker = oldWorkerInfo.worker;

    if ((Date.now() - timestamp) / 1000 > 60) {
      worker = new Worker(new URL('./worker.js', import.meta.url), {type: 'module'});
      worker.postMessage({type: 'init-solc', version: version})
      workerMap.set(version, {
        worker,
        version,
        timestamp: Date.now(),
      });
    }
  } else {
    worker = new Worker(new URL('./worker.js', import.meta.url), {type: 'module'});
    worker.postMessage({type: 'init-solc', version: version})
    workerMap.set(version, {
      worker,
      version,
      timestamp: Date.now(),
    });
  }

  return new Promise((resolve, reject) => {
    worker.postMessage({input: JSON.stringify(input), version});
    worker.onmessage = function ({data}: any) {
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
