import React, { useState, useRef } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, TextInput, useColorScheme, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSession } from '@/components/ctx';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function Register()
{
    const { signUp } = useSession();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleRegister = async () =>
    {
        if (password !== confirmPassword)
        {
            console.error('Passwords do not match');
            return;
        }

        try
        {
            await signUp(username, email, password);
            router.push('/');
        } catch (error)
        {
            console.error('Registration failed:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    <ThemedText style={styles.title}>Neuen Account bei EventBuddy erstellen</ThemedText>
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
                        placeholder="Email"
                        placeholderTextColor={colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.backgroundAlt, color: colors.textPrimary }]}
                        placeholder="Passwort"
                        placeholderTextColor={colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.backgroundAlt, color: colors.textPrimary }]}
                        placeholder="Passwort wiederholen"
                        placeholderTextColor={colors.textSecondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                        onPress={handleRegister}
                    >
                        <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Account erstellen</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.buttonSecondary }]}
                        onPress={() => router.back()}
                    >
                        <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Zurück zum Anmelden</ThemedText>
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
        padding: 20,
        fontSize: 38,
        fontWeight: 'bold',
        marginBottom: 30,
        lineHeight: 40,
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
});
