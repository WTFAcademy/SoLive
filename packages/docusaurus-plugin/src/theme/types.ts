import type { Props } from '@theme-init/CodeBlock';

export interface SoliveCodeBlockProps extends Props {
  solive: string;
  height?: string;
  width?: string;
  deployDefaultVisible?: string;
  consoleDefaultVisible?: string;
  fileNavOpen?: string;
}

export type DispatchTypes = 'reset' | 'loading' | 'loaded' | 'error'

export interface DispatchMessage {
  type: DispatchTypes
  value: string | Error
}
