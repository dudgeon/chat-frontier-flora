// Manual NativeWind-style utility for converting Tailwind classes to React Native styles
import { ViewStyle, TextStyle } from 'react-native';

type StyleType = ViewStyle | TextStyle;

const colorMap = {
  'blue-500': '#3B82F6',
  'blue-600': '#2563EB',
  'green-500': '#10B981',
  'red-500': '#EF4444',
  'gray-100': '#F3F4F6',
  'gray-200': '#E5E7EB',
  'gray-400': '#9CA3AF',
  'gray-500': '#6B7280',
  'gray-700': '#374151',
  'white': '#FFFFFF',
};

const sizeMap = {
  'w-4': { width: 16 },
  'w-8': { width: 32 },
  'w-10': { width: 40 },
  'w-12': { width: 48 },
  'w-full': { width: '100%' },
  'h-4': { height: 16 },
  'h-8': { height: 32 },
  'h-10': { height: 40 },
  'h-12': { height: 48 },
  'min-h-screen': { minHeight: '100vh' },
};

const spacingMap = {
  'p-2': { padding: 8 },
  'p-4': { padding: 16 },
  'px-2': { paddingHorizontal: 8 },
  'px-4': { paddingHorizontal: 16 },
  'py-2': { paddingVertical: 8 },
  'py-3': { paddingVertical: 12 },
  'm-2': { margin: 8 },
  'mb-2': { marginBottom: 8 },
  'mb-4': { marginBottom: 16 },
  'mt-2': { marginTop: 8 },
};

const positionMap = {
  'absolute': { position: 'absolute' as const },
  'relative': { position: 'relative' as const },
  'top-2': { top: 8 },
  'top-14': { top: 56 },
  'top-24': { top: 96 },
  'top-32': { top: 128 },
  'right-2': { right: 8 },
  'z-50': { zIndex: 50 },
};

const borderMap = {
  'rounded-sm': { borderRadius: 2 },
  'rounded-md': { borderRadius: 6 },
  'rounded-lg': { borderRadius: 8 },
  'rounded-full': { borderRadius: 9999 },
  'border': { borderWidth: 1 },
};

const textMap = {
  'text-xs': { fontSize: 12, lineHeight: 16 },
  'text-sm': { fontSize: 14, lineHeight: 20 },
  'text-base': { fontSize: 16, lineHeight: 24 },
  'text-lg': { fontSize: 18, lineHeight: 28 },
  'font-medium': { fontWeight: '500' as const },
  'font-semibold': { fontWeight: '600' as const },
  'font-bold': { fontWeight: '700' as const },
};

const flexMap = {
  'flex': { display: 'flex' as const },
  'flex-col': { flexDirection: 'column' as const },
  'items-center': { alignItems: 'center' as const },
  'items-end': { alignItems: 'flex-end' as const },
  'justify-center': { justifyContent: 'center' as const },
};

export function convertTailwindToRN(classNames: string): StyleType {
  const classes = classNames.split(' ').filter(Boolean);
  let style: StyleType = {};

  classes.forEach(className => {
    // Background colors
    if (className.startsWith('bg-')) {
      const color = className.replace('bg-', '');
      if (colorMap[color as keyof typeof colorMap]) {
        style.backgroundColor = colorMap[color as keyof typeof colorMap];
      }
    }
    
    // Text colors
    if (className.startsWith('text-') && !className.includes('xs') && !className.includes('sm') && !className.includes('base') && !className.includes('lg')) {
      const color = className.replace('text-', '');
      if (colorMap[color as keyof typeof colorMap]) {
        (style as TextStyle).color = colorMap[color as keyof typeof colorMap];
      }
    }
    
    // Border colors
    if (className.startsWith('border-') && !className.includes('radius')) {
      const color = className.replace('border-', '');
      if (colorMap[color as keyof typeof colorMap]) {
        style.borderColor = colorMap[color as keyof typeof colorMap];
      }
    }

    // Size classes
    if (sizeMap[className as keyof typeof sizeMap]) {
      Object.assign(style, sizeMap[className as keyof typeof sizeMap]);
    }

    // Spacing classes
    if (spacingMap[className as keyof typeof spacingMap]) {
      Object.assign(style, spacingMap[className as keyof typeof spacingMap]);
    }

    // Position classes
    if (positionMap[className as keyof typeof positionMap]) {
      Object.assign(style, positionMap[className as keyof typeof positionMap]);
    }

    // Border classes
    if (borderMap[className as keyof typeof borderMap]) {
      Object.assign(style, borderMap[className as keyof typeof borderMap]);
    }

    // Text classes
    if (textMap[className as keyof typeof textMap]) {
      Object.assign(style, textMap[className as keyof typeof textMap]);
    }

    // Flex classes
    if (flexMap[className as keyof typeof flexMap]) {
      Object.assign(style, flexMap[className as keyof typeof flexMap]);
    }
  });

  return style;
}

// Helper hook for easier usage
export function useTailwind(classNames: string) {
  return convertTailwindToRN(classNames);
}