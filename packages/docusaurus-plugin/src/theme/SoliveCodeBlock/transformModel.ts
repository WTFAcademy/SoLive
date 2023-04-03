import {SupportLanguage} from "solive-core";
import {ModelInfoType} from "solive-core/src";

import {TMeta} from "./resolveMeta";


const transformModel = (metas: TMeta[]) => {
  return metas.map(meta => new ModelInfoType({
    filename: meta.meta.filename,
    value: meta.content,
    language: (meta.meta.language as SupportLanguage) || SupportLanguage.Solidity,
  }))
}

export default transformModel;
