import { solidityCompiler } from 'solive-solc';
import {
  Source,
  Language,
  makeCompilerInput,
} from 'solive-compiler-utils';

import { IEditorInitState } from '../editorContext';
import { EditorApi, ModelType } from '../../types/monaco';

import ParserVersion from './parserVersion';
import { cache, getCache } from '../utils/cache';
import axios from 'axios';

class CodeParserCompiler {
  editorApi: EditorApi;
  editorState: IEditorInitState;
  compiler: any;
  parseVersion: ParserVersion;

  constructor(
    editorApi: EditorApi,
    editorState: IEditorInitState,
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
    } catch (error) { /* empty */ }
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
    const importRegex = new RegExp("^\\s*import\\s+[\"']([^\"']+\\.(sol))[\"']", "gm");
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
    const domain = 'github.com';

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
      }else if(im.includes(domain)){
        this.importRemoteFile(im).then(res => {
          Object.assign(sources, res)
        });
      }
    });

    return sources;
  }

  async importRemoteFile(url: string) {
    const fileDomain = 'raw.githubusercontent.com';
    const fileRaw = url.replace('//github.com/', `//${fileDomain}/`).replace('/blob/', '/');
    const fileName = `github:${fileRaw.split(`${fileDomain}/`).pop()}`;
    let fileContent = '';
    if(!!fileName) {
      const cacheFile = getCache(fileName);
      if(cacheFile.value){
        fileContent = cacheFile.value as string;
      }else{
        try{
          const res = await axios.get(fileRaw);
          fileContent = res.data;
          cache(fileName, fileContent, { cacheTime: 1000 * 60 * 60 * 24 });
        }catch(err){
          console.error(`Error fetching file: ${url}`, err);
          throw err;
        }
      }
    }else{
      console.warn('fileName is null');
    }
    return {
      [fileName] : fileContent,
    };
  }
  
}

export default CodeParserCompiler;
