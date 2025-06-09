import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  error?: string;
  testID?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  error,
  testID,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        testID={testID}
      >
        <View style={[styles.box, checked && styles.checked, error ? styles.error : null]}>
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
    maxWidth: '100%',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
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
    flex: 1,
    lineHeight: 20,
    flexShrink: 1,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
});
