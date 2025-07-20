// 1. IMPORTS (Add the Tailwind plugin import here)
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwind from 'eslint-plugin-tailwindcss'; // 👈 ADD THIS LINE
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 2. GLOBAL IGNORES (No changes needed here)
  {
    ignores: ['dist', '**/*.config.js'],
  },

  // 3. MAIN JS/JSX CONFIG (Add Tailwind here)
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    // 👇 ADD THIS PLUGINS BLOCK
    plugins: {
      tailwind,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        module: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // 👇 ADD THESE TAILWIND RULES
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
    },
  },

  // 4. CONFIG FILES (No changes needed here)
  {
    files: ['**/*.config.{js,cjs}'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
  },
]);