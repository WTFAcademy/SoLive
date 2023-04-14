import Editor from "solive-core";
import React, {useMemo} from "react";
import {v4 as uuidv4} from 'uuid';

import type {SoliveCodeBlockProps} from '../types'

import 'solive-core/dist/index.css';
import resolveMeta from "./resolveMeta";
import transformModel from "./transformModel";

const SoliveCodeBlock = (props: SoliveCodeBlockProps) => {
  const {metastring, ...others} = props;
  const id = useMemo(() => uuidv4(), []);
  const modelInfos = useMemo(() => transformModel(resolveMeta(props.children)), [props.children]);

  const heightMatch = metastring?.match(/height="(?<height>[^"]*)"/);
  const widthMatch = metastring?.match(/width="(?<width>[^"]*)"/);
  const consoleDefaultVisibleMatch = metastring?.match(/consoleDefaultVisible="(?<consoleDefaultVisible>[^"]*)"/);
  const deployDefaultVisibleMatch = metastring?.match(/deployDefaultVisible="(?<deployDefaultVisible>[^"]*)"/);

  const height = heightMatch?.groups?.height || '500px';
  const width = widthMatch?.groups?.width || '90%';
  const consoleDefaultVisible = consoleDefaultVisibleMatch?.groups?.consoleDefaultVisible || "true";
  const deployDefaultVisible = deployDefaultVisibleMatch?.groups?.deployDefaultVisible || 'true';

  console.log(height, width, consoleDefaultVisible, deployDefaultVisible)

  return (
    <div style={{width: width, maxWidth: '800px', margin: 'auto'}}>
        <Editor
          console={{defaultVisible: consoleDefaultVisible === 'true'}}
          deploy={{defaultVisible: deployDefaultVisible === 'true'}}
          height={height}
          id={id}
          modelInfos={modelInfos}
        />
    </div>
  )
}

export default SoliveCodeBlock;
