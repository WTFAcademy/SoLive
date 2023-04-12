import {useMemo} from "react";

import NavBar from "../NavBar";
import {useEditor} from "../../editor/contexts/editorContext";

const FileNavBar = () => {
  const {state, actions, id} = useEditor();

  const models = state.models || [];
  const modelIndex = state.modelIndex || 0;

  const navs = useMemo(() => {
    return models.map((model, index) => ({
      label: model.model.uri.path.substring(1),
      id: model.model.uri.path.substring(1),
      data: model,
    }));
  }, [models, modelIndex])

  return (
    <div className="w-full pt-2">
      <NavBar
        globalId={id}
        navs={navs}
        activeNavId={navs[modelIndex]?.id}
        onClick={(nav, index) => {
          actions.updateModelIndex(index);
          state.editor?.setModel(nav.data.model);
        }}
      />
    </div>
  )
}

export default FileNavBar;
