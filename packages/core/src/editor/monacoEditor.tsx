import React, { useEffect, useRef } from 'react';

import BaseMonaco from 'monaco-editor';
import ReactBaseMonacoEditor, { Monaco, loader } from '@monaco-editor/react';
import { ErrorMarker, MarkerSeverity } from 'solive-compiler-utils';

import { BaseMonacoEditor, EditorApi, ModelInfoType } from '../types/monaco';

import { useEditor } from './contexts/editorContext';
import {
  initTheme,
  registerLangs,
  initModels,
  registerCommandsAndActions,
  registerListeners,
} from './mountFunctions';
import CodeParser from './codeParser';
import { findModel } from './utils/model';

loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.37.1/min/vs' } });

interface IProps {
  modelInfos: ModelInfoType[];
  disableValidation?: boolean;
  monacoEditorOptions?: BaseMonaco.editor.IStandaloneEditorConstructionOptions;
}

function App({ modelInfos, disableValidation = false, monacoEditorOptions = {} }: IProps) {
  const {
    stateRef, dispatch, actions, id,
  } = useEditor();
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
    // TODO 目前监听仅有处理语法校验问题，后续状态控制需要特殊处理
    // eslint-disable-next-line no-unused-expressions
    !disableValidation && registerListeners(editor, editorApiRef.current, stateRef.current);
  }

  function handleEditorBeforeMount(monaco: Monaco) {
    monacoRef.current = monaco;
    registerLangs(monaco, stateRef.current);
  }

  useEffect(() => {
    editorApiRef.current.addErrorMarker = (errors: ErrorMarker[], from = id) => {
      const allMarkersPerfile: Record<string, Array<BaseMonaco.editor.IMarkerData>> = {};

      for (const error of errors) {
        const filePath = error.file;

        if (!filePath) return;
        const model = findModel(stateRef.current.models || [], filePath);
        const errorServerityMap = {
          error: MarkerSeverity.Error,
          warning: MarkerSeverity.Warning,
          info: MarkerSeverity.Info,
        };
        if (model!) {
          const markerData: BaseMonaco.editor.IMarkerData = {
            severity: (typeof error.severity === 'string') ? errorServerityMap[error.severity] : error.severity,
            startLineNumber: ((error.position.start && error.position.start.line) || 0),
            startColumn: ((error.position.start && error.position.start.column) || 0),
            endLineNumber: ((error.position.end && error.position.end.line) || 0),
            endColumn: ((error.position.end && error.position.end.column) || 0),
            message: error.message,
          };
          if (!allMarkersPerfile[filePath]) {
            allMarkersPerfile[filePath] = [];
          }
          allMarkersPerfile[filePath].push(markerData);
        }
      }
      for (const filePath in allMarkersPerfile) {
        const model = findModel(stateRef.current.models || [], filePath);
        if (model) {
          monacoRef.current?.editor.setModelMarkers(model.model, from, allMarkersPerfile[filePath]);
        }
      }
    };

    editorApiRef.current.removeErrorMarker = (sources: string[], from = id) => {
      const files = Object.keys(sources);
      for (const file of files) {
        const model = findModel(stateRef.current.models || [], file);
        if (model) {
          monacoRef.current?.editor.setModelMarkers(model.model, from, []);
        }
      }
    };
  }, []);

  return (
    <ReactBaseMonacoEditor
      key={`${id}_editor`}
      onMount={handleEditorDidMount}
      beforeMount={handleEditorBeforeMount}
      defaultLanguage="solidity"
      defaultValue="// some comment"
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        ...monacoEditorOptions,
      }}
    />
  );
}

export default App;
