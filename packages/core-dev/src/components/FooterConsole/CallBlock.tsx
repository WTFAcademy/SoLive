import {TabPanel} from "@material-tailwind/react";

import {useEditor} from "../../editor/editorContext";


const CallBlock = () => {
  const {id} = useEditor();

  return (
    <div>
      <TabPanel className="text-white" key={id + "_tabPanel_call"} value="call">
        测试CallBlock
      </TabPanel>
    </div>
  )
}

export default CallBlock;
