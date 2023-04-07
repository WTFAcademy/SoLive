import React from "react";
// form
import {Controller, useFormContext} from "react-hook-form";

import Select from "../Select";

import ErrorMessage from "./ErrorMessage";
import FormItemLabel from "./FormItemLabel";

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  label: string;
  onChange?: (value: string, option: any) => void;
  errorMessage?: string;
  warningMessage?: string;
  options: { label: string; value: string }[];
}

type Props = IProps & React.HTMLAttributes<HTMLDivElement>;

export default function RHFSelect(
  {
    name,
    label,
    children,
    onChange,
    options,
    errorMessage,
    warningMessage,
    ...other
  }: Props
) {
  const {control} = useFormContext();

  const handleChange = (e: any, field: any) => {
    field.onChange(e);
    onChange && onChange(e);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState: {error}}) => (
        <div className="mb-1">
          <FormItemLabel label={label} />

          <Select
            options={options}
            {...field}
            onChange={(e) => handleChange(e, field)}
            {...other}
          />

          <ErrorMessage error={error || errorMessage || warningMessage}
                        type={!(error && errorMessage) && warningMessage ? "warning" : "error"}/>
        </div>
      )}
    />
  );
}
