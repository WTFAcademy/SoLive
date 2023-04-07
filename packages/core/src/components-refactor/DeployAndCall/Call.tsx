import {useForm} from "react-hook-form";

import {FormProvider} from "../HookForm";
import RHFSelect from "../HookForm/RHFSelect";

const Call = () => {
  // 第二种方案数据获取
  const methods = useForm({
    defaultValues: {
      callFunction: 'test',
    }
  });
  const {watch} = methods;
  const callFunction = watch('callFunction');
  console.log(callFunction);

  return (
    <div className="h-full w-full">
      {/*1. 是否需要加标题*/}
      {/*<div className="text-primary-100 font-medium text-[14px] py-2 px-2">Call</div>*/}

      {/*2. 处理无数据状态展示*/}

      {/*3. 数据展示*/}
      {/*两种方式*/}
      {/*第一种：*/}
      {/*<FormItemLabel label="ABI" />*/}
      {/*<Select options={[{label: 'test', value: "test"}]} value="test" />*/}
      {/*第二种*/}
      <FormProvider methods={methods}>
        <RHFSelect name="callFunction" label="ABI" options={[{label: 'test', value: "test"}]} />
      </FormProvider>
    </div>
  )
}

export default Call;
