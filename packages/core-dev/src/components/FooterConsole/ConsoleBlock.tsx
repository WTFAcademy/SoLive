import {TabPanel} from "@material-tailwind/react";

import {useEditor} from "../../editor/editorContext";
import {generateConsoleMessageToShow} from "../../types/console";

const ConsoleBlock = () => {
  const {id, state} = useEditor();

  const consoleMessages = state.consoleMessages || [];

  return (
    <div key={id + "_consoleBlock"} className="flex-1 max-h-[220px] overflow-auto">
      {consoleMessages.map((item, index) => (
        <div key={index} className={`text-sm ${item.type === 'error' ? 'text-red-500' : 'text-white'}`}>
            {generateConsoleMessageToShow(item).toString()}
        </div>
      ))}
    </div>
  )
}

export default ConsoleBlock;
