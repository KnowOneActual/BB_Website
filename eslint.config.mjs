import globals from 'globals';
import pluginSecurity from 'eslint-plugin-security';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // Define files to apply this config to
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        // Add any project-specific globals here if needed
        Chart: 'readonly', // For trends.js
        L: 'readonly',     // For my_ip.js (Leaflet)
      },
    },
    plugins: {
      security: pluginSecurity,
    },
    rules: {
      ...pluginSecurity.configs.recommended.rules,
      // Custom overrides
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off', // Keeping console logs for now as it's a personal project
    },
  },
  // Apply Prettier config last to disable conflicting rules
  eslintConfigPrettier,
  {
    // Global ignores
    ignores: ['node_modules/**', 'coverage/**', '.netlify/**', 'three.min.js'],
  },
];
