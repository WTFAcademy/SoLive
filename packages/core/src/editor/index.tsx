import React, { Dispatch, SetStateAction } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// import dynamic from "next/dynamic";
// let MonacoEditor = dynamic(() => import("./monacoEditor"), { ssr: false });
import { Provider } from '@remix-project/remix-simulator';

import { ModelInfoType } from '../types/monaco';

import { EditorProvider } from './editorContext';
import MonacoEditor from './monacoEditor';


new Provider()


export type EditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  onSuccess?: Dispatch<SetStateAction<number>>;
  onFailure?: Function;
  submissionCount?: number;
  children?: any;
};

export default function Editor({
  modelInfos,
  id
}: EditorProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <EditorProvider>
        <MonacoEditor modelInfos={modelInfos} id={id} />
      </EditorProvider>
    </DndProvider>
  );
}
