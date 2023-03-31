import {Monaco} from '@monaco-editor/react';
import {IPosition} from 'monaco-editor';
import * as helper from 'solive-compiler-utils';
import {ErrorMarker} from 'solive-compiler-utils';
import debounce from "lodash/debounce";

import {
  BaseMonacoEditor,
  EditorApi,
  ModelInfoType,
  ModelType,
  SupportLanguage,
} from '../types/monaco';

import {IEditorInitState} from './editorContext';
import {DefinitionProvider} from './providers/definition/provider';
import {
  solidityLanguageConfig,
  solidityTokensProvider,
} from './syntaxes/solidity';
import {findModel} from './utils/model';

function initTheme(monaco: Monaco) {
  monaco.editor.defineTheme('myCustomTheme', {
    "base": "vs-dark",
    "inherit": true,
    "rules": [],
    "colors": {
      "editor.foreground": "#ffffff",
      "editor.background": "#1e293b",
      "editor.selectionBackground": "#6280AC",
      "editor.lineHighlightBackground": "#ffffff12",
    }
  });
  monaco.editor.setTheme('myCustomTheme');
}

function initModels(
  monaco: Monaco,
  editor: BaseMonacoEditor,
  modelInfos: ModelInfoType[],
  dispatch: any,
  overWriteExisting = false
) {
  addModels(monaco, editor, 0, modelInfos, [], dispatch, overWriteExisting);
}

// this state link to the editor state
function registerLangs(monaco: Monaco, state: IEditorInitState) {
  // Register a new language
  monaco.languages.register({id: SupportLanguage.Solidity});

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider(
    SupportLanguage.Solidity,
    solidityTokensProvider as any
  );
  monaco.languages.setLanguageConfiguration(
    SupportLanguage.Solidity,
    solidityLanguageConfig as any
  );

  monaco.languages.registerDefinitionProvider(
    SupportLanguage.Solidity,
    new DefinitionProvider(monaco, state)
  );

  registerFileCompletion(monaco);
  registerFileImports(monaco, state);
}

function registerCommandsAndActions(monaco: Monaco, editor: BaseMonacoEditor, dispatch: any, stateRef: IEditorInitState) {
  // save
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    // save
    editor.saveViewState();
    // editor.getAction('editor.action.formatDocument').run();
  });

  // add context menu items
  const zoominAction = {
    id: 'zoomIn',
    label: 'Zoom In',
    contextMenuOrder: 0, // choose the order
    contextMenuGroupId: 'zooming', // create a new grouping
    keybindings: [
      // eslint-disable-next-line no-bitwise
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal,
    ],
    run: () => {
      editor.updateOptions({fontSize: Number(editor.getOption(46)) + 1});
    },
  };
  const zoomOutAction = {
    id: 'zoomOut',
    label: 'Zoom Out',
    contextMenuOrder: 0, // choose the order
    contextMenuGroupId: 'zooming', // create a new grouping
    keybindings: [
      // eslint-disable-next-line no-bitwise
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus,
    ],
    run: () => {
      editor.updateOptions({fontSize: Number(editor.getOption(46)) - 1});
    },
  };

  editor.addAction(zoomOutAction);
  editor.addAction(zoominAction);

  // @ts-ignore
  const editorService = editor._codeEditorService;
  const openEditorBase = editorService.openCodeEditor.bind(editorService);
  editorService.openCodeEditor = async (input: any, source: any) => {
    const result = await openEditorBase(input, source);
    if (input && input.resource && input.resource.path) {
      try {
        if (input.options && input.options.selection) {
          const path = input.resource.path.replace('/', '')
          const nextModel = findModel(stateRef.models as ModelType[], path)
          const nextModelIndex = stateRef.models?.findIndex(model => model.filename === path)
          dispatch({type: "updateModelIndex", payload: {modelIndex: nextModelIndex}});
          editor.setModel(nextModel?.model as any);
          editor.revealRange(input.options.selection);
          editor.setPosition({
            column: input.options.selection.startColumn,
            lineNumber: input.options.selection.startLineNumber,
          });
        }
      } catch (e) { /* empty */
      }
    }
    return result;
  };
}

function registerFileCompletion(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider(SupportLanguage.Solidity, {
    provideCompletionItems: (model, position) => {
      // const textUntilPosition = model.getValueInRange({
      //   startLineNumber: position.lineNumber,
      //   startColumn: 1,
      //   endLineNumber: position.lineNumber,
      //   endColumn: position.column,
      // });

      const word = model.getWordUntilPosition(position);

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        ...solidityTokensProvider.keywords.map((k) => {
          return {
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
            range,
          };
        }),
      ];

      return {
        suggestions: suggestions,
      } as any;
    },
  });
}

