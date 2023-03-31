import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Controller, useFormContext } from "react-hook-form";
import React from "react";
import { ControllerRenderProps } from "react-hook-form/dist/types/controller";
import { Input } from "@material-tailwind/react";

interface IProps {
  name: string;
  label: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  errorMessage?: string;
  warningMessage?: string;
}

type Props = IProps & React.InputHTMLAttributes<HTMLInputElement>;

export default function RHFArrayInput(props: Props) {
  const { name, label } = props;
  const { register, control } = useFormContext();

  const handleDelete = (index: number, field: ControllerRenderProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const list = [...field.value];
    list.splice(index, 1);
    field.onChange(list);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <div>
            {field.value.map((item: any, index: number) => (
              <div key={index} className="group flex justify-between items-center mb-4">
                <Input
                  label={`${label} ${index + 1}`}
                  {...register(`${name}.${index}`)}
                  onChange={(e) => {
                    const list = [...field.value];
                    list[index] = e.target.value;
                    field.onChange(list);
                  }}
                  value={item}
                />
                <TrashIcon className="w-6 hidden group-hover:inline-block text-red-500 cursor-pointer" onClick={() => handleDelete(index, field)} />
              </div>
            ))}
          </div>
          <div
            className="flex-center cursor-pointer block box-border w-full text-black text-md leading-5 rounded border border-gray-300 border-dashed px-3 py-2 mb-3 placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out"
            onClick={() => field.onChange([...field.value, ""])}
          >
            <PlusIcon className="w-6" />
          </div>
        </div>
      )}
    />
  );
}
