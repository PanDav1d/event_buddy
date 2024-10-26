import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, TextInput, useColorScheme, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSession } from '@/components/ctx';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignIn()
{
    const { signIn } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleSignIn = async () =>
    {
        if (isLoading) return;
        setIsLoading(true);
        try
        {
            const success = await signIn(username, password);
            router.replace('/');
        } catch (error)
        {
            console.error('Sign in failed:', error);
        } finally
        {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[colors.background, colors.backgroundAlt]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <Image
                            source={require('../assets/images/buddy/buddy_fine.svg')}
                            style={styles.buddyImage}
                            resizeMode="contain"
                        />
                        <Image
                            source={require('../assets/images/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <ThemedText style={styles.title}>Willkommen zurück bei EventBuddy</ThemedText>
                        <View style={styles.inputContainer}>
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
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                                onPress={handleSignIn}
                                disabled={isLoading}>
                                <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>
                                    {isLoading ? 'Anmelden...' : 'Anmelden'}
                                </ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/register')}
                                style={styles.createAccountContainer}>
                                <ThemedText style={styles.createAccountText}>Noch keinen Account? Erstelle einen!</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 48,
    },
    buddyImage: {
        position: 'absolute',
        top: 40,
        width: '100%',
        height: 200,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    title: {
        paddingTop: 22,
        lineHeight: 34,
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 32,
        textAlign: 'left',
        letterSpacing: 0.5,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 24,
    },
    input: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        gap: 12,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    createAccountContainer: {
        alignItems: 'center',
        padding: 8,
    },
    createAccountText: {
        fontSize: 16,
        textDecorationLine: 'underline',
        opacity: 0.8,
    },
    forgotPasswordContainer: {
        marginTop: 24,
        padding: 8,
    },
    forgotPassword: {
        fontSize: 16,
        textDecorationLine: 'underline',
        opacity: 0.8,
    },
});