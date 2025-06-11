import { AccessibilityRole, AccessibilityState } from 'react-native';

/**
 * Accessibility utilities for consistent accessibility features across components.
 *
 * Features:
 * - Standard accessibility role mappings
 * - Accessibility label generators
 * - Screen reader optimized descriptions
 * - Accessibility state helpers
 * - WCAG compliance utilities
 */

// Standard accessibility roles for common UI patterns
export const accessibilityRoles = {
  button: 'button' as AccessibilityRole,
  link: 'link' as AccessibilityRole,
  text: 'text' as AccessibilityRole,
  heading: 'header' as AccessibilityRole,
  image: 'image' as AccessibilityRole,
  list: 'list' as AccessibilityRole,
  listItem: 'none' as AccessibilityRole, // Use 'none' for list items in React Native
  checkbox: 'checkbox' as AccessibilityRole,
  radio: 'radio' as AccessibilityRole,
  textInput: 'none' as AccessibilityRole, // TextInput has built-in accessibility
  progressBar: 'progressbar' as AccessibilityRole,
  alert: 'alert' as AccessibilityRole,
  menu: 'menu' as AccessibilityRole,
  menuItem: 'menuitem' as AccessibilityRole,
  tab: 'tab' as AccessibilityRole,
  tabList: 'tablist' as AccessibilityRole,
} as const;

// Accessibility state helpers
export const createAccessibilityState = (options: {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean;
  expanded?: boolean;
  busy?: boolean;
}): AccessibilityState => {
  const state: AccessibilityState = {};

  if (options.disabled !== undefined) state.disabled = options.disabled;
  if (options.selected !== undefined) state.selected = options.selected;
  if (options.checked !== undefined) state.checked = options.checked;
  if (options.expanded !== undefined) state.expanded = options.expanded;
  if (options.busy !== undefined) state.busy = options.busy;

  return state;
};

// Accessibility label generators
export const generateAccessibilityLabel = {
  button: (text: string, state?: { disabled?: boolean; loading?: boolean }) => {
    let label = `${text} button`;
    if (state?.disabled) label += ', disabled';
    if (state?.loading) label += ', loading';
    return label;
  },

  checkbox: (label: string, checked: boolean, required?: boolean) => {
    let accessibilityLabel = `${label} checkbox, ${checked ? 'checked' : 'unchecked'}`;
    if (required) accessibilityLabel += ', required';
    return accessibilityLabel;
  },

  textInput: (label: string, value?: string, error?: string, required?: boolean) => {
    let accessibilityLabel = `${label} text input`;
    if (required) accessibilityLabel += ', required';
    if (value) accessibilityLabel += `, current value: ${value}`;
    if (error) accessibilityLabel += `, error: ${error}`;
    return accessibilityLabel;
  },

  validationIcon: (state: 'success' | 'error' | 'warning' | 'pending' | 'neutral', context?: string) => {
    const stateDescriptions = {
      success: 'validation passed',
      error: 'validation failed',
      warning: 'validation warning',
      pending: 'validation in progress',
      neutral: 'no validation status',
    };

    let label = stateDescriptions[state];
    if (context) label = `${context}: ${label}`;
    return label;
  },

  progressBar: (label: string, value: number, max: number = 100) => {
    const percentage = Math.round((value / max) * 100);
    return `${label}: ${percentage} percent complete`;
  },
};

// Accessibility hint generators
export const generateAccessibilityHint = {
  button: (action: string) => `Double tap to ${action}`,
  checkbox: (action: string = 'toggle') => `Double tap to ${action}`,
  textInput: (purpose: string) => `Text input for ${purpose}`,
  link: (destination: string) => `Opens ${destination}`,
  expandable: (expanded: boolean) =>
    expanded ? 'Double tap to collapse' : 'Double tap to expand',
};

// Screen reader optimized text
export const optimizeForScreenReader = (text: string): string => {
  return text
    // Add pauses for better readability
    .replace(/\./g, '. ')
    .replace(/,/g, ', ')
    .replace(/:/g, ': ')
    // Expand common abbreviations
    .replace(/\be\.g\./gi, 'for example')
    .replace(/\bi\.e\./gi, 'that is')
    .replace(/\betc\./gi, 'and so on')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
};

// WCAG compliance helpers
export const wcagCompliance = {
  // Color contrast ratios (for reference)
  contrastRatios: {
    AA_NORMAL: 4.5,
    AA_LARGE: 3,
    AAA_NORMAL: 7,
    AAA_LARGE: 4.5,
  },

  // Minimum touch target sizes (in dp)
  touchTargets: {
    MINIMUM: 44, // iOS/Android minimum
    RECOMMENDED: 48, // Material Design recommendation
    COMFORTABLE: 56, // Comfortable for most users
  },

  // Text size recommendations (in sp)
  textSizes: {
    MINIMUM: 12,
    RECOMMENDED: 14,
    LARGE: 18,
    EXTRA_LARGE: 24,
  },
};

// Accessibility testing helpers
export const accessibilityTestHelpers = {
  // Generate test IDs for accessibility testing
  generateTestId: (component: string, element?: string, state?: string) => {
    let testId = component;
    if (element) testId += `-${element}`;
    if (state) testId += `-${state}`;
    return testId.toLowerCase().replace(/\s+/g, '-');
  },

  // Validate accessibility props
  validateAccessibilityProps: (props: {
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityRole?: AccessibilityRole;
    testID?: string;
  }) => {
    const warnings: string[] = [];

    if (!props.accessibilityLabel) {
      warnings.push('Missing accessibilityLabel - screen readers need descriptive labels');
    }

    if (!props.accessibilityRole) {
      warnings.push('Missing accessibilityRole - helps screen readers understand element purpose');
    }

    if (!props.testID) {
      warnings.push('Missing testID - needed for automated accessibility testing');
    }

    if (props.accessibilityLabel && props.accessibilityLabel.length > 100) {
      warnings.push('AccessibilityLabel is very long - consider shortening for better UX');
    }

    return warnings;
  },
};

// Common accessibility configurations
export const accessibilityConfig = {
  // Form field accessibility
  formField: (label: string, required: boolean = false, error?: string) => ({
    accessibilityLabel: generateAccessibilityLabel.textInput(label, undefined, error, required),
    accessibilityHint: generateAccessibilityHint.textInput(label.toLowerCase()),
    accessibilityRole: accessibilityRoles.textInput,
    accessibilityState: createAccessibilityState({ disabled: false }),
  }),

  // Button accessibility
  button: (text: string, disabled: boolean = false, loading: boolean = false) => ({
    accessibilityLabel: generateAccessibilityLabel.button(text, { disabled, loading }),
    accessibilityHint: generateAccessibilityHint.button(text.toLowerCase()),
    accessibilityRole: accessibilityRoles.button,
    accessibilityState: createAccessibilityState({ disabled, busy: loading }),
  }),

  // Checkbox accessibility
  checkbox: (label: string, checked: boolean, required: boolean = false) => ({
    accessibilityLabel: generateAccessibilityLabel.checkbox(label, checked, required),
    accessibilityHint: generateAccessibilityHint.checkbox(),
    accessibilityRole: accessibilityRoles.checkbox,
    accessibilityState: createAccessibilityState({ checked }),
  }),

  // Validation feedback accessibility
  validation: (state: 'success' | 'error' | 'warning' | 'pending' | 'neutral', context: string) => ({
    accessibilityLabel: generateAccessibilityLabel.validationIcon(state, context),
    accessibilityRole: accessibilityRoles.image,
    accessibilityLiveRegion: state === 'error' ? 'assertive' as const : 'polite' as const,
  }),
};
