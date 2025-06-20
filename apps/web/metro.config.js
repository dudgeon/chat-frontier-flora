const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Monorepo support - resolve packages from workspace
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Configure source extensions for React Native Web
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'css', // Add CSS support for styling
];

// Ensure NativeWind CSS processing
config.transformer.unstable_allowRequireContext = true;

// Platform-specific source extensions
config.resolver.platforms = [
  'web.tsx',
  'web.ts',
  'web.jsx',
  'web.js',
  'tsx',
  'ts',
  'jsx',
  'js',
];

module.exports = withNativeWind(config, { 
  input: './global.css',
  inlineRem: 16 
});
