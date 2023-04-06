import {useState} from "react";
import {Bars2Icon} from "@heroicons/react/24/outline";

import {useEditor} from "../../editor/contexts/editorContext";

import CallBlock from "./CallBlock";
import ConsoleBlock from "./ConsoleBlock";

const FooterConsole = () => {
  const {id} = useEditor();
  const [display, setDisplay] = useState(false);

  return (
    <div>
      <div className="flex justify-center items-center bg-[#0f172a] text-zinc-50 h-10 cursor-pointer"
           onClick={() => setDisplay(!display)}>
        {display
          ? <Bars2Icon className="h-6 w-10 text-blue-500" preserveAspectRatio="none meet"/>
          : <Bars2Icon className="h-6 w-10 text-gray-500" preserveAspectRatio="none meet"/>}
      </div>
      <div key={id + "_footerConsole"}
           className={`transition-all duration-500 ease flex bg-[#0f172a] text-white gap-2 rounded-b-lg p-2`}
           style={{height: display ? 300 : 0}}>
        <div className="flex-1 flex-col">
          <div>Execute contract:</div>
          <CallBlock/>
        </div>
        <div className="flex-[2] flex flex-col ml-2">
          <div>Console:</div>
          <ConsoleBlock/>
        </div>
      </div>
    </div>
  )
}

export default FooterConsole;
