import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerTintColor: '#fff',
        
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Pokemon',
          headerRight: () => (
            <Ionicons name="search" size={24} color="#fff" />
          ),
        
        }}


      />
      <Stack.Screen name="details" 
      
      options={{
          animation: "slide_from_bottom", // best modal-like animation for Android
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }
      
      }/>
    </Stack>
  );
}