function registerFileImports(monaco: Monaco, state: any) {
  monaco.languages.registerCompletionItemProvider(SupportLanguage.Solidity, {
    triggerCharacters: ["'", '"'],
    provideCompletionItems: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const match = textUntilPosition.match(/import\s+/);

      if (!match) {
        return {suggestions: []};
      }
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = state.models
        .filter(
          (m: any) => m.filename !== state.models[state.modelIndex].filename
        )
        .map((m: any) => {
          return {
            label: `./${m.filename}`,
            kind: monaco.languages.CompletionItemKind.File,
            insertText: `./${m.filename}`,
            range,
          };
        });

      return {
        suggestions,
      } as any;
    },
  });
}

function registerListeners(
  editor: BaseMonacoEditor,
  editorApi: EditorApi,
  editorState: IEditorInitState
) {
  const transformCompileError = async (data: { output: any; input: any }) => {
    const models = editorState?.models || [];
    const modelIndex = editorState?.modelIndex || 0;
    const curFile = models[modelIndex].filename;
    const curFileContent = models[modelIndex].model.getValue();

    const sources = data.input.sources || {};
    const output = data.output || {};

    let allErrors: ErrorMarker[] = [];
    editorApi.removeErrorMarker(output.sources);
    if (output.error || output.errors) {
      if (output.error) { /* empty */
      } else {
        for (const error of output.errors) {
          console.log(error);
          if (!error.sourceLocation) {
            const errorMarker = helper.createErrorMarker(error, curFile, {
              start: {line: 0, column: 0},
              end: {line: 0, column: 100},
            });
            allErrors = [...allErrors, errorMarker];
          } else {
            const lineBreaks = helper.getLinebreakPositions(
              sources[error.sourceLocation.file].content
            );
            const lineColumn = helper.convertOffsetToLineColumn(
              {
                start: error.sourceLocation.start,
                length: error.sourceLocation.end - error.sourceLocation.start,
              },
              lineBreaks
            );

            const filePath = error.sourceLocation.file;

            if (filePath !== curFile) {
              const importFilePositions =
                await helper.getPositionForImportErrors(
                  filePath,
                  curFileContent
                );

              for (const importFilePosition of importFilePositions) {
                for (const line of importFilePosition.lines) {
                  allErrors = [
                    ...allErrors,
                    helper.createErrorMarker(error, curFile, line.position),
                  ];
                }
              }
            } else {
              allErrors = [
                ...allErrors,
                helper.createErrorMarker(error, filePath, lineColumn),
              ];
            }
          }
        }
      }
      console.log(allErrors);
      editorApi.addErrorMarker(allErrors);
    }
  };

  const throttledCompile = debounce(async () => {
    editorState.codeParser.compilerService
      .compile()
      .then((data: unknown) =>
        transformCompileError(data as unknown as { output: any; input: any })
      );
  }, 1000, {leading: true, trailing: true});

  const registerListenErrorMarkers = () => {
    editor.onDidChangeModelContent(throttledCompile);

    editor.onDidChangeModel(throttledCompile);
  };

  registerListenErrorMarkers();
}

function addModels(
  monaco: Monaco,
  editor: BaseMonacoEditor,
  modelIndex: number,
  modelInfos: ModelInfoType[],
  currentModels: ModelType[],
  dispatch: any,
  overWriteExisting = false
) {
  const formatModels: any[] = [];
  for (const modelInfo of modelInfos) {
    let model = monaco.editor.getModel(monaco.Uri.file(modelInfo.filename));

    //If model not exist create, otherwise replace value (for editor resets).
    if (model === null) {
      model = monaco.editor.createModel(
        modelInfo.value,
        modelInfo.language,
        monaco.Uri.file(modelInfo.filename)
      );
      monaco.editor.setModelLanguage(model, modelInfo.language);
    } else if (overWriteExisting) {
      model.setValue(modelInfo.value);
    }
    model.updateOptions({tabSize: 2});
    formatModels.push({
      ...modelInfo,
      model,
    });
  }

  //undefined initially so ternary operator deals with edge case, useContext typing issue
  dispatch({
    type: 'updateModels',
    payload: {
      models: [...currentModels!, ...formatModels] as ModelType[],
    },
  });

  const firstModelInfo = modelInfos[0];
  const firstModel = formatModels[0];
  //The last model with initial true should be initial
  if (!firstModelInfo.notInitial) {
    // @ts-ignore
    editor.setModel(firstModel.model);
    dispatch({
      type: 'updateModelIndex',
      payload: {
        modelIndex,
      },
    });
  }
}

function getCursorPosition(
  monaco: Monaco,
  state: IEditorInitState,
  offset = true
) {
  if (!monaco) return;
  const models = state?.models || [];
  const index = state?.modelIndex || 0;

  const model = models[index]?.model;
  if (model) {
    return offset
      ? model.getOffsetAt(state.editor?.getPosition() as IPosition)
      : state.editor?.getPosition();
  }

  return;
}

export {
  initTheme,
  initModels,
  registerLangs,
  registerCommandsAndActions,
  addModels,
  getCursorPosition,
  registerFileCompletion,
  registerFileImports,
  registerListeners,
};
