import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, TextInput, useColorScheme, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSession } from '@/components/ctx';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function SignIn()
{
    const { signIn } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleSignIn = async () =>
    {
        try
        {
            const success = await signIn(username, password);
            router.replace('/');  // Changed from router.push to router.replace and updated the route
        } catch (error)
        {
            console.error('Sign in failed:', error);
        }
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    <ThemedText style={styles.title}>Willkommen zurück bei EventBuddy</ThemedText>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.backgroundAlt, color: colors.textPrimary }]}
                        placeholder="Nutzername"
                        placeholderTextColor={colors.textSecondary}
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.backgroundAlt, color: colors.textPrimary }]}
                        placeholder="Passwort"
                        placeholderTextColor={colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                        onPress={handleSignIn}>
                        <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Anmelden</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.buttonSecondary }]}
                        onPress={() => router.push('/register')}>
                        <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Account erstellen</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                        <ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        lineHeight: 40,
        paddingRight: 20,
        fontSize: 38,
        marginLeft: 0,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        maxWidth: 500,
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        maxWidth: 500,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '800',
    },
    forgotPassword: {
        marginTop: 15,
        textDecorationLine: 'underline',
    },
});
