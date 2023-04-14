import React from "react";

type TProps = {
  children: React.ReactNode;
}

const CssWrapper = ({children}: TProps) => {

  return (
    <div id="solive-tailwind">
      {children}
    </div>
  )
}

export default CssWrapper;
