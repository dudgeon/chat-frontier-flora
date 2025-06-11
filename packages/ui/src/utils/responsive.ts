import { Dimensions } from 'react-native';

/**
 * Responsive design utilities for consistent breakpoints and responsive behavior.
 *
 * Features:
 * - Standard breakpoints matching common design systems
 * - Responsive value selection based on screen size
 * - Utility functions for responsive styling
 * - Type-safe responsive configuration
 */

// Standard breakpoints (matching Tailwind CSS)
export const breakpoints = {
  xs: 0,     // Extra small devices
  sm: 640,   // Small devices (phones)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (laptops)
  xl: 1280,  // Extra large devices (desktops)
  '2xl': 1536, // 2X large devices (large desktops)
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get current screen dimensions
 */
export const getScreenDimensions = () => {
  return Dimensions.get('window');
};

/**
 * Get current breakpoint based on screen width
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  const { width } = getScreenDimensions();

  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Check if current screen matches a breakpoint condition
 */
export const isBreakpoint = (condition: string): boolean => {
  const { width } = getScreenDimensions();

  // Parse condition like ">=md", "<=sm", "md", etc.
  const match = condition.match(/^(>=|<=|>|<)?(.+)$/);
  if (!match) return false;

  const [, operator, breakpointName] = match;
  const breakpointValue = breakpoints[breakpointName as Breakpoint];

  if (breakpointValue === undefined) return false;

  switch (operator) {
    case '>=':
      return width >= breakpointValue;
    case '<=':
      return width <= breakpointValue;
    case '>':
      return width > breakpointValue;
    case '<':
      return width < breakpointValue;
    default:
      // Exact match - check if current breakpoint matches
      return getCurrentBreakpoint() === breakpointName;
  }
};

/**
 * Responsive value type - can be a single value or breakpoint-specific values
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Get responsive value based on current screen size
 */
export const getResponsiveValue = <T>(value: ResponsiveValue<T>): T => {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const currentBreakpoint = getCurrentBreakpoint();
  const responsiveValues = value as Partial<Record<Breakpoint, T>>;

  // Check current breakpoint first
  if (responsiveValues[currentBreakpoint] !== undefined) {
    return responsiveValues[currentBreakpoint] as T;
  }

  // Fall back to smaller breakpoints
  const orderedBreakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = orderedBreakpoints.indexOf(currentBreakpoint);

  for (let i = currentIndex + 1; i < orderedBreakpoints.length; i++) {
    const fallbackBreakpoint = orderedBreakpoints[i];
    if (responsiveValues[fallbackBreakpoint] !== undefined) {
      return responsiveValues[fallbackBreakpoint] as T;
    }
  }

  // If no specific value found, return the first available value
  const firstValue = Object.values(responsiveValues)[0];
  return firstValue as T;
};

/**
 * Responsive spacing utility
 */
export const getResponsiveSpacing = (spacing: ResponsiveValue<number>): number => {
  return getResponsiveValue(spacing);
};

/**
 * Responsive font size utility
 */
export const getResponsiveFontSize = (fontSize: ResponsiveValue<number>): number => {
  return getResponsiveValue(fontSize);
};

/**
 * Common responsive configurations
 */
export const responsiveConfig = {
  // Container max widths
  containerMaxWidth: {
    xs: '100%',
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Common spacing scales
  spacing: {
    xs: { xs: 4, sm: 6, md: 8 },
    sm: { xs: 8, sm: 12, md: 16 },
    md: { xs: 16, sm: 20, md: 24 },
    lg: { xs: 24, sm: 32, md: 40 },
    xl: { xs: 32, sm: 48, md: 64 },
  },

  // Common font size scales
  fontSize: {
    xs: { xs: 10, sm: 11, md: 12 },
    sm: { xs: 12, sm: 14, md: 14 },
    base: { xs: 14, sm: 16, md: 16 },
    lg: { xs: 16, sm: 18, md: 18 },
    xl: { xs: 18, sm: 20, md: 20 },
  },
} as const;

/**
 * Hook-like function for responsive values (can be used in components)
 */
export const useResponsive = () => {
  const dimensions = getScreenDimensions();
  const currentBreakpoint = getCurrentBreakpoint();

  return {
    dimensions,
    currentBreakpoint,
    isBreakpoint,
    getResponsiveValue,
    getResponsiveSpacing,
    getResponsiveFontSize,
    // Convenience methods
    isMobile: isBreakpoint('<=sm'),
    isTablet: isBreakpoint('md'),
    isDesktop: isBreakpoint('>=lg'),
    isSmallScreen: isBreakpoint('<=md'),
    isLargeScreen: isBreakpoint('>=lg'),
  };
};
