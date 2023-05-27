module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
    'jsx-a11y',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    Worker: true,
    globalThis: true,
    document: true,
    JSX: true,
    React: 'readonly',
    localStorage: true,
    HTMLElement: true,
    window: true,
    // 在这里添加其他全局变量
  },
  rules: {
    // 常用规则
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-template': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    'func-names': 'off',
    'no-use-before-define': 'off',
    'import/no-import-module-exports': 'off',
    'no-plusplus': 'off',
    'prefer-regex-literals': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-shadow': 'off',
    'no-bitwise': 'off',
    'class-methods-use-this': 'off',
    radix: 'off',
    'guard-for-in': 'off',
    'max-len': ['error', { code: 250 }],

    // TypeScript 相关
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-unused-expressions': 'off',

    // React 相关
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unused-prop-types': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'react/jsx-no-bind': 'off',
    'react/require-default-props': 'off',
    'react/no-array-index-key': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',

    // import 相关
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', 'never', { svg: 'always' }],
    'import/order': ['error', {
      'newlines-between': 'always',
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      pathGroups: [
        {
          pattern: 'react',
          group: 'external',
          position: 'before',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
    }],
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^@theme-original', '^@docusaurus', '^@theme-init', '^@theme'],
      },
    ],

    // 全局变量 相关
    'no-restricted-globals': ['error', {
      name: 'addEventListener',
      message: 'Use `self.addEventListener` instead.',
    }, {
      name: 'importScripts',
      message: 'Use `self.importScripts` instead.',
    }, {
      name: 'self',
      message: 'Use `globalThis` instead.',
    }],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // 在这里添加针对 TypeScript 的规则
      },
    },
    {
      files: ['*.jsx', '*.tsx'],
      rules: {
        // 在这里添加针对 React/JSX 的规则
      },
    },
    {
      files: ['next/**/*.js', 'next/**/*.jsx', 'next/**/*.ts', 'next/**/*.tsx'],
      rules: {
        // 在这里添加针对 Next.js 项目的规则
      },
    },
  ],
  ignorePatterns: ['dist/', 'build/'],
};
