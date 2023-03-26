import { TabPanel } from "@material-tailwind/react";
import ReactJson from 'react-json-view'

import { useEditor } from "../../editor/editorContext";
import { generateConsoleMessageToShow } from "../../types/console";

const ConsoleBlock = () => {
  const { id, state } = useEditor();

  const consoleMessages = state.consoleMessages || [];
  console.log(consoleMessages)

  return (
    <div key={id + "_consoleBlock"} className="flex-1 max-h-[220px] overflow-auto">
      {consoleMessages.map((item, index) => {
        let data
        try {
          data = JSON.parse(item.message)
        } catch (e) { /* empty */ }
        if (data instanceof Object) {
          return (
            <div key={index} className={`text-sm flex ${item.type === 'error' ? 'text-red-500' : 'text-white'}`}>
              <span>[{new Date(item.timestamp).toLocaleTimeString()}]:</span>
              <ReactJson src={data} theme="ocean" style={{backgroundColor: 'transparent'}} />
            </div>
          )
        } else
        return (
          <div key={index} className={`text-sm ${item.type === 'error' ? 'text-red-500' : 'text-white'}`}>
            {generateConsoleMessageToShow(item).toString()}
          </div>
        )
      })}
    </div>
  )
}

export default ConsoleBlock;
