import React from 'react';
import { makeStyles } from '@material-ui/core';
import { SupportLanguage } from '../../../types/monaco';

const useStyles = makeStyles({
  JS: {
    height: '100%',
    marginRight: '5px',
    color: '#cbcb41',
    fontSize: '0.7em',
    fontWeight: 700,
  },
  SOL: {
    height: '100%',
    marginRight: '5px',
    color: '#5098b7',
    fontSize: '0.7em',
    fontWeight: 700,
  },
  JSON: {
    height: '100%',
    marginRight: '5px',
    color: '#c7c741',
    fontSize: '0.8em',
    fontWeight: 700,
  },
});

export default function LanguageIcon({
  language,
}: {
  language: SupportLanguage;
}) {
  const classes = useStyles();
  if (language === SupportLanguage.Solidity) {
    return <span className={classes.SOL}>SOL</span>;
  }
  return null
}
