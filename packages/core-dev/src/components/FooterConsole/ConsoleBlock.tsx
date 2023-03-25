import {TabPanel} from "@material-tailwind/react";

import {useEditor} from "../../editor/editorContext";
import {generateConsoleMessageToShow} from "../../types/console";


const ConsoleBlock = () => {
  const {id, state} = useEditor();

  const consoleMessages = state.consoleMessages || [];

  return (
    <TabPanel className="text-white max-h-[100px] overflow-auto" key={id + "_tabPanel_log"} value="log">
      {consoleMessages.map((item, index) => (
        <div key={index} className={`text-sm ${item.type === 'error' ? 'text-red-500' : 'text-white'}`}>
          {generateConsoleMessageToShow(item).toString()}
        </div>
      ))}
    </TabPanel>
  )
}

export default ConsoleBlock;
