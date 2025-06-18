const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const { withNativeWind } = require('nativewind/metro');

// Load environment variables (replicating webpack functionality)
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const config = getDefaultConfig(__dirname);

// Monorepo support - resolve packages from workspace (like webpack config)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

config.watchFolders = [workspaceRoot];

// Monorepo module resolution (replicating webpack resolver.modules)
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'), // Prioritize root node_modules
  path.resolve(projectRoot, 'node_modules'),
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

// Add polyfills for web platform (replicating webpack resolve.fallback)
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
};

// Add global Buffer polyfill (replicating webpack ProvidePlugin)
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Debug: Log environment variables (like webpack config did)
console.log('Metro config - Environment variables:');
console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

module.exports = withNativeWind(config, { 
  input: './global.css',
  configPath: '../../tailwind.config.js',
  inlineRem: 16 
});
