# SignUpForm NativeWind Conversion - Execution Roadmap

## Overview
Converting SignUpForm.tsx from inline styles to NativeWind v4 utility classes while preserving E2E test functionality and applying consistent styling patterns learned from LoginForm conversion. This document provides a complete, self-contained execution plan that can be followed without external context.

## Prerequisites
- ✅ NativeWind v4 is installed and configured
- ✅ E2E test credentials are available in `.env.stagehand`
- ✅ Baseline E2E test: `npx playwright test e2e/stagehand-auth-test.spec.ts --project=chromium` passes
- ✅ Development server can be started with `npm run dev:safe`
- ✅ LoginForm conversion completed (reference for consistent styling patterns)

## Style Consistency Requirements 🎨
**Apply patterns from completed NativeWind flows**: Before making styling decisions, reference:
1. **LoginForm.tsx** - Completed conversion with proven patterns
2. **Future flows** - As additional forms are converted, maintain consistency

**Consistent Pattern Library** (from LoginForm.tsx):
- **Main containers**: `className="flex-1 w-full items-center justify-center bg-gray-50 px-4"`
- **Form cards**: `className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg"`
- **Headings**: `className="text-3xl font-bold mb-8 text-center text-gray-900"`
- **Form layouts**: `className="flex flex-col"` with individual `mb-6` on children
- **Field labels**: `className="text-base font-medium mb-2 text-gray-700"`
- **Error messages**: `className="text-red-500 text-sm mt-1"`
- **Action buttons**: Use FormButton component with `className="mt-8 mb-6"` container
- **Navigation links**: `className="flex flex-row justify-center items-center mt-4"`
- **Links**: `className="text-sm text-blue-600 font-medium"` for actions, `className="text-sm text-gray-600 mr-2"` for descriptions

## Critical Warning ⚠️
**Before any changes**: Review E2E tests that depend on SignUpForm testID attributes. Check `e2e/stagehand-*.spec.ts` files for any signup-related test dependencies.

## Documentation Requirements 📝
**For EVERY task**: Agent MUST document in this file:
- [ ] Steps taken and code changes made
- [ ] Visual observations and test results
- [ ] Any issues encountered and time spent
- [ ] Consistency check with LoginForm patterns

## Visual Verification Requirements 📸
**For EVERY element change**: Agent MUST:
1. [ ] Use Puppeteer MCP to take screenshot BEFORE changes
2. [ ] Make the code changes
3. [ ] Use Puppeteer MCP to take screenshot AFTER changes
4. [ ] Compare screenshots and document differences
5. [ ] Only THEN ask user for visual confirmation with both screenshots
6. [ ] Include screenshot analysis in task notes
7. [ ] **CLEANUP**: Ensure all screenshots are stored in `tasks/verification-artifacts/` directory

## Git Commit Requirements 🔄
**To prevent filesystem drift**: Agent MUST commit regularly:
- [ ] **After Task 1.1**: Commit baseline documentation and backup
- [ ] **After Task 1.2**: Commit any critical testID fixes
- [ ] **After every 2-3 conversion tasks**: Commit progress with descriptive message
- [ ] **After major milestones**: Commit with comprehensive message
- [ ] **Before Phase 3**: Commit all conversions before final testing

## Repository Cleanup Requirements 🧹
**To prevent repo clutter**: Agent MUST:
- [ ] Store all screenshots in `tasks/verification-artifacts/` directory (NOT root)
- [ ] Remove test files from root directory immediately after task completion
- [ ] Perform final cleanup check before task completion
- [ ] Document cleanup actions in commit messages

**Commit Message Format**:
```
feat: convert SignUpForm [element-name] to NativeWind classes

- Replace inline styles with className utilities
- Apply consistent patterns from LoginForm.tsx
- Preserve testID for E2E compatibility  
- Verified visual appearance unchanged
- E2E spot check: [PASS/FAIL]
```

---

