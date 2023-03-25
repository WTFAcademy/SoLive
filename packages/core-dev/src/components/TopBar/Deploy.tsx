import {useForm} from "react-hook-form";
import {Popover, PopoverContent, PopoverHandler, Select, Option} from "@material-tailwind/react";
import {PlayCircleIcon} from "@heroicons/react/24/solid";
import {useEffect, useMemo, useState} from "react";

import {FormProvider} from "../HookForm";
import RHFInput from "../HookForm/RHFInput";
import {useEditor} from "../../editor/editorContext";
import Button from "../Button";
import deploy from "../../editor/utils/deploy";

const resolveConstructor = (abi: any) => {
  const constructor = abi.filter((item: any) => item.type === 'constructor')[0];
  return constructor ? constructor.inputs : [];
}

const Deploy = () => {
  const {state, vmProviderRef, actions} = useEditor();
  const methods = useForm({mode: "onBlur"});

  const [compiledContracts, setCompiledContracts] = useState<any>(null);
  const [compiledContractKeys, setCompiledContractKeys] = useState<any>(null);
  const [compileLoading, setCompileLoading] = useState(false);

  const [selectedContract, setSelectedContract] = useState<string>();
  const [error, setError] = useState<boolean>(false);

  const [deployLoading, setDeployLoading] = useState(false);
  const [deployContractAddress, setDeployContractAddress] = useState<string>();
  const [deployError, setDeployError] = useState<boolean>(false);

  const models = state.models || [];
  const modelIndex = state.modelIndex || 0;
  const curModel = models[modelIndex];

  const selectedContractDeployParams = useMemo(() => {
    if (!selectedContract) {
      return [];
    }
    return resolveConstructor(compiledContracts[selectedContract]?.abi);
  }, [selectedContract]);

  const preDeploy = async () => {
    setCompileLoading(true);
    methods.reset();
    try {
      const compileResult: any = await state.codeParser.compilerService.compile();
      const hasError = compileResult.output.errors.filter((item: any) => item.severity === 'error').length > 0;
      if (hasError) {
        console.log(compileResult.errors);
        throw new Error('编译失败');
      }

      setError(false);
      setCompiledContracts(compileResult.output.contracts[curModel?.filename]);
      setCompiledContractKeys(Object.keys(compileResult.output.contracts[curModel?.filename]));
    } catch (e: any) {
      setError(true);
      actions.updateConsoleMessages([
        {
          type: "error",
          message: e.message,
        }
      ])
    }
    setCompileLoading(false);
  }

  const startDeploy = async (data: any) => {
    try {
      setDeployLoading(true);
      const abi = selectedContract ? compiledContracts[selectedContract]?.abi : undefined;
      const bytecode = selectedContract ? compiledContracts[selectedContract]?.evm.bytecode.object: undefined;
      if (!abi) {
        throw new Error('abi 不存在');
      }
      console.log(selectedContract && compiledContracts[selectedContract]);
      const signer = await vmProviderRef.current.provider.getSigner('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4');
      const contract = await deploy(abi, bytecode, signer, Object.values(data));
      console.log(contract, contract.address);
      actions.updateCompilerContract({
        name: selectedContract!,
        address: contract.address,
        abi: contract.interface.format(),
        signerAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
      });
      setDeployContractAddress(contract.address);
      setDeployError(false);
    } catch (e: any) {
      setDeployError(true);
      actions.updateConsoleMessages([
        {
          type: "error",
          message: e.message,
        }
      ])
    }

    setDeployLoading(false);
  }

  useEffect(() => {
    if (curModel) {
      methods.reset();
      setSelectedContract(undefined);
      setCompiledContracts(null);
      setCompiledContractKeys(null);
      setDeployContractAddress(undefined);
    }
  }, [modelIndex])

  return (
    <Popover>
      <PopoverHandler>
        <PlayCircleIcon className="w-6 h-6 text-white cursor-pointer"/>
      </PopoverHandler>
      <PopoverContent>
        <div className="mb-4 font-medium">当前部署合约：{curModel ? curModel.model.uri.path.substring(1) : '无'}</div>
        <div className="flex gap-2 mb-4">
          <Button color={error ? 'red' : 'blue'} size="sm" loading={compileLoading} onClick={preDeploy}>
            编译合约
          </Button>
          <Button
            color={deployError ? 'red' : 'blue'}
            disabled={error}
            size="sm"
            onClick={methods.handleSubmit(startDeploy)}
            loading={deployLoading}
          >
            部署
          </Button>
        </div>
        {deployContractAddress && <div>部署成功：${deployContractAddress}</div>}
        <div className="mb-4">
          {compiledContractKeys && (
            <Select
              label="选择合约"
              value={selectedContract}
              onChange={(e) => setSelectedContract(e)}
            >
              {compiledContractKeys.map((key: string, index: number) => (
                <Option key={key + index} value={key}>{key}</Option>
              ))}
            </Select>
          )}
        </div>

        <FormProvider methods={methods}>
          {selectedContractDeployParams.map((item: any) => (
            <RHFInput name={item.name} label={item.name} />
          ))}
        </FormProvider>
      </PopoverContent>
    </Popover>
  )
}

export default Deploy;
