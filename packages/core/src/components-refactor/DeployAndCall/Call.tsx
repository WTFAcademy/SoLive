import {useForm} from "react-hook-form";
import {ContractInterface} from "ethers";
import {useMemo, useRef} from "react";
import { Disclosure } from '@headlessui/react'
import {ChevronUpIcon} from "@heroicons/react/24/outline";

import {useDeployed} from "../../editor/contexts/deployedContext";

import AbiForm from "./AbiForm";

const Call = () => {
  const { compiledContracts } = useDeployed()

  return (
    <div className="h-full w-full overflow-scroll">
      <div className="text-primary-100 font-medium text-[14px] py-2 px-2">Call</div>
      <div className="mt-2">
        {compiledContracts.length === 0 ? <span className="text-primary-100">No contract has been deployed yet.</span> : ''}
        {compiledContracts.map((v) => {
          return <Disclosure key={v.address}>
            {({ open }) => (
              <>
                <Disclosure.Button className="relative box-border w-full py-2 pl-3 pr-10 rounded border-none text-white placeholder:text-[#878E95] text-left bg-[#36384A] focus:outline-none focus:shadow-outline">
                  <span className="block truncate text-[12px] min-h-[12px]">{v.name}</span>
                  <span className="h-fit pointer-events-none absolute inset-y-[3px] right-0 flex items-center pr-2">
                <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5`}
                />
              </span>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-primary-100">
                  <AbiForm abi={v.abi} signerAddress={v.signerAddress} address={v.address} name={v.name} key={v.address} />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        })}
      </div>
    </div>
  );
}

export default Call;
