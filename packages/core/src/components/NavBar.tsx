import {XMarkIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";

type TNavProps<T> = {
  label: string;
  id: string;
  data?: T;
}

type TProps = {
  globalId?: string; // 全局Editor唯一ID
  activeNavId?: string;
  navs?: TNavProps<any>[];
  onClick?: (nav: TNavProps<any>, index: number) => void;
  onDeleteClick?: (nav: TNavProps<any>, index: number) => void;
  placeholderElement?: React.ReactNode;
}

const NavBar = (props: TProps) => {
  const {navs = [], globalId = '', activeNavId, onClick, onDeleteClick, placeholderElement} = props;
  const [activeId, setActiveId] = useState(activeNavId || navs[0]?.id);

  const handleClick = (nav: TNavProps<any>, index: number) => {
    setActiveId(nav.id);
    onClick && onClick(nav, index);
  }

  const handleDeleteClick = (nav: TNavProps<any>, index: number) => {
    onDeleteClick && onDeleteClick(nav, index);
  }

  useEffect(() => {
    if (activeNavId) {
      setActiveId(activeNavId);
    }
  }, [activeNavId])

  return (
    <div className="w-full h-[36px] shrink-0 flex overflow-auto">
      {navs.map((nav, index) => (
        <div
          key={`${globalId}_${nav.id}_${index}`}
          className={"nav " + (nav.id === activeId ? "nav-active" : "") + (nav.id === "empty" ? " nav-empty" : "")}
          onClick={() => handleClick(nav, index)}
        >
          <span>{nav.label}</span>
          {
            nav.id === activeId &&
            <XMarkIcon
              className="absolute right-2 w-3 h-3 cursor-pointer mt-[2px] text-[#94A0B3]"
              onClick={() => handleDeleteClick(nav, index)}
            />
          }
        </div>
      ))}
      <div className="nav-placeholder">
        {placeholderElement}
      </div>
    </div>
  )
}

export default NavBar;
