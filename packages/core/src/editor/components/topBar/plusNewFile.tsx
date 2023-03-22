import React, { ChangeEventHandler } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useOnclickOutside from 'react-cool-onclickoutside';
import IconButton from '@material-ui/core/IconButton';
import AddIconComponent from '@material-ui/icons/Add';

import { useState } from 'react';
import { SupportLanguage } from '../../../types/monaco';
import { styled } from '@material-ui/styles';

const useStyles = makeStyles({
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },

  dropdownContent: {
    display: 'flex',
    position: 'absolute',
    backgroundColor: '#252526',
    border: '1px solid #007fd4',
    minWidth: '160px',
    zIndex: 1,
    margin: '3px',
  },

  dropdownInput: {
    border: 0,
    color: '#b0b0b0',
    backgroundColor: '#2d3233',
    outline: 'none !important',
  },

  dropdownSelect: {
    border: '0px',
    borderLeft: '1px solid #007fd4',
    color: '#b0b0b0',
    backgroundColor: '#2d3233',
    outline: 'none !important',
  },
});

const AddIcon = styled(AddIconComponent)(() => ({
  color: '#787777',
}));


interface Props { 
  plusModel: any
}

export default function NewFileButton({ plusModel }: Props) {
  const classes = useStyles();
  const [openMenu, setOpenMenu] = useState(false);
  const [input, setInput] = useState('');
  const [fileType, setFileType] = useState(SupportLanguage.Solidity);

  const ref = useOnclickOutside(() => {
    setOpenMenu(false);
  });

  const createModelOnEnter = () => {
    let extension = fileType === SupportLanguage.Solidity ? '.sol' : '.js';
    plusModel(
      input + extension,
      fileType as SupportLanguage
    );
  };

  return (
    <div className={classes.dropdown} ref={ref}>
      <IconButton size="small" onClick={() => setOpenMenu(true)}>
        <AddIcon />
      </IconButton>

      {openMenu && (
        <div className={classes.dropdownContent}>
          <input
            className={classes.dropdownInput}
            autoFocus
            placeholder="type file name, press enter"
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                createModelOnEnter();
                setOpenMenu(false);
              }
            }}
          ></input>
          <select
            className={classes.dropdownSelect}
            onChange={e => setFileType(e.target.value as SupportLanguage)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                createModelOnEnter();
                setOpenMenu(false);
              }
            }}
          >
            <option value={SupportLanguage.Solidity}>.sol</option>
          </select>
        </div>
      )}
    </div>
  );
}
