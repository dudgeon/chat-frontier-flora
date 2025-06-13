# Login Testing Limitation: Cannot Test Default User Behavior

## Summary

Our E2E tests cannot successfully test the normal login flow when the "Remember me" checkbox is unchecked (which is the default state). This represents a significant gap in our testing coverage and indicates a potential UX issue.

## Problem Description

### Current Behavior
When a user logs in with "Remember me" **unchecked** (the default state):
1. User enters credentials and clicks "Sign In"
2. Authentication succeeds with Supabase
3. User is redirected to `/chat` page
4. **Immediately after redirect**, LoginForm.tsx calls token cleanup logic
5. Auth token is deleted from localStorage
6. User is automatically logged out and bounced back to auth page
7. User never actually gets to use the chat interface

### Impact on Testing
- **E2E tests fail** when testing normal user behavior (unchecked "Remember me")
- **Tests only pass** when "Remember me" is artificially checked
- **False confidence** in our authentication flow
- **Cannot verify** the most common user journey

### Code Location
The logic is in `apps/web/src/components/auth/LoginForm.tsx` in the `handleSubmit` function:

```typescript
// Handle "Remember me" functionality
if (!rememberMe) {
  try {
    const removeTokens = () => {
      try {
        // Supabase JS v2 stores auth session under this key
        const storageKey = (supabase.auth as any).storageKey as string | undefined;
        if (storageKey) {
          localStorage.removeItem(storageKey);
        } else {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              localStorage.removeItem(key);
            }
          });
        }
      } catch (err) {
        console.warn('Remember me cleanup error:', err);
      }
    };

    // Ensure we only attach one listener per tab
    window.removeEventListener('beforeunload', removeTokens);
    window.addEventListener('beforeunload', removeTokens);
  } catch (err) {
    console.warn('Remember me setup error:', err);
  }
}
```

## Expected Behavior

### What Should Happen
1. User logs in with "Remember me" unchecked
2. User successfully reaches chat page and can use the application
3. Auth token persists for the **current session**
4. Token is only cleaned up when:
   - User explicitly logs out
   - User closes browser tab/window
   - Session expires naturally

### What Currently Happens
1. User logs in with "Remember me" unchecked
2. User briefly reaches chat page
3. Token is immediately deleted
4. User is bounced back to login page
5. User experience is broken

## Root Cause Analysis

The current implementation misinterprets the purpose of "Remember me":

- **"Remember me" checked**: Should persist login across browser sessions (days/weeks)
- **"Remember me" unchecked**: Should persist login for current session only (until browser close)

Currently, unchecked "Remember me" means "log out immediately after login", which is not standard UX behavior.

## Investigation Needed

The current code appears to be correctly implemented - it only sets up a `beforeunload` event listener that should only trigger when the browser tab is closed. However, our E2E tests consistently fail when "Remember me" is unchecked, suggesting there may be:

1. **Hidden interaction** between the `beforeunload` event and test automation
2. **Race condition** in the authentication flow
3. **Different behavior** in test environment vs. manual testing
4. **Supabase session management** issue

## Proposed Investigation Steps

1. **Manual Testing**: Verify if the issue occurs during manual testing or only in automated tests
2. **Console Logging**: Add detailed logging to track when token removal actually occurs
3. **Test Environment**: Check if test automation tools trigger `beforeunload` events unexpectedly
4. **Session Persistence**: Verify Supabase session behavior with and without "Remember me"

## Potential Solutions

### Option A: Investigate Test Environment Behavior
Determine why E2E tests fail with unchecked "Remember me" when manual testing might work fine.

### Option B: Alternative Session Management
Consider using Supabase's built-in session persistence options instead of manual localStorage manipulation.

### Option C: Default State Change
Make "Remember me" checked by default as a temporary workaround while investigating the root cause.

## Testing Implications

### Current Workaround
Tests must artificially check "Remember me" to pass:
```typescript
// This shouldn't be necessary for basic login testing
await page.locator('[data-testid="remember-me-checkbox"]').click();
```

### After Fix
Tests should be able to verify normal user behavior:
```typescript
// Should work without artificial checkbox manipulation
await page.act('click the login button');
// User should successfully reach chat page
```

## User Experience Impact

### Current UX Issues
- **Confusing behavior**: Login appears to work but immediately fails
- **Forced checkbox**: Users must check "Remember me" for basic functionality
- **Non-standard pattern**: Most apps don't require "Remember me" for session persistence

### Expected UX
- **Smooth login**: Works as expected without additional checkboxes
- **Clear choice**: "Remember me" is truly optional for extended persistence
- **Standard behavior**: Matches user expectations from other applications

## Acceptance Criteria

- [ ] User can log in with "Remember me" unchecked and successfully use the application
- [ ] Auth token persists for current browser session when "Remember me" is unchecked
- [ ] Auth token is cleaned up only on browser close when "Remember me" is unchecked
- [ ] Auth token persists across browser sessions when "Remember me" is checked
- [ ] E2E tests pass for both checked and unchecked "Remember me" states
- [ ] No artificial test workarounds required

## Priority

**High** - This affects the core user authentication experience and prevents comprehensive testing of the most common user journey.

## Labels

- `bug`
- `authentication`
- `testing`
- `user-experience`
- `high-priority`
