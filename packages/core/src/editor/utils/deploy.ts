import {
  Contract, ContractInterface, ethers, providers,
} from 'ethers';

const deploy = async (
  abi: ContractInterface,
  bytecode: string,
  signer: providers.JsonRpcSigner,
  callOptions: {value: number; gasLimit: number},
  args: any[],
): Promise<[Contract, ethers.providers.TransactionReceipt]> => {
  const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
  const instance = await contractFactory.deploy(...(args || []), {
    gasLimit: callOptions.gasLimit,
    value: ethers.utils.parseEther(`${callOptions.value}`),
  });
  const tx = await instance.deployTransaction.wait();
  return [instance, tx];
};

// const getBytecode = (compiledContract: any) => compiledContract.evm.bytecode.object;

export default deploy;
