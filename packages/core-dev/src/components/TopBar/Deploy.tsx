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
  const {state, vmProviderRef, actions, id} = useEditor();
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
    resetAll();
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
        abi: abi,
        signerAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
      });
      setDeployContractAddress(contract.address);
      setDeployError(false);
      actions.updateConsoleMessages([
        {
          type: "success",
          message: selectedContract + " - 合约部署成功：" + contract.address
        }
      ])
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

  const resetAll = () => {
    methods.reset();
    setSelectedContract(undefined);
    setCompiledContracts(null);
    setCompiledContractKeys(null);
    setDeployContractAddress(undefined);
  }

  useEffect(() => {
    if (curModel) {
      resetAll();
    }
  }, [modelIndex])

  console.log(compiledContractKeys);

  return (
    <Popover placement="bottom-end">
      <PopoverHandler>
        <PlayCircleIcon className="w-6 h-6 text-white cursor-pointer"/>
      </PopoverHandler>
      <PopoverContent className="z-[10]">
        <div className="mb-4 font-medium">当前部署合约：{curModel ? curModel.model.uri.path.substring(1) : '无'}</div>
        <div className="flex gap-2 mb-4">
          <Button color={error ? 'red' : 'blue'} size="sm" onClick={preDeploy}>
            编译合约
          </Button>
          <Button
            color={deployError ? 'red' : 'blue'}
            disabled={error}
            size="sm"
            onClick={methods.handleSubmit(startDeploy)}
          >
            部署
          </Button>
        </div>
        {deployContractAddress && <div className="mb-4">部署成功, 可查看日志</div>}
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
