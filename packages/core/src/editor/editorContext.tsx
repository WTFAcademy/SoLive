import React, {useEffect, useMemo, useReducer, useRef, useState} from "react";
import monacoForTypes, {editor} from "monaco-editor";
import VmProvider from "solive-provider";

import {BaseMonacoEditor, ModelType} from "../types/monaco";
import {createConsoleMessage, TConsoleMessage, TInputConsoleMessage} from "../types/console";
import {TCompiledContract} from "../types/contract";

import CodeParser from "./codeParser";

export interface IEditorInitState {
  editor: editor.IStandaloneCodeEditor | undefined;
  monaco: typeof monacoForTypes | undefined;
  models: ModelType[] | undefined;
  modelIndex: number | undefined;
  consoleMessages: TConsoleMessage[];
  codeParser: CodeParser;
  codeParserInitLoading: boolean;
  compliedContract: TCompiledContract;
}

export interface IEditorReducerActionType {
  type: "updateEditor" |
    "updateMonaco" |
    "updateModels" |
    "updateModelIndex" |
    "updateConsoleMessages" |
    "setCodeParser" |
    "updateCodeParserLoading" |
    "cleanConsoleMessages" |
    "cleanModels" |
    "updateCompilerContract";
  payload: Partial<IEditorInitState> & { id?: string };
}

export type TEditorReducerAction = {
  updateEditor: (e: BaseMonacoEditor) => void;
  updateMonaco: (m: typeof monacoForTypes) => void;
  updateModels: (m: ModelType[]) => void;
  updateModelIndex: (m: number) => void;
  updateConsoleMessages: (m: TInputConsoleMessage[]) => void;
  setCodeParser: (m: any) => void;
  updateCodeParserLoading: (m: boolean) => void;
  cleanConsoleMessages: () => void;
  cleanModels: () => void;
  updateCompilerContract: (m: TCompiledContract) => void;
}

export type TEditorContext = {
  state: IEditorInitState;
  stateRef: React.MutableRefObject<IEditorInitState>;
  vmProviderRef: React.MutableRefObject<VmProvider>;
  dispatch: React.Dispatch<IEditorReducerActionType>;
  actions: TEditorReducerAction;
  id: string;
}

const EditorContext = React.createContext<TEditorContext | undefined>(undefined);

// Editor Reducer And State
const editorInitState: IEditorInitState = {
  editor: undefined,
  monaco: undefined,
  models: [],
  modelIndex: 0,
  consoleMessages: [],
  codeParser: {} as CodeParser,
  codeParserInitLoading: false,
  compliedContract: {} as TCompiledContract,
}

const editorReducer = (state: IEditorInitState, action: IEditorReducerActionType): IEditorInitState => {
  switch (action.type) {
    case "updateEditor":
      return {...state, editor: action.payload.editor}
    case "updateMonaco":
      return {...state, monaco: action.payload.monaco}
    case "updateModels":
      return {...state, models: action.payload.models}
    case "updateModelIndex":
      return {...state, modelIndex: action.payload.modelIndex}
    case "updateConsoleMessages":
      return {
        ...state,
        consoleMessages: [
          ...(action.payload.consoleMessages || []),
          ...state.consoleMessages,
        ]
      }
    case "setCodeParser":
      return {...state, codeParser: action.payload.codeParser || {} as CodeParser}
    case "updateCodeParserLoading":
      return {...state, codeParserInitLoading: action.payload.codeParserInitLoading || false}
    case "updateCompilerContract":
      return {...state, compliedContract: action.payload.compliedContract || {} as TCompiledContract}
    default:
      return state;
  }
}

const editorStateMap = new Map<string, IEditorInitState>();

// Editor Provider
export function EditorProvider({children, id}: { children: React.ReactNode, id: string }) {
  const [state, dispatch] = useReducer<React.Reducer<IEditorInitState, IEditorReducerActionType>>(editorReducer, editorInitState);
  const vmProviderRef = useRef<VmProvider>(new VmProvider());
  const stateRef = useRef<IEditorInitState>(state);
  // some provider need to access the state directly
  const actions: TEditorReducerAction = useMemo(() => {
    return {
      updateEditor: (editor: BaseMonacoEditor) => dispatch({type: "updateEditor", payload: {editor}}),
      updateMonaco: (monaco: typeof monacoForTypes) => dispatch({type: "updateMonaco", payload: {monaco}}),
      updateModels: (models: ModelType[]) => dispatch({type: "updateModels", payload: {models}}),
      updateModelIndex: (modelIndex: number) => dispatch({type: "updateModelIndex", payload: {modelIndex}}),
      setCodeParser: (codeParser: CodeParser) => dispatch({type: "setCodeParser", payload: {codeParser}}),
      updateCodeParserLoading: (codeParserInitLoading: boolean) => dispatch({
        type: "updateCodeParserLoading",
        payload: {codeParserInitLoading}
      }),
      cleanModels: () => dispatch({type: "updateModels", payload: {models: []}}),
      updateConsoleMessages: (consoleMessages: TInputConsoleMessage[]) => dispatch({
        type: "updateConsoleMessages",
        payload: {consoleMessages: consoleMessages.map(msg => createConsoleMessage(msg))}
      }),
      cleanConsoleMessages: () => dispatch({type: "updateConsoleMessages", payload: {consoleMessages: []}}),
      updateCompilerContract: (compliedContract: TCompiledContract) => dispatch({
        type: "updateCompilerContract",
        payload: {compliedContract}
      }),
    }
  }, [])

  useEffect(() => {
    const oldState = editorStateMap.get(id) || {};
    editorStateMap.set(id, Object.assign(oldState, state || {}));
    stateRef.current = Object.assign(oldState, state || {});
  }, [state, id]);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        stateRef,
        vmProviderRef,
        actions,
        id
      }}
    >
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
