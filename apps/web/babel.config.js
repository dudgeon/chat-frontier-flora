// ⚠️  CRITICAL: NativeWind v4 Babel Configuration
// 🚨 DO NOT MODIFY THIS FILE WITHOUT READING THE WARNING BELOW 🚨
//
// This Babel configuration is ESSENTIAL for NativeWind v4 CSS processing.
// Removing or modifying ANY of these settings will break NativeWind styling:
//
// 1. jsxImportSource: "nativewind" - Required for className processing
// 2. "nativewind/babel" preset - Required for CSS class transformation  
// 3. Function format with api.cache(true) - Required for proper caching
//
// REGRESSION HISTORY:
// - 2025-06-16: Babel config was corrupted, breaking all NativeWind styles
// - Root cause: Missing NativeWind presets caused className attributes to not be processed
// - Symptom: Only React Native Web css-view-* classes, no Tailwind classes
// - Fix: Restored this exact configuration
//
// BEFORE EDITING: Test NativeWind styles work after any changes!
// Test command: node test-blue-user-bubble.js (should show blue bubbles)

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      // CRITICAL: jsxImportSource required for NativeWind className processing
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      // CRITICAL: nativewind/babel preset required for CSS class transformation
      "nativewind/babel"
    ],
    plugins: [
      // No plugins needed for web-only Expo app
    ],
  };
};