import {Disclosure} from '@headlessui/react'
import {ChevronUpIcon} from "@heroicons/react/24/outline";

import {useDeployed} from "../../editor/contexts/deployedContext";

import AbiForm from "./AbiForm";

const Call = () => {
  const {compiledContracts} = useDeployed()

  return (
    <div className="h-full w-full overflow-scroll">
      <div className="text-primary-100 font-medium text-[14px] py-2 px-2">
        <span>Call</span>
        <span className="text-primary-100 text-[10px] ml-1 inline-flex">上拉展示</span>
      </div>
      <div className="mt-2">
        {compiledContracts.length === 0 ?
          <span className="text-primary-100">No contract has been deployed yet.</span> : ''}
        {compiledContracts.map((v) => {
          return <div className="mt-2" key={v.address}>
            <Disclosure key={v.address}>
              {({open}) => (
                <>
                  <Disclosure.Button
                    className="flex items-center justify-between box-border w-full py-2 px-2 rounded border-none text-white placeholder:text-[#878E95] text-left bg-[#36384A] focus:outline-none focus:shadow-outline">
                    <span className="block truncate text-[12px] min-h-[12px]">{v.name}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-3 w-3 transition-transform duration-200 ease-in-out`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-primary-100">
                    <AbiForm abi={v.abi} signerAddress={v.signerAddress} address={v.address} name={v.name}
                             key={v.address}/>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        })}
      </div>
    </div>
  );
}

export default Call;
