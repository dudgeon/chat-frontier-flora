# PRD: Fix Broken NativeWind CSS Pipeline

## Introduction/Overview

The NativeWind CSS pipeline in the chat-frontier-flora project is currently broken, forcing developers to use manual inline styling instead of utility-first CSS classes. The project has a workaround system (`injectNativeWindStyles()`) that manually injects a limited set of hardcoded CSS classes, but this prevents the use of the full Tailwind utility library that NativeWind should provide.

**Problem:** NativeWind's automated CSS generation and injection system is not functioning, limiting developers to ~10 hardcoded classes instead of the full Tailwind utility set.

**Goal:** Restore the proper NativeWind CSS pipeline so that any Tailwind utility class used in `className` props automatically generates and injects the corresponding CSS.

## Goals

1. **Restore Automated CSS Generation:** Enable NativeWind to automatically scan components and generate CSS for all used utility classes
2. **Eliminate Manual Workarounds:** Remove dependency on the hardcoded `nativewind-styles.js` injection system
3. **Validate with Test Case:** Successfully convert MessageComposer.SendButton from inline styles to NativeWind classes as proof of concept
4. **Ensure Iterative Development:** Create testing framework that works during interim broken states
5. **Focus on Core Issues:** Address the fundamental Metro/Tailwind integration problems without rebuilding existing NativeWind functionality

## User Stories

**As a developer**, I want to use any Tailwind utility class in `className` props so that I can leverage the full utility-first CSS system without manual CSS generation.

**As a developer**, I want the CSS pipeline to work automatically during development so that I don't need to manually maintain hardcoded style lists.

**As a developer**, I want reliable testing during pipeline fixes so that I can validate progress even when the system is temporarily broken.

## Functional Requirements

### **Phase 1: Diagnostic & Baseline (FR-1 to FR-3)**

**FR-1:** The system must document the current state of MessageComposer.SendButton with inline styles as a baseline
- Document current inline style implementation
- Capture visual appearance for comparison
- Record current functionality (enabled/disabled states)

**FR-2:** The system must create a NativeWind version of the SendButton for testing
- Convert inline styles to equivalent NativeWind classes
- Maintain identical visual appearance and functionality
- Use classes: `w-11 h-11 rounded-full items-center justify-center shadow-md bg-blue-500/bg-gray-400`

**FR-3:** The system must implement automated testing to validate button appearance and functionality
- Test button renders correctly
- Test enabled/disabled state styling
- Test click functionality
- Tests must work during interim broken pipeline states

### **Phase 2: Pipeline Investigation (FR-4 to FR-6)**

**FR-4:** The system must verify Metro NativeWind integration is properly configured
- Validate `withNativeWind(config)` is processing files correctly
- Check Metro logs for NativeWind processing messages
- Verify `global.css` is being loaded and processed

**FR-5:** The system must test Tailwind CSS generation independently
- Run Tailwind CLI to generate CSS for test classes
- Verify content paths are scanning the correct files
- Confirm test classes (`bg-blue-500`, `w-11`, etc.) appear in generated output

**FR-6:** The system must identify the specific failure point in the CSS pipeline
- Determine if issue is in Metro integration, Tailwind scanning, or CSS injection
- Document which part of the pipeline is broken
- Create targeted fix strategy based on findings

### **Phase 3: Pipeline Restoration (FR-7 to FR-9)**

**FR-7:** The system must restore proper Tailwind content scanning
- Ensure `tailwind.config.js` content paths include all component files
- Verify file extensions and glob patterns are correct
- Test that Tailwind detects `className` usage in components

**FR-8:** The system must fix Metro NativeWind integration
- Ensure `metro.config.js` properly integrates NativeWind transformer
- Verify CSS processing and injection during Metro bundling
- Confirm `global.css` with `@tailwind` directives is processed correctly

**FR-9:** The system must eliminate manual CSS injection dependency
- Remove or disable `injectNativeWindStyles()` function
- Ensure automated pipeline provides all necessary classes
- Maintain backward compatibility during transition

### **Phase 4: Validation & Testing (FR-10 to FR-12)**

