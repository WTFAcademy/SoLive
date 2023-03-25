import {useState} from "react";

type Lang = 'sol' | 'js';

interface Model {
  lang: Lang;
  filename: string;
}

const TopBar = () => {
  const [models, setModels] = useState([
    {filename: 'HelloWorld.sol', lang: 'sol'},
    {filename: 'HelloWorld.js', lang: 'js'},
  ] as Model[]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (model: Model) => {
    setModels([...models, model]);
    setShowAddModal(false);
  };

  const handleRemove = (model: Model) => {
    setModels(models.filter((m) => m !== model));
  };

  const handleSelect = (model: Model) => {
    // alert(`你选中了文件：${model.filename}`);
  };

  return (
    <div className="h-[50px] rounded-t-lg bg-[#0f172a]">
      {/* 顶部导航栏 */}

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
