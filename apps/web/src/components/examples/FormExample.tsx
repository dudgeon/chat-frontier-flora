import React from 'react';
import { View } from 'react-native';
import { Input } from '../ui/input';
import { Text } from '../ui/text';

export function FormExample() {
  const [value, setValue] = React.useState('');

  const onChangeText = (text: string) => {
    setValue(text);
  };

  return (
    <View style={{ padding: 20, gap: 16 }}>
      <Text variant="heading">Form Example</Text>

      <View style={{ gap: 8 }}>
        <Text variant="label">Input Field</Text>
        <Input
          placeholder="Write some stuff..."
          value={value}
          onChangeText={onChangeText}
          aria-labelledby="inputLabel"
          aria-errormessage="inputError"
        />
      </View>

      {value ? (
        <View style={{ gap: 4 }}>
          <Text variant="label">Current Value:</Text>
          <Text variant="caption">{value}</Text>
        </View>
      ) : null}
    </View>
  );
}
