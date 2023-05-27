import { ABIDescription } from 'solive-compiler-utils';

export type TCompiledContract = {
  name: string;
  address: string;
  abi: ABIDescription[];
  signerAddress: string;
}
