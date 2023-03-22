import { Monaco } from '@monaco-editor/react';
import BaseMonaco from 'monaco-editor';

import { EditorInitState } from '../../editorContext';

export class DefinitionProvider
  implements BaseMonaco.languages.DefinitionProvider
{
  monaco: Monaco;
  state: EditorInitState;

  constructor(monaco: Monaco, state: EditorInitState) {
    this.monaco = monaco;
    this.state = state;
  }

  provideDefinition(
    model: BaseMonaco.editor.ITextModel,
    position: BaseMonaco.Position,
    token: BaseMonaco.CancellationToken
  ): BaseMonaco.languages.ProviderResult<BaseMonaco.languages.Definition> {
    // throw new Error('Method not implemented.');

    return null;
  }
}
