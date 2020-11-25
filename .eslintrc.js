// Configuration for EsLint
// See: https://eslint.org/docs/user-guide/configuring

module.exports = {
  'root': true,

  'extends': [
    'plugin:nuxt/recommended',
    '@vue/typescript',
    'plugin:compat/recommended',
    'plugin:vue-a11y/recommended',
  ],

  'plugins': [
    'compat',
    'json',
    'eslint-plugin-import-helpers',
  ],

  'rules': {
    // Sets the import order linting,
    // see: https://github.com/Tibfib/eslint-plugin-import-helpers
    // 'import-helpers/order-imports': ['error', {
    //   'newlinesBetween': 'always',
    //   'groups': ['module', '/^~//', '/^@//'],
    //   'alphabetize': { 'order': 'asc', 'ignoreCase': false },
    // }],
    'compat/compat': 0,
    'vue-a11y/click-events-have-key-events': 0
  },

  'overrides': [],

  'parserOptions': {
    'parser': '@typescript-eslint/parser',
  },

  'settings': {
    // providing polyfills for `eslint-plugin-compat` plugin, see:
    // https://github.com/amilajack/eslint-plugin-compat/wiki/Adding-polyfills
    'polyfills': [],
  },

  'env': {
    'node': true,
    'browser': true,
  },
}
