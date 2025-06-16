// MINIMAL METRO CONFIG + NATIVEWIND + POLYFILLS
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add polyfills for web (needed for Supabase client)
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
};

// Add NativeWind plugin
const configWithNativeWind = withNativeWind(config, {
  input: './global.css',
  configPath: '../../tailwind.config.js',
});

module.exports = configWithNativeWind;