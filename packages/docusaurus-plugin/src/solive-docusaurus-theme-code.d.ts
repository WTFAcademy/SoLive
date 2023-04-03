/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module 'solive-docusaurus-theme-code' {
    export type ThemeConfig = {
        codeblock: {
            showGithubLink: boolean
            githubLinkLabel: string
            showRunmeLink: boolean
            runmeLinkLabel: string
        }
    }
}

declare module 'solive-docusaurus-theme-code/client' {
    import type { ThemeConfig } from 'solive-docusaurus-theme-code';
    export function useCodeblockThemeConfig(): ThemeConfig['codeblock'];
}
