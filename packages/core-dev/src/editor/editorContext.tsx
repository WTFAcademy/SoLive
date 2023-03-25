import React, {useEffect, useMemo, useReducer, useRef, useState} from "react";
import monacoForTypes, { editor } from "monaco-editor";

import { BaseMonacoEditor, ModelType } from "../types/monaco";

import CodeParser from "./codeParser";

export interface EditorInitState {
  editor: editor.IStandaloneCodeEditor | undefined;
  monaco: typeof monacoForTypes | undefined;
  models: ModelType[] | undefined;
  modelIndex: number | undefined;
  consoleMessages: any[];
  codeParser: CodeParser;
  codeParserInitLoading: boolean;
  curAbi: any;
}

export interface EditorReducerActionType {
  type: "updateEditor" |
  "updateMonaco" |
  "updateModels" |
  "updateModelIndex" |
  "updateConsoleMessages" |
  "setCodeParser" |
  "updateCodeParserLoading" |
  "cleanConsoleMessages" |
  "cleanModels" |
  "createCurApi";
  payload: Partial<EditorInitState>;
}

export type EditorReducerAction = {
  updateEditor: (e: BaseMonacoEditor) => void;
  updateMonaco: (m: typeof monacoForTypes) => void;
  updateModels: (m: ModelType[]) => void;
  updateModelIndex: (m: number) => void;
  updateConsoleMessages: (m: any[]) => void;
  setCodeParser: (m: any) => void;
  updateCodeParserLoading: (m: boolean) => void;
  cleanConsoleMessages: () => void;
  cleanModels: () => void;
  createCurApi: (m: any) => void;
}

export type EditorState = {
  state: EditorInitState;
  stateRef: React.MutableRefObject<EditorInitState>;
  dispatch: React.Dispatch<EditorReducerActionType>;
  actions: EditorReducerAction;
  id: string;
}

const EditorContext = React.createContext<EditorState | undefined>(undefined);

// Editor Reducer And State
const editorInitState: EditorInitState = {
  editor: undefined,
  monaco: undefined,
  models: [],
  modelIndex: 0,
  consoleMessages: [],
  codeParser: {} as CodeParser,
  codeParserInitLoading: false,
  curAbi: {}
}

const editorReducer = (state: EditorInitState, action: EditorReducerActionType): EditorInitState => {
  switch (action.type) {
    case "updateEditor":
      return { ...state, editor: action.payload.editor }
    case "updateMonaco":
      return { ...state, monaco: action.payload.monaco }
    case "updateModels":
      return { ...state, models: action.payload.models }
    case "updateModelIndex":
      return { ...state, modelIndex: action.payload.modelIndex }
    case "updateConsoleMessages":
      return { ...state, consoleMessages: action.payload.consoleMessages || [] }
    case "setCodeParser":
      return { ...state, codeParser: action.payload.codeParser || {} as CodeParser }
    case "updateCodeParserLoading":
      return { ...state, codeParserInitLoading: action.payload.codeParserInitLoading || false }
    case "createCurApi":
      return { ...state, curAbi: action.payload.curAbi || {} }
    default:
      return state;
  }
}

// Editor Provider
export function EditorProvider({ children, id }: { children: React.ReactNode, id: string }) {
  const [state, dispatch] = useReducer<React.Reducer<EditorInitState, EditorReducerActionType>>(editorReducer, editorInitState);
  // some provider need to access the state directly
  const stateRef = useRef(state || {});

  const actions: EditorReducerAction = useMemo(() => {
    return {
      updateEditor: (editor: BaseMonacoEditor) => dispatch({ type: "updateEditor", payload: { editor } }),
      updateMonaco: (monaco: typeof monacoForTypes) => dispatch({ type: "updateMonaco", payload: { monaco } }),
      updateModels: (models: ModelType[]) => dispatch({ type: "updateModels", payload: { models } }),
      updateModelIndex: (modelIndex: number) => dispatch({ type: "updateModelIndex", payload: { modelIndex } }),
      updateConsoleMessages: (consoleMessages: any[]) => dispatch({ type: "updateConsoleMessages", payload: { consoleMessages } }),
      setCodeParser: (codeParser: CodeParser) => dispatch({ type: "setCodeParser", payload: { codeParser } }),
      updateCodeParserLoading: (codeParserInitLoading: boolean) => dispatch({ type: "updateCodeParserLoading", payload: { codeParserInitLoading } }),
      cleanModels: () => dispatch({ type: "updateModels", payload: { models: [] } }),
      cleanConsoleMessages: () => dispatch({ type: "updateConsoleMessages", payload: { consoleMessages: [] } }),
      createCurApi: (curAbi: any) => dispatch({ type: "createCurApi", payload: { curAbi } }),
    }
  }, [])

  useEffect(() => {
    stateRef.current = Object.assign(stateRef.current, state || {});
  }, [state]);

  return (
    <EditorContext.Provider value={{ state, dispatch, stateRef, actions, id }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = React.useContext(EditorContext);

  if (context === undefined) {
    throw new Error("useEditor must be used withing a provider");
  }

  return context;
}
