module.exports = function (api) {
  const isTest = api.env('test');

  api.cache(true);

  const presets = ['babel-preset-expo'];
  if (!isTest) {
    presets.push('nativewind/babel');
  }

  return {
    presets,
    plugins: [],
  };
};
