import React, {Dispatch, SetStateAction} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {ThemeProvider} from "@mui/material";

import { ModelInfoType } from '../types/monaco';

import { EditorProvider } from './editorContext';
import MonacoEditor from './monacoEditor';
import theme from "./theme";


export type EditorProps = {
  id: string;
  modelInfos: ModelInfoType[];
  onSuccess?: Dispatch<SetStateAction<number>>;
  onFailure?: () => void;
  onCompile?: () => void;
  submissionCount?: number;
  children?: any;
};

export default function Editor({
  modelInfos,
  id
}: EditorProps) {
  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <EditorProvider>
          <MonacoEditor modelInfos={modelInfos} id={id} />
        </EditorProvider>
      </DndProvider>
    </ThemeProvider>
  );
}
