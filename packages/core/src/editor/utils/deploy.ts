import {
  Contract, ContractInterface, ethers, providers,
} from 'ethers';

const deploy = async (
  abi: ContractInterface,
  bytecode: string,
  signer: providers.JsonRpcSigner,
  callOptions: {value: number; gasLimit: number},
  args: any[],
): Promise<Contract> => {
  const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
  const instance = await contractFactory.deploy(...(args || []), {
    gasLimit: callOptions.gasLimit,
    value: ethers.utils.parseEther(`${callOptions.value}`),
  });
  await instance.deployTransaction.wait();
  return instance;
};

// const getBytecode = (compiledContract: any) => compiledContract.evm.bytecode.object;

export default deploy;
