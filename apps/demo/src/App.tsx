import {useEffect} from "react";
import Editor from "solive-core";


function App() {

  useEffect(() => {
    // const provider = new Provider();
    // console.log(provider.provider);
    // provider.getAccounts().then(console.log);
    // const worker = new Worker(new URL('./worker.ts', import.meta.url));
    // worker.postMessage("");
  }, []);

  return (
    <div className="App">
      <Editor
        id="1"
        modelInfos={[
          {
            filename: 'a.sol',
            value: 'pragma solidity ^0.8.0;\nimport "./b.sol";\ncontract MyContract {\n     function foo() external {\n         // do something\n     }\n}\n',
            language: "solidity" as any,
          },
          {
            filename: 'b.sol',
            value: 'pragma solidity ^0.8.0;\nimport "./a.sol";\ncontract MyContract {\n     function foo() external {\n         // do something\n     }\n}\n',
            language: "solidity" as any,
          }
        ]}
      />
    </div>
  );
}

export default App;
