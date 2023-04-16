import setupMethods from 'solc/wrapper';

globalThis.addEventListener('message', ({ data }) => {
  if (data === 'fetch-compiler-versions') {
    fetch('https://binaries.soliditylang.org/bin/list.json')
      .then((response) => response.json())
      .then((result) => {
        // @ts-ignore
        globalThis.postMessage(result);
      });
  } else if (data.type === 'init-solc') {
    globalThis.importScripts(data.version);
  } else {
    // version find in https://github.com/ethereum/solc-bin/tree/gh-pages/bin
    const compiler = setupMethods(globalThis);

    try {
      const output = compiler.compile(data.input);
      globalThis.postMessage({
        output: JSON.parse(output),
        input: data.input && JSON.parse(data.input),
      });
    } catch (exception) {
      globalThis.postMessage({
        output: { error: `Uncaught JavaScript exception:\n${exception}` },
        input: data.input && JSON.parse(data.input),
      });
    }
  }
});
