module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['chrome > 70', 'firefox > 63'],
        useBuiltIns: 'usage',
      },
    ],
  ],
};
