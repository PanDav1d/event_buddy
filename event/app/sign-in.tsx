import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSession } from '@/components/ctx';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function SignIn()
{
    const { signIn } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleSignIn = async () =>
    {
        try
        {
            await signIn(email, password);
            router.replace('/');
        } catch (error)
        {
            console.error('Sign in failed:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <ThemedText style={styles.title}>Welcome Back</ThemedText>
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
                <TouchableOpacity

                    style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                    onPress={handleSignIn}
                >
                    <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Sign In</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonSecondary }]}
                    onPress={() => router.push('/register')}
                >
                    <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Register</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                    <ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
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
    forgotPassword: {
        marginTop: 15,
        textDecorationLine: 'underline',
    },
});
