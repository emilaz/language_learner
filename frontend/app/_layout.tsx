import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const DRAWER_SCREENS = ['index', 'profile', 'first_exercise'];

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer
        screenOptions={({ route}) => ({
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          drawerActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          drawerItemStyle: {
            display: DRAWER_SCREENS.includes(route.name) ? 'flex' : 'none',
          }
        })}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Home',
            drawerIcon: ({ color }: { color: string }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: 'Profile',
            drawerIcon: ({ color }: { color: string }) => (
              <Ionicons name="person" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="first_exercise"
          options={{
            title: 'First Exercise',
          }}
        />
      </Drawer>
    </ThemeProvider>
  );
}
