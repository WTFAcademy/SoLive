import React, { useEffect, useRef } from 'react';
import BaseMonaco from 'monaco-editor';
import ReactBaseMonacoEditor, { Monaco } from "@monaco-editor/react";
import { ErrorMarker, MarkerSeverity } from 'solive-compiler-utils';

import { BaseMonacoEditor, EditorApi, ModelInfoType } from '../types/monaco';
import TopBar from "../components/TopBar";
import FooterConsole from "../components/FooterConsole";

import { useEditor } from "./editorContext";
import {
  initTheme,
  registerLangs,
  initModels,
  registerCommandsAndActions,
  registerListeners,
} from './mountFunctions';
import CodeParser from './codeParser';
import { findModel } from './utils/model';

interface Props {
  modelInfos: ModelInfoType[];
  height: string;
}

function App({modelInfos, height}: Props) {
  const { stateRef, dispatch, actions, id } = useEditor();
  const editorRef = useRef<BaseMonacoEditor>();
  const monacoRef = useRef<Monaco>();
  const editorApiRef = useRef<EditorApi>({} as EditorApi);

  async function handleEditorDidMount(editor: BaseMonacoEditor, monaco: Monaco) {
    editorRef.current = editor;
    actions.updateMonaco(monaco);
    actions.updateEditor(editor);
    actions.updateCodeParserLoading(true);

    initTheme(monaco);
    initModels(monaco, editor, modelInfos, dispatch);
    const codeParser = new CodeParser(editorApiRef.current, stateRef.current);
    await codeParser.parseVersion.init();
    actions.setCodeParser(codeParser);
    actions.updateCodeParserLoading(false);

    registerCommandsAndActions(monaco, editor, dispatch, stateRef.current);
    registerListeners(editor, editorApiRef.current, stateRef.current);
  }

  function handleEditorBeforeMount(monaco: Monaco) {
    monacoRef.current = monaco;
    registerLangs(monaco, stateRef.current);
  }

  useEffect(() => {
    editorApiRef.current.addErrorMarker = (errors: ErrorMarker[], from = id) => {
      const allMarkersPerfile: Record<string, Array<BaseMonaco.editor.IMarkerData>> = {}

      for (const error of errors) {
        const filePath = error.file

        if (!filePath) return
        const model = findModel(stateRef.current.models || [], filePath);
        const errorServerityMap = {
          'error': MarkerSeverity.Error,
          'warning': MarkerSeverity.Warning,
          'info': MarkerSeverity.Info
        }
        if (model) {
          const markerData: BaseMonaco.editor.IMarkerData = {
            severity: (typeof error.severity === 'string') ? errorServerityMap[error.severity] : error.severity,
            startLineNumber: ((error.position.start && error.position.start.line) || 0),
            startColumn: ((error.position.start && error.position.start.column) || 0),
            endLineNumber: ((error.position.end && error.position.end.line) || 0),
            endColumn: ((error.position.end && error.position.end.column) || 0),
            message: error.message,
          }
          if (!allMarkersPerfile[filePath]) {
            allMarkersPerfile[filePath] = []
          }
          allMarkersPerfile[filePath].push(markerData)
        }
      }
      for (const filePath in allMarkersPerfile) {
        const model = findModel(stateRef.current.models || [], filePath);
        if (model) {
          monacoRef.current?.editor.setModelMarkers(model.model, from, allMarkersPerfile[filePath])
        }
      }
    }

    editorApiRef.current.removeErrorMarker = (sources: string[], from = id) => {
        const files = Object.keys(sources);
        for (const file of files) {
          const model = findModel(stateRef.current.models || [], file);
          if (model) {
            monacoRef.current?.editor.setModelMarkers(model.model, from, [])
          }
        }
    }
  }, [])

  return (
    <>
      <TopBar />
      <ReactBaseMonacoEditor
        height={height}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorBeforeMount}
        defaultLanguage="solidity"
        defaultValue="// some comment"
      />
      <FooterConsole />
    </>
  )
}

export default App;
