import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/solid";
import {Fragment, useMemo, useState} from "react";

type TProps = {
  value?: any;
  onChange?: (value: any) => void;
  options: { label: string; value: any; }[];
}

const Select = ({options, value, onChange}: TProps) => {

  const selectedOpt = useMemo(() => options.find(opt => opt.value === value), [options, value]);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button
          className="box-border w-full py-2 pl-3 pr-10 rounded border-none text-white placeholder:text-[#878E95] text-left bg-[#36384A] focus:outline-none focus:shadow-outline">
          <span className="block truncate text-[14px] min-h-[14px]">{selectedOpt?.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="list-none ps-0 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((opt, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({active}) =>
                  `relative cursor-default select-none hover:bg-gray-800 py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={opt.value}
              >
                {({selected}) => (
                  <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {opt.label}
                      </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                        </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default Select;