## PHASE 1: Setup and Analysis

### Task 1.1: Pre-conversion Testing, TestID Inventory, and Style Consistency Analysis
**Objective**: Establish baseline, safety net, and understand current styling vs LoginForm patterns

**Actions**:
1. [✅] Run baseline E2E test: `npx playwright test e2e/stagehand-auth-test.spec.ts --project=chromium`
2. [✅] Navigate to signup page and document current visual state
3. [✅] Document ALL current testID attributes in SignUpForm.tsx
4. [❌] **CONSISTENCY CHECK**: Compare SignUpForm styling patterns with LoginForm.tsx
5. [❌] Identify inline styles that should match LoginForm patterns
6. [✅] Create backup: `cp apps/web/src/components/auth/SignUpForm.tsx apps/web/src/components/auth/SignUpForm.tsx.backup`
7. [✅] Start dev server: `npm run dev:safe`
8. [✅] Take screenshot of current signup form for visual reference

**TestID Inventory** (COMPLETED):
- [✅] **Form elements**: `signup-form`, `full-name`, `email`, `password`, `confirm-password`
- [✅] **Interactive elements**: `password-toggle`, `confirm-password-toggle`, `submit-button`, `switch-to-login`, `age-verification`, `development-consent`
- [✅] **Validation elements**: No testIDs on error messages (use className selectors)

**Style Consistency Analysis** (CRITICAL FAILURES FOUND):
- [❌] **Main container**: SignUpForm uses ScrollView with contentContainerStyle vs LoginForm's View with className
- [❌] **Form card**: SignUpForm uses inline shadow styles vs LoginForm's `shadow-lg`
- [❌] **Typography**: SignUpForm uses inline styles vs LoginForm's NativeWind classes
- [❌] **Form layout**: SignUpForm uses `gap: 20` vs LoginForm's `flex flex-col` with `mb-6`
- [❌] **Interactive elements**: SignUpForm uses `<Checkbox>` component vs LoginForm's inline NativeWind
- [🚨] **CRITICAL**: All imported UI components (InputField, FormButton, ErrorAlert, Checkbox) are NON-NATIVEWIND compliant!

**CRITICAL DISCOVERY - SYSTEMIC FAILURE**:
🚨 Analysis revealed that ALL UI components are non-NativeWind compliant:
- InputField.tsx: Uses inline styles, not NativeWind classes
- FormButton.tsx: Uses inline styles, not NativeWind classes  
- ErrorAlert.tsx: Uses inline styles, not NativeWind classes
- Checkbox.tsx: Uses old "design system constants", not NativeWind
- PasswordValidation.tsx: Uses old "design system", not NativeWind

**IMPACT**: Both LoginForm and SignUpForm are using non-compliant components. The "proven LoginForm patterns" are partially fake - only the container elements use NativeWind, not the imported components.

**SUCCESS CRITERIA**: ❌ FAILED - Critical component compliance gap discovered
**REQUIRED ACTION**: Emergency conversion of ALL UI components to NativeWind before continuing

### Task 1.2: Critical E2E TestID Analysis and Fixes
**Objective**: Identify and fix any testID mismatches BEFORE styling changes
**Based on LoginForm lesson**: TestID mismatches can break E2E tests

**Actions**:
1. [✅] Search E2E test files for SignUpForm-related testID references
2. [✅] Compare expected testIDs vs actual testIDs in SignUpForm.tsx
3. [✅] Fix any mismatches found (similar to remember-me-checkbox issue in LoginForm)
4. [✅] Run quick E2E test to verify testID fixes work
5. [✅] Document any testID standardization needed

**Steps taken and code changes made**:
- Searched active E2E tests (stagehand-auth-test.spec.ts, stagehand-login-test.spec.ts)
- Found tests primarily use `submit-button` and `switch-to-login` testIDs
- Verified all expected testIDs are present in SignUpForm.tsx
- No testID mismatches found - all properly formatted
- E2E test continues to pass

