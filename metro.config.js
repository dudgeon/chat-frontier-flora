const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add workspaces support for monorepo
config.watchFolders = [
  path.resolve(__dirname, 'apps'),
  path.resolve(__dirname, 'packages'),
];

// Ensure Metro can resolve workspace dependencies
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'apps/web/node_modules'),
];

// Block problematic CSS cache files that cause SHA-1 issues
config.resolver.blockList = [
  /node_modules\/react-native-css-interop\/\.cache\/.*\.css$/,
];

module.exports = config;