import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Add this metadata to hide from drawer
export const unstable_settings = {
  isHidden: true,
  drawerType: 'none'
};

// Mark this screen as not part of the drawer group
NotFoundScreen.getInitialProps = () => {
  return { hideDrawer: true };
};

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false, presentation: 'modal'}} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <View style={styles.link}>
          <Link href="/">
            <ThemedText type="link">Go to home screen!</ThemedText>
          </Link>
        </View>
      </ThemedView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
