import Editor from "solive-core";
import React, {useMemo} from "react";
import { v4 as uuidv4 } from 'uuid';

import type { SoliveCodeBlockProps } from '../types'

import 'solive-core/dist/index.css';

import resolveMeta from "./resolveMeta";
import transformModel from "./transformModel";

const SoliveCodeBlock = (props: SoliveCodeBlockProps) => {
  const {height, width} = props;
  const id = useMemo(() => uuidv4(), []);
  const modelInfos = useMemo(() => transformModel(resolveMeta(props.children)), [props.children]);

  return (
    <div style={{width: width || '90%', maxWidth: '800px', margin: 'auto'}}>
      <Editor
        height={height || '300px'}
        id={id}
        modelInfos={modelInfos}
      />
    </div>
  )
}

export default SoliveCodeBlock;
