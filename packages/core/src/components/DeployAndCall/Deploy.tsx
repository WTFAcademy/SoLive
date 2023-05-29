import {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { useForm } from 'react-hook-form';
import { Hardfork } from '@ethereumjs/common';
import VmProvider from 'solive-provider';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

import { FormProvider } from '../HookForm';
import RHFInput from '../HookForm/RHFInput';
import RHFSelect from '../HookForm/RHFSelect';
import Button from '../Button';
import { useEditor } from '../../editor/contexts/editorContext';
import Copy from '../Copy';
import deploy from '../../editor/utils/deploy';
import { useDeployed } from '../../editor/contexts/deployedContext';
import { useConsole } from '../../editor/contexts/consoleContext';
import { useRelayNetwork } from '../../editor/contexts/relayNetworkContext';

import AbiInput from './AbiInput';
import { getAccountOptions } from './utils/accounts';

const ENVIRONMENT_OPTIONS = [
  { label: 'London', value: Hardfork.London },
  { label: 'Berlin', value: Hardfork.Berlin },
  { label: 'Shanghai', value: Hardfork.Shanghai },
  { label: 'merge', value: Hardfork.Merge },
];

const DEFAULT_ACCOUNT = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
const DEFAULT_GAS_LIMIT = 3000000;
const DEFAULT_VALUE = 0;

const resolveConstructor = (abi: any = []) => {
  const constructor = abi.filter((item: any) => item.type === 'constructor')[0];
  return constructor ? constructor.inputs : [];
};

const useCompile = () => {
  const { state } = useEditor();
  const { addConsole } = useConsole();
  const models = state.models || [];
  const modelIndex = state.modelIndex || 0;
  const curModel = models[modelIndex];

  const [compiledContracts, setCompiledContracts] = useState<any>([]);
  const [compiledOptions, setCompiledOptions] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<boolean>(false);

  const compile = async () => {
    setLoading(true);
    resetAll();
    try {
      const compileResult: any = await state.codeParser.compilerService.compile();
      const hasError = compileResult.output.errors?.filter((item: any) => item.severity === 'error').length > 0;
      if (hasError) {
        throw new Error(compileResult.output.errors.map((item: any) => item.formattedMessage).join('\n'));
      }

      setError(false);
      setCompiledContracts(compileResult.output.contracts[curModel?.filename]);
      setCompiledOptions(Object.keys(compileResult.output.contracts[curModel?.filename]).map((key: string) => ({
        label: key,
        value: key,
      })));
      addConsole([{
        type: 'success',
        message: 'Compile success!',
      }]);
    } catch (e: any) {
      setError(true);
      addConsole([{
        type: 'error',
        message: e.message,
      }]);
    }
    setLoading(false);
  };

  const resetAll = () => {
    setCompiledContracts([]);
    setCompiledOptions([]);
  };

  return {
    compile,
    compiledContracts,
    compiledOptions,
    loading,
    error,
  };
};

const useDeploy = () => {
  const { addConsole } = useConsole();
  const { addCompiledContract } = useDeployed();
  const [loading, setLoading] = useState(false);

  const startDeploy = async (
    name: string,
    abi: any,
    bytecode: string,
    params: any,
    signerAddress: string,
    callOptions: { gasLimit: number; value: number },
    provider: VmProvider,
  ) => {
    try {
      setLoading(true);
      if (!abi) {
        throw new Error('Please compile or select contract first!');
      }
      const signer = await provider.provider.getSigner(signerAddress);
      const [contract, tx] = await deploy(abi, bytecode, signer, callOptions, Object.values(params || {}));
      addCompiledContract({
        name,
        address: contract.address,
        abi,
        signerAddress,
      });
      addConsole([
        {
          type: 'success',
          message: JSON.stringify(tx),
        },
        {
          type: 'success',
          message: `${name} - Contract deployment succeeded: ${contract.address}`,
        },
      ]);
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

  return {
    startDeploy,
    loading,
  };
};

// Hardfork
function Deploy() {
  const {
    compile, loading: compileLoading, error, compiledContracts, compiledOptions,
  } = useCompile();
  const { startDeploy, loading: deployLoading } = useDeploy();
  const { setSelectedNetwork, providerRef } = useRelayNetwork();

  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountOptions, setAccountOptions] = useState<{ label: string; value: string }[]>([]);

  const methods = useForm({
    defaultValues: {
      environment: Hardfork.Shanghai,
      account: DEFAULT_ACCOUNT,
      gasLimit: DEFAULT_GAS_LIMIT,
      value: DEFAULT_VALUE,
      contract: '',
    },
  });

  useEffect(() => {
    if (compiledOptions.length > 0) {
      methods.setValue('contract', compiledOptions[0]?.value);
    }
  }, [compiledOptions]);

  const { watch, setValue } = methods;
  const environment = watch('environment');
  const selectAccount = watch('account');
  const selectedContract = watch('contract');
  const selectedContractDeployParams = useMemo(() => {
    if (!selectedContract || selectedContract === '') {
      return [];
    }
    return resolveConstructor(compiledContracts[selectedContract]?.abi);
  }, [selectedContract, compiledContracts]);
  const abiInputRef = useRef<{ getValues:() => any; watch: (v: string) => any; }>();

  const updateAccountOptions = async (accounts: string[]) => {
    try {
      const options = await getAccountOptions(accounts, providerRef.current);
      setAccountOptions(options);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeploy = async () => {
    const abi = selectedContract ? compiledContracts[selectedContract]?.abi : undefined;
    const bytecode = selectedContract ? compiledContracts[selectedContract]?.evm.bytecode.object : undefined;
    const deployParams = abiInputRef.current?.getValues();
    const value = methods.getValues('value');
    const gasLimit = methods.getValues('gasLimit');

    await startDeploy(
      selectedContract,
      abi,
      bytecode,
      deployParams,
      selectAccount,
      { value, gasLimit },
      providerRef.current,
    );
    updateAccountOptions(accounts);
  };

  const handleCompile = () => {
    setValue('contract', '');
    compile();
  };

  useEffect(() => {
    if (environment) {
      setSelectedNetwork(environment);
      Promise.resolve().then(() => {
        providerRef.current.getAccounts().then(async (accounts) => {
          setValue('account', accounts[0]);
          setAccounts(accounts);
          await updateAccountOptions(accounts);
        });
      });
    }
  }, [environment]);

  return (
    <div className="h-full w-full flex flex-col overflow-auto pb-2">
      <FormProvider methods={methods}>
        <RHFSelect name="environment" label="Environment" options={ENVIRONMENT_OPTIONS} />
        <RHFSelect
          name="account"
          label="Account"
          options={accountOptions}
          widget={(
            <div className="flex items-center gap-1">
              <ArrowPathIcon className="w-3 h-3" onClick={() => updateAccountOptions(accounts)} />
              <Copy text={selectAccount} />
            </div>
          )}
        />
        <div className="flex justify-between gap-3">
          <RHFInput name="gasLimit" label="Gas Limit" />
          <RHFInput name="value" label="Value" />
        </div>
        <RHFSelect name="contract" label="Contract" options={compiledOptions} />
      </FormProvider>
      {selectedContractDeployParams.length > 0 && (
        <AbiInput ref={abiInputRef} inputs={selectedContractDeployParams} />
      )}
      <div className="flex justify-end gap-2 mb-2">
        <Button type="default" loading={compileLoading} onClick={handleCompile}>Compile</Button>
        <Button type="primary" loading={deployLoading} onClick={handleDeploy}>Deploy</Button>
      </div>
    </div>
  );
}

export default Deploy;
