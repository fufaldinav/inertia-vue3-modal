module.exports = {
  root: true,
  env: {
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  ignorePatterns: ['vendor', 'src', 'dist'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-plusplus': 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['event'] }],
    'max-len': ['error', 140],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
