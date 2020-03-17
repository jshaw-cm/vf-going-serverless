module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:jest/recommended',
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'jest'
  ],
  rules: {
    'import/extensions': [
      "error",
      "always",
      {
        ts: "never",
        js: "never",
      }
    ],
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    'no-new': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts']
      }
    }
  }
};

/**
VS Code .vscode/settings.json
From this guide: https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb
{
  '[javascript]': {
    'editor.formatOnSave': false
  },
  '[typescript]': {
    'editor.formatOnSave': false
  },
  'eslint.autoFixOnSave': true,
  'eslint.validate': [
    'javascript',
    {
      'autoFix': true,
      'language': 'typescript'
    }
  ],
  'eslint.enable': true,
}
*/
