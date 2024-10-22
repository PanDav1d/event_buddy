import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, TextInput, useColorScheme, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';

import { useSession } from '@/components/ctx';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import Slider from '@react-native-community/slider';

export default function RegisterScreen()
{
    const { signUp } = useSession();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [buddyName, setBuddyName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [preferredEventSize, setPreferredEventSize] = useState(0.5);
    const [preferredInteractivity, setPreferredInteractivity] = useState(0.5);
    const [preferredNoisiness, setPreferredNoisiness] = useState(0.5);
    const [preferredCrowdedness, setPreferredCrowdedness] = useState(0.5);
    const [preferredMusicStyles, setPreferredMusicStyles] = useState<string[]>([]);
    const [preferredEventTypes, setPreferredEventTypes] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const musicStyles = [
        { id: 1, label: 'Pop' },
        { id: 2, label: 'Rock' },
        { id: 3, label: 'Hip Hop' },
        { id: 4, label: 'Electronic' },
        { id: 5, label: 'Classical' },
        { id: 6, label: 'Jazz' },
    ];

    const eventTypes = [
        { id: 1, label: 'Concert' },
        { id: 2, label: 'Festival' },
        { id: 3, label: 'Club Night' },
        { id: 4, label: 'Theater' },
        { id: 5, label: 'Exhibition' },
        { id: 6, label: 'Sports Event' },
    ];

    const handleRegister = async () =>
    {
        if (password !== confirmPassword)
        {
            console.error('Passwords do not match');
            return;
        }

        try
        {
            await signUp(username, email, phone, password, buddyName, preferredEventSize, preferredInteractivity, preferredNoisiness, preferredCrowdedness, preferredMusicStyles, preferredEventTypes);
            router.push('/');
        } catch (error)
        {
            console.error('Registration failed:', error);
        }
    };

    const nextStep = () =>
    {
        setCurrentStep(currentStep + 1);
    };

    const renderStep = () =>
    {
        switch (currentStep)
        {
            case 0:
                return (
                    <>
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
                            placeholder="Telefonnummer"
                            placeholderTextColor={colors.textSecondary}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
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
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.backgroundAlt, color: colors.textPrimary }]}
                            placeholder="Buddy Name"
                            placeholderTextColor={colors.textSecondary}
                            value={buddyName}
                            onChangeText={setBuddyName}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <ThemedText style={styles.title}>Bevorzugte Eventgröße</ThemedText>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.1}
                            value={preferredEventSize}
                            onValueChange={(value: number) => setPreferredEventSize(Math.round(value * 10) / 10)}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.backgroundAlt}
                            thumbTintColor={colors.primary}
                        />
                        <ThemedText style={[styles.sliderValue, { color: colors.textPrimary }]}>
                            {preferredEventSize * 100 + " %"}
                        </ThemedText>
                    </>
                );
            case 2:
                return (
                    <>
                        <ThemedText style={styles.title}>Bevorzugte Interaktivität</ThemedText>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.1}
                            value={preferredInteractivity}
                            onValueChange={(value: number) => setPreferredInteractivity(Math.round(value * 10) / 10)}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.backgroundAlt}
                            thumbTintColor={colors.primary}
                        />
                        <ThemedText style={[styles.sliderValue, { color: colors.textPrimary }]}>
                            {preferredInteractivity * 100 + " %"}
                        </ThemedText>
                    </>
                );
            case 3:
                return (
                    <>
                        <ThemedText style={styles.title}>Bevorzugte Lautstärke</ThemedText>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.1}
                            value={preferredNoisiness}
                            onValueChange={(value: number) => setPreferredNoisiness(Math.round(value * 10) / 10)}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.backgroundAlt}
                            thumbTintColor={colors.primary}
                        />
                        <ThemedText style={[styles.sliderValue, { color: colors.textPrimary }]}>
                            {preferredNoisiness * 100 + " %"}
                        </ThemedText>
                    </>
                );
            case 4:
                return (
                    <>
                        <ThemedText style={styles.title}>Bevorzugte Menschenmenge</ThemedText>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.1}
                            value={preferredCrowdedness}
                            onValueChange={(value: number) => setPreferredCrowdedness(Math.round(value * 10) / 10)}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.backgroundAlt}
                            thumbTintColor={colors.primary}
                        />
                        <ThemedText style={[styles.sliderValue, { color: colors.textPrimary }]}>
                            {preferredCrowdedness * 100 + " %"}
                        </ThemedText>
                    </>
                );
            case 5:
                return (
                    <>
                        <ThemedText style={styles.title}>Willkommen bei EventBuddy!</ThemedText>
                        <ThemedText style={styles.subtitle}>Dein Account wurde erfolgreich erstellt.</ThemedText>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    {renderStep()}
                    {currentStep < 5 && (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                            onPress={currentStep === 5 ? handleRegister : nextStep}
                        >
                            <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>
                                {currentStep === 5 ? 'Account erstellen' : 'Weiter'}
                            </ThemedText>
                        </TouchableOpacity>
                    )}
                    {currentStep === 5 && (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                            onPress={() => router.push('/')}
                        >
                            <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>
                                Loslegen
                            </ThemedText>
                        </TouchableOpacity>
                    ) || (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.buttonSecondary }]}
                                onPress={() => router.back()}
                            >
                                <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>Zurück zum Anmelden</ThemedText>
                            </TouchableOpacity>
                        )}
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
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
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
    slider: {
        width: '100%',
        height: 40,
    },
    sliderValue: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    tag: {
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        padding: 10,
        margin: 5,
    },
    tagLabel: {
        color: '#333',
    },
    tagSelected: {
        backgroundColor: '#007AFF',
    },
    tagLabelSelected: {
        color: '#fff',
    },
});