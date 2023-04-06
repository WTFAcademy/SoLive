import NavBar from "../NavBar";
import Input from "../Input";
import Select from "../Select";
import Button from "../Button";

const PlaceholderElement = () => {
  return (
    <div className="truncate h-full inline-flex items-center pl-2 text-[14px] font-medium text-primary-100">
      Deploy & Run Contract
    </div>
  )
}

const DeployAndCall = () => {

  return (
    <div className="w-full h-full bg-primary-700 pt-2">
      <NavBar placeholderElement={<PlaceholderElement />} />
      <div className="px-2 py-2">
        <label className="inline-flex text-primary-100 text-[14px] mb-1">测试1：</label>
        <Input />
        <label className="inline-flex text-primary-100 text-[14px] mb-1 mt-2">测试2：</label>
        <Select options={[{label: 'test', value: "test"}]} value="test" />
        <div className="mt-2" />
        <Button type="primary">测试</Button>
      </div>
    </div>
  )
}

export default DeployAndCall;
