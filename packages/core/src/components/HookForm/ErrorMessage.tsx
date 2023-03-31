import React from "react";
import { FieldError } from "react-hook-form";

interface ErrorMessageProps {
  type?: "error" | "warning";
  error?: FieldError | string;
  useIcon?: boolean;
}

const ErrorMessage = (props: ErrorMessageProps) => {
  const { error, useIcon, type = "error" } = props;

  if (!error) {
    return null;
  }

  const errorMessage = typeof error === "string" ? error : error.message;
  const color = type === "error" ? "text-red-500" : "text-lime-500";
  return <p className={String(color)}>{typeof error === "string" ? error : error.message}</p>;
};

export default ErrorMessage;
