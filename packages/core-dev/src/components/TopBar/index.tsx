
import {PlayCircleIcon} from "@heroicons/react/24/solid"

import {useEditor} from "../../editor/editorContext";

import Nav from "./Nav";

const TopBar = () => {
 const {state, actions, id} = useEditor();

 const models = state.models || [];
 const modelIndex = state.modelIndex || 0;

  return (
    <div className="h-[50px] rounded-t-lg bg-[#0f172a] flex items-center px-4 justify-between">
      <div className="flex items-center gap-1">
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
        <PlayCircleIcon className="w-6 h-6 text-white cursor-pointer" />
      </div>
      {/*<Nav models={models} onFileDelete={handleRemove} onFileSelect={handleSelect} onFileAdd={handleAdd} />*/}

      {/*/!* 添加新文件 *!/*/}
      {/*<button*/}
      {/*  className="fixed bottom-4 right-4 p-3 bg-green-500 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"*/}
      {/*  onClick={() => setShowAddModal(true)}*/}
      {/*>*/}
      {/*  <PlusCircleIcon className="w-6 h-6" />*/}
      {/*</button>*/}

      {/*{showAddModal && (*/}
      {/*  // 添加新文件的弹出框*/}
      {/*  <AddModel onSubmit={handleAdd} />*/}
      {/*)}*/}
    </div>
  );
};

export default TopBar;
