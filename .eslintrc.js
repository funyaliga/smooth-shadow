module.exports = {
  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    '@vue/prettier',
  ],

  rules: {
    'vue/multi-word-component-names': 0,
    'vue/no-setup-props-destructure': 0,
    '@typescript-eslint/no-explicit-any': ['off'],
  },
};
