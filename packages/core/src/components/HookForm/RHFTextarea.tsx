// form
import { Controller, useFormContext } from "react-hook-form";
import React from "react";
import { Textarea } from "@material-tailwind/react";
import { TextareaProps } from "@material-tailwind/react/components/Textarea";

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

type Props = IProps & TextareaProps & React.RefAttributes<HTMLDivElement>;

export default function RHFTextArea({ name, label, onChange, onBlur, errorMessage, warningMessage, ...other }: Props) {
  const { control } = useFormContext();

  const handleChange = (e: any, feild: any) => {
    feild.onChange(e.target.value);
    onChange && onChange(e);
  };

  const handleBlur = (e: any, feild: any) => {
    feild.onBlur(e.target.value);
    onBlur && onBlur(e);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label className="form-label">{label}</label>
          <Textarea {...field} onChange={(e) => handleChange(e, field)} onBlur={(e) => handleBlur(e, field)} {...other} />
          <ErrorMessage error={error || errorMessage || warningMessage} type={!(error && errorMessage) && warningMessage ? "warning" : "error"} />
        </div>
      )}
    />
  );
}
