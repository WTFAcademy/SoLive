import React from "react";
// form
import { Controller, useFormContext } from "react-hook-form";
import { Select } from "@material-tailwind/react";
import { SelectProps } from "@material-tailwind/react/components/Select";

import ErrorMessage from "./ErrorMessage";

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  label: string;
  children: any;
  onChange?: (value: string, option: any) => void;
  errorMessage?: string;
  warningMessage?: string;
}

type Props = IProps & SelectProps & React.RefAttributes<HTMLDivElement>;

export default function RHFSelect({ name, label, children, onChange, errorMessage, warningMessage, ...other }: Props) {
  const { control } = useFormContext();

  const handleChange = (e: any, feild: any) => {
    feild.onChange(e);
    onChange && onChange(e);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          {/*<FormItemLabel label={label} />*/}

          <Select {...field} label={label} onChange={(e) => handleChange(e, field)} {...other}>
            {children}
          </Select>

          <ErrorMessage error={error || errorMessage || warningMessage} type={!(error && errorMessage) && warningMessage ? "warning" : "error"} />
        </div>
      )}
    />
  );
}
