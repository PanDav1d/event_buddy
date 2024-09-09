
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSession } from '@/components/ctx';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function Register()
{
    const { signUp } = useSession();
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
            await signUp(email, password);
            router.push('/personalization');
        } catch (error)
        {
            console.error('Registration failed:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <ThemedText style={styles.title}>Create Account</ThemedText>
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
                    placeholder="Password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={[styles.input, { backgroundColor: colors.backgroundAlt, color: colors.textPrimary }]}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                    onPress={handleRegister}
                >
                    <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Register</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonSecondary }]}
                    onPress={() => router.push('/sign-in')}
                >
                    <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Back to Sign In</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
