import React from "react";

import Loading from "./Loading";

type TProps = {
  children: React.ReactNode;
  type?: "primary" | "default";
  onClick?: () => void;
  className?: string;
  loading?: boolean;
}

const Button = (props: TProps) => {
  const {
    type = "default",
    children,
    loading = false,
    className,
    onClick
  } = props;

  const commonClasses = "pointer-events-auto rounded-md text-[12px] inline-flex items-center px-3 py-1 cursor-pointer"
  const buttonClasses = type === 'primary' ?
    `${commonClasses} bg-other-600 leading-5 text-white hover:bg-other-500` :
    `${commonClasses} text-white bg-primary-300`

  const loadingClasses = loading ? " opacity-50 pointer-events-disabled" : "";

  return (
    <div className={buttonClasses + loadingClasses + " " + className} onClick={onClick}>
      {loading && <Loading className="w-[12px] h-[12px] mr-1"/>}
      {children}
    </div>
  )
}

export default Button;