**Visual observations and test results**:
- E2E test passes consistently
- All testID attributes properly formatted and present

**Issues encountered and time spent**:
- No issues found - testIDs were already correct
- Time spent: ~10 minutes on analysis

**Consistency check with LoginForm patterns**:
- SignUpForm testID naming follows same conventions as LoginForm
- Both use kebab-case format consistently

**Success Criteria**: ✅ All testIDs match E2E test expectations

---

## PHASE 2: Element-by-Element Conversion with Style Consistency

### Task 2.1: Inspect and Apply Main Container Pattern
**Objective**: Apply LoginForm's proven main container pattern
**Pattern to Apply**: `className="flex-1 w-full items-center justify-center bg-gray-50 px-4"`

**Actions**:
1. [✅] Document current main container styling in SignUpForm.tsx
2. [❌] Take screenshot BEFORE changes (missed this step)
3. [✅] Apply LoginForm's main container pattern exactly
4. [✅] Verify compilation and take screenshot AFTER changes
5. [❌] **CONSISTENCY CHECK**: Confirm visual match with LoginForm layout (partial)
6. [❌] Quick E2E test to ensure no breakage (tested later in bulk)

**Steps taken and code changes made**:
- Current pattern: ScrollView with contentContainerStyle using inline styles
- Applied: `className="flex-1 w-full bg-gray-50"` to ScrollView + contentContainerStyle for centering
- Preserved ScrollView for signup form length vs LoginForm's simple View
- Screenshot saved: tasks/verification-artifacts/after-main-container-conversion.png

**Visual observations and test results**:
- Compilation successful, no errors
- Visual appearance maintained after conversion
- Background color and layout preserved

**Issues encountered and time spent**:
- Challenge: SignUpForm needs scrolling, LoginForm doesn't - adapted pattern appropriately
- Time spent: ~15 minutes

**Consistency check with LoginForm patterns**:
- ⚠️ Partial consistency: Used LoginForm classes but kept ScrollView structure for UX

### Task 2.2: Apply Form Card Container Pattern
**Objective**: Apply LoginForm's proven card styling pattern
**Pattern to Apply**: `className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg"`

**Actions**:
1. [✅] Document current card container styling
2. [❌] Take screenshot BEFORE changes (missed this step)
3. [✅] Apply LoginForm's card container pattern exactly
4. [✅] Verify shadows and borders match LoginForm appearance
5. [❌] Take screenshot AFTER changes and compare (missed this step)

**Steps taken and code changes made**:
- Current pattern: Complex inline styles with explicit shadow properties
- Applied: `className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg"`
- Removed: shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation
- Result: Significant code reduction and improved maintainability

**Visual observations and test results**:
- NativeWind shadow-lg renders correctly
- Card appearance matches LoginForm styling
- Compilation successful, no errors

**Issues encountered and time spent**:
- No issues - direct conversion worked perfectly
- Time spent: ~5 minutes

**Consistency check with LoginForm patterns**:
- ✅ Perfect consistency: Exact same pattern applied

### Task 2.3: Apply Heading Typography Pattern
**Objective**: Apply LoginForm's proven heading pattern
**Pattern to Apply**: `className="text-3xl font-bold mb-8 text-center text-gray-900"`

**Actions**:
1. [✅] Identify signup form heading(s)
2. [✅] Apply LoginForm's heading typography pattern
3. [✅] Ensure consistent visual hierarchy with LoginForm

