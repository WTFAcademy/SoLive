import React from 'react';
import {styled} from "@mui/material";

import { SupportLanguage } from '../../../types/monaco';

const SolBox = styled("span")(() => ({
  height: '100%',
  marginRight: '5px',
  color: '#5098b7',
  fontSize: '0.7em',
  fontWeight: 700,
}))

export default function LanguageIcon({
  language,
}: {
  language: SupportLanguage;
}) {
  if (language === SupportLanguage.Solidity) {
    return <SolBox>SOL</SolBox>;
  }
  return null
}
