import React, { useCallback, useMemo } from 'react';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { ModelInfoType } from '../../../types/monaco';
import { useEditor } from '../../editorContext';
import { getCursorPosition } from '../../mountFunctions';

interface Props {
  modelInfos: ModelInfoType[];
};
export default function PlayButton({ modelInfos }: Props) {
  const { state, dispatch } = useEditor();

  const monaco = useMemo(() => state.monaco, [state.monaco]);
 
  const run = () => {
    console.log(getCursorPosition(
      monaco!,
      state,
    ));
  }

  const depoly = () => {}

  const compile = () => {}

  return (
    <div style={{ display: 'flex', marginLeft: 'auto', marginRight: '3px' }}>
      <PlayArrowIcon
        onClick={run}
        style={{ color: '#09ad11' }}
      />
    </div>
  );
}
