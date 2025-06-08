const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Fix monorepo module resolution - prioritize root node_modules
  config.resolve.modules = [
    path.resolve(__dirname, '../../node_modules'),
    'node_modules'
  ];

  // Ensure webpack loaders are resolved from root node_modules
  config.resolveLoader = {
    modules: [
      path.resolve(__dirname, '../../node_modules'),
      'node_modules'
    ]
  };

  // Disable source-map-loader to fix monorepo path issues
  config.module.rules = config.module.rules.filter(rule => {
    if (rule.loader && rule.loader.includes('source-map-loader')) {
      return false;
    }
    if (rule.use && Array.isArray(rule.use)) {
      rule.use = rule.use.filter(use => {
        if (typeof use === 'string' && use.includes('source-map-loader')) {
          return false;
        }
        if (use.loader && use.loader.includes('source-map-loader')) {
          return false;
        }
        return true;
      });
    }
    return true;
  });

  // Add crypto polyfills
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
  };

  // Load environment variables from .env file
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });

  // Debug: Log environment variables
  console.log('Webpack config - Environment variables:');
  console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
  console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

  // Add environment variables and buffer polyfill plugins
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.EXPO_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.EXPO_PUBLIC_SUPABASE_URL),
      'process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
