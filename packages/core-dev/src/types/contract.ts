
import {ContractInterface} from 'ethers';

export type TCompiledContract = {
  name: string;
  address: string;
  abi: ContractInterface;
  signerAddress: string;
}
