// @ts-check
const { defineConfig } = require('eslint-define-config');
const { readGitignoreFiles } = require('eslint-gitignore');

module.exports = defineConfig({
  ignorePatterns: [...readGitignoreFiles(), '.eslintrc.js'],
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.lint.json',
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true },
    ],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/lines-between-class-members': [
      'warn',
      'always',
      { exceptAfterSingleLine: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
});
