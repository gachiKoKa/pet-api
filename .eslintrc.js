module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 2,
    '@typescript-eslint/explicit-module-boundary-types': 2,
    '@typescript-eslint/no-for-in-array': 2,
    '@typescript-eslint/no-use-before-define': 2,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-duplicate-enum-values': 2,
    '@typescript-eslint/no-floating-promises': 2,
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
      },

      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },

      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },

      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    'no-var': 2,
    'prefer-const': 2,
    'no-use-before-define': 2,
    'no-console': [
      2,
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'object-shorthand': 2,
    'unused-imports/no-unused-imports': 2,
    'unused-imports/no-unused-vars': 2,
    'no-return-await': 2,
    '@typescript-eslint/return-await': [2, 'in-try-catch' ],
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': [
          2,
          {
            accessibility: 'explicit',
            overrides: {
              accessors: 'off',
              constructors: 'no-public',
              methods: 'explicit',
              properties: 'explicit',
              parameterProperties: 'explicit',
            },
          },
        ],
      },
    },
  ],
};
