import {Button as TailButton} from "@material-tailwind/react";
import {ButtonProps} from "@material-tailwind/react/components/Button";
import React from "react";

import Loading from "./Loading";

type Props = {
  loading?: boolean;
} & ButtonProps &  React.RefAttributes<HTMLButtonElement>;

const Button = ({loading, children, ...other}: Props) => {

  return (
    <TailButton className="flex items-center gap-2" {...other}>
        {loading && <Loading className="text-sm" />}
        {children}
    </TailButton>
  )
}

export default Button;
