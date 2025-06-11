# Monorepo Import Guidelines - chat-frontier-flora

## 🚨 CRITICAL: Import Path Standards

**This document prevents the FormInput import path confusion that caused compilation errors.**

---

## 📋 Component Import Patterns

### ✅ CORRECT: Authentication Components Pattern

**Follow SignUpForm pattern for all auth components:**

```typescript
// ✅ CORRECT - Direct React Native imports
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

// ✅ CORRECT - Local hooks and utilities
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validateEmail } from '../../../utils/validation';
```

### 🎨 STYLING CONSISTENCY

**Both LoginForm and SignUpForm now use consistent styling:**

- ✅ **Unified Design**: Both forms use the same color palette, spacing, and typography
- ✅ **Card Layout**: Both forms use elegant card design with shadows and rounded corners
- ✅ **Background Consistency**: Both forms have the same light gray background (`#f9fafb`)
- ✅ **Consistent Input Fields**: Same border radius (12px), padding (12px), and error states
- ✅ **Password Toggles**: Both forms include show/hide password functionality for better UX
- ✅ **Matching Buttons**: Same button styling with consistent colors and spacing
- ✅ **Harmonized Typography**: Consistent font sizes and weights across both forms

### ❌ INCORRECT: Deep Package Imports

```typescript
// ❌ WRONG - Deep import paths that break
import { FormInput } from '../../../../../../packages/ui/src/components/FormInput';

// ❌ WRONG - Package imports that don't resolve
import { FormInput } from '@chat-frontier-flora/ui';
```

---

## 🎯 Form Input Standards

### Current Pattern: TextInput + Inline Styling

**All authentication forms use TextInput directly with design system constants:**

```typescript
// ✅ CORRECT - Form field pattern used in SignUpForm and LoginForm
<View>
  <Text style={{
    fontSize: designSystem.fontSize.base,
    fontWeight: designSystem.fontWeight.medium,
    color: designSystem.colors.gray700,
    marginBottom: designSystem.spacing.sm,
  }}>
    Email Address
  </Text>
  <TextInput
    style={{
      height: 48,
      borderWidth: 1,
      borderColor: hasError ? designSystem.colors.red500 : designSystem.colors.gray300,
      borderRadius: designSystem.borderRadius.lg,
      paddingHorizontal: designSystem.spacing.md,
      fontSize: designSystem.fontSize.base,
      backgroundColor: designSystem.colors.white,
    }}
    value={value}
    onChangeText={onChangeText}
    placeholder="Enter your email address"
  />
  {hasError && (
    <Text style={{
      color: designSystem.colors.red500,
      fontSize: designSystem.fontSize.sm,
      marginTop: designSystem.spacing.xs,
    }}>
      {errorMessage}
    </Text>
  )}
</View>
```

### Why Not FormInput Component?

1. **Import Resolution Issues**: Package imports don't work reliably in current monorepo setup
2. **Consistency**: SignUpForm uses TextInput directly - maintain consistency
3. **Design System**: Inline styles with design system constants work perfectly
4. **Simplicity**: Fewer dependencies, clearer code

---

## 📁 Monorepo Structure Understanding

### Package Structure
```
packages/
├── ui/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormInput.tsx      # ⚠️ Exists but import issues
│   │   │   ├── ValidationIcon.tsx
│   │   │   └── ConsentText.tsx
│   │   └── index.ts               # Exports components
│   └── package.json               # @chat-frontier-flora/ui
└── shared/
    └── ...
```

### Apps Structure
```
apps/
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── SignUpForm.tsx    # ✅ Uses TextInput pattern
│   │   │   │   ├── LoginForm.tsx     # ✅ Fixed to use TextInput pattern
│   │   │   │   └── AuthFlow.tsx
│   │   │   └── ...
│   │   └── ...
│   └── package.json                  # Lists @chat-frontier-flora/ui as dependency
```

---

## 🔧 Import Resolution Rules

### 1. React Native Components
```typescript
// ✅ ALWAYS import React Native components directly
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
```

### 2. Local Hooks and Utilities
```typescript
// ✅ Use relative paths for local imports
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../hooks/useFormValidation';
import { validateEmail } from '../../../utils/validation';
```

