import { EditorApi } from '../../types/monaco';
import { EditorInitState } from '../editorContext';

import CodeParserCompiler from './codeParserCompiler';
import ParserVersion from './parserVersion';

class CodeParser {
  compilerService: CodeParserCompiler;
  parseVersion: ParserVersion;

  constructor(editorApi: EditorApi, editorState: EditorInitState) {
    this.parseVersion = new ParserVersion(editorApi, editorState);
    console.log(this.parseVersion);
    
    this.compilerService = new CodeParserCompiler(
      editorApi,
      editorState,
      this.parseVersion
    );
  }
}

export default CodeParser;
