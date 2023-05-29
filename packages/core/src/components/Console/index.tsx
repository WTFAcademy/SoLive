import { useEffect, useRef } from 'react';

import ReactJson from 'react-json-view';

import NavBar from '../NavBar';
import { useEditor } from '../../editor/contexts/editorContext';
import { generateConsoleMessageToShow } from '../../types/console';
import { useConsole } from '../../editor/contexts/consoleContext';

const NAVS = [
  { label: 'Console', id: 'console' },
  { label: '', id: 'empty' },
];

type TProps = {
  onDeleteClick?: () => void;
}

function Console(props: TProps) {
  const {
    onDeleteClick,
  } = props;
  const { id } = useEditor();
  const { consoles } = useConsole();
  const consoleRef = useRef<HTMLDivElement>(null);

  const consoleMessages = consoles || [];

  const handleDeleteClick = () => onDeleteClick && onDeleteClick();

  useEffect(() => {
    consoleRef.current?.scrollTo(0, consoleRef.current.scrollHeight);
  }, [consoleMessages]);

  return (
    <div key={`${id}_console`} className="h-full flex flex-col flex-1 bg-primary-700 pt-2 rounded-b-[12px]">
      <NavBar globalId={id} navs={NAVS} onDeleteClick={handleDeleteClick} />
      <div ref={consoleRef} className="flex-auto mb-4 text-primary-100 p-2 text-[12px] overflow-scroll">
        {consoleMessages.map((item, index) => {
          let data;
          try {
            data = JSON.parse(item.message);
          } catch (e) { /* empty */ }
          if (data instanceof Object) {
            return (
              <div key={index} className={`flex ${item.type === 'error' ? 'text-red-500' : 'text-white'}`}>
                <span>
                  [
                  {new Date(item.timestamp).toLocaleTimeString()}
                  ]:
                </span>
                <ReactJson src={data} theme="ocean" collapsed style={{ backgroundColor: 'transparent' }} />
              </div>
            );
          } return (
            <div key={index} className={`whitespace-pre-line ${item.type === 'error' ? 'text-red-500' : 'text-white'}`}>
              {generateConsoleMessageToShow(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Console;
