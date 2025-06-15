module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      "babel-preset-expo"
    ],
    plugins: [
      require("nativewind/babel"),      // ① run the transform using require
      "react-native-reanimated/plugin"  // ② must remain last
    ],
  };
};
