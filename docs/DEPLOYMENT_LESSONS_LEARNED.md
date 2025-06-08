# Deployment Lessons Learned

## 🎯 **Critical Success: Netlify CI Deployment Fixed**

After multiple failed attempts, we successfully resolved Netlify CI deployment issues. This document captures key lessons to prevent future breakage.

---

## 🚨 **Root Cause Analysis**

### **Primary Issue**: Dependency Version Conflicts
The deployment failed due to npm ERESOLVE errors caused by:
1. **React version mismatches** between React Native (18.2.0) and React DOM (18.3.1)
2. **Problematic @expo/metro-runtime dependency** causing peer dependency conflicts
3. **Workspace complexity** with multiple lockfiles and version ranges

### **Secondary Issues**:
- React Native Web compatibility with Expo SDK 50
- Workspace npm install running twice (root + apps/web)
- Corrupted/multiple package-lock.json files

---

## ✅ **Successful Solutions**

### 1. **Exact Version Pinning**
```json
// ❌ AVOID: Version ranges that cause conflicts
"react": "^18.2.0 <19.0.0"

// ✅ USE: Exact versions for critical dependencies
"react": "18.2.0"
```

**Key Learning**: React Native requires exact React version matching. Use `18.2.0` for React Native 0.73.4.

### 2. **Dependency Cleanup**
```json
// ❌ REMOVED: Problematic dependency
"@expo/metro-runtime": "~3.1.3"  // Caused peer dependency conflicts
```

**Key Learning**: Not all Expo-related packages are necessary. Remove dependencies that cause conflicts unless absolutely required.

### 3. **npm Configuration**
```bash
# .npmrc file
legacy-peer-deps=true
```

**Key Learning**: Use `.npmrc` with `legacy-peer-deps=true` for complex monorepos with React Native Web.

### 4. **Simplified Build Strategy**
```toml
# netlify.toml - Simplified approach
[build]
  command = "npm run build"  # Use root script, not complex cd commands
  publish = "apps/web/web-build"
```

**Key Learning**: Start with simple static builds, then iterate to complexity. Don't try to solve everything at once.

---

## 🛡️ **Prevention Guidelines**

### **Dependency Management**
1. **Always pin exact React versions** in React Native projects
2. **Test dependency changes locally** before pushing
3. **Use `npm list react` to verify** no version conflicts exist
4. **Regenerate package-lock.json** after major dependency changes

### **Netlify CI Best Practices**
1. **Use root build commands** instead of complex workspace navigation
2. **Add `.npmrc` with legacy-peer-deps** for React Native Web projects
3. **Test builds locally** with same Node version as Netlify (18.x)
4. **Keep static fallback** for critical deployments

### **Debugging Workflow**
1. **Read Netlify error logs carefully** - they often provide exact solutions
2. **Follow systematic hypothesis testing**:
   - Simplify first (static build)
   - Fix dependencies second
   - Add complexity last
3. **Use Netlify development rules** as guidance

---

## 📋 **Deployment Checklist**

Before pushing dependency changes:

- [ ] **Verify React versions match** across all packages
- [ ] **Test `npm install` locally** without errors
- [ ] **Test `npm run build` locally** succeeds
- [ ] **Check for multiple package-lock files** and clean up
- [ ] **Ensure .npmrc exists** with appropriate settings
- [ ] **Verify netlify.toml uses simple commands**

---

## 🔧 **Working Configuration**

### **Package Versions (apps/web/package.json)**
```json
{
  "dependencies": {
    "react": "18.2.0",           // Exact version
    "react-dom": "18.2.0",       // Exact version
    "react-native": "0.73.4",    // Matches Expo SDK 50
    "react-native-web": "0.19.13", // Compatible with Expo SDK 50
    "expo": "~50.0.0"
  }
}
```

### **Build Configuration (netlify.toml)**
```toml
[build]
  command = "npm run build"
  publish = "apps/web/web-build"

[build.environment]
  NODE_VERSION = "18"
```

### **npm Configuration (.npmrc)**
```
legacy-peer-deps=true
```

---

## 🚀 **Next Steps**

1. **Monitor deployment stability** for a few cycles
2. **Consider upgrading to Metro web** once React Native Web issues are resolved
3. **Implement proper React Native Web build** to replace static fallback
4. **Add deployment status monitoring** to catch issues early

---

## 📚 **References**

