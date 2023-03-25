import {TabPanel} from "@material-tailwind/react";

import {useEditor} from "../../editor/editorContext";


const ConsoleBlock = () => {
  const {id} = useEditor();

  return (
    <TabPanel className="text-white" key={id + "_tabPanel_log"} value="log">
      测试ConsoleBlock
    </TabPanel>
  )
}

export default ConsoleBlock;
