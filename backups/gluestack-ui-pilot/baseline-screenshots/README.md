# Button Component Baseline Screenshots

## Overview
This directory contains baseline screenshots of the Button component in all its variants before Gluestack UI conversion.

## Test Page Location
- **URL**: http://localhost:19006/button-test
- **Component**: `apps/web/src/pages/ButtonTestPage.tsx`
- **Router**: Added to `apps/web/src/components/AppRouter.tsx` at `/button-test`

## Button Variants Documented

### Primary Variants
- Primary Button (default state)
- Primary Disabled
- Primary Loading
- Primary Full Width

### Secondary Variants
- Secondary Button (default state)
- Secondary Disabled
- Secondary Loading
- Secondary Full Width

### Outline Variants
- Outline Button (default state)
- Outline Disabled
- Outline Loading
- Outline Full Width

### Size Comparison
- Short title
- Medium length title
- Very long title (tests wrapping)

## Button Component Props
Based on `packages/ui/src/components/Button.tsx`:

```typescript
interface ButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
}
```

## Current Implementation
- Uses Gluestack UI Button components internally
- Maps variants to Gluestack UI variants:
  - `primary` → `{ variant: 'solid', action: 'primary' }`
  - `secondary` → `{ variant: 'solid', action: 'secondary' }`
  - `outline` → `{ variant: 'outline', action: 'primary' }`

## Screenshot Instructions
1. Navigate to http://localhost:19006/button-test
2. Take full page screenshot showing all variants
3. Take individual screenshots of each variant section if needed
4. Save screenshots with descriptive names in this directory

## Baseline Date
Created: $(date)

## Notes
- All variants should render correctly with Gluestack UI
- Loading states show spinner with appropriate colors
- Disabled states have reduced opacity
- Full width buttons span container width
- Text wrapping behavior should be preserved
