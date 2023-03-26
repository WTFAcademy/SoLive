import {useEditor} from "../../editor/editorContext";

import Nav from "./Nav";
import Deploy from "./Deploy";

const TopBar = () => {
 const {state, actions, id} = useEditor();

 const models = state.models || [];
 const modelIndex = state.modelIndex || 0;

  return (
    <div className="h-[50px] rounded-t-lg bg-[#0f172a] flex items-center px-4 justify-between">
      <div className="flex items-center gap-1 w-4/5 overflow-auto">
        {models.map((model, index) => (
          <Nav
            key={`${id}_${model.model.uri.path.substring(1)}_${index}`}
            active={index === modelIndex}
            model={model}
            onClick={() => {
              actions.updateModelIndex(index);
              state.editor?.setModel(model.model);
            }}
          />
        ))}
      </div>

      <div className="flex">
        <Deploy />
      </div>
    </div>
  );
};

export default TopBar;
