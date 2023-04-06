import React, {Dispatch, SetStateAction} from 'react';

import {ModelInfoType} from '../types/monaco';

import {EditorProvider} from './contexts/editorContext';
import MonacoEditor from './monacoEditor';
import {ConsoleProvider} from "./contexts/consoleContext";
import {DeployProvider} from "./contexts/deployContext";

export type EditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  height: string;
  onSuccess?: Dispatch<SetStateAction<number>>;
  onFailure?: () => void;
  onCompile?: () => void;
  submissionCount?: number;
  children?: any;
};

export default function Editor(
  {
    modelInfos,
    id,
    height
  }: EditorProps
) {
  return (
    <EditorProvider id={id}>
      <ConsoleProvider>
        <DeployProvider>
          <div id="solive-tailwind">
            <MonacoEditor height={height} modelInfos={modelInfos}/>
          </div>
        </DeployProvider>
      </ConsoleProvider>
    </EditorProvider>
  );
}
