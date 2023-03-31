import {getCompilerVersions} from 'solive-solc';
import semver from 'semver';

import {EditorApi} from '../../types/monaco';
import {CompilerInfo} from '../../types/solidity';
import {IEditorInitState} from '../editorContext';
import {cache, getCache} from '../utils/cache';

const COMPILER_INFO_KEY = 'compiler_info';

class ParserVersion {
  editorApi: EditorApi;
  editorState: IEditorInitState;
  allVersions: string[] = [];
  latestVersion = '';
  compilerInfo?: CompilerInfo;

  constructor(editorApi: EditorApi, editorState: IEditorInitState) {
    this.editorApi = editorApi;
    this.editorState = editorState;
  }

  async init() {
    // TODO: Consider the problem of loading failure
    await this.getCompilerInfo();
  }

  resolveCodeVersion(code: string) {
    const rex = new RegExp("(pragma solidity (.+?);)", "g");
    const pragmaArr = code.match(rex)

    if (!pragmaArr) {
      return this.latestVersion;
    }

    const pragmaStr = pragmaArr[0].replace('pragma solidity', '').trim()
    return pragmaStr.substring(0, pragmaStr.length - 1);
  }

  getVersionUri(version: string) {
    const matchVersion = this.matchVersion(version);

    return this.compilerInfo?.releases[matchVersion];
  }

  matchVersion(version: string) {
    const bestVersion = semver.maxSatisfying(this.allVersions, version);
    console.log("bestVersion: ",bestVersion);
    if (!bestVersion) {
      console.warn('No version match, use latest version');
      return this.latestVersion; // This is the latest version
    }

    return bestVersion;
  }

  async getCompilerInfo() {
    const { value: oldCompilerInfo, expired } =
      getCache<CompilerInfo>(COMPILER_INFO_KEY);
    let curCompiler = oldCompilerInfo as CompilerInfo;

    if (!oldCompilerInfo || expired) {
      curCompiler = (await getCompilerVersions()) as CompilerInfo;
      cache(COMPILER_INFO_KEY, curCompiler, { cacheTime: 1000 * 60 * 60 * 24 });
    }

    this.compilerInfo = curCompiler;
    this.allVersions = Object.keys(curCompiler.releases);
    this.latestVersion = curCompiler.latestRelease;

    return curCompiler;
  }

  setVersion() {}
}

export default ParserVersion;
