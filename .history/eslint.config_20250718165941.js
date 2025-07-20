import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    // Global ignores
    ignores: ['dist', '**/*.config.js'], // Add any other files to ignore
  },
  {
    // JavaScript/JSX rules
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals
        module: 'readonly', // Fix 'module is not defined' error
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Configuration files specific rules
    files: ['**/*.config.{js,cjs}'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs', // Allow CommonJS in config files
    },
  },
]);