import { solidityCompiler, getCompilerVersions } from 'solive-solc';
import {
  EVMVersion,
  Source,
  Language,
  urlFromVersion,
  makeCompilerInput,
} from 'solive-compiler';

import { EditorInitState } from '../editorContext';
import { EditorApi, ModelType, SupportLanguage } from '../../types/monaco';

import ParserVersion from './parserVersion';

class CodeParserCompiler {
  editorApi: EditorApi;
  editorState: EditorInitState;
  compiler: any;
  parseVersion: ParserVersion;

  constructor(
    editorApi: EditorApi,
    editorState: EditorInitState,
    parseVersion: ParserVersion
  ) {
    this.editorApi = editorApi;
    this.editorState = editorState;
    this.parseVersion = parseVersion;
  }

  compile() {
    const currentModel = this.editorState.models![this.editorState.modelIndex!];

    let codeVersion = this.parseVersion.latestVersion;

    try {
      codeVersion = this.parseVersion.resolveCodeVersion(
        currentModel.model.getValue()
      );
    } catch (error) {}
    const versionUrl = this.parseVersion.getVersionUri(codeVersion);
    const imports = this.resolveImports(currentModel);
    const sources = Object.assign(
      {
        [currentModel.filename]: {
          content: currentModel.model.getValue(),
        },
      },
      this.resolveSource(imports)
    );

    // wasm compiler use string config
    const compilerConfig = makeCompilerInput(sources, {
      optimize: true,
      runs: 200,
      language: 'Solidity' as Language,
    });

    // TODO: Consider partial adoption WebAssembly
    return solidityCompiler({
      version: `https://binaries.soliditylang.org/bin/${versionUrl}`,
      input: compilerConfig,
    });
  }

  resolveImports(model: ModelType) {
    const code = model.model.getValue();
    const importRegex = /^\s*import\s+["']([^"']+\.(sol))["']/gm;
    const importHints: string[] = [];
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      let importFilePath = match[1];
      if (importFilePath.startsWith('./')) {
        const path: RegExpExecArray | null = /(.*\/).*/.exec(model.filename);
        importFilePath = path
          ? importFilePath.replace('./', path[1])
          : importFilePath.slice(2);
      }
      if (!importHints.includes(importFilePath))
        importHints.push(importFilePath);
    }

    return importHints;
  }

  resolveSource(imports: string[]): Source {
    const monaco = this.editorState.monaco;

    const find = (value: string): ModelType['model'] => {
      const uri = monaco?.Uri.parse(value);
      return monaco?.editor
        .getModels()
        .find((model) => model.uri.toString() === uri?.toString())!;
    };

    const sources = {};
    imports.forEach((im: string) => {
      if (find(im)) {
        Object.assign(sources, {
          [im]: { content: find(im).getValue() },
        });
      }
    });

    return sources;
  }
}

export default CodeParserCompiler;
