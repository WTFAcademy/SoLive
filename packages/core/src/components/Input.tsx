import {forwardRef, HTMLAttributes, LegacyRef} from "react";


type TProps = HTMLAttributes<HTMLInputElement>;

const Input = forwardRef(
  ({className, ...others}: TProps, ref: LegacyRef<HTMLInputElement>) => {
    return (
      <input
        ref={ref}
        className={`box-border w-full py-2 px-2 rounded border-none text-[12px] text-white placeholder:text-[#878E95] bg-[#36384A] focus:outline-none focus:shadow-outline ${className}`}
        {...others}
      />
    )
  }
)

export default Input;
