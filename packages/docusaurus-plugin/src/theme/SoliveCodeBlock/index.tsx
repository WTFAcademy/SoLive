import React, { useMemo } from 'react';

import Editor from 'solive-core';
import { v4 as uuidv4 } from 'uuid';

import 'solive-core/dist/index.css';

import { SoliveCodeBlockProps } from '../types';
import { matchProps } from '../utils/match-props';
import resolveMeta from '../utils/resolve-meta';
import transformModel from '../utils/transform-model';

const PropsInfo = {
  simple: {
    type: 'boolean',
    default: false,
  },
  width: {
    type: 'string',
    default: '90%',
  },
  height: {
    type: 'string',
    default: '500px',
  },
  fileNavOpen: {
    type: 'boolean',
    default: true,
  },
  consoleOpen: {
    type: 'boolean',
    default: true,
  },
  deployOpen: {
    type: 'boolean',
    default: true,
  },
  consoleTriggerControl: {
    type: 'boolean',
    default: false,
  },
  consoleDefaultVisible: {
    type: 'boolean',
    default: false,
  },
  deployDefaultVisible: {
    type: 'boolean',
    default: false,
  },
  mode: {
    type: 'string',
    default: 'standard',
  },
};

function SoliveCodeBlock(props: SoliveCodeBlockProps) {
  const { metastring, children } = props;
  const allProps = useMemo(() => matchProps(metastring?.split('solive')[1] || '', PropsInfo), [metastring]);

  const id = useMemo(() => uuidv4(), []);
  const modelInfos = useMemo(() => transformModel(resolveMeta(children)), [children]);

  const state = useMemo(() => {
    if (allProps.simple) {
      return {
        height: allProps.height,
        id,
        modelInfos,
        fileNav: { open: false },
        console: { open: false },
        deploy: { open: false },
        disableValidation: true,
      };
    }

    return {
      fileNav: {
        open: allProps.fileNavOpen,
      },
      console: {
        defaultVisible: allProps.consoleDefaultVisible,
        open: allProps.consoleOpen,
        triggerControl: allProps.consoleTriggerControl,
      },
      deploy: {
        defaultVisible: allProps.deployDefaultVisible,
        open: allProps.deployOpen,
      },
      height: allProps.height,
      id,
      modelInfos,
    };
  }, [
    allProps,
    id,
    modelInfos,
  ]);

  return (
    <div style={{ width: allProps.width, maxWidth: '800px', margin: 'auto' }}>
      <Editor {...state} />
    </div>
  );
}

export default SoliveCodeBlock;
