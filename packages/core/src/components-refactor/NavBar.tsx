import {XMarkIcon} from "@heroicons/react/24/solid";
import React, {useState} from "react";

type TNavProps<T> = {
  label: string;
  id: string;
  data?: T;
}

type TProps = {
  navs: TNavProps<any>[];
  onClick?: (id: string, data?: any) => void;
}

const NavBar = (props: TProps) => {
  const {navs, onClick} = props;
  const [activeId, setActiveId] = useState(navs[0].id);

  const handleClick = (nav: TNavProps<any>) => {
    setActiveId(nav.id);
    onClick && onClick(nav.id, nav.data);
  }

  return (
    <div className="w-full h-[40px] flex">
      {navs.map(nav => (
        <div
          className={"nav " + (nav.id === activeId ? "nav-active" : "")}
          onClick={() => handleClick(nav)}
        >
          <span>{nav.label}</span>
          {nav.id === activeId && <XMarkIcon className="absolute right-2 w-3 h-3 cursor-pointer mt-[2px] text-[#94A0B3]"/>}
        </div>
      ))}
      <div className="nav-placeholder"/>
    </div>
  )
}

export default NavBar;
