import globals from 'globals';

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
        L: 'readonly', // For my_ip.js (Leaflet)
      },
    },
    rules: {
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
  {
    // Global ignores
    ignores: ['node_modules/**', 'coverage/**', '.netlify/**', 'three.min.js'],
  },
];
