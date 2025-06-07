# 🔐 Authentication Flow Documentation

## ⚠️ **CRITICAL: REGRESSION PREVENTION**

This authentication flow was extremely difficult to implement correctly. **DO NOT MODIFY** without reading this entire document and understanding all dependencies.

## 🚨 **MANDATORY PRE-CHANGE CHECKLIST**

**BEFORE MAKING ANY CHANGES TO AUTHENTICATION CODE:**

- [ ] **STOP**: Is the current system working? If YES, document exactly what works before changing anything
- [ ] **BACKUP**: Create a git commit of the current working state
- [ ] **UNDERSTAND**: Read this entire documentation file
- [ ] **IDENTIFY**: List ALL files you plan to modify
- [ ] **DEPENDENCIES**: Map out what each file depends on
- [ ] **TEST PLAN**: Write down how you will verify the change works
- [ ] **ROLLBACK PLAN**: Know exactly how to revert if something breaks

**NEVER:**
- ❌ Delete files without understanding their purpose
- ❌ Remove dependencies without checking what uses them
- ❌ Change build systems without testing
- ❌ Assume "cleanup" is safe
- ❌ Make multiple changes at once
- ❌ Skip testing after each change

**ALWAYS:**
- ✅ Make one small change at a time
- ✅ Test after each change
- ✅ Commit working states frequently
- ✅ Document what you're doing and why
- ✅ Ask "what could this break?" before changing anything

---

## 🎯 **Overview**

The authentication system provides secure user account creation and management with the following key components:

1. **Database Schema** - User profiles with role-based access
2. **Authentication Context** - Global auth state management
3. **Sign-Up Form** - User registration with validation
4. **Validation System** - Real-time form validation
5. **Session Management** - Persistent authentication

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SignUpForm    │───▶│  AuthContext    │───▶│   Supabase      │
│                 │    │                 │    │                 │
│ - Form State    │    │ - signUp()      │    │ - auth.signUp() │
│ - Validation    │    │ - signIn()      │    │ - User Profiles │
│ - Submit Logic  │    │ - Session Mgmt  │    │ - RLS Policies  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   useAuth Hook  │    │ User Profile    │    │   Database      │
│                 │    │                 │    │                 │
│ - Context API   │    │ - Role System   │    │ - user_profiles │
│ - Type Safety   │    │ - Primary/Child │    │ - RLS Security  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🗄️ **Database Schema (CRITICAL)**

### **Table: `user_profiles`**

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_role user_role NOT NULL DEFAULT 'primary',
    display_name TEXT,
    parent_user_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### **⚠️ CRITICAL SCHEMA NOTES:**

1. **`id` Field**: MUST reference `auth.users(id)` - this links Supabase Auth to profiles
2. **`user_role` Enum**: Only 'primary' or 'child' - DO NOT add other values without migration
3. **`parent_user_id`**: Self-referencing for child accounts - NULL for primary users
4. **Constraint**: Child users MUST have parent_user_id, primary users MUST NOT

### **Row Level Security (RLS) Policies**

**⚠️ CRITICAL**: These policies control data access. Modifying them can break security:

1. **Read Own Profile**: `auth.uid() = id`
2. **Primary Read Child**: Primary users can read their children's profiles
3. **Update Own Profile**: Users can update their own data
4. **Primary Update Child**: Primary users can update children's profiles
5. **Insert Restrictions**: Only allows proper role creation

---

## 🔄 **Authentication Flow (Step-by-Step)**

### **1. User Registration Process**

```typescript
// 1. User fills SignUpForm
const formData = {
  email: "user@example.com",
  password: "SecurePass123",
  confirmPassword: "SecurePass123",
  displayName: "John Doe",
  agreeToTerms: true
};

// 2. Form validation runs
const isValid = validateForm(); // Must pass ALL checks

// 3. AuthContext.signUp() called
await signUp(email, password, displayName);

// 4. Supabase Auth creates user
const { data: { user }, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      display_name: displayName,
      user_role: 'primary'
    }
  }
});

// 5. User profile created (manual + trigger backup)
await supabase.from('user_profiles').insert({
  id: user.id,
  display_name: displayName,
  user_role: 'primary'
});

// 6. Profile loaded into context
await loadUserProfile(user.id);
```

### **2. Session Management**

```typescript
// On app start - check existing session
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      loadUserProfile(session.user.id);
    }
    setLoading(false);
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

---

## 📝 **Form Validation System (CRITICAL)**

### **Validation Rules (DO NOT CHANGE)**

```typescript
// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasNumber: /\d/,
  hasLetter: /[a-zA-Z]/
};

