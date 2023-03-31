import { Monaco } from '@monaco-editor/react';
import BaseMonaco from 'monaco-editor';

import { IEditorInitState } from '../../editorContext';
import { findModel } from '../../utils/model';
import { ModelType } from '../../../types/monaco';

export class DefinitionProvider
  implements BaseMonaco.languages.DefinitionProvider {
  monaco: Monaco;
  state: IEditorInitState;

  constructor(monaco: Monaco, state: IEditorInitState) {
    this.monaco = monaco;
    this.state = state;
  }

  provideDefinition(
    model: BaseMonaco.editor.ITextModel,
    position: BaseMonaco.Position,
    token: BaseMonaco.CancellationToken
  ): BaseMonaco.languages.ProviderResult<BaseMonaco.languages.Definition> {
    // throw new Error('Method not implemented.');
    const line = model.getLineContent(position.lineNumber)
    const wordAtPosition = model.getWordAtPosition(position);
    // 检测是否为import语句
    const checkResult = /import [',"].+[',"];/.test(line)
    if (checkResult) {
      const filePath = line.match(new RegExp(`(?<=[',"])(.+?)(?=[',"])`, 'g'))
      if (filePath === null) { return null }
      const nextModel = findModel(this.state.models as ModelType[], filePath[0]?.replace('./', ''))
      return {
        uri: nextModel?.model.uri as BaseMonaco.Uri,
        // uri: model.uri,
        range: {
          startColumn: 1,
          startLineNumber: 1,
          endColumn: 1,
          endLineNumber: 1,
        },
      };
    } else {
      return null
    }
  }
}
