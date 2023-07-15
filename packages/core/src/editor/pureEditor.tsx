import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { Allotment } from 'allotment';
import { StopIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import merge from 'lodash/merge';
import BaseMonaco from 'monaco-editor';
import { useForm } from 'react-hook-form';
import { Hardfork } from '@ethereumjs/common';
import VmProvider from 'solive-provider';
import { Disclosure } from '@headlessui/react';

import { ModelInfoType } from '../types/monaco';
import FileNavBar from '../components/FileNavBar';
import Console from '../components/Console';
import CssWrapper from '../components/CssWrapper';
import NavBar from '../components/NavBar';
import { FormProvider } from '../components/HookForm';
import RHFSelect from '../components/HookForm/RHFSelect';
import Button from '../components/Button';
import { getAccountOptions } from '../components/DeployAndCall/utils/accounts';
import AbiForm from '../components/DeployAndCall/AbiForm';
import { TCompiledContract } from '../types/contract';
import AbiInput from '../components/DeployAndCall/AbiInput';

import {
  RelayNetworkProvider,
  useRelayNetwork,
} from './contexts/relayNetworkContext';
import { DeployedProvider, useDeployed } from './contexts/deployedContext';
import { ConsoleProvider, useConsole } from './contexts/consoleContext';
import MonacoEditor from './monacoEditor';
import { EditorProvider, useEditor } from './contexts/editorContext';
import deploy from './utils/deploy';

const resolveConstructor = (abi: any = []) => {
  const constructor = abi.filter((item: any) => item.type === 'constructor')[0];
  return constructor ? constructor.inputs : [];
};

export type TConsoleProps = {
  defaultVisible?: boolean;
  defaultHeight?: string;
  minHeight?: number;
  triggerControl?: boolean;
  open?: boolean;
};

export type TDeployProps = {
  defaultVisible?: boolean;
  defaultWidth?: string;
  minWidth?: number;
  maxWidth?: number;
  open?: boolean;
};

export type TFileNavProps = {
  open?: boolean;
};

export type TEditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  height: string;
  disableValidation?: boolean;
  fileNav?: TFileNavProps;
  rounded?: string;
  console?: TConsoleProps;
  deploy?: TDeployProps;
  monacoEditorOptions?: BaseMonaco.editor.IStandaloneEditorConstructionOptions;
  children?: any;
};

const DefaultConsoleProps = {
  open: true,
  triggerControl: true,
  defaultVisible: true,
  minHeight: 100,
  defaultHeight: '30%',
};

const DefaultFileNavProps = {
  open: true,
};

const DEFAULT_ACCOUNT = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
const DEFAULT_GAS_LIMIT = 3000000;
const DEFAULT_VALUE = 0;

