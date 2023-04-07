import {ABIParameter} from "solive-compiler-utils";
import {ethers} from "ethers";

export const transformAbiParams = (inputs: ABIParameter[], params: {[key: string]: string}) => {
  return inputs.map((input) => {
    const param = params[input.name];

    if (
      input.type === 'address' ||
      input.type === 'uint8' ||
      input.type === 'uint16' ||
      input.type === 'uint32' ||
      input.type === 'uint64' ||
      input.type === 'uint128' ||
      input.type === 'uint256' ||
      input.type === 'bool' ||
      input.type === 'string' ||
      input.type === 'bytes'
    ) {
      return param;
    }

    if (input.type === 'uint[]' || input.type === 'uint256[]') {
      const arr = param.split(',');
      return arr.map((item) => {
        return parseInt(item);
      });
    }

    if (input.type === 'address[]') {
      return param.split(',');
    }

    if (input.type === 'bytes32') {
      return ethers.utils.formatBytes32String(param);
    }

    if (input.type === 'bytes32[]') {
      const arr = param.split(',');
      return arr.map((item) => {
        return ethers.utils.formatBytes32String(item);
      });
    }

    return param;
  });
}
