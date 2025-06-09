# NativeWind Class Patterns

## Standardized Class Combinations for Common UI Patterns

This document defines approved NativeWind class patterns for the chat-frontier-flora project to ensure consistency and maintainability.

## Layout Patterns

### Container Layouts
```typescript
// Full-screen container
"flex-1 bg-white"

// Centered content container
"flex-1 justify-center items-center p-4"

// Page container with padding
"flex-1 bg-gray-50 p-6"

// Card container
"bg-white rounded-lg shadow-sm border border-gray-200 p-4"

// Modal/overlay container
"absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
```

### Form Layouts
```typescript
// Form container
"space-y-4 p-6"

// Form section
"space-y-3"

// Form row (horizontal)
"flex flex-row items-center space-x-3"

// Form group (vertical)
"space-y-2"
```

### Navigation Layouts
```typescript
// Header/navbar
"flex flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200"

// Tab bar
"flex flex-row bg-white border-t border-gray-200"

// Sidebar
"w-64 bg-gray-100 border-r border-gray-200 p-4"
```

## Input Patterns

### Text Inputs
```typescript
// Standard text input
"w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"

// Error state input
"w-full px-4 py-3 border border-red-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"

// Success state input
"w-full px-4 py-3 border border-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"

// Disabled input
"w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 placeholder-gray-400 cursor-not-allowed"
```

### Search Inputs
```typescript
// Search input with icon space
"w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"

// Search container
"relative w-full"

// Search icon positioning
"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
```

## Button Patterns

### Primary Buttons
```typescript
// Standard primary button
"bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"

// Large primary button
"bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-4 px-8 rounded-lg text-lg transition-colors duration-200"

// Small primary button
"bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
```

### Secondary Buttons
```typescript
// Standard secondary button
"bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"

// Outline secondary button
"border border-gray-300 hover:border-gray-400 active:border-gray-500 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
```

### Danger Buttons
```typescript
// Destructive action button
"bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"

// Outline danger button
"border border-red-300 hover:border-red-400 active:border-red-500 bg-white hover:bg-red-50 text-red-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
```

### Button States
```typescript
// Loading state
"bg-blue-600 text-white font-medium py-3 px-6 rounded-lg opacity-75 cursor-not-allowed"

// Disabled state
"bg-gray-300 text-gray-500 font-medium py-3 px-6 rounded-lg cursor-not-allowed"

// Icon button
"p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
```

## Typography Patterns

### Headings
```typescript
// Page title
"text-3xl font-bold text-gray-900 mb-6"

// Section title
"text-2xl font-semibold text-gray-900 mb-4"

// Subsection title
"text-xl font-medium text-gray-900 mb-3"

// Card title
"text-lg font-semibold text-gray-900 mb-2"
```

### Body Text
```typescript
// Standard body text
"text-base text-gray-700 leading-relaxed"

// Small body text
"text-sm text-gray-600 leading-normal"

// Large body text
"text-lg text-gray-700 leading-relaxed"

// Muted text
"text-sm text-gray-500"
```

### Labels and Captions
```typescript
// Form label
"text-sm font-medium text-gray-700 mb-1"

// Required field label
"text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:text-red-500 after:ml-1"

// Caption text
"text-xs text-gray-500 mt-1"

// Error message
"text-sm text-red-600 mt-1"

// Success message
"text-sm text-green-600 mt-1"
```

## Status and Feedback Patterns

### Validation States
```typescript
// Validation item (valid)
"flex items-center space-x-2 text-sm text-green-600"

// Validation item (invalid)
"flex items-center space-x-2 text-sm text-red-600"

// Validation icon (valid)
"w-4 h-4 text-green-600"

// Validation icon (invalid)
"w-4 h-4 text-red-600"
```

### Loading States
```typescript
// Loading container
"flex items-center justify-center p-8"

// Loading spinner
"animate-spin w-6 h-6 text-blue-600"

// Loading text
"text-sm text-gray-500 ml-2"
```

### Alert Patterns
```typescript
// Success alert
"bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"

// Error alert
"bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"

// Warning alert
"bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg"

// Info alert
"bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg"
```

## Responsive Patterns

### Mobile-First Responsive
```typescript
// Responsive container
"w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl"

// Responsive grid
"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"

// Responsive text
"text-sm sm:text-base lg:text-lg"

// Responsive padding
"p-4 sm:p-6 lg:p-8"

// Responsive flex direction
"flex flex-col sm:flex-row"
```

### Breakpoint Guidelines
- `sm:` - 640px and up (small tablets)
- `md:` - 768px and up (tablets)
- `lg:` - 1024px and up (laptops)
- `xl:` - 1280px and up (desktops)

## Animation Patterns

### Transitions
```typescript
// Standard transition
"transition-colors duration-200"

// All properties transition
"transition-all duration-300"

// Transform transition
"transition-transform duration-200"

// Opacity transition
"transition-opacity duration-300"
```

### Hover Effects
```typescript
// Subtle hover
"hover:bg-gray-50 transition-colors duration-200"

// Scale hover
"hover:scale-105 transition-transform duration-200"

// Shadow hover
"hover:shadow-lg transition-shadow duration-200"
```

## Conditional Class Patterns

### Using Template Literals
```typescript
// Conditional background
`bg-${isActive ? 'blue-600' : 'gray-100'} text-${isActive ? 'white' : 'gray-700'}`

// Conditional size
`p-${size === 'large' ? '4' : size === 'small' ? '2' : '3'}`
```

### Using clsx (Recommended)
```typescript
import clsx from 'clsx';

// Complex conditional classes
clsx(
  'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
  {
    'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
    'bg-gray-100 text-gray-700 hover:bg-gray-200': variant === 'secondary',
    'opacity-50 cursor-not-allowed': disabled,
    'text-sm': size === 'small',
    'text-lg': size === 'large',
  }
)
```

## Best Practices

### Class Organization
1. **Layout first**: flex, grid, positioning
2. **Sizing**: width, height, padding, margin
3. **Visual**: background, border, shadow
4. **Typography**: font, text color, text size
5. **Interactive**: hover, focus, active states
6. **Responsive**: breakpoint-specific classes

### Example Well-Organized Classes
```typescript
// Good: Organized by category
"flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:px-6"

// Avoid: Random order
"text-gray-900 flex border-gray-300 hover:border-blue-500 w-full bg-white px-4 items-center rounded-lg py-3 border focus:ring-2 justify-between focus:border-blue-500 focus:ring-blue-200"
```

### Performance Considerations
- Prefer static classes over dynamic template literals when possible
- Use clsx for complex conditional logic
- Avoid deeply nested conditional class logic
- Consider extracting complex class combinations into reusable constants

### Maintenance Guidelines
- Update this document when adding new patterns
- Ensure all patterns are tested across different screen sizes
- Document any project-specific color or spacing decisions
- Regular review and cleanup of unused patterns