- [Netlify Development Rules](./netlify-development.mdc) - Used for systematic debugging
- [Expo SDK 50 Changelog](https://expo.dev/changelog/2024/01-18-sdk-50) - React Native Web compatibility
- [React Native Web Compatibility](https://necolas.github.io/react-native-web/) - Version requirements

---

**Last Updated**: June 7, 2025
**Status**: ✅ Deployment Working
**Next Review**: After next major dependency update

---

## 🚨 **REACT NATIVE WEB MODULE RESOLUTION CRISIS**

### **Incident Date**: June 7, 2025
### **Severity**: Critical - Complete development/deployment failure
### **Duration**: Multiple hours of systematic failures

---

## 📋 **Incident Timeline & Lessons**

### **What Went Wrong**
1. **Careless File Deletion**: Deleted `metro.config.js`, `main.tsx`, `vite.config.ts` without understanding purpose
2. **Premature Success Claims**: Claimed fixes worked without checking browser console
3. **Version Conflict Ignorance**: React 18.3.1 installed despite requiring 18.2.0
4. **Module Resolution Misunderstanding**: Webpack looking in wrong node_modules paths

### **Systematic Failures**
```bash
# Error Pattern 1: Module path resolution
ERROR: ENOENT: no such file or directory, open '.../apps/web/node_modules/react/jsx-dev-runtime.js'
# Cause: Webpack looking in local node_modules, but dependencies hoisted to root

# Error Pattern 2: React version conflicts
ERROR: Module not found: Can't resolve 'react-dom/client'
# Cause: React 18.3.1 installed but React Native Web expects 18.2.0

# Error Pattern 3: Build vs Runtime disconnect
SUCCESS: npm run build (exits 0)
FAILURE: Browser console shows 10+ webpack module errors
# Cause: Testing build success but not runtime functionality
```

---

## 🔧 **DEFINITIVE SOLUTION GUIDE**

### **Step 1: React Version Resolution (CRITICAL)**

```bash
# 1. Check current versions (will show conflicts)
npm ls react react-dom react-native-web

# 2. Fix package.json overrides (use EXACT versions)
```

```json
{
  "overrides": {
    "react": "18.2.0",           // EXACT, not ^18.2.0
    "react-dom": "18.2.0",       // EXACT, not ^18.2.0
    "react-test-renderer": "18.2.0"
  },
  "resolutions": {
    "react": "18.2.0",           // For yarn compatibility
    "react-dom": "18.2.0",
    "react-test-renderer": "18.2.0"
  }
}
```

```bash
# 3. Force clean reinstall
rm -rf node_modules package-lock.json
npm install

# 4. Verify resolution (should show no conflicts)
npm ls react react-dom react-native-web
```

### **Step 2: Webpack Module Resolution (CRITICAL)**

```javascript
// apps/web/webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // 🔧 FIX: Monorepo module resolution
  config.resolve.modules = [
    path.resolve(__dirname, '../../node_modules'),  // Root node_modules (PRIMARY)
    path.resolve(__dirname, 'node_modules'),        // Local node_modules (FALLBACK)
    'node_modules'                                  // Default (FALLBACK)
  ];

  // ... rest of config
  return config;
};
```

### **Step 3: Verification Protocol (MANDATORY)**

```bash
# 1. Test dependency resolution
npm ls react react-dom react-native-web
# Must show: react@18.2.0, react-dom@18.2.0, react-native-web@0.19.13
# Must NOT show: "invalid" or version conflicts

# 2. Test build process
npm run build:web
# Must exit with code 0 AND produce web-build/ directory

# 3. Test development server
npm run dev:web &
sleep 15

# 4. Test HTTP response
curl -s http://localhost:19006 | grep "<title>"
# Must return: <title>web</title>

# 5. Test browser console (CRITICAL)
# Open http://localhost:19006 in browser
# Check console for webpack errors
# Must show NO "Module not found" or "ENOENT" errors

# 6. Kill server
pkill -f "expo start"
```

---

## 🚨 **ERROR PATTERN RECOGNITION**

### **React Native Web Specific Errors**

#### **Pattern A: Module Path Resolution**
```bash
ERROR: ENOENT: no such file or directory, open '.../apps/web/node_modules/react-native-web/dist/exports/Alert/index.js'

Root Cause: Webpack looking in apps/web/node_modules but dependencies in root node_modules
Solution: Fix webpack.config.js resolve.modules configuration
```

#### **Pattern B: React Version Mismatch**
```bash
ERROR: Module not found: Can't resolve 'react-dom/client'

Root Cause: React 18.3.1 installed but React Native Web 0.19.13 expects 18.2.0
Solution: Force exact React 18.2.0 in package.json overrides
```

#### **Pattern C: Source Map Loader Issues**
```bash
ERROR: Module build failed (from ../../node_modules/source-map-loader/dist/cjs.js)

Root Cause: Source map loader can't find files due to path resolution
Solution: Fix module resolution first, source maps will follow
```

### **Build vs Runtime Disconnect**
```bash
# Dangerous Pattern: False Success
✅ npm run build (exits 0)
❌ Browser console (10+ webpack errors)

# Why This Happens:
# - Build process uses different module resolution than dev server
# - Static assets build successfully but JS modules fail to resolve
# - Need to test BOTH build AND runtime

# Correct Verification:
✅ npm run build (exits 0)
✅ npm run dev:web (starts without errors)
✅ curl http://localhost:19006 (returns HTML)
✅ Browser console (no webpack errors)
```

---

## 📋 **PREVENTION CHECKLIST**

### **Before Making Dependency Changes**
- [ ] Create backup branch: `git checkout -b backup-before-deps`
- [ ] Document current state: `npm ls > deps-before.txt`
- [ ] Test current functionality: `npm run build && npm run dev:web`
- [ ] Screenshot working browser console

### **During Dependency Changes**
- [ ] Change ONE thing at a time
- [ ] Use exact versions for React ecosystem
- [ ] Clean install after each change: `rm -rf node_modules && npm install`
- [ ] Test immediately: `npm ls react react-dom react-native-web`

### **After Dependency Changes**
- [ ] Verify no version conflicts: `npm ls | grep invalid`
- [ ] Test build: `npm run build:web`
- [ ] Test dev server: `npm run dev:web`
- [ ] Test browser console: Open localhost, check for errors
- [ ] Test authentication flow: Manual signup test

### **Before Making Build System Changes**
- [ ] Understand current build system (Expo webpack vs Vite vs Metro)
- [ ] Research file purpose: `git log --oneline filename`
- [ ] Check file references: `grep -r "filename" .`
- [ ] Test current module resolution: `node -e "console.log(require.resolve('react'))"`

### **After Build System Changes**
- [ ] Test both development and production builds
- [ ] Verify module resolution in browser console
- [ ] Test cross-platform compatibility (web + mobile)
- [ ] Check Netlify deployment if applicable

---

## 🎯 **SUCCESS CRITERIA MATRIX**

| Test Level | Requirement | Command | Expected Result |
|------------|-------------|---------|-----------------|
| **L1: Dependencies** | No version conflicts | `npm ls react react-dom react-native-web` | All exact 18.2.0, 0.19.13 |
| **L2: Build** | Build completes | `npm run build:web` | Exit code 0 + web-build/ |
| **L3: Dev Server** | Server starts | `npm run dev:web` | No startup errors |
| **L4: HTTP** | Serves content | `curl http://localhost:19006` | Returns HTML |
| **L5: Runtime** | No JS errors | Browser console | No webpack/module errors |
| **L6: Auth Flow** | End-to-end works | Manual test | Signup creates user |

### **Failure at Any Level = STOP and Fix**
- ❌ L1 Failure: Fix package.json overrides
- ❌ L2 Failure: Check build configuration
- ❌ L3 Failure: Check webpack.config.js
- ❌ L4 Failure: Check server startup
- ❌ L5 Failure: Check module resolution
- ❌ L6 Failure: Check authentication code

---

## 🔍 **DEBUGGING COMMANDS**

### **Dependency Analysis**
```bash
# Check all React-related packages
npm ls | grep react

# Check specific package resolution
node -e "console.log(require.resolve('react-native-web'))"

# Check for duplicate packages
npm ls --depth=0 | grep react
```

### **Module Resolution Testing**
```bash
# Test webpack module resolution
cd apps/web
node -e "
const path = require('path');
console.log('Root modules:', path.resolve(__dirname, '../../node_modules'));
console.log('Local modules:', path.resolve(__dirname, 'node_modules'));
console.log('React location:', require.resolve('react'));
"
```

### **Build Analysis**
```bash
# Verbose build output
npm run build:web -- --verbose

# Development server with debug
DEBUG=expo:* npm run dev:web

# Webpack bundle analysis
npm run build:web -- --analyze
```

---

## 📚 **REQUIRED KNOWLEDGE**

### **React Native Web Compatibility**
- React Native Web 0.19.13 requires React 18.2.0 (EXACT)
- Expo SDK 50 uses React Native 0.73.4
- Version mismatches cause module resolution failures

### **Monorepo Module Resolution**
- npm hoists dependencies to root node_modules
- Webpack needs explicit module resolution paths
- Local node_modules can override root dependencies

### **Expo Build Systems**
- Mobile: Metro bundler (metro.config.js)
- Web: Webpack (webpack.config.js via @expo/webpack-config)
- Different bundlers = different module resolution

---

**🎯 GOLDEN RULE: Never claim success until browser console is clean and authentication flow works end-to-end.**

---