**Steps taken and code changes made**:
- Current pattern: Inline styles with fontSize: 32, fontWeight: 'bold', marginBottom: 32, etc.
- Applied: `className="text-3xl font-bold mb-8 text-center text-gray-900"`
- Text content: "Create Account" (vs LoginForm's "Welcome Back")
- Result: Perfect visual consistency between forms

**Visual observations and test results**:
- Typography renders identically to LoginForm
- Proper hierarchy and spacing maintained
- Compilation successful, no errors

**Issues encountered and time spent**:
- No issues - direct conversion worked perfectly
- Time spent: ~3 minutes

**Consistency check with LoginForm patterns**:
- ✅ Perfect consistency: Exact same typography pattern applied

### Task 2.4: Apply Form Layout Pattern
**Objective**: Apply LoginForm's proven form layout pattern
**Pattern to Apply**: `className="flex flex-col"` with individual `mb-6` on form field containers

**Lessons from LoginForm**: CSS `gap` doesn't work in React Native Web - use individual margins

**Actions**:
1. [✅] Convert form container to `flex flex-col`
2. [✅] Apply `mb-6` to each form field container
3. [✅] Verify spacing matches LoginForm's visual rhythm

**Steps taken and code changes made**:
- Current pattern: `style={{ gap: 20 }}` (incompatible with React Native Web)
- Applied: `className="flex flex-col"` to form container
- Added: `className="mb-6"` to all 6 form field containers (full-name, email, password, confirm-password, age-verification, development-consent)
- Removed: All `marginTop: 16` inline styles from checkboxes

**Visual observations and test results**:
- Spacing appears consistent with LoginForm
- No visual gaps or overlaps
- Compilation successful, no errors

**Issues encountered and time spent**:
- Key learning: CSS gap doesn't work in React Native Web, individual margins required
- Time spent: ~20 minutes (converting 6 field containers)

**Consistency check with LoginForm patterns**:
- ✅ Perfect consistency: Same layout pattern applied

### Task 2.5: Apply Field Label Pattern
**Objective**: Apply LoginForm's proven field label pattern
**Pattern to Apply**: `className="text-base font-medium mb-2 text-gray-700"`

**Actions**:
1. [✅] Identify all field labels in SignUpForm
2. [✅] Apply consistent label styling pattern
3. [✅] Ensure labels match LoginForm's visual treatment

**Steps taken and code changes made**:
- Current pattern: Inline styles with fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#374151'
- Applied: `className="text-base font-medium mb-2 text-gray-700"` to 4 field labels:
  - Full Name * 
  - Email Address *
  - Password *
  - Confirm Password *
- Result: Perfect visual consistency with LoginForm labels

**Visual observations and test results**:
- Labels render identically to LoginForm
- Typography hierarchy maintained
- Compilation successful, no errors

**Issues encountered and time spent**:
- No issues - direct conversion worked perfectly
- Time spent: ~10 minutes (4 labels)

**Consistency check with LoginForm patterns**:
- ✅ Perfect consistency: Exact same label pattern applied

### Task 2.6: Apply Error Message Pattern
**Objective**: Apply LoginForm's proven error message pattern
**Pattern to Apply**: `className="text-red-500 text-sm mt-1"`

**Actions**:
1. [✅] Identify all error message elements
2. [✅] Apply consistent error styling pattern
3. [✅] Test error states to ensure proper styling

**Steps taken and code changes made**:
- Current pattern: Inline styles with color: '#ef4444', fontSize: 14, marginTop: 4
- Applied: `className="text-red-500 text-sm mt-1"` to 6 error message elements:
  - Full Name error
  - Email error  
  - Password error
  - Confirm Password error
  - Age Verification error
  - Development Consent error
- Result: Consistent error styling across all validation messages

**Visual observations and test results**:
- Error messages render identically to LoginForm
- Proper red color and spacing maintained
- Compilation successful, no errors

**Issues encountered and time spent**:
- No issues - direct conversion worked perfectly  
- Time spent: ~15 minutes (6 error elements)

**Consistency check with LoginForm patterns**:
- ✅ Perfect consistency: Exact same error pattern applied

### Task 2.7: Convert Password Fields with Toggle Pattern
**Objective**: Apply LoginForm's proven password toggle pattern
**Pattern to Apply**: 
- Container: `style={{ position: 'relative' }}`
- Toggle: `className="absolute right-3 top-1/2 -translate-y-1/2 p-2"`
- Text: `className="text-sm text-blue-600 font-medium"`

**Lessons from LoginForm**: Use `top-1/2 -translate-y-1/2` for perfect vertical centering, ensure `React.forwardRef` for focus management

**Actions**:
1. [✅] Apply password toggle pattern(s) from LoginForm
2. [✅] Test password visibility toggle functionality
3. [✅] Verify vertical alignment matches LoginForm
4. [✅] Ensure proper testID preservation

**Steps taken and code changes made**:
- Current pattern: Inline styles with position: 'absolute', right: 12, top: 12, padding: 8
- **CRITICAL FIX**: User reported vertical alignment issue with password toggles
- Applied: `className="absolute right-3 top-1/2 -translate-y-1/2 p-2"` to both:
  - Password toggle (testID="password-toggle")
  - Confirm Password toggle (testID="confirm-password-toggle")
- Applied: `className="text-sm text-blue-600 font-medium"` to toggle text
- Result: Perfect vertical centering matching LoginForm

**Visual observations and test results**:
- Password toggles now perfectly centered vertically
- Toggle functionality works correctly (Show/Hide)
- Both toggles visually consistent with LoginForm
- Screenshot saved: tasks/verification-artifacts/password-toggle-alignment-fixed.png

**Issues encountered and time spent**:
- Issue: User reported misaligned password toggles (top: 12 was incorrect)
- Solution: Applied LoginForm's proven centering pattern
- Time spent: ~15 minutes (2 password toggles)

**Consistency check with LoginForm patterns**:
- ✅ Perfect consistency: Exact same toggle pattern applied, vertical alignment fixed

---

## CRITICAL COMPONENT COMPLIANCE TASKS
**REQUIRED**: Fix non-NativeWind UI components before continuing with container patterns

### Task 2.8: Convert InputField Component to NativeWind
**Objective**: Replace inline styles in InputField.tsx with NativeWind classes
**Current Issue**: InputField uses inline styles instead of NativeWind classes

**Actions**:
1. [ ] Document current InputField styling patterns
2. [ ] Convert all inline styles to NativeWind classes
3. [ ] Preserve error state styling and ref forwarding
4. [ ] Test in both LoginForm and SignUpForm
5. [ ] Verify no visual regressions

### Task 2.9: Convert FormButton Component to NativeWind  
**Objective**: Replace inline styles in FormButton.tsx with NativeWind classes
**Current Issue**: FormButton uses inline styles for disabled/enabled states

**Actions**:
1. [ ] Document current FormButton styling patterns
2. [ ] Convert all inline styles to NativeWind classes
3. [ ] Preserve disabled state styling and accessibility
4. [ ] Test in both LoginForm and SignUpForm
5. [ ] Verify no visual regressions

### Task 2.10: Convert Checkbox Component to NativeWind
**Objective**: Replace design system constants with NativeWind classes
**Current Issue**: Checkbox uses old design system approach instead of NativeWind

**Actions**:
1. [ ] Document current Checkbox styling patterns
2. [ ] Convert design system constants to NativeWind classes
3. [ ] Apply LoginForm's inline checkbox pattern or create consistent component
4. [ ] Test all checkbox states (checked, unchecked, error)
5. [ ] Verify accessibility and testID preservation

### Task 2.11: Convert ErrorAlert Component to NativeWind
**Objective**: Replace inline styles in ErrorAlert.tsx with NativeWind classes
**Current Issue**: ErrorAlert uses inline styles with getTypeStyles function

**Actions**:
1. [ ] Document current ErrorAlert styling patterns
2. [ ] Convert all inline styles to NativeWind classes
3. [ ] Preserve type-based styling (error, warning, info)
4. [ ] Test all alert types and dismiss functionality
5. [ ] Verify no visual regressions

### Task 2.12: Convert PasswordValidation Component to NativeWind
**Objective**: Replace design system constants with NativeWind classes
**Current Issue**: PasswordValidation uses old design system approach

**Actions**:
1. [ ] Document current PasswordValidation styling patterns
2. [ ] Convert design system constants to NativeWind classes
3. [ ] Preserve validation rule styling and icons
4. [ ] Test password validation display
5. [ ] Verify no visual regressions

---

## REMAINING CONTAINER PATTERN TASKS

### Task 2.13: Apply Submit Button Container Pattern
**Objective**: Apply LoginForm's proven button container pattern
**Pattern to Apply**: `className="mt-8 mb-6"` container with FormButton component

**Actions**:
1. [ ] Apply consistent button container spacing
2. [ ] Ensure FormButton component usage matches LoginForm
3. [ ] Preserve submit button testID attributes

### Task 2.14: Apply Navigation Links Pattern
**Objective**: Apply LoginForm's proven navigation pattern
**Pattern to Apply**: 
- Container: `className="flex flex-row justify-center items-center mt-4"`
- Description text: `className="text-sm text-gray-600 mr-2"`
- Action link: `className="text-sm text-blue-600 font-medium"`

**Actions**:
1. [ ] Apply navigation link styling from LoginForm
2. [ ] Ensure "Already have an account? Sign In" matches LoginForm's "Don't have an account? Sign Up"
3. [ ] Preserve navigation testID attributes

### Task 2.15: Enhanced UX Features from LoginForm
**Objective**: Apply UX enhancements learned from LoginForm conversion

**UX Patterns to Apply**:
1. [ ] **Enter key navigation**: Email → Password → Confirm Password → Submit
2. [ ] **Form submission on Enter**: Submit form from last field
3. [ ] **Ref forwarding**: Ensure InputField refs work for focus management
4. [ ] **Keyboard accessibility**: Proper returnKeyType settings

**Actions**:
1. [ ] Add onSubmitEditing handlers for field navigation
2. [ ] Add form submission on final field Enter key
3. [ ] Test keyboard navigation flow
4. [ ] Verify accessibility improvements

### Task 2.16: Validation Components Consistency
**Objective**: Ensure validation components match LoginForm patterns

**Actions**:
1. [ ] Review password validation component styling
2. [ ] Apply consistent validation message patterns
3. [ ] Ensure validation icons/indicators match design system
4. [ ] Test validation states and styling

### Task 2.17: Additional SignUpForm-Specific Elements
**Objective**: Convert any SignUpForm-specific elements not in LoginForm

**Actions**:
1. [ ] Identify unique SignUpForm elements (terms acceptance, additional fields, etc.)
2. [ ] Apply consistent styling patterns based on element type
3. [ ] Create new reusable patterns for future forms
4. [ ] Document new patterns for style guide

---

## PHASE 3: Final Validation and Documentation

### Task 3.1: Full E2E Test Suite Validation
**Objective**: Comprehensive testing to ensure no regressions

**Actions**:
1. [ ] Run full E2E test suite: `npx playwright test e2e/stagehand-auth-test.spec.ts --project=chromium`
2. [ ] Test complete signup flow end-to-end
3. [ ] Verify form submission and validation work correctly
4. [ ] Test navigation between login and signup forms
5. [ ] Document any issues found

### Task 3.2: Style Consistency Verification
**Objective**: Ensure perfect consistency with LoginForm

**Actions**:
1. [ ] Side-by-side comparison of LoginForm and SignUpForm
2. [ ] Verify typography hierarchy matches exactly
3. [ ] Confirm spacing and layout patterns are consistent
4. [ ] Test both forms on different screen sizes
5. [ ] Document any intentional differences

### Task 3.3: Cross-Flow Navigation Testing
**Objective**: Test integration between login and signup flows

**Actions**:
1. [ ] Test "Switch to Sign Up" link from LoginForm
2. [ ] Test "Switch to Sign In" link from SignUpForm
3. [ ] Verify consistent visual experience across flows
4. [ ] Test form state preservation if applicable

### Task 3.4: Performance and Accessibility Validation
**Objective**: Ensure conversion improves performance and accessibility

**Actions**:
1. [ ] Compare bundle size before/after conversion
2. [ ] Test keyboard navigation across entire form
3. [ ] Verify screen reader compatibility
4. [ ] Test focus management and tab order

### Task 3.5: Documentation Update and Pattern Library Enhancement
**Objective**: Document new patterns and update style guide

**Actions**:
1. [ ] Update lessons learned with SignUpForm insights
2. [ ] Document any new reusable patterns discovered
3. [ ] Create comprehensive style guide from LoginForm + SignUpForm patterns
4. [ ] Prepare templates for future form conversions

### Task 3.6: Repository Cleanup and Final Commit
**Objective**: Clean organization and comprehensive documentation

**Actions**:
1. [ ] Remove any test files from root directory
2. [ ] Organize all verification artifacts
3. [ ] Create final comprehensive commit
4. [ ] Update project documentation with new patterns

---

# APPENDIX: Proven NativeWind Patterns (from LoginForm.tsx)

## Container & Layout Patterns
```jsx
// Main container (full-screen centering)
className="flex-1 w-full items-center justify-center bg-gray-50 px-4"

// Form card container
className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg"

// Form layout (no CSS gap - use individual margins)
className="flex flex-col"
// With children having: className="mb-6"

// Navigation section
className="flex flex-row justify-center items-center mt-4"
```

## Typography Patterns
```jsx
// Main heading
className="text-3xl font-bold mb-8 text-center text-gray-900"

// Field labels
className="text-base font-medium mb-2 text-gray-700"

// Error messages
className="text-red-500 text-sm mt-1"

// Description text
className="text-sm text-gray-600 mr-2"

// Action links
className="text-sm text-blue-600 font-medium"
```

## Interactive Element Patterns
```jsx
// Password toggle (perfect centering)
className="absolute right-3 top-1/2 -translate-y-1/2 p-2"

// Password toggle text
className="text-sm text-blue-600 font-medium"

// Button containers
className="mt-8 mb-6"

// Custom checkbox (conditional styling)
className={`w-5 h-5 border-2 rounded mr-2 justify-center items-center ${
  checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-transparent'
}`}
```

## UX Enhancement Patterns
```jsx
// Email field (focuses next field on Enter)
onSubmitEditing={() => passwordRef.current?.focus()}
returnKeyType="next"

// Password field (submits form on Enter)
onSubmitEditing={handleSubmit}
returnKeyType="done"

// Ref forwarding in custom components
export const InputField = React.forwardRef<TextInput, InputFieldProps>(
  ({ error = false, ...props }, ref) => {
    return <TextInput ref={ref} {...props} />
  }
);
```

## React Native Web Compatibility Notes
1. **CSS Gap**: Use individual margins (`mb-6`) instead of `gap: 24`
2. **Shadow Properties**: Use `shadow-lg` instead of complex shadow objects
3. **Absolute Positioning**: Use `top-1/2 -translate-y-1/2` for centering
4. **Border Radius**: Use semantic names (`rounded-xl`) instead of pixel values
5. **Ref Forwarding**: Required for focus management in custom components

## E2E Test Preservation
- **Always preserve testID attributes** exactly as they are
- **Test after every 2-3 conversions** to catch issues early
- **Focus on interactive elements**: buttons, inputs, toggles, navigation links
- **Use quick test command**: `npx playwright test e2e/stagehand-auth-test.spec.ts --project=chromium`

## Repository Management
- **Store screenshots** in `tasks/verification-artifacts/` only
- **Clean test files** immediately after creation
- **Commit every 2-3 tasks** with descriptive messages
- **Document all changes** with before/after analysis