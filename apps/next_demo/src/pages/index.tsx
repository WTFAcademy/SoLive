import dynamic from 'next/dynamic';

import 'solive-core/dist/index.css';

const Editor = dynamic(
  () => import('solive-core'),
  { ssr: false },
);

export default function Home() {
  return (
    <main>
      <Editor
        id="1"
        modelInfos={
        [
          {
            filename: '_Storage.sol',
            // eslint-disable-next-line max-len
            value: "// SPDX-License-Identifier: GPL-3.0\n\npragma solidity >=0.7.0 <0.9.0;\n\n/**\n * @title Storage\n * @dev Store & retrieve value in a variable\n * @custom:dev-run-script ./scripts/deploy_with_ethers.ts\n */\ncontract Storage {\n\n    uint256 number;\n\n    /**\n     * @dev Store value in variable\n     * @param num value to store\n     */\n    function store(uint256 num) public {\n        number = num;\n    }\n\n    /**\n     * @dev Return value \n     * @return value of 'number'\n     */\n    function retrieve() public view returns (uint256){\n        return number;\n    }\n}",
            language: 'solidity' as any,
          },
        ]
      }
        height="500px"
      />
    </main>
  );
}
