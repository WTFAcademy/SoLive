import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LanguageIcon from './languageIcon';
import { useDrag, useDrop } from 'react-dnd';
import { useEditor } from '../../editorContext';
import { ModelInfoType, ModelType } from '../../../types/monaco';

const useStyles = makeStyles({
  tab: {
    display: 'inline-flex',
    height: '100%',
    cursor: 'pointer',
    alignItems: 'center',
    color: '#919191',
    padding: '0.3rem 0.4rem 0.3rem 0.6rem !important',
    fontSize: '0.75rem',
    fontWeight: 400,
    borderRight: '1px solid #252526',
    backgroundColor: '#2d3233',
    '&:hover': {
      '& span:last-child': {
        visibility: 'visible',
        fontSize: '0.9rem',
        marginLeft: '5px',
        color: 'gainsboro',
      },
    },
    '& span:last-child': {
      visibility: 'hidden',
      fontSize: '0.9rem',
      marginLeft: '5px',
      color: 'gainsboro',
    },
  },
});

type TabProps = {
  model: ModelType;
  index: number;
  dragTabMove: (draggedIdx: number, draggedToIdx: number) => void;
  deleteTab: (index: number) => void;
};
type DragTabItem = {
  type: string;
  index: number;
};
export default function Tab({
  model,
  index,
  dragTabMove,
  deleteTab,
}: TabProps) {
  const classes = useStyles();
  const {state, dispatch} = useEditor();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'moveIdx',
      item: { type: 'moveIdx', index },
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    })
  );

  const [{ isOver }, drop] = useDrop({
    accept: 'moveIdx',
    drop: (item: DragTabItem) => {
      dragTabMove(item.index, index);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <span ref={drag}>
      <span
        onMouseDown={() => {
          dispatch({type: "updateModelIndex", payload: {modelIndex: index}})
          state.editor?.setModel(model.model);
        }}
        className={classes.tab}
        key={index}
        ref={drop}
        style={{
          backgroundColor:
            state.modelIndex === index ? '#1D2021' : isOver ? '#4F4F4F' : '#2d3233',
        }}
      >
        <LanguageIcon language={model.language} />
        <span>{model.model.uri.path.substring(1)}</span>
        <span onClick={() => deleteTab(index)}>x</span>
      </span>
    </span>
  );
}
