// @ts-ignore
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { ThemeConfig } from 'solive-docusaurus-theme-code';

const DEFAULT_THEME_CONFIG: ThemeConfig['codeblock'] = {
  showGithubLink: true,
  githubLinkLabel: 'View on GitHub',
  showRunmeLink: false,
  runmeLinkLabel: 'Checkout via Runme',
};

const THEME_CONFIG_KEY = 'codeblock';

export function useCodeblockThemeConfig(): ThemeConfig['codeblock'] {
  const {
    siteConfig: { themeConfig },
  } = useDocusaurusContext();
  return Object.assign(DEFAULT_THEME_CONFIG, themeConfig[THEME_CONFIG_KEY] || {});
}
