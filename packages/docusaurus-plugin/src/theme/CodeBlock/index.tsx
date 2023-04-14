/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import CodeBlock from '@theme-init/CodeBlock'
import BrowserOnly from '@docusaurus/BrowserOnly';

import type {SoliveCodeBlockProps} from '../types'

const componentWrapper = (Component: typeof CodeBlock) => {
  const WrappedComponent = (props: SoliveCodeBlockProps) => {

    if (props.solive && typeof window !== 'undefined') {
      return (
        <BrowserOnly fallback={<div>Loading...</div>}>
          {() => {
            const SoliveCodeBlock = require('../SoliveCodeBlock').default;
            return <SoliveCodeBlock {...props} />;
          }}
        </BrowserOnly>
      )
    }

    return <CodeBlock {...props} />
  };

  return WrappedComponent;
};

module.exports = componentWrapper(CodeBlock)
