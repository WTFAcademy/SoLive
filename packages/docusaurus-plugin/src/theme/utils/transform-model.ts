import { SupportLanguage } from 'solive-core';
import { ModelInfoType } from 'solive-core/src';

import { TMeta } from './resolve-meta';
import solidityFormatter from './format-code';

const transformModel = (metas: TMeta[]) => metas.map((meta) => new ModelInfoType({
  filename: meta.filename,
  value: solidityFormatter(meta.content),
  language: SupportLanguage.Solidity,
}));

export default transformModel;