**FR-10:** The system must successfully render MessageComposer.SendButton with NativeWind classes
- Button appears with correct styling using `className` props
- All visual states (enabled/disabled) work correctly
- No manual CSS injection required

**FR-11:** The system must pass all automated tests with NativeWind implementation
- All existing button tests pass with NativeWind version
- Visual regression tests confirm identical appearance
- Functionality tests confirm identical behavior

**FR-12:** The system must demonstrate pipeline works for additional classes
- Test with classes not in the hardcoded list (`py-4`, `px-6`, `font-semibold`)
- Verify new classes generate CSS automatically
- Confirm no manual intervention required for new utility classes

## Non-Goals (Out of Scope)

- **Production Deployment:** Focus on local development environment only
- **Cross-Platform Testing:** Web platform only, no iOS/Android testing
- **Performance Optimization:** No bundle size or build time optimization requirements
- **Multiple Component Migration:** Only MessageComposer.SendButton conversion, not full component library migration
- **Custom Utility Creation:** No custom Tailwind utilities, use existing NativeWind/Tailwind functionality only
- **Documentation Updates:** Developer documentation updates are optional

## Technical Considerations

### **Current Architecture Issues**
- Metro `withNativeWind` integration appears non-functional
- Tailwind content scanning may not be detecting `className` usage
- CSS generation/injection pipeline is bypassed by manual workaround

### **Dependencies**
- NativeWind package and Metro integration
- Tailwind CSS and PostCSS configuration
- React Native Web for `className` to `style` conversion

### **Fallback Strategy**
- Solid main branch implementation with inline styles available for rollback
- Manual injection system can be re-enabled if needed during development

### **Testing Strategy**
- Automated tests designed to work during interim broken states
- Visual comparison testing for regression detection
- Functional testing for behavior validation

## Success Metrics

### **Primary Success Criteria**
1. **Pipeline Functionality:** MessageComposer.SendButton renders correctly using only NativeWind `className` props
2. **Automated Generation:** New Tailwind classes generate CSS automatically without manual intervention
3. **Test Coverage:** All automated tests pass with NativeWind implementation

### **Secondary Success Criteria**
1. **Developer Experience:** No manual CSS maintenance required for new utility classes
2. **System Reliability:** Pipeline works consistently across development sessions
3. **Backward Compatibility:** Existing components continue working during transition

## Implementation Phases

### **Phase 1: Diagnostic & Setup (Day 1)**
- Document baseline SendButton implementation
- Create NativeWind test version
- Implement automated testing framework
- **Milestone:** Tests running and baseline documented

### **Phase 2: Investigation (Day 1-2)**
- Analyze Metro and Tailwind configurations
- Test CSS generation independently
- Identify specific pipeline failure points
- **Milestone:** Root cause identified and documented

### **Phase 3: Pipeline Fix (Day 2-3)**
- Fix Tailwind content scanning
- Restore Metro NativeWind integration
- Remove manual injection dependencies
- **Milestone:** Automated CSS generation working

### **Phase 4: Validation (Day 3)**
- Test SendButton with NativeWind classes
- Run full automated test suite
- Validate additional utility classes work
- **Milestone:** Complete pipeline functionality confirmed

## Open Questions

1. **Configuration Conflicts:** Are there any conflicting Metro or Webpack configurations that might interfere with NativeWind processing?

2. **Package Versions:** Are the NativeWind and Tailwind package versions compatible with the current React Native Web setup?

3. **Build Process:** Does the current build process have any custom steps that might bypass the NativeWind transformer?

## Acceptance Criteria

**The NativeWind CSS pipeline fix is complete when:**

✅ MessageComposer.SendButton renders identically using `className="w-11 h-11 rounded-full bg-blue-500..."` instead of inline styles

✅ All automated tests pass with the NativeWind implementation

✅ New Tailwind utility classes (not in hardcoded list) generate CSS automatically

✅ No manual CSS injection or hardcoded style lists required

✅ Pipeline works consistently across development server restarts

✅ Developer can use any standard Tailwind utility class without additional configuration
