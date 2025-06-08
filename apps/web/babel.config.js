module.exports = function (api) {
  const isTest = api.env('test');

  api.cache(true);

  const plugins = [];

  // Only add NativeWind plugin when not in test environment
  if (!isTest) {
    plugins.push('nativewind/babel');
  }

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
