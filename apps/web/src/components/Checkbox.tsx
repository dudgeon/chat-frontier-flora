import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export const Checkbox = ({
  label,
  checked,
  onPress,
  error,
  testID,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        aria-checked={checked}
        focusable={true}
        onKeyDown={handleKeyDown}
        testID={testID}
      >
        <View style={[styles.box, checked && styles.checked, error && styles.error]}>
          {checked && <View style={styles.checkmark} />}
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  error: {
    borderColor: '#EF4444',
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  label: {
    fontSize: 14,
    color: '#1F2937',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
});
