// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    // https://github.com/airbnb/javascript
    'airbnb-base',
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow unresolved module and extensions,
    // because webpack will handle this part
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    // allow param reassign or the param's properties
    'no-param-reassign': ['error', { props: false }],
    'max-len': ['error', { code: 80 }],
    'operator-linebreak': 'off',
    'no-underscore-dangle': [
      'error', {
        allow: ['_options'],
        allowAfterThis: true,
      }],
  },
};
