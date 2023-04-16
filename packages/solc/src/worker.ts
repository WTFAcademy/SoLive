const importVersions: any[] = [];

// 在 Main Thread 中 postMessage 消息，Worker 中 "message" 事件监听函数会接收到对应的事件。
globalThis.addEventListener('message', ({ data }) => {
  if (data === 'fetch-compiler-versions') {
    fetch('https://binaries.soliditylang.org/bin/list.json')
      .then((response) => response.json())
      .then((result) => {
        // @ts-ignore
        globalThis.postMessage(result);
      });
  } else if (data.type === 'init-solc') {
    const jsUri = data.version;
    globalThis.importScripts(jsUri);
  } else {
    // version find in https://github.com/ethereum/solc-bin/tree/gh-pages/bin
    // @ts-ignore
    const soljson = globalThis.Module;

    if (soljson && '_solidity_compile' in soljson) {
      if (!importVersions.includes(data.version)) {
        importVersions.push(data.version);
      }
      const compile = soljson.cwrap('solidity_compile', 'string', [
        'string',
        'number',
      ]);
      const output = JSON.parse(compile(data.input));
      // @ts-ignore
      globalThis.postMessage({
        output,
        input: data.input && JSON.parse(data.input),
      });
    }
  }
});
