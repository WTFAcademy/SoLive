import React, { useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PlayButton from './rightButtons';
import Tab from './tab';
import NewFileButton from './plusNewFile';
import { useEditor } from '../../editorContext';
import { ModelInfoType, SupportLanguage } from '../../../types/monaco';
import { addModels } from '../../mountFunctions';

const useStyles = makeStyles({
  bar: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    height: '33px',
    backgroundColor: '#2d3233',
    width: '100%',
    alignItems: 'center',
  },
});

interface Props {
  modelInfos: ModelInfoType[];
}

export default function TopBar({ modelInfos }: Props) {
  const classes = useStyles();
  const { state, dispatch } = useEditor();

  const models = useMemo(() => state.models || [], [state.models]);
  const editor = useMemo(() => state.editor, [state.editor]);
  const monaco = useMemo(() => state.monaco, [state.monaco]);
  const selectedIdx = useMemo(() => state.modelIndex, [state.modelIndex]);

  // curry function adding from mount
  const plusModel = (
    filename: string,
    language: SupportLanguage
  ) => {
    addModels(
      monaco!,
      editor!,
      state.models!.length,
      [
        new ModelInfoType({
          filename,
          language,
        })
      ],
      state.models!,
      dispatch
    )
  }

  function dragTabMove(draggedIdx: number, draggedToIdx: number) {
    if (models) {
      let newModels = [...models];
      // drag left
      if (draggedIdx > draggedToIdx) {
        newModels.splice(draggedToIdx, 0, models[draggedIdx]);
        newModels.splice(draggedIdx + 1, 1);
      } else {
        // drag right
        newModels.splice(draggedToIdx + 1, 0, models[draggedIdx]);
        newModels.splice(draggedIdx, 1);
      }
      
      dispatch({type: 'updateModels', payload: {models: newModels}});
      dispatch({type: "updateModelIndex", payload: {modelIndex: draggedToIdx}});
    }
  }

  function deleteTab(index: number) {
    if (models && models.length > 1) {
      let newModels = [...models];
      newModels.splice(index, 1);
      dispatch({type: 'updateModels', payload: {models: newModels}});

      if (index < newModels.length) {
        dispatch({type: "updateModelIndex", payload: {modelIndex: index}});
        editor?.setModel(newModels[index].model);
      } else {
        dispatch({type: "updateModelIndex", payload: {modelIndex: index}});
        editor?.setModel(newModels[index - 1].model);
      }
    } else {
      console.error("Cannot delete only model");
    }
  }

  // if model is readonly make editor readonly
  // Since this code could go anywhere should I extract a custom hook?
  useEffect(() => {
    if (editor && models && selectedIdx !== undefined) {
      editor.updateOptions({ readOnly: models[selectedIdx]?.readOnly });
    }
  }, [selectedIdx, editor, selectedIdx]);

  return (
    <div className={classes.bar}>
      {models &&
        models
          .filter(model => !model.shown)
          .map((model, index) => (
            <Tab
              key={index}
              model={model}
              index={index}
              dragTabMove={dragTabMove}
              deleteTab={deleteTab}
            />
          ))}
      <NewFileButton plusModel={plusModel} />
      <PlayButton modelInfos={modelInfos} />
    </div>
  );
}
