/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import CodeBlock from '@theme-init/CodeBlock'

import type {SoliveCodeBlockProps} from '../types'
import SoliveCodeBlock from "../SoliveCodeBlock";

const componentWrapper = (Component: typeof CodeBlock) => {
  const WrappedComponent = (props: SoliveCodeBlockProps) => {

    if (props.solive) {
      return <SoliveCodeBlock {...props} />
    }

    return <CodeBlock {...props} />
  };

  return WrappedComponent;
};

module.exports = componentWrapper(CodeBlock)
