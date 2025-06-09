# NativeWind Component Conversion Checklist

## Pre-Conversion Setup

### 1. Backup Component
- [ ] Create backup using: `cp [component-file] [component-file].backup.$(date +%Y%m%d_%H%M%S)`
- [ ] Verify backup file exists and is readable
- [ ] Document current component functionality and visual appearance

### 2. Analyze Current Implementation
- [ ] Document all StyleSheet objects and their purposes
- [ ] Identify conditional styling logic
- [ ] Note any platform-specific styles
- [ ] List all style dependencies and imports
- [ ] Screenshot current component appearance (if visual)

## Conversion Process

### 3. Plan NativeWind Classes
- [ ] Map each StyleSheet property to equivalent NativeWind class
- [ ] Identify responsive breakpoints needed (sm:, md:, lg:, xl:)
- [ ] Plan conditional class logic using template literals or clsx
- [ ] Verify all required classes are available in NativeWind v4

### 4. Convert Styles Systematically

#### Container/Layout Styles
- [ ] Convert flex properties (`flex-1`, `flex-row`, `flex-col`)
- [ ] Convert positioning (`absolute`, `relative`, `top-*`, `left-*`)
- [ ] Convert dimensions (`w-*`, `h-*`, `min-w-*`, `max-w-*`)
- [ ] Convert padding/margin (`p-*`, `m-*`, `px-*`, `py-*`)

#### Visual Styles
- [ ] Convert background colors (`bg-*`)
- [ ] Convert text colors (`text-*`)
- [ ] Convert borders (`border`, `border-*`, `rounded-*`)
- [ ] Convert shadows (`shadow-*`)

#### Typography
- [ ] Convert font sizes (`text-*`)
- [ ] Convert font weights (`font-*`)
- [ ] Convert text alignment (`text-left`, `text-center`, `text-right`)
- [ ] Convert line height (`leading-*`)

#### Interactive States
- [ ] Convert hover states (`hover:*`)
- [ ] Convert focus states (`focus:*`)
- [ ] Convert active states (`active:*`)
- [ ] Convert disabled states (`disabled:*`)

### 5. Update Component Code
- [ ] Remove StyleSheet import: `import { StyleSheet } from 'react-native'`
- [ ] Remove styles object definition
- [ ] Replace `style={styles.styleName}` with `className="nativewind-classes"`
- [ ] Update conditional styling to use template literals or clsx
- [ ] Add any missing imports (clsx if needed)

### 6. Handle Special Cases
- [ ] Convert platform-specific styles using responsive classes
- [ ] Handle dynamic styles with conditional classes
- [ ] Ensure proper TypeScript types for className props
- [ ] Address any custom style calculations

## Testing & Verification

### 7. Visual Testing
- [ ] Start development server: `cd apps/web && npm run web`
- [ ] Verify component renders without errors
- [ ] Compare visual appearance with original (screenshot comparison)
- [ ] Test all component variants/states
- [ ] Test responsive behavior on different screen sizes

### 8. Functional Testing
- [ ] Verify all interactive elements work correctly
- [ ] Test any conditional styling logic
- [ ] Ensure accessibility features are preserved
- [ ] Test component with different prop combinations

### 9. Cross-Platform Testing (if applicable)
- [ ] Test on web platform
- [ ] Test on mobile platforms (if component is used there)
- [ ] Verify consistent behavior across platforms

## Post-Conversion Cleanup

### 10. Code Quality
- [ ] Remove any unused imports
- [ ] Clean up any commented-out code
- [ ] Ensure consistent code formatting
- [ ] Add/update TypeScript types if needed

### 11. Documentation
- [ ] Update component documentation if it exists
- [ ] Document any breaking changes
- [ ] Note any new className props added
- [ ] Update any style-related comments

### 12. Final Verification
- [ ] Run full application to ensure no regressions
- [ ] Verify component works in all contexts where it's used
- [ ] Check that no console errors are introduced
- [ ] Confirm webpack compilation shows only normal warnings

## Rollback Procedure (if needed)

### 13. Emergency Rollback
- [ ] Stop development server
- [ ] Restore from backup: `cp [component-file].backup.* [component-file]`
- [ ] Restart development server
- [ ] Verify original functionality is restored
- [ ] Document what went wrong for future reference

## Success Criteria

✅ **Conversion is successful when:**
- Component renders identically to original
- All functionality is preserved
- No new console errors
- Webpack compiles with only normal warnings
- All tests pass (if component has tests)
- Code is cleaner and more maintainable

## Common NativeWind Class Patterns

### Layout
```
flex-1, flex-row, flex-col, items-center, justify-center, justify-between
absolute, relative, top-0, left-0, right-0, bottom-0
w-full, h-full, w-screen, h-screen
```

### Spacing
```
p-4, px-6, py-3, m-2, mx-auto, my-4
space-x-2, space-y-4, gap-4
```

### Colors
```
bg-white, bg-gray-100, bg-blue-500
text-black, text-gray-600, text-white
border-gray-300, border-blue-500
```

### Typography
```
text-sm, text-base, text-lg, text-xl, text-2xl
font-normal, font-medium, font-semibold, font-bold
leading-tight, leading-normal, leading-relaxed
```

### Interactive
```
hover:bg-gray-100, focus:ring-2, active:bg-gray-200
disabled:opacity-50, disabled:cursor-not-allowed
```
