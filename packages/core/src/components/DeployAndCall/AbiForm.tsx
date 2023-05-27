import { useMemo, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import { ethers } from 'ethers';
import { ABIDescription, FunctionDescription } from 'solive-compiler-utils';

import RHFInput from '../HookForm/RHFInput';
import { FormProvider } from '../HookForm';
import RHFSelect from '../HookForm/RHFSelect';
import Button from '../Button';
import { useRelayNetwork } from '../../editor/contexts/relayNetworkContext';
import { useConsole } from '../../editor/contexts/consoleContext';

import AbiInput from './AbiInput';
import { transformAbiOutputs } from './utils/utils';

type TProps = {
  signerAddress: string;
  abi: ABIDescription[];
  address: string;
  name: string;
}

function AbiForm(props: TProps) {
  const {
    signerAddress,
    abi,
    address,
  } = props;
  const [loading, setLoading] = useState(false);
  const { providerRef } = useRelayNetwork();
  const { addConsole } = useConsole();
  const methods = useForm({
    defaultValues: {
      callFunction: '',
      ethAmount: '',
    },
  });
  const { watch } = methods;
  const callFunction = watch('callFunction');
  const ethAmount = watch('ethAmount');
  const abiInputRef = useRef<{ getValues:() => any; watch: (v: string) => any; }>();

  const abiOptions = useMemo(() => {
    if (Array.isArray(abi)) {
      return abi
        .filter((v) => v.type !== 'constructor' && v.type === 'function')
        .map((v) => ({
          label: v.name || '',
          value: v.name || '',
        }));
    }
    return [];
  }, [abi]);

  const selectedFunction = useMemo(() => {
    if (Array.isArray(abi)) {
      return abi.filter((v) => v.type === 'function' && v.name === callFunction)[0] as FunctionDescription;
    }
    return {} as FunctionDescription;
  }, [callFunction]);

  const handleSubmit = async () => {
    const submitParams = abiInputRef.current?.getValues();
    setLoading(true);

    try {
      const signer = await providerRef.current.getSigner(signerAddress);
      const contract = new ethers.Contract(address, abi, signer);
      let result;
      if (selectedFunction?.stateMutability === 'payable') {
        const overrides = {
          value: ethers.utils.parseEther(ethAmount),
        };
        result = await contract[callFunction](...Object.values(submitParams || []), overrides);
      } else {
        result = await contract[callFunction](...Object.values(submitParams || []));
      }

      if (selectedFunction.stateMutability === 'view') {
        addConsole([
          {
            type: 'success',
            message: `Result: ${transformAbiOutputs(selectedFunction.outputs || [], result)}`,
          },
        ]);
      } else {
        addConsole([
          {
            type: 'success',
            message: JSON.stringify(result),
          },
        ]);
        const txResult = await result.wait();
        addConsole([
          {
            type: 'success',
            message: JSON.stringify(txResult),
          },
        ]);
      }
    } catch (e: any) {
      addConsole([
        {
          type: 'error',
          message: e.message,
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <FormProvider methods={methods}>
      <RHFSelect name="callFunction" label="ABI" options={abiOptions} />
      {selectedFunction?.stateMutability === 'payable'
        ? <RHFInput name="ethAmount" label="eth amount" />
        : ''}
      {selectedFunction?.inputs && selectedFunction?.inputs.length > 0 && (
        <AbiInput ref={abiInputRef} inputs={selectedFunction.inputs} />
      )}
      {selectedFunction && <Button type="primary" loading={loading} onClick={handleSubmit}>Submit</Button>}
    </FormProvider>
  );
}

export default AbiForm;
