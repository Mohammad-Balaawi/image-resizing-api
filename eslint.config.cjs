const tseslint = require('typescript-eslint');

module.exports = [
  { ignores: ['build/**', 'dist/**', 'assets/thumbs/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  { files: ['eslint.config.cjs'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
];
