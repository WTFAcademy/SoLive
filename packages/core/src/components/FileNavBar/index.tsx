import {useMemo} from "react";
import {PlayIcon} from "@heroicons/react/24/outline";

import NavBar from "../NavBar";
import {useEditor} from "../../editor/contexts/editorContext";

type TProps = {
  onClickRun?: () => void;
}

const FileNavBar = (props: TProps) => {
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
        placeholderElement={(
          <div className="h-full flex items-center justify-end pr-2">
            <PlayIcon className="w-4 h-4 text-primary-100 cursor-pointer" onClick={props.onClickRun} />
          </div>
        )}
      />
    </div>
  )
}

export default FileNavBar;
