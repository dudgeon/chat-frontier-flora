# 🔐 Authentication Quick Reference

## 🚨 **CRITICAL FAILURE PREVENTION (READ FIRST)**

### **⚠️ BEFORE ANY CHANGE**
```bash
# 1. MANDATORY: Create backup
git checkout -b backup-$(date +%Y%m%d-%H%M)
git push origin backup-$(date +%Y%m%d-%H%M)

# 2. MANDATORY: Test current state
npm run build:web && npm run dev:web &
sleep 10 && curl http://localhost:19006 | grep "<title>"
# Must return: <title>web</title>
pkill -f "expo start"

# 3. MANDATORY: Check dependencies
npm ls react react-dom react-native-web | grep -E "(invalid|UNMET)"
# Must return: NO OUTPUT (no conflicts)
```

### **🔴 NEVER DO THESE**
- ❌ Delete files without `git log --oneline filename`
- ❌ Claim success without checking browser console
- ❌ Ignore npm version conflicts
- ❌ Make multiple changes in one commit
- ❌ Skip testing after dependency changes

### **✅ ALWAYS DO THESE**
- ✅ One change at a time with immediate testing
- ✅ Use exact versions for React ecosystem (18.2.0)
- ✅ Test browser console for webpack errors
- ✅ Verify authentication flow end-to-end
- ✅ Document what you changed and why

### **🧪 SUCCESS VERIFICATION**
```bash
# ALL must pass before claiming success:
✅ npm ls react react-dom react-native-web  # No conflicts
✅ npm run build:web                        # Exit code 0
✅ npm run dev:web                          # Starts without errors
✅ curl http://localhost:19006              # Returns HTML
✅ Browser console at localhost:19006       # No webpack errors
✅ Manual signup test                       # Creates user in Supabase
```

---

## ⚠️ **BEFORE YOU START**

**STOP!** If you're about to modify authentication code, read [`AUTHENTICATION_FLOW_DOCUMENTATION.md`](./AUTHENTICATION_FLOW_DOCUMENTATION.md) first.

## 🚨 **CRITICAL: PREVENT CARELESS MISTAKES**

**This system has been broken by careless changes before. DO NOT:**

- ❌ **Delete files without understanding their purpose**
- ❌ **Remove dependencies without checking what uses them**
- ❌ **Change build configurations without testing**
- ❌ **Assume any file is "unused" or "safe to remove"**
- ❌ **Make multiple changes at once**
- ❌ **Skip testing after each change**

**MANDATORY STEPS:**
1. **Document current working state** before any changes
2. **Make ONE change at a time**
3. **Test immediately after each change**
4. **Commit working states frequently**
5. **Have a rollback plan ready**

**If something breaks: IMMEDIATELY revert to last working commit!**

---

## 🚨 **Critical Files - Handle with Care**

| File | Purpose | Risk Level | Notes |
|------|---------|------------|-------|
| `apps/web/src/contexts/AuthContext.tsx` | 🔴 **CRITICAL** | **HIGH** | Core auth logic - breaking changes affect entire app |
| `apps/web/src/components/auth/SignUpForm.tsx` | 🟡 **IMPORTANT** | **MEDIUM** | User registration - validation logic is critical |
| `apps/web/utils/validation.ts` | 🟡 **IMPORTANT** | **MEDIUM** | Form security - relaxing rules weakens security |
| `supabase/migrations/20240325_create_user_profiles.sql` | 🔴 **CRITICAL** | **HIGH** | Database schema - changes require migration |
| `packages/shared/src/types/auth.ts` | 🟡 **IMPORTANT** | **MEDIUM** | Type definitions - changes break components |

---

## 🔄 **Authentication Flow (Simplified)**

```
User fills form → Validation → AuthContext.signUp() → Supabase Auth → Profile Creation → Session Start
```

### **Key Steps:**
1. **Form Validation**: All fields must pass validation
2. **Submit Control**: Button disabled until form is valid
3. **Account Creation**: Supabase creates auth user
4. **Profile Creation**: Manual insert + trigger backup
5. **Session Management**: Auto-login and persistence

---

## ✅ **Safe Changes**

- 🎨 **Styling**: Colors, fonts, spacing, animations
- 📝 **Text**: Error messages, labels (keep meaning clear)
- 🔧 **Optional Features**: New non-required form fields
- ♿ **Accessibility**: ARIA labels, screen reader support

---

## ⚠️ **Dangerous Changes**

- 🔐 **Validation Rules**: Password requirements, email regex
- 🗄️ **Database Schema**: user_profiles table, RLS policies
- 🔄 **Auth Flow**: signUp() function, session management
- 🎯 **Submit Logic**: Button state control, form validation

---

## 🧪 **Testing Checklist**

Before deploying auth changes:

- [ ] **Form Validation**: Test all validation scenarios
- [ ] **Submit Button**: Verify disabled/enabled states
- [ ] **Account Creation**: Test complete signup flow
- [ ] **Session Persistence**: Test browser restart
- [ ] **Error Handling**: Test network failures
- [ ] **Multiple Browsers**: Test cross-browser compatibility

---

## 🚨 **Emergency Procedures**

### **If Authentication Breaks:**

1. **Immediate**: Revert to last working commit
2. **Check**: Supabase dashboard for auth errors
3. **Debug**: Follow debugging guide in main documentation
4. **Test**: Complete testing checklist before redeployment

### **Common Issues:**

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Submit button won't enable | Form validation logic | Check `isFormValid()` function |
| "User not found" error | Profile creation failed | Check manual profile insert |
| Session not persisting | Auth listener broken | Check `onAuthStateChange` setup |
| RLS policy errors | User ID mismatch | Verify `auth.uid() = profile.id` |

---

## 📞 **Getting Help**

1. **Read**: [`AUTHENTICATION_FLOW_DOCUMENTATION.md`](./AUTHENTICATION_FLOW_DOCUMENTATION.md)
2. **Check**: Component comments for specific guidance
3. **Test**: Use debugging guide in main documentation
4. **Ask**: Include specific error messages and steps to reproduce

---

## 🔗 **Quick Links**

- [📚 Full Documentation](./AUTHENTICATION_FLOW_DOCUMENTATION.md)
- [🏗️ Deployment Guide](./DEPLOYMENT_LESSONS_LEARNED.md)
- [📋 Task Status](./tasks/tasks-prd-auth-flow.md)
- [🎯 PRD Requirements](./tasks/prd-auth-flow.md)

---

**Remember**: The authentication system was extremely difficult to implement correctly. When in doubt, don't change it! 🛡️
