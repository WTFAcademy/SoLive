import {useEffect} from "react";
import Editor from "solive-core-dev"

function App() {

  useEffect(() => {

  }, []);

  return (
    <div className="App">
      <Editor
        height="500px"
        id="1"
        modelInfos={[
          {
            filename: '_Storage.sol',
            value: "// SPDX-License-Identifier: GPL-3.0\n\npragma solidity >=0.7.0 <0.9.0;\n\n/**\n * @title Storage\n * @dev Store & retrieve value in a variable\n * @custom:dev-run-script ./scripts/deploy_with_ethers.ts\n */\ncontract Storage {\n\n    uint256 number;\n\n    /**\n     * @dev Store value in variable\n     * @param num value to store\n     */\n    function store(uint256 num) public {\n        number = num;\n    }\n\n    /**\n     * @dev Return value \n     * @return value of 'number'\n     */\n    function retrieve() public view returns (uint256){\n        return number;\n    }\n}",
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
