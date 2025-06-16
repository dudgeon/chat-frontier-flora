// ⚠️  CRITICAL: Metro + NativeWind v4 + Polyfills Configuration
// 🚨 DO NOT MODIFY WITHOUT UNDERSTANDING DEPENDENCIES 🚨
//
// This Metro config is essential for:
// 1. NativeWind v4 CSS processing (withNativeWind plugin)
// 2. Web polyfills for Supabase (crypto, stream, buffer)
// 3. Monorepo package resolution
//
// CRITICAL DEPENDENCIES:
// - nativewind/metro (v4 API) - Incompatible with v2/v3
// - expo/metro-config ~50.0.0 - Required for web bundling
// - Polyfill packages for browser compatibility
//
// BEFORE MODIFYING:
// 1. Test Metro compilation: npm run web
// 2. Verify NativeWind CSS processing: Check for .bg-blue-500 rules in browser
// 3. Test Supabase client: Should not get crypto/stream errors
//
// RECENT REGRESSION:
// - 2025-06-16: Babel config corruption broke NativeWind entirely
// - Always test styling after Metro config changes!

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// CRITICAL: Web polyfills required for Supabase client in browser
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: require.resolve('crypto-browserify'),    // Supabase auth requires crypto
  stream: require.resolve('stream-browserify'),   // Node.js stream compatibility
  buffer: require.resolve('buffer'),              // Buffer polyfill for browser
};

// CRITICAL: NativeWind v4 plugin for CSS processing
// input: CSS file with @tailwind directives
// configPath: Root Tailwind config with nativewind/preset
const configWithNativeWind = withNativeWind(config, {
  input: './global.css',                    // Must exist with @tailwind directives
  configPath: '../../tailwind.config.js',  // Must have nativewind/preset
});

module.exports = configWithNativeWind;