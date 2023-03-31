import { Select, Option, Input, Button } from "@material-tailwind/react";
import { useState } from "react";
import { ethers } from 'ethers';

import { useEditor } from "../../editor/editorContext";

interface dataObj {
  [key: string]: any
}

const CallBlock = () => {
  const { id, state, vmProviderRef, actions } = useEditor();
  const [abiItem, setAbiItem] = useState('')
  const [params, setParams] = useState({})
  const [payableAmount, setPayableAmount] = useState('')

  const contractInfo = state.compliedContract || {};
  const abi = contractInfo.abi || [];

  const abiOption = (abiJson: any) => {
    if (!(abiJson instanceof Array)) return ''
    return abiJson.filter(item => {
      return item.type !== 'constructor' && item.type === 'function'
    }).map((v: any, k: any) => {
      return <Option
        key={id + k}
        className="text-black"
        value={JSON.stringify(v)}>
        ({v.stateMutability === 'pure' || v.stateMutability === 'view' ? 'Read' : 'Write'}){v.name ? v.name : v.type}
      </Option>
    })
  }

  const handleInputsChange = (data: any) => {
    const newParam: dataObj = {}
    newParam[data.target.name] = data.target.value
    setParams((prev) => {
      return { ...prev, ...newParam }
    })
  }

  const displayInputs = (item: any) => {
    if (item === '') return ''
    return JSON.parse(item).inputs.map((v: any, k: any) => {
      return <Input variant="standard" key={id + v.name} name={v.name} label={`${v.name}(${v.internalType})`}
        onChange={handleInputsChange} />
    })
  }

  const handleChange = (value: any) => {
    setAbiItem(value)
    setParams({})
  }

  const handleExecute = async () => {
    const a = JSON.parse(abiItem)
    console.log(abiItem)
    console.log(params)
    // vmProviderRef.current.provider;
    const signer = await vmProviderRef.current.getSigner(contractInfo?.signerAddress)
    const contract = new ethers.Contract(contractInfo?.address, abi, signer);
    let result
    try {
      if (a.stateMutability === 'payable') {
        const overrides = {
          value: ethers.utils.parseEther(payableAmount),
        }
        result = await contract[a.name](...Object.values(params || []), overrides);
      } else {
        result = await contract[a.name](...Object.values(params || []));
      }
      if (result === undefined) return
      actions.updateConsoleMessages([{
        type: 'success',
        message: JSON.stringify(result)
      }])
    } catch (e) {
      if (e instanceof Error) {
        actions.updateConsoleMessages([{
          type: 'error',
          message: e.message
        }])
      }
    }

    console.log(result);
  }

  const displayPayableAmount = (item: any) => {
    if (item === '') return ''
    return JSON.parse(abiItem).stateMutability === 'payable'
      ? <Input key={id + 'payableAmount'} name='payableAmount' label='payableAmount(ether)' onChange={(v) => {
        setPayableAmount(v.target.value)
      }} />
      : ''
  }

  return (
    <div className="flex-1 p-4" key={id + "_callBlock"}>
      <Select variant="standard" label="Select function" onChange={handleChange}>
        {abiOption(abi)}
      </Select>
      <div className="mt-6 flex flex-col space-y-4 max-h-[160px] overflow-auto">
        {displayPayableAmount(abiItem)}
        {displayInputs(abiItem)}
        <Button disabled={abiItem === ''} onClick={handleExecute}>Execute</Button>
      </div>
    </div>
  )
}

export default CallBlock;
