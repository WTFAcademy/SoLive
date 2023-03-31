import BaseMonaco, { editor } from 'monaco-editor';
import { ErrorMarker } from 'solive-compiler-utils';

export type BaseMonacoEditor = BaseMonaco.editor.IStandaloneCodeEditor;

export type ModelsInfoType = ModelInfoType[];

export type ModelType = ModelInfoType & { model: editor.ITextModel };

export enum SupportLanguage {
  Solidity = 'solidity',
}

export class ModelInfoType {
  notInitial?: boolean;
  shown?: boolean;
  readOnly?: boolean;
  tested?: boolean;
  filename = '';
  value = '';
  language: SupportLanguage = SupportLanguage.Solidity;

  constructor({
    notInitial = false,
    shown = false,
    readOnly = false,
    tested = false,
    filename = '',
    value = '',
    language = SupportLanguage.Solidity,
  }: Partial<ModelInfoType> = {}) {
    this.filename = filename;
    this.value = value;
    this.language = language;
    this.notInitial = notInitial;
    this.shown = shown;
    this.readOnly = readOnly;
    this.tested = tested;
  }
}

export type EditorApi = {
  addErrorMarker: (errors: ErrorMarker[], from?: string) => void;
  removeErrorMarker: (sources: string[], from?: string) => void;
};
