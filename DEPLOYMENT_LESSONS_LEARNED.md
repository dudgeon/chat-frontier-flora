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
