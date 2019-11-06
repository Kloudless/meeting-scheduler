const webpackMerge = require('webpack-merge');
const getPostCssPlugins = require('./post-css-plugins');

const merge = webpackMerge.strategy(
  {
    'module.rules': 'append',
    plugins: 'append',
  },
);

module.exports = (...args) => {
  const config = merge(...args);
  /**
   * Attach postcss-loader plugins based on minimize option in the config.
   * webpack-merge returns new object and does deep copy recursively,
   * so we don't need to worry about affecting other generated configs
   */
  const minimize = config.optimization.minimize || false;
  config.module.rules.forEach((rule) => {
    if (!Array.isArray(rule.use)) {
      return;
    }
    for (let index = 0; index < rule.use.length; index += 1) {
      const loaderConfig = rule.use[index];
      if (typeof loaderConfig === 'object'
              && loaderConfig.loader === 'postcss-loader') {
        // attach plugins to this postcss loader
        rule.use[index].options = {
          plugins: () => getPostCssPlugins(minimize),
        };
        // assume there is at most one postcss-loader per rule
        return;
      }
    }
  });
  return config;
};