// Required fields for submission
const REQUIRED_FIELDS = [
  'email',
  'password',
  'confirmPassword',
  'agreeToTerms'
];
```

### **Submit Button Control Logic**

```typescript
// ⚠️ CRITICAL: Submit button MUST be disabled until ALL conditions met
const isFormValid = () => {
  return (
    formData.email &&
    EMAIL_REGEX.test(formData.email) &&
    formData.password &&
    formData.password.length >= 8 &&
    /\d/.test(formData.password) &&
    /[a-zA-Z]/.test(formData.password) &&
    formData.password === formData.confirmPassword &&
    formData.agreeToTerms
  );
};

// Button state
<TouchableOpacity
  style={[styles.button, (!isFormValid() || loading) && styles.buttonDisabled]}
  onPress={handleSubmit}
  disabled={!isFormValid() || loading}
>
```

---

## 🧩 **Component Dependencies**

### **Critical File Dependencies**

```
AuthContext.tsx (CORE)
├── useAuth.ts (Hook)
├── SignUpForm.tsx (UI)
│   ├── validation.ts (Utils)
│   └── auth.ts (Types)
├── supabase.ts (Client)
└── user_profiles migration (DB)
```

### **Import Chain (DO NOT BREAK)**

```typescript
// 1. Types must be imported first
import { AuthContextType, UserProfile } from '@chat-frontier-flora/shared';

// 2. Supabase client
import { supabase } from '../lib/supabase';

// 3. Context creation
export const AuthContext = createContext<AuthContextType | null>(null);

// 4. Hook usage
export const useAuth = () => useContext(AuthContext);
```

---

## ⚠️ **CRITICAL REGRESSION RISKS**

### **🚨 HIGH RISK CHANGES**

1. **Database Schema Changes**
   - ❌ Modifying `user_profiles` table structure
   - ❌ Changing RLS policies
   - ❌ Altering `user_role` enum values
   - ❌ Breaking `auth.users` relationship

2. **Authentication Context Changes**
   - ❌ Modifying `signUp()` function signature
   - ❌ Changing session management logic
   - ❌ Breaking `loadUserProfile()` function
   - ❌ Altering auth state structure

3. **Form Validation Changes**
   - ❌ Relaxing password requirements
   - ❌ Removing required field validation
   - ❌ Breaking submit button control logic
   - ❌ Changing validation error handling

4. **Supabase Integration Changes**
   - ❌ Modifying auth configuration
   - ❌ Changing client initialization
   - ❌ Breaking auth state listeners
   - ❌ Altering profile creation logic

### **🟡 MEDIUM RISK CHANGES**

1. **UI/Styling Changes**
   - ⚠️ Form layout modifications
   - ⚠️ Button styling changes
   - ⚠️ Error message display
   - ⚠️ Loading state indicators

2. **Validation Message Changes**
   - ⚠️ Error text modifications
   - ⚠️ Validation feedback timing
   - ⚠️ User experience improvements

### **✅ SAFE CHANGES**

1. **Styling Only**
   - ✅ Colors, fonts, spacing
   - ✅ Animation additions
   - ✅ Responsive design improvements

2. **Additional Features**
   - ✅ New optional form fields
   - ✅ Enhanced error messages
   - ✅ Accessibility improvements

---

## 🧪 **Testing Requirements**

### **Critical Test Cases (MUST PASS)**

```typescript
// 1. Form validation
✅ Empty fields show errors
✅ Invalid email shows error
✅ Weak password shows error
✅ Password mismatch shows error
✅ Unchecked terms shows error

// 2. Submit button control
✅ Disabled when form invalid
✅ Enabled when form valid
✅ Disabled during loading

// 3. Authentication flow
✅ Successful signup creates user
✅ Successful signup creates profile
✅ Error handling works correctly
✅ Session persistence works

