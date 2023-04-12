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
  widget?: React.ReactNode;
}

type Props = IProps & React.HTMLAttributes<HTMLDivElement>;

const RHFSelect = (
  {
    name,
    label,
    children,
    onChange,
    options,
    errorMessage,
    warningMessage,
    widget,
    ...other
  }: Props
) => {
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
        <div className="mb-2">
          <FormItemLabel label={label}>
            {widget}
          </FormItemLabel>

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

export default RHFSelect;
