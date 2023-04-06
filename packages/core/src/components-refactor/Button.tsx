import {HTMLAttributes} from "react";

type TProps = {
  type?: "primary" | "default"
} & HTMLAttributes<HTMLButtonElement>

const Button = ({type = "default", children}: TProps) => {
  const commonClasses = "pointer-events-auto rounded-md text-[14px] inline-flex px-3 py-2 cursor-pointer"
  const buttonClasses = type === 'primary' ?
    `${commonClasses} bg-primary-600 leading-5 text-white hover:bg-primary-500` :
    `${commonClasses} shadow-sm ring-1 ring-primary-300 hover:bg-primary-100`

  return (
    <div className={buttonClasses}>
      {children}
    </div>
  )
}

export default Button;
