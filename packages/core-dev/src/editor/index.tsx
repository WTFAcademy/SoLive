import React, {Dispatch, SetStateAction} from 'react';

import {ModelInfoType} from '../types/monaco';

import {EditorProvider} from './editorContext';
import MonacoEditor from './monacoEditor';


export type EditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  onSuccess?: Dispatch<SetStateAction<number>>;
  onFailure?: () => void;
  onCompile?: () => void;
  submissionCount?: number;
  children?: any;
};

export default function Editor(
  {
    modelInfos,
    id
  }: EditorProps
) {
  return (
    <EditorProvider>
      <MonacoEditor modelInfos={modelInfos} id={id}/>
    </EditorProvider>
  );
}
