import { useEffect } from "react";
import Editor, { SupportLanguage } from "solive-core";

function App() {

  // useEffect(() => {
  //   const worker = new Worker(new URL('./worker.ts', import.meta.url));
  //   worker.postMessage("");
  // }, []);

  return (
    <div className="App">
      <Editor
        id="1"
        modelInfos={[
          {
            filename: 'a.sol',
            value: 'pragma solidity ^0.8.0;\nimport "b.sol";\ncontract MyContract {\n     function foo() external {\n         // do something\n     }\n}\n',
            language: SupportLanguage.Solidity,
          },
          {
            filename: 'b.sol',
            value: 'pragma solidity ^0.8.0;\nimport "a.sol";\ncontract MyContract {\n     function foo() external {\n         // do something\n     }\n}\n',
            language: SupportLanguage.Solidity,
          }
        ]}
      ></Editor>
    </div>
  );
}

export default App;