// 4. Database integration
✅ User profile created correctly
✅ RLS policies enforced
✅ Role assignment works
```

### **Test Files (MUST MAINTAIN)**

- `SignUpForm.test.tsx` - Form component tests
- `AuthContext.test.tsx` - Context logic tests
- `validation.test.ts` - Validation utility tests
- `useAuth.test.ts` - Hook behavior tests

---

## 🔧 **Debugging Guide**

### **Common Issues & Solutions**

1. **"User not found" Error**
   ```typescript
   // Check: Profile creation after auth signup
   // Solution: Verify manual profile insert + trigger
   ```

2. **Submit Button Not Enabling**
   ```typescript
   // Check: All validation conditions
   // Solution: Debug isFormValid() logic step by step
   ```

3. **Session Not Persisting**
   ```typescript
   // Check: Auth state listener setup
   // Solution: Verify onAuthStateChange subscription
   ```

4. **RLS Policy Errors**
   ```sql
   -- Check: User ID matching
   -- Solution: Verify auth.uid() = profile.id
   ```

---

## 📋 **Maintenance Checklist**

### **Before Making Changes**

- [ ] Read this entire document
- [ ] Understand the specific component being modified
- [ ] Check all dependencies and imports
- [ ] Review test coverage for affected areas
- [ ] Plan rollback strategy

### **During Development**

- [ ] Test locally with real Supabase instance
- [ ] Verify all form validation scenarios
- [ ] Test submit button state changes
- [ ] Check session persistence
- [ ] Validate database operations

### **Before Deployment**

- [ ] Run all authentication tests
- [ ] Test complete signup flow end-to-end
- [ ] Verify no TypeScript errors
- [ ] Check console for warnings/errors
- [ ] Test on multiple browsers/devices

---

## 📚 **Reference Links**

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Context API](https://react.dev/reference/react/useContext)
- [Form Validation Best Practices](https://web.dev/sign-up-form-best-practices/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated**: June 7, 2025
**Status**: ✅ Production Ready
**Next Review**: Before any auth-related changes

---

## 🚨 **EMERGENCY CONTACTS**

If authentication breaks in production:

1. **Immediate**: Revert to last known working commit
2. **Debug**: Check Supabase dashboard for auth errors
3. **Escalate**: Review this documentation for root cause
4. **Fix**: Follow debugging guide above
5. **Test**: Complete maintenance checklist before redeployment

---

## 🚨 **SYSTEMATIC FAILURE PREVENTION**

### **⚠️ CRITICAL LESSONS FROM JUNE 2025 INCIDENT**

**Incident Summary**: React Native Web module resolution failures caused by careless dependency management and premature success claims.

#### **Root Cause Analysis**
1. **Careless File Deletion**: Deleted critical files without understanding dependencies
2. **Premature Success Claims**: Claimed fixes worked without proper verification
3. **Incomplete Testing**: Tested build success but ignored runtime webpack errors
4. **Version Conflict Ignorance**: Failed to properly resolve React 18.2.0 vs 18.3.1 conflicts

#### **Systematic Failures That MUST Be Prevented**

### **🔴 NEVER DO THESE THINGS**

#### **1. File Deletion Without Understanding**
```bash
# ❌ NEVER: Delete files without understanding their purpose
rm apps/web/metro.config.js  # Could break mobile builds
rm apps/web/src/main.tsx     # Could break Vite builds
rm apps/web/vite.config.ts   # Could break alternative build systems

# ✅ ALWAYS: Research file purpose first
git log --oneline apps/web/metro.config.js  # Check history
grep -r "metro.config" .                     # Check references
```

#### **2. Claiming Success Without Verification**
```bash
# ❌ NEVER: Claim "build successful" without checking runtime
npm run build  # ✅ Exits 0
# But then ignore webpack errors in browser console

# ✅ ALWAYS: Verify complete functionality
npm run build && npm run start  # Test build AND runtime
curl http://localhost:19006      # Test actual serving
# Check browser console for errors
```

#### **3. Ignoring Version Conflicts**
```bash
# ❌ NEVER: Ignore npm version warnings
npm ls react  # Shows conflicts but continue anyway

# ✅ ALWAYS: Resolve version conflicts immediately
npm ls react react-dom react-native-web  # Check ALL related packages
# Fix overrides/resolutions in package.json
# Clean install to verify resolution
```

#### **4. Making Multiple Changes Simultaneously**
```bash
# ❌ NEVER: Change multiple systems at once
# - Delete metro.config.js
# - Modify webpack.config.js
# - Update package.json
# - Change build commands
# All in one commit

# ✅ ALWAYS: One change at a time with verification
git commit -m "Fix React version conflicts"
# Test thoroughly
git commit -m "Update webpack module resolution"
# Test thoroughly
```

### **🟡 MANDATORY VERIFICATION STEPS**

#### **Before ANY Change**
```bash
# 1. Create backup branch
git checkout -b backup-before-changes
git push origin backup-before-changes

# 2. Document current working state
npm run build > build-before.log 2>&1
npm run dev:web > dev-before.log 2>&1 &
curl http://localhost:19006 > response-before.html
pkill -f "expo start"

# 3. Test critical paths
# - Authentication flow works
# - Build completes without errors
# - Runtime has no console errors
```

#### **After ANY Change**
```bash
# 1. Clean install to verify dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Test build process
npm run build 2>&1 | tee build-after.log
# Compare with build-before.log

# 3. Test runtime
npm run dev:web &
sleep 15
curl http://localhost:19006 > response-after.html
# Compare with response-before.html

# 4. Check browser console
# Open http://localhost:19006
# Check for ANY webpack/module errors
# Screenshot console if errors exist

