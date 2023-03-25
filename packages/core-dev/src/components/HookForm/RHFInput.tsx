// form
import { Controller, useFormContext } from "react-hook-form";
import React, { ChangeEvent } from "react";
import { ControllerRenderProps } from "react-hook-form/dist/types/controller";
import { Input, InputProps } from "@material-tailwind/react";

import ErrorMessage from "./ErrorMessage";

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  label: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  errorMessage?: string;
  warningMessage?: string;
}

type Props = IProps & InputProps & React.RefAttributes<HTMLInputElement>;

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
        <div className="relative mb-4">
          {/*<FormItemLabel label={label} />*/}

          <Input label={label} {...field} onChange={(e) => handleChange(e, field)} onBlur={(e) => handleBlur(e, field)} {...other} />

          <ErrorMessage error={error || errorMessage || warningMessage} type={!(error && errorMessage) && warningMessage ? "warning" : "error"} />
        </div>
      )}
    />
  );
}
