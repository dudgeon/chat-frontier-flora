module.exports = function (api) {
  const isTest = api.env('test');

  api.cache(true);

  const plugins = [];

  // Temporarily disable NativeWind plugin to fix compilation error
  // TODO: Re-enable after fixing NativeWind configuration
  // if (!isTest) {
  //   plugins.push('nativewind/babel');
  // }

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
