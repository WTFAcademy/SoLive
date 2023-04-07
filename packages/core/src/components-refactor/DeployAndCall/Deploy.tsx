import {useForm} from "react-hook-form";

import {FormProvider} from "../HookForm";
import RHFInput from "../HookForm/RHFInput";
import RHFSelect from "../HookForm/RHFSelect";
import Button from "../Button";


const Deploy = () => {
  const methods = useForm({
    defaultValues: {
      environment: 'test',
      account: 'test',
      gasLimit: 25000,
      value: 0,
    }
  });

  return (
    <div className="h-full w-full flex gap-2">
      <FormProvider methods={methods}>
        <RHFSelect name="environment" label="Environment" options={[{label: 'test', value: "test"}]} />
        <RHFSelect name="account" label="Account" options={[{label: 'test', value: "test"}]} />
        <div className="flex justify-between gap-3">
          <RHFInput name="gasLimit" label="Gas Limit" />
          <RHFInput name="value" label="Value" />
        </div>
        <RHFSelect name="contract" label="Contract" options={[]} />
        <div className="flex justify-end gap-2 mt-2">
          <Button type="default">Compile</Button>
          <Button type="primary">Deploy</Button>
        </div>
      </FormProvider>
    </div>
  )
}

export default Deploy;
