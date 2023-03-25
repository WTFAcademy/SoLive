import React from 'react';

import {SupportLanguage} from "../../types/monaco";


export default function LangIcon({
  language,
}: {
  language: SupportLanguage;
}) {
  if (language === SupportLanguage.Solidity) {
    return <div className="h-full mr-1 text-[#5098b7] text-sm font-medium">SOL</div>;
  }
  return null
}
