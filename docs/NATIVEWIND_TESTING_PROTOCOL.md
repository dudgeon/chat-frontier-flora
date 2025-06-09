# NativeWind Testing Protocol

## Mandatory Testing Requirements for Component Conversions

This document defines the required testing procedures for converting components from StyleSheet to NativeWind in the chat-frontier-flora project.

## Pre-Conversion Testing

### 1. Baseline Documentation
- [ ] **Screenshot original component** in all states/variants
- [ ] **Document current functionality** - list all interactive features
- [ ] **Record current performance** - note any slow renders or issues
- [ ] **Test current accessibility** - verify screen reader compatibility
- [ ] **Document current responsive behavior** - test on different screen sizes

### 2. Functional Baseline Test
```bash
# Start development server
cd apps/web && npm run web

# Verify current functionality works
# Document any existing issues or bugs
```

**Required checks:**
- [ ] Component renders without errors
- [ ] All interactive elements respond correctly
- [ ] All conditional logic works as expected
- [ ] No console errors related to the component
- [ ] Component works in all contexts where it's used

## During Conversion Testing

### 3. Incremental Verification
**Test after each major style conversion step:**

#### After Container/Layout Conversion
- [ ] **Visual check:** Layout structure matches original
- [ ] **Responsive check:** Test on mobile, tablet, desktop sizes
- [ ] **Console check:** No new errors introduced

#### After Color/Visual Conversion
- [ ] **Color accuracy:** All colors match original design
- [ ] **Visual hierarchy:** Text contrast and emphasis preserved
- [ ] **Brand consistency:** Colors align with design system

#### After Interactive State Conversion
- [ ] **Hover states:** All hover effects work correctly
- [ ] **Focus states:** Keyboard navigation and focus rings work
- [ ] **Active states:** Click/touch feedback works
- [ ] **Disabled states:** Disabled styling and behavior correct

#### After Typography Conversion
- [ ] **Font sizes:** All text sizes match original
- [ ] **Font weights:** Bold, medium, normal weights correct
- [ ] **Line spacing:** Text readability maintained
- [ ] **Text alignment:** Left, center, right alignment preserved

### 4. Compilation Verification
**After each conversion step:**
```bash
# Check webpack compilation
# Should show "web compiled with 1 warning" (normal vm warning)
# Should NOT show "web compiled with 1 error"
```

- [ ] **No compilation errors:** Webpack compiles successfully
- [ ] **No TypeScript errors:** All types resolve correctly
- [ ] **No import errors:** All dependencies resolve

## Post-Conversion Testing

### 5. Comprehensive Visual Testing

#### Desktop Testing (1024px+)
- [ ] **Chrome:** Test in latest Chrome browser
- [ ] **Firefox:** Test in latest Firefox browser
- [ ] **Safari:** Test in latest Safari browser (if available)
- [ ] **Edge:** Test in latest Edge browser

#### Tablet Testing (768px - 1023px)
- [ ] **Portrait mode:** Test tablet portrait layout
- [ ] **Landscape mode:** Test tablet landscape layout
- [ ] **Touch interactions:** Verify touch targets are appropriate

#### Mobile Testing (320px - 767px)
- [ ] **Small mobile (320px):** Test on smallest supported screen
- [ ] **Large mobile (414px):** Test on larger mobile screens
- [ ] **Touch interactions:** Verify all touch targets work

### 6. Functional Testing

#### Core Functionality
- [ ] **All props work:** Test component with all possible prop combinations
- [ ] **Event handlers:** All onClick, onFocus, onChange events work
- [ ] **Conditional rendering:** All conditional logic works correctly
- [ ] **State management:** Component state updates correctly

#### Integration Testing
- [ ] **Parent components:** Component works in all parent contexts
- [ ] **Child components:** All child components render correctly
- [ ] **Data flow:** Props and callbacks flow correctly
- [ ] **Context usage:** Component works with React context if used

### 7. Performance Testing

#### Render Performance
- [ ] **Initial render:** Component renders quickly on first load
- [ ] **Re-renders:** Component updates efficiently on prop changes
- [ ] **Memory usage:** No memory leaks during component lifecycle

#### Bundle Size Impact
```bash
# Check if conversion significantly impacts bundle size
npm run build
# Compare bundle size before and after conversion
```

- [ ] **Bundle size:** No significant increase in bundle size
- [ ] **Tree shaking:** Unused styles are properly tree-shaken

### 8. Accessibility Testing

#### Keyboard Navigation
- [ ] **Tab order:** Logical tab order through interactive elements
- [ ] **Focus indicators:** Clear focus indicators on all interactive elements
- [ ] **Keyboard shortcuts:** All keyboard shortcuts work correctly

#### Screen Reader Testing
- [ ] **VoiceOver (macOS):** Test with VoiceOver if available
- [ ] **NVDA (Windows):** Test with NVDA if available
- [ ] **Semantic markup:** Proper heading structure and landmarks

