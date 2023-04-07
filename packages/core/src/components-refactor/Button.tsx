import {HTMLAttributes} from "react";

type TProps = {
  type?: "primary" | "default"
} & HTMLAttributes<HTMLButtonElement>

const Button = ({type = "default", children, className}: TProps) => {
  const commonClasses = "pointer-events-auto rounded-md text-[12px] inline-flex items-center px-3 py-1 cursor-pointer"
  const buttonClasses = type === 'primary' ?
    `${commonClasses} bg-other-600 leading-5 text-white hover:bg-other-500` :
    `${commonClasses} text-white bg-primary-300`

  return (
    <div className={buttonClasses + " " + className}>
      {children}
    </div>
  )
}

export default Button;