# 5. Test authentication flow manually
# - Can you see the signup form?
# - Can you submit valid data?
# - Does it create user in Supabase?
```

### **🔧 DEPENDENCY MANAGEMENT RULES**

#### **React Native Web Specific Rules**
```json
// ✅ ALWAYS: Use exact versions for React ecosystem
{
  "dependencies": {
    "react": "18.2.0",           // EXACT, not ^18.2.0
    "react-dom": "18.2.0",       // EXACT, not ^18.2.0
    "react-native": "0.73.4",    // Match Expo SDK
    "react-native-web": "0.19.13" // Compatible with Expo 50
  },
  "overrides": {
    "react": "18.2.0",           // Force exact version
    "react-dom": "18.2.0"        // Force exact version
  }
}
```

#### **Monorepo Module Resolution Rules**
```javascript
// ✅ ALWAYS: Configure webpack for monorepo
// apps/web/webpack.config.js
config.resolve.modules = [
  path.resolve(__dirname, '../../node_modules'),  // Root modules
  path.resolve(__dirname, 'node_modules'),        // Local modules
  'node_modules'                                  // Default
];

// ❌ NEVER: Assume modules will resolve automatically
// ❌ NEVER: Mix local and hoisted node_modules
```

### **🧪 TESTING REQUIREMENTS FOR CHANGES**

#### **Level 1: Basic Functionality**
```bash
# Must pass before claiming success
✅ npm install (no errors)
✅ npm run build (exits 0)
✅ npm run dev:web (starts without errors)
✅ curl http://localhost:19006 (returns HTML)
✅ Browser console (no webpack errors)
```

#### **Level 2: Authentication Flow**
```bash
# Must pass for auth-related changes
✅ Signup form visible
✅ Form validation works
✅ Submit button enables/disables correctly
✅ Successful signup creates user
✅ Error handling displays correctly
```

#### **Level 3: Cross-Platform Compatibility**
```bash
# Must pass for build system changes
✅ Web build works (npm run build:web)
✅ Mobile build works (npm run dev:mobile)
✅ Netlify deployment works
✅ No version conflicts (npm ls)
```

### **📋 INCIDENT RESPONSE CHECKLIST**

#### **When Things Break**
```bash
# 1. STOP making changes immediately
# 2. Document the exact error
screenshot browser-console-errors.png
npm run build > error-log.txt 2>&1

# 3. Revert to last known good state
git checkout backup-before-changes
npm install
npm run build  # Verify it works

# 4. Analyze the failure systematically
diff build-before.log error-log.txt
# Identify EXACT change that caused failure

# 5. Fix ONE thing at a time
git checkout main
# Make minimal fix
# Test thoroughly
# Commit only if verified working
```

### **🔍 ERROR PATTERN RECOGNITION**

#### **React Native Web Module Errors**
```bash
# Pattern: "ENOENT: no such file or directory, open '.../apps/web/node_modules/react/...'"
# Cause: Webpack looking in wrong node_modules location
# Solution: Fix webpack.config.js resolve.modules

# Pattern: "Module not found: Can't resolve 'react-dom/client'"
# Cause: React version mismatch (18.3.1 vs 18.2.0)
# Solution: Fix package.json overrides to exact versions
```

#### **Build vs Runtime Errors**
```bash
# Pattern: "npm run build" succeeds but browser shows webpack errors
# Cause: Build process != development server
# Solution: Test BOTH build AND dev server

# Pattern: Static files serve but JavaScript fails
# Cause: Module resolution works for assets but not for JS modules
# Solution: Check webpack module resolution configuration
```

### **📚 REQUIRED READING BEFORE CHANGES**

#### **For Dependency Changes**
- [ ] Read DEPLOYMENT_LESSONS_LEARNED.md
- [ ] Understand React Native Web compatibility matrix
- [ ] Check Expo SDK compatibility guide
- [ ] Review monorepo dependency hoisting behavior

#### **For Build System Changes**
- [ ] Understand difference between Metro (mobile) and Webpack (web)
- [ ] Know when metro.config.js is needed vs not needed
- [ ] Understand module resolution in monorepos
- [ ] Test both development and production builds

#### **For Authentication Changes**
- [ ] Read this entire document
- [ ] Understand Supabase auth flow
- [ ] Know all validation requirements
- [ ] Test with real Supabase instance

### **🎯 SUCCESS CRITERIA**

#### **A change is only successful when:**
1. ✅ All builds complete without errors
2. ✅ All development servers start without errors
3. ✅ Browser console shows no webpack/module errors
4. ✅ Authentication flow works end-to-end
5. ✅ No version conflicts in dependency tree
6. ✅ Netlify deployment succeeds (if applicable)
7. ✅ Manual testing confirms functionality

#### **Documentation of success must include:**
1. Screenshots of working application
2. Copy of clean build logs
3. Copy of clean browser console
4. Confirmation of authentication flow
5. npm ls output showing clean dependencies

---

**⚠️ REMEMBER: The goal is not to fix things quickly, but to fix them correctly and permanently while learning from mistakes.**

---
