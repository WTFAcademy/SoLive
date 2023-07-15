import React, { useEffect, useReducer, useRef } from 'react';

import monacoForTypes, { editor } from 'monaco-editor';

import { BaseMonacoEditor, ModelType } from '../../types/monaco';
import CodeParser from '../codeParser';

export interface IEditorInitState {
  editor: editor.IStandaloneCodeEditor | undefined;
  monaco: typeof monacoForTypes | undefined;
  models: ModelType[] | undefined;
  modelIndex: number | undefined;
  codeParser: CodeParser;
  codeParserInitLoading: boolean;
}

export interface IEditorReducerActionType {
  type:
    | 'updateEditor'
    | 'updateMonaco'
    | 'updateModels'
    | 'updateModelIndex'
    | 'setCodeParser'
    | 'updateCodeParserLoading'
    | 'cleanModels';
  payload: Partial<IEditorInitState> & { id?: string };
}

export type TEditorReducerAction = {
  updateEditor: (e: BaseMonacoEditor) => void;
  updateMonaco: (m: typeof monacoForTypes) => void;
  updateModels: (m: ModelType[]) => void;
  updateModelIndex: (m: number) => void;
  setCodeParser: (m: any) => void;
  updateCodeParserLoading: (m: boolean) => void;
  cleanModels: () => void;
};

export type TEditorContext = {
  state: IEditorInitState;
  stateRef: React.MutableRefObject<IEditorInitState>;
  dispatch: React.Dispatch<IEditorReducerActionType>;
  actions: TEditorReducerAction;
  id: string;
};

const EditorContext = React.createContext<TEditorContext | undefined>(
  undefined,
);

// Editor Reducer And State
const editorInitState: IEditorInitState = {
  editor: undefined,
  monaco: undefined,
  models: [],
  modelIndex: 0,
  codeParser: {} as CodeParser,
  codeParserInitLoading: false,
};

const editorReducer = (
  state: IEditorInitState,
  action: IEditorReducerActionType,
): IEditorInitState => {
  switch (action.type) {
    case 'updateEditor':
      return { ...state, editor: action.payload.editor };
    case 'updateMonaco':
      return { ...state, monaco: action.payload.monaco };
    case 'updateModels':
      return { ...state, models: action.payload.models };
    case 'updateModelIndex':
      return { ...state, modelIndex: action.payload.modelIndex };
    case 'setCodeParser':
      return {
        ...state,
        codeParser: action.payload.codeParser || ({} as CodeParser),
      };
    case 'updateCodeParserLoading':
      return {
        ...state,
        codeParserInitLoading: action.payload.codeParserInitLoading || false,
      };
    default:
      return state;
  }
};

const editorStateMap = new Map<string, IEditorInitState>();

// TODO: 待删减拆分后的部分
// Editor Provider
export function EditorProvider({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const [state, dispatch] = useReducer<
    React.Reducer<IEditorInitState, IEditorReducerActionType>
  >(editorReducer, editorInitState);
  const stateRef = useRef<IEditorInitState>(state);
  // some provider need to access the state directly
  const actions: TEditorReducerAction = {
    updateEditor: (editor: BaseMonacoEditor) => dispatch({ type: 'updateEditor', payload: { editor } }),
    updateMonaco: (monaco: typeof monacoForTypes) => dispatch({ type: 'updateMonaco', payload: { monaco } }),
    updateModels: (models: ModelType[]) => dispatch({ type: 'updateModels', payload: { models } }),
    updateModelIndex: (modelIndex: number) => dispatch({ type: 'updateModelIndex', payload: { modelIndex } }),
    setCodeParser: (codeParser: CodeParser) => dispatch({ type: 'setCodeParser', payload: { codeParser } }),
    updateCodeParserLoading: (codeParserInitLoading: boolean) => dispatch({
      type: 'updateCodeParserLoading',
      payload: { codeParserInitLoading },
    }),
    cleanModels: () => dispatch({ type: 'updateModels', payload: { models: [] } }),
  };

  useEffect(() => {
    const oldState = editorStateMap.get(id) || {};
    editorStateMap.set(id, Object.assign(oldState, state || {}));
    stateRef.current = Object.assign(oldState, state || {});
  }, [state, id]);

  const contextState = {
    state,
    dispatch,
    stateRef,
    actions,
    id,
  };
  return (
    <EditorContext.Provider value={contextState}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = React.useContext(EditorContext);

  if (context === undefined) {
    throw new Error('useEditor must be used withing a provider');
  }

  return context;
}
