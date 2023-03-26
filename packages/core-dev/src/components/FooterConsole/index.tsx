import {Allotment} from "allotment";

import {useEditor} from "../../editor/editorContext";

import CallBlock from "./CallBlock";
import ConsoleBlock from "./ConsoleBlock";
import "allotment/dist/style.css";

const FooterConsole = () => {
  const {id} = useEditor();

  return (
    <div key={id + "_footerConsole"} className="flex bg-[#0f172a] text-white p-2 gap-2 rounded-b-lg h-1 min-h-[300px]">
      <Allotment key={id + "_Allotment"}>
        <div className="flex-1 flex-col">
          <div>Execute contract:</div>
          <CallBlock/>
        </div>
        <div className="flex-[2] flex flex-col ml-2">
          <div>Console:</div>
          <ConsoleBlock/>
        </div>
      </Allotment>
    </div>
  )
}

export default FooterConsole;
