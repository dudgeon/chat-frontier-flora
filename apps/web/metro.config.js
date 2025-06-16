/**
 * CRITICAL METRO CONFIGURATION - DO NOT MODIFY WITHOUT READING THIS
 * 
 * This Metro config was carefully built after extensive debugging of Metro compilation hangs.
 * 
 * WORKING CONFIGURATION VERIFIED:
 * - Basic Expo config + withNativeWind plugin = ✅ WORKS (3231ms compilation)
 * - + polyfills (crypto, stream, buffer) = ✅ WORKS (38ms compilation, faster!)
 * - + monorepo support (watchFolders, nodeModulesPaths) = ⏳ TESTING
 * 
 * WHAT CAUSED ORIGINAL HANG:
 * - Complex Metro configuration in previous version caused infinite compilation hangs
 * - Minimal config works perfectly, complex additions tested incrementally
 * 
 * LOCKED-IN REQUIREMENTS:
 * 1. withNativeWind plugin with input: './global.css' and configPath: '../../tailwind.config.js'
 * 2. Polyfills for crypto, stream, buffer (replaces webpack polyfills)
 * 3. Environment variable loading via dotenv
 * 
 * TODO - CLEANUP NEEDED:
 * - Remove debug console.log statements once fully stable
 * - Consider moving environment variable logging to development only
 * 
 * DANGER ZONES:
 * - Do NOT add complex resolver configurations without testing incrementally
 * - Do NOT modify NativeWind plugin configuration
 * - Do NOT remove polyfills (breaks Supabase and other deps)
 */

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// REQUIRED: Load environment variables (needed for Supabase and other env vars)
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const config = getDefaultConfig(__dirname);

// REQUIRED: Add polyfills for web (replacing webpack polyfills)
// These are needed for Supabase client and other Node.js dependencies
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
};

// REQUIRED: Add monorepo support for workspace packages
// Allows imports from packages/shared and packages/ui
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// CRITICAL: NativeWind v4 plugin configuration
// DO NOT MODIFY: These paths and settings are precisely calibrated
const configWithNativeWind = withNativeWind(config, {
  input: './global.css',           // LOCKED: Points to CSS file with @tailwind directives
  configPath: '../../tailwind.config.js', // LOCKED: Points to root Tailwind config
});

// TODO CLEANUP: Remove debug logging once configuration is fully stable
console.log('Metro config - Environment variables:');
console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

module.exports = configWithNativeWind;