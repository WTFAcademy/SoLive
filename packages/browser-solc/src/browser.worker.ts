declare global {
  interface Worker {
    Module: any;
  }
}

function browserSolidityCompiler() {
  const ctx: Worker = self as any;
  const importVersions: any[] = [];

  ctx.addEventListener("message", ({ data }) => {
    if (data === "fetch-compiler-versions") {
      fetch("https://binaries.soliditylang.org/bin/list.json")
        .then((response) => response.json())
        .then((result) => {
          // @ts-ignore
          postMessage(result);
        });
    } else {
      // version find in https://github.com/ethereum/solc-bin/tree/gh-pages/bin
      const jsUri = data.version;
      console.log(jsUri);
      
      importScripts(encodeURIComponent('https://binaries.soliditylang.org/bin/soljson-v0.8.19+commit.7dd6d404.js'));
      const soljson = ctx.Module;

      if (soljson && "_solidity_compile" in soljson) {
        console.log('load success');
        if (!importVersions.includes(data.version)) {
          importVersions.push(data.version);
        }
        const compile = soljson.cwrap("solidity_compile", "string", [
          "string",
          "number",
        ]);
        const output = JSON.parse(compile(data.input));
        // @ts-ignore
        postMessage({
          output,
          input: data.input && JSON.parse(data.input),
        });
      }
    }
  });
}

function importScripts(_arg0: string) {
  throw new Error("Function not implemented.");
}

if (window !== self) {
  browserSolidityCompiler();
}

export { browserSolidityCompiler };
