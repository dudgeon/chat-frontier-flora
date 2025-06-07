# 🔐 Authentication Quick Reference

## ⚠️ **BEFORE YOU START**

**STOP!** If you're about to modify authentication code, read [`AUTHENTICATION_FLOW_DOCUMENTATION.md`](./AUTHENTICATION_FLOW_DOCUMENTATION.md) first.

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
