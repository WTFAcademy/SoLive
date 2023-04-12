import {useMemo, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {ContractInterface, ethers} from "ethers";

import RHFInput from "../HookForm/RHFInput";
import {FormProvider} from "../HookForm";
import RHFSelect from "../HookForm/RHFSelect";
import Button from "../Button";
import {useRelayNetwork} from "../../editor/contexts/relayNetworkContext";
import {useConsole} from "../../editor/contexts/consoleContext";

import AbiInput from "./AbiInput";

const AbiForm = (props: any) => {
  const [loading, setLoading] = useState(false);
  const {providerRef} = useRelayNetwork();
  const {addConsole} = useConsole();
  const abiOptions = (abi: ContractInterface) => {
    if (Array.isArray(abi)) {
      return abi.filter(v => {
        return v.type !== 'constructor' && v.type === 'function'
      }).map(v => {
        return {
          label: v.name,
          value: v.name,
        };
      })
    } else {
      return [];
    }
  }

  const methods = useForm({
    defaultValues: {
      callFunction: '',
      ethAmount: ''
    }
  });
  const {watch} = methods;
  const callFunction = watch('callFunction');
  const ethAmount = watch('ethAmount');
  const abiInputRef = useRef<{ getValues: () => any; watch: (v: string) => any; }>();

  const selectedFunction = useMemo(() => {
    if (Array.isArray(props.abi)) {
      return props.abi.filter((v: { name: string; }) => v.name === callFunction)[0];
    } else {
      return false
    }
  }, [callFunction]);

  const handleSubmit = async () => {
    const submitParams = abiInputRef.current?.getValues();

    setLoading(true);

    try{
      const signer = await providerRef.current.getSigner(props.signerAddress)
      const contract = new ethers.Contract(props.address, props.abi, signer);
      let result
      if(selectedFunction?.stateMutability === "payable") {
        const overrides = {
          value: ethers.utils.parseEther(ethAmount),
        }
        result = await contract[callFunction](...Object.values(submitParams || []), overrides);
      }else{
        result = await contract[callFunction](...Object.values(submitParams || []));
      }
      console.log(result)
      addConsole([
        {
          type: "success",
          message: JSON.stringify(result)
        }
      ]);
    }catch (e) {
      addConsole([
        {
          type: "error",
          message: e
        }
      ]);
    }

    setLoading(false);
  }

  return <FormProvider methods={methods}>
    <RHFSelect name="callFunction" label="ABI" options={abiOptions(props.abi)}/>
    {selectedFunction?.stateMutability === "payable"
      ? <RHFInput name="ethAmount" label="eth amount"/>
      : ''}
    {selectedFunction?.inputs?.length > 0 && (
      <AbiInput ref={abiInputRef} inputs={selectedFunction.inputs}/>
    )}
    {selectedFunction ? <Button type="primary" loading={loading} onClick={handleSubmit}>Submit</Button> : ''}
  </FormProvider>
}

export default AbiForm;
