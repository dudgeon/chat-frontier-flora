import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  error?: string;
  testID?: string;
}

/**
 * Checkbox component using NativeWind classes for consistent styling.
 *
 * This component has been converted to use NativeWind v4 utility classes
 * for consistent styling across the application.
 *
 * @param props - The checkbox component props
 * @returns A styled checkbox component with label and optional error message
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  error,
  testID,
}) => {
  return (
    <View className="mb-4 max-w-full overflow-hidden">
      <TouchableOpacity
        className="flex-row items-start flex-wrap max-w-full overflow-hidden"
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        testID={testID}
      >
        <View className={`w-5 h-5 border-2 rounded mr-2 mt-0.5 justify-center items-center flex-shrink-0 ${
          error ? 'border-red-500' : (checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-transparent')
        }`}>
          {checked && (
            <View className="w-2.5 h-2.5 bg-white rounded-sm" />
          )}
        </View>
        <Text className="text-sm text-gray-900 flex-1 leading-5 flex-shrink min-w-0">{label}</Text>
      </TouchableOpacity>
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};