### 3. Package Imports (Currently Problematic)
```typescript
// ❌ AVOID - These don't resolve properly
import { FormInput } from '@chat-frontier-flora/ui';
import { SomeComponent } from '@chat-frontier-flora/shared';

// ✅ WORKAROUND - Use direct patterns instead
// Copy the pattern from working components like SignUpForm
```

### 4. Third-Party Packages
```typescript
// ✅ Standard npm package imports work fine
import { createClient } from '@supabase/supabase-js';
import React, { useState } from 'react';
```

---

## 🛡️ Error Prevention Checklist

### Before Adding New Components

- [ ] **Check existing patterns**: Look at SignUpForm.tsx for form patterns
- [ ] **Avoid deep imports**: Never use `../../../../../../packages/` paths
- [ ] **Test imports**: Verify imports resolve before writing component logic
- [ ] **Follow consistency**: Match the pattern of similar existing components

### When Import Errors Occur

1. **Check compilation output**: Look for "Module not found" errors
2. **Compare with working components**: See how SignUpForm handles similar needs
3. **Use direct React Native components**: TextInput instead of custom FormInput
4. **Apply design system inline**: Use designSystem constants for styling

### Common Import Error Patterns

```typescript
// ❌ These patterns cause "Module not found" errors:
import { FormInput } from '../../../../../../packages/ui/src/components/FormInput';
import { FormInput } from '@chat-frontier-flora/ui';

// ✅ Use these patterns instead:
import { TextInput } from 'react-native';
// + inline styling with design system constants
```

---

## 🎨 Design System Integration

### Design System Constants Pattern

```typescript
// ✅ CORRECT - Design system constants (copy from existing components)
const designSystem = {
  colors: {
    white: '#FFFFFF',
    gray300: '#D1D5DB',
    gray700: '#374151',
    red500: '#EF4444',
    blue600: '#2563EB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  borderRadius: {
    lg: 8,
  },
  fontSize: {
    sm: 14,
    base: 16,
  },
  fontWeight: {
    medium: '500' as const,
  },
};
```

### Styling Application

```typescript
// ✅ Apply design system to React Native components
<TextInput
  style={{
    height: 48,
    borderWidth: 1,
    borderColor: designSystem.colors.gray300,
    borderRadius: designSystem.borderRadius.lg,
    paddingHorizontal: designSystem.spacing.md,
    fontSize: designSystem.fontSize.base,
    backgroundColor: designSystem.colors.white,
  }}
/>
```

---

## 🚀 Future Improvements

### When Package Imports Are Fixed

1. **Module Resolution**: Fix webpack/metro configuration for package imports
2. **FormInput Usage**: Can then use `import { FormInput } from '@chat-frontier-flora/ui'`
3. **Component Library**: Leverage the UI package components properly

### Until Then

1. **Maintain Consistency**: Keep using TextInput + design system pattern
2. **Document Patterns**: Update this guide when patterns change
3. **Test Thoroughly**: Always verify imports resolve before committing

---

## 📚 Reference Examples

### Working Component: SignUpForm.tsx
- **Location**: `apps/web/src/components/auth/SignUpForm.tsx`
- **Pattern**: TextInput + design system constants
- **Status**: ✅ Compiles and works correctly

### Fixed Component: LoginForm.tsx
- **Location**: `apps/web/src/components/auth/LoginForm.tsx`
- **Previous Issue**: FormInput import path errors
- **Solution**: Converted to TextInput pattern matching SignUpForm
- **Status**: ✅ Fixed and working

---

## 🔄 Maintenance

### When to Update This Document

1. **Import patterns change**: New working patterns discovered
2. **Package resolution fixed**: When @chat-frontier-flora/ui imports work
3. **New components added**: Document any new import patterns
4. **Errors encountered**: Add new error patterns and solutions

### Review Schedule

- **After major changes**: Review when adding new components
- **Monthly**: Check if patterns have evolved
- **When errors occur**: Update with new solutions

---

**Last Updated**: December 2024
**Status**: Active - Prevents FormInput import errors
**Next Review**: After package import resolution is fixed
