import {useEffect, useState} from "react";
import {ClipboardIcon} from "@heroicons/react/24/outline";

type TProps = {
  text: string;
}

const Copy = ({text}: TProps) => {
  const [copy, setCopy] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopy(true);
  };

  useEffect(() => {
    if (copy) {
      setTimeout(() => {
        setCopy(false);
      }, 1000);
    }
  }, [copy])

  return (
    <>
      {!copy && <ClipboardIcon className="w-3 h-3" onClick={copyToClipboard}/>}
      {copy && <span className="text-[12px] text-other-500">Copied!</span>}
    </>
  );
};

export default Copy;
