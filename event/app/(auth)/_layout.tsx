import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useSession } from '@/components/ctx';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

export default function AuthLayout()
{
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();

  if (isLoading)
  {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!session)
  {
    return <Redirect href={"/sign-in"} />
  }


  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{
        headerBlurEffect: "systemMaterial",
        headerLargeTitleShadowVisible: false,
        headerBackButtonMenuEnabled: false,
        headerBackTitle: "Zurück",
        headerTitle: 'Profil von ' + session.username,
        headerLargeTitle: true,
      }} />
      <Stack.Screen name="event" options={{
        headerShown: false,
      }} />
    </Stack>
  );
}