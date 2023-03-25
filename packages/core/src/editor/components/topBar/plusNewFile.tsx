import React, { useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import {IconButton, styled} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import { SupportLanguage } from '../../../types/monaco';


const Dropdown = styled('div')(() => ({
  position: 'relative',
  display: 'inline-block',
}));


const DropdownContent = styled('div')(() => ({
  display: 'flex',
  position: 'absolute',
  backgroundColor: '#252526',
  border: '1px solid #007fd4',
  minWidth: '160px',
  zIndex: 1,
  margin: '3px',
}));

const DropdownInput = styled('input')(() => ({
  border: 0,
  color: '#b0b0b0',
  backgroundColor: '#2d3233',
  outline: 'none !important',
}));

const DropdownSelect = styled('select')(() => ({
  border: '0px',
  borderLeft: '1px solid #007fd4',
  color: '#b0b0b0',
  backgroundColor: '#2d3233',
  outline: 'none !important',
}));

const CustomAddIcon = styled(AddIcon)(() => ({
  color: '#787777',
}));


interface Props {
  plusModel: any
}

export default function NewFileButton({ plusModel }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [input, setInput] = useState('');
  const [fileType, setFileType] = useState(SupportLanguage.Solidity);

  const ref = useOnclickOutside(() => {
    setOpenMenu(false);
  });

  const createModelOnEnter = () => {
    const extension = fileType === SupportLanguage.Solidity ? '.sol' : '.js';
    plusModel(
      input + extension,
      fileType as SupportLanguage
    );
  };

  return (
    <Dropdown ref={ref}>
      <IconButton size="small" onClick={() => setOpenMenu(true)}>
        <CustomAddIcon />
      </IconButton>

      {openMenu && (
        <DropdownContent>
          <DropdownInput
            autoFocus
            placeholder="type file name, press enter"
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                createModelOnEnter();
                setOpenMenu(false);
              }
            }}
          />
          <DropdownSelect
            onChange={e => setFileType(e.target.value as SupportLanguage)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                createModelOnEnter();
                setOpenMenu(false);
              }
            }}
          >
            <option value={SupportLanguage.Solidity}>.sol</option>
          </DropdownSelect>
        </DropdownContent>
      )}
    </Dropdown>
  );
}
