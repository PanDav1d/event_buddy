import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SessionProvider } from '@/components/ctx';
import * as Linking from 'expo-linking';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout()
{
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Nunito: require("../assets/fonts/Nunito-VariableFont.ttf"),
    });

    const linking = {
        prefixes: ['eventbuddy://'],
        config: {
            screens: {
                Event: 'event/:id',
            }
        }
    };

    useEffect(() =>
    {
        if (loaded)
        {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded)
    {
        return null;
    }

    return (
        <SessionProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                    <Stack.Screen name="register" options={{ headerShown: false }} />
                    <Stack.Screen name="personalization" options={{ headerShown: false }} />
                </Stack>
            </ThemeProvider >
        </SessionProvider>
    );
}