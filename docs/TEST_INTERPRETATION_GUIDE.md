# Test Result Interpretation Guide

## Common False Negatives

### 1. Browser Context Cleanup Issues
- **What it looks like**: Test failures after successful operations
- **Example**: `Error: Browser context already closed` after successful auth flow
- **Reality Check**: If the error occurs after the test action completes, it's likely cleanup noise
- **Verification**: Check screenshots and logs from before the cleanup phase

### 2. Timing-Related Failures
- **What it looks like**: `TimeoutError waiting for [data-testid="X"]`
- **Reality Check**:
  - Check if the element exists in production/preview
  - Verify actual functionality in browser
  - Look for successful operations before timeout
- **Key Indicator**: If manual testing shows functionality works, investigate test timing

### 3. Profile Menu Interactions
- **Known Issue**: Menu tests often timeout due to animation/transition delays
- **False Failure Pattern**: Test reports failure but screenshots show successful interaction
- **Verification Steps**:
  1. Check test-results/screenshots for actual UI state
  2. Verify menu functionality manually
  3. Look for successful operations in logs before timeout

## Distinguishing Real Issues from False Negatives

### Evidence Hierarchy (Most to Least Reliable)
1. Manual verification in production/preview
2. Screenshot evidence from test runs
3. Server-side logs of operations
4. Test pass/fail status
5. Cleanup phase errors

### Required Checks Before Declaring Issues
1. Examine actual screenshots in test-results/
2. Verify functionality in browser
3. Check server logs for successful operations
4. Look for patterns (cleanup vs actual failures)

### Red Flags for Real Issues
- Element not found in ANY environment
- Consistent failures across multiple test runs
- Failures during core operation (not cleanup)
- No successful operations logged
- Visual evidence shows actual failure

## Test Result Analysis Protocol

1. **First Response**
   - Don't immediately assume failure
   - Locate and examine test screenshots
   - Check actual functionality in browser

2. **Evidence Collection**
   - Screenshots from test-results/
   - Server logs
   - Browser console output
   - Manual verification results

3. **Classification**
   - Core Functionality Issue: Fails during main operation
   - Cleanup Noise: Fails after successful operation
   - Timing Issue: Works but test times out

4. **Action Plan**
   - Real Issue: Create fix in application code
   - False Negative: Adjust test timing/cleanup
   - Timing Issue: Increase timeouts or add waits

## Common Patterns to Remember

1. **Authentication Flow**
   - Successful auth + cleanup error = Working
   - No auth + element not found = Real Issue
   - Auth works + menu timeout = Timing Issue

2. **Profile Menu**
   - Menu visible in screenshots + timeout = Timing Issue
   - Menu never appears = Real Issue
   - Interaction works + context error = Cleanup Noise

3. **Form Submissions**
   - Form submits + cleanup error = Working
   - Form never appears = Real Issue
   - Form works + timeout = Timing Issue

## Updating This Guide

Add new patterns when:
- New false negative patterns are identified
- Test framework changes affect failure patterns
- New components have unique testing characteristics
