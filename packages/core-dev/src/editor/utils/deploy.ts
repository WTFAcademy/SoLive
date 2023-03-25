import {Contract, ContractInterface, ethers, providers} from 'ethers';

const deploy = async (abi: ContractInterface, bytecode: string, signer: providers.JsonRpcSigner, args: any[]): Promise<Contract> => {
  console.log('deploying contract', abi, bytecode, signer, args);
  const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
  return contractFactory.deploy(...args);
}

const getBytecode = (compiledContract: any) => {
  return compiledContract.evm.bytecode.object;
}

export default deploy;
