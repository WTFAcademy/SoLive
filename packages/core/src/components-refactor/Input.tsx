import {HTMLAttributes} from "react";


type TProps = {

} & HTMLAttributes<HTMLInputElement>;

const Input = ({className, ...others}: TProps) => {
  return (
    <input
      className={`box-border w-full py-2 pl-3 pr-10 rounded border-none text-white placeholder:text-[#878E95] bg-[#36384A] focus:outline-none focus:shadow-outline ${className}`}
      {...others}
    />
  )
}

export default Input;
