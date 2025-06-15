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

  // CRITICAL FIX: Remove conflicting Expo CSS processing rules
  // This prevents conflicts between Expo CSS rules and our NativeWind rule
  // We'll add our own CSS rule after this cleanup
  const originalRulesCount = config.module.rules.length;
  
  config.module.rules = config.module.rules.filter(rule => {
    // Remove direct CSS rules (but keep others)
    if (rule.test && rule.test.toString().includes('css')) {
      console.log('Removing Expo CSS rule:', rule.test.toString());
      return false;
    }

    // Remove oneOf rules that contain CSS processing
    if (rule.oneOf && Array.isArray(rule.oneOf)) {
      const originalOneOfLength = rule.oneOf.length;
      rule.oneOf = rule.oneOf.filter(oneOfRule => {
        if (oneOfRule.test && oneOfRule.test.toString().includes('css')) {
          console.log('Removing oneOf CSS rule:', oneOfRule.test.toString());
          return false;
        }
        return true;
      });

      // If oneOf is now empty, remove the entire rule
      if (rule.oneOf.length === 0) {
        console.log('Removing empty oneOf rule');
        return false;
      }
    }

    return true;
  });
  
  console.log(`Removed ${originalRulesCount - config.module.rules.length} conflicting CSS rules`);

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

  // Add NativeWind babel-loader rule for proper transpilation
  // Use babel.config.js instead of inline configuration to avoid conflicts
  config.module.rules.unshift({
    test: /\.[jt]sx?$/,
    include: [
      path.resolve(__dirname, 'src'),
      // Include nativewind and other React Native packages that need transpilation
      /node_modules\/(nativewind|react-native|react-native-reanimated|react-native-safe-area-context)/,
    ],
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        // Use the babel.config.js file instead of inline config to avoid conflicts
        configFile: path.resolve(__dirname, 'babel.config.js')
      },
    },
  });

  // Add ONLY our clean NativeWind CSS processing rule with debugging
  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: false
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            config: false, // Don't use postcss.config.js
            plugins: [
              require('tailwindcss')('./tailwind.config.js'),
              require('autoprefixer'),
              {
                postcssPlugin: 'debug-plugin',
                Once(root, { result }) {
                  console.log('🎨 PostCSS processing CSS file:', result.opts.from);
                  console.log('🎨 CSS rules count:', root.nodes.length);
                  
                  // Look for our specific classes
                  let hasNativeWindClasses = false;
                  root.walkRules(rule => {
                    if (rule.selector.includes('bg-blue-500') || rule.selector.includes('w-10') || rule.selector.includes('h-10')) {
                      hasNativeWindClasses = true;
                      console.log('✅ Found NativeWind class:', rule.selector);
                    }
                  });
                  
                  if (!hasNativeWindClasses) {
                    console.log('❌ No NativeWind classes generated by Tailwind');
                  }
                }
              }
            ],
          },
          sourceMap: false
        },
      },
    ],
  });

  console.log('Final webpack rules count:', config.module.rules.length);

  return config;
};
