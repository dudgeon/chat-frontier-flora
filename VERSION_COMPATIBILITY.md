# ⚠️  CRITICAL: Version Compatibility Matrix

**🚨 DO NOT UPGRADE DEPENDENCIES WITHOUT READING THIS DOCUMENT 🚨**

This project uses a highly version-sensitive stack with NativeWind v4 + Metro + React 18.2.0. Upgrading ANY of these dependencies can break the entire application.

## 🔴 ULTRA-CRITICAL (Exact Versions Required)

### React Ecosystem
- **react**: `18.2.0` (exact, no ^ or ~)
- **react-dom**: `18.2.0` (exact, must match React exactly)
- **react-native**: `0.73.6`
- **react-native-web**: `0.19.13`

**Why Exact Versions?**
- React Native Web requires exact React version matching
- Any React version mismatch causes Metro compilation failures
- React 18.2.0 is the last version confirmed working with RN 0.73.x

### NativeWind Stack
- **nativewind**: `^4.1.23` (v4 ONLY - v2/v3 completely incompatible)
- **tailwindcss**: `^3.4.17`
- **autoprefixer**: `^10.4.21`

**Why Version Sensitive?**
- NativeWind v2 → v4 migration required complete API overhaul
- v2/v3 use completely different configuration and processing
- Metro plugin API changed between versions

### Expo Metro Bundler
- **expo**: `~50.0.0`
- **@expo/metro-runtime**: `~3.1.3`

**Why Specific Versions?**
- Metro web bundler support introduced in Expo 50
- Earlier versions don't support Metro web serving
- Metro runtime required for web bundle execution

## 🟡 HIGH-CRITICAL (Break App Functionality)

### Supabase Integration
- **@supabase/supabase-js**: `^2.39.0`

### Web Polyfills (Required)
- **crypto-browserify**: `^3.12.1`
- **stream-browserify**: `^3.0.0`
- **buffer**: `^6.0.3`

### Routing
- **react-router-dom**: `^6.28.0`

## 🔧 Critical Configuration Files

### babel.config.js
```javascript
// CRITICAL: Must include NativeWind presets
presets: [
  ["babel-preset-expo", { jsxImportSource: "nativewind" }],
  "nativewind/babel"
]
```

### metro.config.js
```javascript
// CRITICAL: Must include withNativeWind plugin
const configWithNativeWind = withNativeWind(config, {
  input: './global.css',
  configPath: '../../tailwind.config.js',
});
```

### tailwind.config.js
```javascript
// CRITICAL: Must include NativeWind preset
presets: [require('nativewind/preset')]
```

### app.json
```json
{
  "expo": {
    "web": {
      "bundler": "metro"  // CRITICAL: Required for Metro web serving
    }
  }
}
```

### .npmrc
```
legacy-peer-deps=true  # CRITICAL: Required for peer dependency resolution
```

## 🚨 Known Breaking Combinations

### ❌ DO NOT UPGRADE TO:
- React 18.3.x or 19.x (breaks React Native Web)
- NativeWind v2.x or v3.x (completely incompatible APIs)
- Expo 49.x or earlier (no Metro web support)
- Remove legacy-peer-deps (breaks monorepo resolution)

### ❌ CONFIGURATION ERRORS THAT BREAK STYLING:
- Missing `jsxImportSource: "nativewind"` in Babel config
- Missing `"nativewind/babel"` preset
- Missing `nativewind/preset` in Tailwind config
- Setting `"bundler": "webpack"` in app.json

## 🧪 Pre-Upgrade Testing Protocol

### Before ANY Dependency Upgrade:

1. **Create Test Branch**
   ```bash
   git checkout -b test-upgrade-[package-name]
   ```

2. **Baseline Test**
   ```bash
   npm run test:safe
   node test-blue-user-bubble.js
   ```

3. **Upgrade & Test**
   ```bash
   npm install [package]@[version]
   npm run web  # Test Metro compilation
   node test-blue-user-bubble.js  # Test NativeWind styling
   ```

4. **Verify Critical Features**
   - Metro compilation works (no errors)
   - NativeWind CSS classes are generated (check browser dev tools)
   - Blue user message bubbles appear (not just css-view-* classes)
   - Supabase client works (no crypto/stream errors)
   - Authentication flow works

5. **Emergency Rollback**
   ```bash
   git checkout main
   npm install
   ```

## 📝 Regression History

### 2025-06-16: Babel Configuration Corruption
- **Issue**: babel.config.js missing NativeWind presets
- **Symptom**: Only React Native Web css-view-* classes, no Tailwind classes
- **Root Cause**: Missing `jsxImportSource: "nativewind"` and `"nativewind/babel"`
- **Fix**: Restored complete NativeWind Babel configuration
- **Detection**: `node test-blue-user-bubble.js` shows no blue bubbles

### Earlier: React Version Mismatches
- **Issue**: Metro compilation failures
- **Symptom**: Build errors, missing peer dependencies
- **Root Cause**: React version range instead of exact version
- **Fix**: Lock React to exact 18.2.0

### Earlier: NativeWind v2 → v4 Migration
- **Issue**: Complete API incompatibility
- **Symptom**: No CSS processing, build errors
- **Root Cause**: v2 and v4 use completely different configurations
- **Fix**: Complete config overhaul for v4

## 🆘 Emergency Procedures

### If App Breaks After Upgrade:

1. **Immediate Rollback**
   ```bash
   git reset --hard HEAD~1
   npm install
   ```

2. **Check Critical Files**
   - Verify babel.config.js has NativeWind presets
   - Verify metro.config.js has withNativeWind plugin
   - Verify app.json has "bundler": "metro"

3. **Test Critical Functions**
   ```bash
   node test-blue-user-bubble.js
   ```

4. **Get Help**
   - Check VERSION_COMPATIBILITY.md regression history
   - Search NATIVEWIND_V4_METRO_MIGRATION_TASKS.md for similar issues
   - Test with known working commit: `0ba36d752b6d`

## ✅ Safe Upgrade Candidates

### Usually Safe to Upgrade:
- ESLint, Prettier (dev tools)
- Testing libraries (@playwright/test, @axe-core/playwright)
- Documentation tools

### Approach with Caution:
- Any Babel plugins
- TypeScript (test thoroughly)
- React Router (test navigation)

### Never Upgrade Without Extreme Testing:
- React ecosystem (React, React-DOM, React-Native, React-Native-Web)
- NativeWind, Tailwind CSS
- Expo, Metro runtime
- Supabase client

---

**Remember: This stack works perfectly when versions are stable. The complexity comes from the intersection of React Native Web + NativeWind v4 + Metro bundler, which is a cutting-edge combination that requires exact version coordination.**