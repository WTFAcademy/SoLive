import { EditorApi } from '../../types/monaco';
import { IEditorInitState } from '../editorContext';

import CodeParserCompiler from './codeParserCompiler';
import ParserVersion from './parserVersion';

class CodeParser {
  compilerService: CodeParserCompiler;
  parseVersion: ParserVersion;

  constructor(editorApi: EditorApi, editorState: IEditorInitState) {
    this.parseVersion = new ParserVersion(editorApi, editorState);

    this.compilerService = new CodeParserCompiler(
      editorApi,
      editorState,
      this.parseVersion
    );
  }
}

export default CodeParser;
