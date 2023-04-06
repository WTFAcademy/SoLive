import {XMarkIcon} from "@heroicons/react/24/solid";
import React, {useState} from "react";

type TNavProps<T> = {
  label: string;
  id: string;
  data?: T;
}

type TProps = {
  navs?: TNavProps<any>[];
  onClick?: (id: string, data?: any) => void;
  placeholderElement?: React.ReactNode;
}

const NavBar = (props: TProps) => {
  const {navs = [], onClick, placeholderElement} = props;
  const [activeId, setActiveId] = useState(navs[0]?.id);

  const handleClick = (nav: TNavProps<any>) => {
    setActiveId(nav.id);
    onClick && onClick(nav.id, nav.data);
  }

  return (
    <div className="w-full h-[36px] flex overflow-auto">
      {navs.map(nav => (
        <div
          key={nav.id}
          className={"nav " + (nav.id === activeId ? "nav-active" : "") + (nav.id === "empty" ? " nav-empty" : "")}
          onClick={() => handleClick(nav)}
        >
          <span>{nav.label}</span>
          {nav.id === activeId && <XMarkIcon className="absolute right-2 w-3 h-3 cursor-pointer mt-[2px] text-[#94A0B3]"/>}
        </div>
      ))}
      <div className="nav-placeholder">
        {placeholderElement}
      </div>
    </div>
  )
}

export default NavBar;
