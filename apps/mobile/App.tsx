import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { ApiClient } from '@chat-frontier-flora/shared';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

// Initialize API client
const apiClient = new ApiClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  process.env.EXPO_PUBLIC_OPENAI_API_KEY!
);

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            initialParams={{ apiClient }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
