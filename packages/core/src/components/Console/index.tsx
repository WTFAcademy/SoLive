import ReactJson from "react-json-view";

import NavBar from "../NavBar";
import {useEditor} from "../../editor/contexts/editorContext";
import {generateConsoleMessageToShow} from "../../types/console";
import {useConsole} from "../../editor/contexts/consoleContext";

const NAVS = [
  {label: "Console", id: "console"},
  {label: "", id: "empty"},
];


const Console = () => {
  const { id } = useEditor();
  const {consoles} = useConsole();

  const consoleMessages = consoles || [];

  return (
    <div key={id + "_console"} className="h-full flex flex-col flex-1 bg-primary-700 pt-2 rounded-b-[12px]">
      <NavBar globalId={id} navs={NAVS} />
      <div className="flex-auto mb-4 text-primary-100 p-2 text-[12px] overflow-scroll">
        {consoleMessages.map((item, index) => {
          let data
          try {
            data = JSON.parse(item.message)
          } catch (e) { /* empty */ }
          if (data instanceof Object) {
            return (
              <div key={index} className={`flex ${item.type === 'error' ? 'text-red-500' : 'text-white'}`}>
                <span>[{new Date(item.timestamp).toLocaleTimeString()}]:</span>
                <ReactJson src={data} theme="ocean" style={{backgroundColor: 'transparent'}} />
              </div>
            )
          } else
            return (
              <div key={index} className={`${item.type === 'error' ? 'text-red-500' : 'text-white'}`}>
                {generateConsoleMessageToShow(item).toString()}
              </div>
            )
        })}
      </div>
    </div>
  )
}

export default Console;
