module.exports = {
  env: {
    // 解决 defineProps 等语法糖报错问题
    'vue/setup-compiler-macros': true,
    browser: true,
    commonjs: true,
    amd: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // 关闭any类型的报错
    '@typescript-eslint/no-explicit-any': ['off'],
    // 关闭 {}类型的报错
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
    // 关闭空函数的报错
    '@typescript-eslint/no-empty-function': ['off'],
    // 关闭未定义报错 ,否则eslint会报全局的类型声明未定义的错误
    'no-undef': 'off',
  },
}
