import { ABIParameter } from 'solive-compiler-utils';
import { ethers } from 'ethers';

export const transformAbiParams = (inputs: ABIParameter[], params: {[key: string]: string}) => inputs.map((input) => {
  const param = params[input.name];

  if (
    input.type === 'address'
      || input.type === 'uint8'
      || input.type === 'uint16'
      || input.type === 'uint32'
      || input.type === 'uint64'
      || input.type === 'uint128'
      || input.type === 'uint256'
      || input.type === 'bool'
      || input.type === 'string'
      || input.type === 'bytes'
  ) {
    return param;
  }

  if (input.type === 'uint[]' || input.type === 'uint256[]') {
    const arr = param.split(',');
    return arr.map((item) => parseInt(item, 10));
  }

  if (input.type === 'address[]') {
    return param.split(',');
  }

  if (input.type === 'bytes32') {
    return ethers.utils.formatBytes32String(param);
  }

  if (input.type === 'bytes32[]') {
    const arr = param.split(',');
    return arr.map((item) => ethers.utils.formatBytes32String(item));
  }

  return param;
});

const transformAbiOutput = (output: ABIParameter, value: any) => {
  if (
    output.type === 'address'
      || output.type === 'uint8'
      || output.type === 'uint16'
      || output.type === 'uint32'
      || output.type === 'uint64'
      || output.type === 'uint128'
      || output.type === 'uint256'
      || output.type === 'bool'
      || output.type === 'string'
      || output.type === 'bytes'
  ) {
    return String(value);
  }

  if (output.type === 'uint256[]') {
    return value.map((item: any) => String(item));
  }

  if (output.type === 'address[]') {
    return value.map((item: any) => String(item));
  }

  if (output.type === 'bytes32') {
    return ethers.utils.parseBytes32String(value);
  }

  if (output.type === 'bytes32[]') {
    return value.map((item: any) => ethers.utils.parseBytes32String(item));
  }

  return value;
};

export const transformAbiOutputs = (outputs: ABIParameter[], result: any) => {
  if (outputs.length === 1) {
    return transformAbiOutput(outputs[0], result);
  }

  return outputs.map((output, index) => transformAbiOutput(output, result[index]));
};