#### Color and Contrast
- [ ] **Color contrast:** All text meets WCAG AA contrast requirements
- [ ] **Color independence:** Information not conveyed by color alone
- [ ] **High contrast mode:** Component works in high contrast mode

### 9. Cross-Platform Testing (if applicable)

#### React Native Testing
- [ ] **iOS simulator:** Test on iOS if component is used in mobile
- [ ] **Android emulator:** Test on Android if component is used in mobile
- [ ] **Platform-specific styles:** Platform differences work correctly

## Automated Testing

### 10. Unit Tests (if they exist)
```bash
# Run existing unit tests
npm test

# Verify all tests still pass
```

- [ ] **Existing tests pass:** All current unit tests continue to pass
- [ ] **Test coverage maintained:** Code coverage doesn't decrease
- [ ] **New tests added:** Add tests for any new functionality

### 11. E2E Tests
```bash
# Run E2E tests that involve the component
npm run test:e2e
```

- [ ] **E2E tests pass:** All end-to-end tests continue to pass
- [ ] **User flows work:** Complete user flows involving component work
- [ ] **No regressions:** No new failures in automated tests

## Regression Testing

### 12. Full Application Testing
- [ ] **Complete user flows:** Test all major user journeys
- [ ] **Component interactions:** Test component with other components
- [ ] **Edge cases:** Test component with edge case data/props
- [ ] **Error states:** Test component error handling

### 13. Performance Regression Testing
- [ ] **Page load times:** No significant increase in page load time
- [ ] **Interaction responsiveness:** UI interactions remain responsive
- [ ] **Memory usage:** No memory leaks introduced

## Documentation and Sign-off

### 14. Test Results Documentation
Create test results document with:
- [ ] **Before/after screenshots:** Visual comparison
- [ ] **Test execution summary:** Pass/fail status for all tests
- [ ] **Performance metrics:** Before/after performance comparison
- [ ] **Known issues:** Document any minor issues or limitations

### 15. Code Review Checklist
- [ ] **Code quality:** Clean, readable NativeWind classes
- [ ] **Consistency:** Follows project class patterns
- [ ] **Performance:** No unnecessary class combinations
- [ ] **Maintainability:** Easy to understand and modify

## Rollback Criteria

### 16. Automatic Rollback Triggers
**Immediately rollback if:**
- [ ] **Compilation errors:** Any webpack compilation errors
- [ ] **Functional regressions:** Core functionality broken
- [ ] **Visual regressions:** Significant visual differences
- [ ] **Performance regressions:** >20% performance decrease
- [ ] **Accessibility regressions:** Accessibility features broken

### 17. Rollback Procedure
```bash
# Stop development server
# Restore from backup
cp [component-file].backup.* [component-file]
# Restart server and verify restoration
cd apps/web && npm run web
```

## Success Criteria

### 18. Conversion Success Definition
**A conversion is successful when:**
- [ ] **Visual parity:** Component looks identical to original
- [ ] **Functional parity:** All functionality works exactly as before
- [ ] **Performance parity:** No significant performance regression
- [ ] **Accessibility parity:** All accessibility features preserved
- [ ] **Code quality:** Code is cleaner and more maintainable
- [ ] **Documentation complete:** All testing documentation complete

### 19. Quality Gates
**All conversions must pass:**
- [ ] **Zero compilation errors:** Clean webpack compilation
- [ ] **Zero functional regressions:** All features work
- [ ] **Zero accessibility regressions:** Accessibility maintained
- [ ] **Positive code review:** Team approval of changes
- [ ] **Complete test coverage:** All tests documented and passed

## Testing Tools and Commands

### 20. Essential Testing Commands
```bash
# Development server
cd apps/web && npm run web

# Build verification
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Bundle analysis
npm run analyze
```

### 21. Browser Developer Tools
- **Chrome DevTools:** Elements, Console, Network, Performance tabs
- **Firefox Developer Tools:** Inspector, Console, Network, Performance
- **Safari Web Inspector:** Elements, Console, Network, Timelines
- **React Developer Tools:** Component tree and props inspection

### 22. Accessibility Testing Tools
- **axe DevTools:** Automated accessibility testing
- **Lighthouse:** Accessibility audit
- **WAVE:** Web accessibility evaluation
- **Color Contrast Analyzers:** Contrast ratio verification

## Continuous Monitoring

### 23. Post-Deployment Monitoring
- [ ] **Error tracking:** Monitor for new errors in production
- [ ] **Performance monitoring:** Track performance metrics
- [ ] **User feedback:** Monitor for user-reported issues
- [ ] **Analytics:** Check for changes in user behavior

This protocol ensures that every NativeWind conversion maintains the highest quality standards while preventing regressions and maintaining user experience.
