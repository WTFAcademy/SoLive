import {XCircleIcon} from "@heroicons/react/24/solid";

import LangIcon from "./LangIcon";

interface IProps {
  model: any;
  active?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}

const Nav = ({model, active, onClick, onDelete}: IProps) => {
  const activeClass = active ? 'bg-white/10' : '';

  return (
    <div
      className={`group flex items-center hover:bg-white/10 rounded py-2 px-3 text-white font-medium text-sm cursor-pointer ${activeClass}`}
      onClick={onClick}
    >
      <LangIcon language={model.language} />
      <span>{model.model.uri.path.substring(1)}</span>
      <XCircleIcon className="w-5 h-5 text-gray-400 group-hover:inline-block hidden" />
    </div>
  )
}

export default Nav;
