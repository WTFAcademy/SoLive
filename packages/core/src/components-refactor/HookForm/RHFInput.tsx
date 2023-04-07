// form
import { Controller, useFormContext } from "react-hook-form";
import React, { ChangeEvent } from "react";
import { ControllerRenderProps } from "react-hook-form/dist/types/controller";

import Input from "../Input";

import ErrorMessage from "./ErrorMessage";
import FormItemLabel from "./FormItemLabel";

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  label: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  errorMessage?: string;
  warningMessage?: string;
}

type Props = IProps & React.HTMLAttributes<HTMLInputElement>;

export default function RHFInput({ name, onChange, onBlur, label, errorMessage, warningMessage, ...other }: Props) {
  const { control } = useFormContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: ControllerRenderProps) => {
    field.onChange(e.target.value);
    onChange?.(e);
  };

  const handleBlur = (e: any, field: ControllerRenderProps) => {
    field.onBlur();
    onBlur?.(e);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="relative mb-2">
          <FormItemLabel label={label} />

          <Input
            {...field}
            onChange={(e: any) => handleChange(e, field)}
            onBlur={(e: any) => handleBlur(e, field)}
            {...other}
          />

          <ErrorMessage error={error || errorMessage || warningMessage} type={!(error && errorMessage) && warningMessage ? "warning" : "error"} />
        </div>
      )}
    />
  );
}
