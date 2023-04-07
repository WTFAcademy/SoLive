import NavBar from "../NavBar";
import {useEditor} from "../../editor/contexts/editorContext";

const NAVS = [
  {label: "Deploy", id: "Deploy"},
  {label: "Call", id: "Call"},
  {label: "Console", id: "console"},
];


const Console = () => {
  const {id} = useEditor();

  return (
    <div className="flex-1 bg-primary-700 pt-2 rounded-b-[12px]">
      <NavBar globalId={id} navs={NAVS} />
      <div className="h-full w-full text-primary-100">
          <p>测试</p>
      </div>
    </div>
  )
}

export default Console;
