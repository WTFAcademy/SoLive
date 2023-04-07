import {ABIParameter} from "solive-compiler-utils";
import {useForm} from "react-hook-form";
import {forwardRef, useImperativeHandle} from "react";

import RHFInput from "./HookForm/RHFInput";
import {FormProvider} from "./HookForm";

type TProps = {
  inputs: ABIParameter[];
  onChange?: (value: any) => void;
  value?: any;
}

const AbiInput = forwardRef(({inputs, value = {}, onChange}: TProps, ref) => {
  const methods = useForm({
    defaultValues: inputs.reduce((acc, cur) => ({
      ...acc,
      [cur.name]: value[cur.name] || cur.type === 'address' ? '0x' : ''
    }), {})
  });

  const {
    watch,
    getValues
  } = methods;

  useImperativeHandle(ref, () => {
    return {
      getValues: () => getValues(),
      watch: () => watch(),
    }
  }, [])

  return (
    <div>
      <FormProvider methods={methods}>
        {inputs.map((input, index) => (
          <RHFInput placeholder={input.type} name={input.name} label={input.name} key={index}/>
        ))}
      </FormProvider>
    </div>
  )
})

export default AbiInput;