function Call({ contract }: { contract: TCompiledContract }) {
  return (
    <div className="min-h-[500px] w-full overflow-scroll">
      <div className="text-primary-100 font-medium text-[14px] py-2 px-1">
        <span>Call</span>
      </div>
      <div className="mt-2">
        <div className="mt-2" key={contract.address}>
          <Disclosure key={contract.address}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between box-border w-full py-2 px-2 rounded border-none text-white placeholder:text-[#878E95] text-left bg-[#36384A] focus:outline-none focus:shadow-outline">
                  <span className="block truncate text-[12px] min-h-[12px]">
                    {contract.name}
                    {' ('}
                    {contract.address}
                    )
                  </span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-3 w-3 transition-transform duration-200 ease-in-out`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-primary-100">
                  <AbiForm
                    abi={contract.abi}
                    signerAddress={contract.signerAddress}
                    address={contract.address}
                    name={contract.name}
                    key={contract.address}
                  />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
}

const useCompile = () => {
  const { state } = useEditor();
  const { addConsole } = useConsole();
  const compile = async () => {
    try {
      const compileResult: any = await state.codeParser.compilerService.compile();
      const hasError = compileResult.output.errors?.filter(
        (item: any) => item.severity === 'error',
      ).length > 0;
      if (hasError) {
        throw new Error(
          compileResult.output.errors
            .map((item: any) => item.formattedMessage)
            .join('\n'),
        );
      }
      addConsole([
        {
          type: 'success',
          message: 'Compile success!',
        },
      ]);
      return compileResult;
    } catch (e: any) {
      addConsole([
        {
          type: 'error',
          message: e.message,
        },
      ]);
      throw new Error(e);
    }
  };
  return {
    compile,
  };
};

const useDeploy = () => {
  const { state } = useEditor();
  const { addConsole } = useConsole();
  const { addCompiledUniqContract } = useDeployed();
  const [loading, setLoading] = useState(false);
  const models = state.models || [];

  const deployOptions = useMemo(
    () => models.map((model) => ({
      label: model.model.uri.path.substring(1),
      value: model.model.uri.path.substring(1),
      data: model,
    })),
    [models],
  );

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
      const [contract, tx] = await deploy(
        abi,
        bytecode,
        signer,
        callOptions,
        Object.values(params || {}),
      );
      addCompiledUniqContract({
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
    deployOptions,
  };
};

function DeployForm() {
  const { compile } = useCompile();
  const { state, actions } = useEditor();
  const { startDeploy, loading: deployLoading, deployOptions } = useDeploy();
  const { setSelectedNetwork, providerRef } = useRelayNetwork();

  const [accounts, setAccounts] = useState<string[]>([]);
  const [, setAccountOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const abiInputRef = useRef<{
    getValues:() => any;
    watch: (v: string) => any;
  }>();

  const [deployParams, setDeployParams] = useState([]);

  const [currentCompileResult, setCompileResult] = useState<any>();

  const methods = useForm({
    defaultValues: {
      environment: Hardfork.Shanghai,
      account: DEFAULT_ACCOUNT,
      gasLimit: DEFAULT_GAS_LIMIT,
      value: DEFAULT_VALUE,
      file: '',
      contract: '',
    },
  });

  const { watch, setValue } = methods;
  const environment = watch('environment');
  const selectAccount = watch('account');

  const updateAccountOptions = async (accounts: string[]) => {
    try {
      const options = await getAccountOptions(accounts, providerRef.current);
      setAccountOptions(options);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCompileAndDeploy = async () => {
    const compileResult = await compile();
    const models = state.models || [];
    const modelIndex = state.modelIndex || 0;
    const curModel = models[modelIndex];
    const compiledContracts = compileResult.output.contracts[curModel?.filename];
    const contractName = Object.keys(compiledContracts)[0];
    const contracts: any = compiledContracts[contractName];
    const abi = contracts ? contracts?.abi : undefined;
    const bytecode = contracts ? contracts?.evm.bytecode.object : undefined;
    const deployParams = resolveConstructor(abi);
    const value = methods.getValues('value');
    const gasLimit = methods.getValues('gasLimit');
    if (deployParams.length > 0) {
      setCompileResult(compileResult);
      setDeployParams(deployParams);
    } else {
      await startDeploy(
        contractName,
        abi,
        bytecode,
        {},
        selectAccount,
        { value, gasLimit },
        providerRef.current,
      );
      updateAccountOptions(accounts);
    }
  };
  const handleGoOnDeploy = async () => {
    const compileResult = currentCompileResult;
    const models = state.models || [];
    const modelIndex = state.modelIndex || 0;
    const curModel = models[modelIndex];
    const compiledContracts = compileResult.output.contracts[curModel?.filename];
    const contractName = Object.keys(compiledContracts)[0];
    const contracts: any = compiledContracts[contractName];
    const abi = contracts ? contracts?.abi : undefined;
    const bytecode = contracts ? contracts?.evm.bytecode.object : undefined;
    const value = methods.getValues('value');
    const gasLimit = methods.getValues('gasLimit');

    const deployParamsValues = abiInputRef.current?.getValues();
    await startDeploy(
      contractName,
      abi,
      bytecode,
      deployParamsValues,
      selectAccount,
      { value, gasLimit },
      providerRef.current,
    );
    updateAccountOptions(accounts);
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

  useEffect(() => {
    if (deployOptions.length > 0) {
      methods.setValue('file', deployOptions[0]?.value);
    }
  }, [deployOptions]);

  const onFileChange = (filename: any) => {
    const index = deployOptions.findIndex((m) => m.value === filename);
    const curModel = deployOptions[index].data.model;
    actions.updateModelIndex(index);
    state.editor?.setModel(curModel);
    setDeployParams([])
    setCompileResult(null)
  };
  return (
    <div className="min-h-[500px] w-full flex flex-col overflow-auto p-[20px] max-w-[300px]">
      <FormProvider methods={methods}>
        <RHFSelect
          name="file"
          label="File"
          options={deployOptions}
          onChange={onFileChange}
        />
        {deployParams.length > 0 && (
          <AbiInput ref={abiInputRef} inputs={deployParams} />
        )}
        <div className="flex justify-start gap-2 mb-2">
          {deployParams.length > 0 ? (
            <Button type="primary" loading={deployLoading} onClick={handleGoOnDeploy}>
              Go on
            </Button>
          )
            : (
              <Button type="primary" loading={deployLoading} onClick={handleCompileAndDeploy}>
                Deploy
              </Button>
            )}
        </div>
      </FormProvider>
    </div>
  );
}

function PureNavBar({
  onChange,
  currentNav = 'pure-deploy',
}: {
  onChange: (nav: any, index: number) => void;
  currentNav?: string;
}) {
  const { compiledUniqContracts } = useDeployed();
  const navs = useMemo(
    () => [
      {
        label: 'Deploy',
        id: 'pure-deploy',
      },
    ].concat(
      (Object.keys(compiledUniqContracts) ?? []).map((name) => ({
        label: name,
        id: name,
        delDisabled: true,
      })),
    ),
    [compiledUniqContracts],
  );

  return (
    <div className="w-full pt-2">
      <NavBar
        globalId="pure-mode-pane"
        navs={navs}
        activeNavId={currentNav}
        onClick={onChange}
      />
    </div>
  );
}

function PureCompile() {
  const { compiledUniqContracts } = useDeployed();
  const [currentNav, setCurrentNav] = useState<{ id: string; label: string }>({
    label: 'Deploy',
    id: 'pure-deploy',
  });
  const onNavChange = (nav: { id: string; label: string }) => {
    setCurrentNav(nav);
  };

  const currentContract = compiledUniqContracts[currentNav.id];

  return (
    <div>
      <PureNavBar onChange={onNavChange} />
      <div className="min-h-[500px] max-w-[300px]">
        {currentNav?.id === 'pure-deploy' && <DeployForm />}
        {currentNav?.id !== 'pure-deploy' && (
          <Call contract={currentContract} />
        )}
      </div>
    </div>
  );
}
function Main(props: TEditorProps) {
  const {
    height,
    console = {},
    fileNav = {},
    rounded = '12px',
    modelInfos,
    ...others
  } = props;
  const consoleProps = merge(DefaultConsoleProps, console);
  const fileNavProps = merge(DefaultFileNavProps, fileNav);
  const [isCompileMode, setCompileMode] = useState(false);

  return (
    <div
      className="bg-primary-700 overflow-auto"
      style={{ height, borderRadius: rounded }}
    >
      <Allotment snap>
        <Allotment.Pane minSize={200} snap={false}>
          <div className="w-full h-full border-none border-l border-solid border-primary-500">
            <Allotment snap vertical>
              <Allotment.Pane
                minSize={consoleProps.minHeight}
                preferredSize={consoleProps.defaultHeight}
                visible={!isCompileMode}
              >
                {fileNavProps.open && (
                  <FileNavBar
                    onClickRun={() => {
                      setCompileMode(true);
                    }}
                  />
                )}
                <MonacoEditor modelInfos={modelInfos} {...others} />
              </Allotment.Pane>

              <Allotment.Pane
                minSize={50}
                preferredSize={consoleProps.defaultHeight}
                visible={isCompileMode}
              >
                <div className="relative w-full h-full">
                  <Console />
                  <StopIcon
                    className="w-4 h-4 text-primary-100 cursor-pointer absolute right-[0.8rem] top-[1rem]"
                    onClick={() => {
                      setCompileMode(false);
                    }}
                  />
                </div>
              </Allotment.Pane>
              <Allotment.Pane
                minSize={400}
                preferredSize={consoleProps.defaultHeight}
                visible={isCompileMode}
              >
                <PureCompile />
              </Allotment.Pane>
            </Allotment>
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default function Editor(props: TEditorProps) {
  const { id } = props;
  return (
    <EditorProvider id={id}>
      <RelayNetworkProvider>
        <ConsoleProvider>
          <DeployedProvider>
            <CssWrapper>
              <Main {...props} />
            </CssWrapper>
          </DeployedProvider>
        </ConsoleProvider>
      </RelayNetworkProvider>
    </EditorProvider>
  );
}
