import React from "react";

interface TProps {
  label: string;
  children?: React.ReactNode;
}

const FormItemLabel = ({label, children}: TProps) => {
  return (
    <div className="flex justify-between items-center text-primary-100">
      <label className="text-[12px]">{label}</label>
      {children}
    </div>
  );
};

export default FormItemLabel;
