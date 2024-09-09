import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, Switch, Dimensions, Image, Animated, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function PersonalizationScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const totalSteps = 6;

    const [step, setStep] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [location, setLocation] = useState({ latitude: 52.520008, longitude: 13.404954 });
    const [radius, setRadius] = useState(10);
    const [includeInternational, setIncludeInternational] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);
    const [preferredEventSize, setPreferredEventSize] = useState('medium');
    const [animation] = useState(new Animated.Value(0));

    useEffect(() =>
    {
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [step]);

    const allCategories = [
        { name: "Theater", icon: "theater-masks" },
        { name: "Shows & Performances", icon: "ticket" },
        { name: "Austellungen", icon: "palette" },
        { name: "Food & Drinks", icon: "utensils" },
        { name: "Aktiv & Kreativ", icon: "paint-brush" },
        { name: "Feste & Festivals", icon: "glass-cheers" },
        { name: "Sport", icon: "basketball-ball" },
        { name: "Film", icon: "film" },
        { name: "Kinder & Familien", icon: "child" },
        { name: "Party", icon: "cocktail" },
        { name: "Märkte", icon: "store" },
        { name: "Konzerte & Musik", icon: "music" }
    ];

    const languages = [
        { name: "Deutsch", icon: "translate" },
        { name: "Englisch", icon: "translate" },
        { name: "Französisch", icon: "translate" },
        { name: "Spanisch", icon: "translate" },
        { name: "Italienisch", icon: "translate" }
    ];
    const eventSizes = [
        { name: "klein", icon: "user-friends" },
        { name: "mittel", icon: "users" },
        { name: "groß", icon: "user-astronaut" }
    ];

    const toggleCategory = (category: string) =>
    {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const toggleLanguage = (language: string) =>
    {
        setPreferredLanguages(prev =>
            prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
        );
    };

    const handleNext = () =>
    {
        if (step < totalSteps)
        {
            setStep(step + 1);
        } else
        {
            console.log('Preferences:', {
                selectedCategories,
                location,
                radius,
                includeInternational,
                notificationsEnabled,
                preferredLanguages,
                preferredEventSize
            });
            router.push('/');
        }
    };

    const renderStep = () =>
    {
        const opacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
        });

        switch (step)
        {
            case 0:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity, transform: [{ translateY }] }]}>
                        <ThemedText style={styles.stepTitle}>Welche Veranstaltungen interessieren Sie?</ThemedText>
                        <ScrollView contentContainerStyle={styles.buttonContainer}>
                            {allCategories.map((category, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.categoryButton,
                                        { backgroundColor: selectedCategories.includes(category.name) ? colors.tagActive : colors.tagInactive }
                                    ]}
                                    onPress={() => toggleCategory(category.name)}
                                >
                                    <FontAwesome5 name={category.icon} size={24} color={colors.textPrimary} />
                                    <ThemedText style={styles.categoryButtonText}>{category.name}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                );
            case 1:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity, transform: [{ translateY }] }]}>
                        <ThemedText style={styles.stepTitle}>Wo befinden Sie sich?</ThemedText>
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    ...location,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                onRegionChangeComplete={(region) => setLocation({ latitude: region.latitude, longitude: region.longitude })}
                            >
                                <Marker coordinate={location} />
                            </MapView>
                        </View>
                    </Animated.View>
                );
            case 2:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity, transform: [{ translateY }] }]}>
                        <ThemedText style={styles.stepTitle}>Wie weit möchten Sie maximal reisen?</ThemedText>
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    ...location,
                                    latitudeDelta: radius * 2 / 111.32,
                                    longitudeDelta: radius * 2 / (111.32 * Math.cos(location.latitude * (Math.PI / 180))),
                                }}
                            >
                                <Marker coordinate={location} />
                                <Circle
                                    center={location}
                                    radius={radius * 1000}
                                    fillColor={colors.primaryTransparent}
                                    strokeColor={colors.primary}
                                />
                            </MapView>
                        </View>
                        <View style={styles.sliderContainer}>
                            <ThemedText style={styles.radiusText}>Radius: {radius} km</ThemedText>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={2}
                                maximumValue={250}
                                step={1}
                                value={radius}
                                onValueChange={setRadius}
                                minimumTrackTintColor={colors.primary}
                                maximumTrackTintColor={colors.backgroundLight}
                                thumbTintColor={colors.primary}
                            />
                        </View>
                    </Animated.View>
                );
            case 3:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity, transform: [{ translateY }] }]}>
                        <ThemedText style={styles.stepTitle}>Weitere Einstellungen</ThemedText>
                        <View style={styles.listContainer}>
                            <View style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]}>
                                <Ionicons name="globe-outline" size={24} color={colors.primary} />
                                <ThemedText style={styles.listItemText}>Internationale Events einbeziehen</ThemedText>
                                <Switch
                                    value={includeInternational}
                                    onValueChange={setIncludeInternational}
                                    trackColor={{ false: colors.backgroundLight, true: colors.primary }}
                                    thumbColor={includeInternational ? colors.secondary : colors.backgroundLight}
                                />
                            </View>
                            <View style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]}>
                                <Ionicons name="notifications-outline" size={24} color={colors.primary} />
                                <ThemedText style={styles.listItemText}>Benachrichtigungen aktivieren</ThemedText>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: colors.backgroundLight, true: colors.primary }}
                                    thumbColor={notificationsEnabled ? colors.secondary : colors.backgroundLight}
                                />
                            </View>
                        </View>
                    </Animated.View>
                );
            case 4:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity, transform: [{ translateY }] }]}>
                        <ThemedText style={styles.stepTitle}>Bevorzugte Sprachen</ThemedText>
                        <ScrollView contentContainerStyle={styles.buttonContainer}>
                            {languages.map((language, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.languageButton,
                                        { backgroundColor: preferredLanguages.includes(language.name) ? colors.tagActive : colors.tagInactive }
                                    ]}
                                    onPress={() => toggleLanguage(language.name)}
                                >
                                    <MaterialCommunityIcons name={language.icon as any} size={24} color={colors.textPrimary} />
                                    <ThemedText style={styles.languageButtonText}>{language.name}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                );
            case 5:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity, transform: [{ translateY }] }]}>
                        <ThemedText style={styles.stepTitle}>Bevorzugte Veranstaltungsgröße</ThemedText>
                        <View style={styles.eventSizeContainer}>
                            {eventSizes.map((size, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.eventSizeButton,
                                        { backgroundColor: preferredEventSize === size.name ? colors.tagActive : colors.tagInactive }
                                    ]}
                                    onPress={() => setPreferredEventSize(size.name)}
                                >
                                    <FontAwesome5 name={size.icon} size={24} color={colors.textPrimary} />
                                    <ThemedText style={styles.eventSizeButtonText}>{size.name}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                );
            case 6:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity, transform: [{ translateY }] }]}>
                        <ThemedText style={styles.stepTitle}>Alles klar, du bist jetzt startklar!</ThemedText>
                        <ThemedText style={styles.stepTitle}>Viel Spaß mit deinem EventBuddy</ThemedText>
                    </Animated.View>
                );
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={styles.progressContainer}>
                    {[0, 1, 2, 3, 4, 5].map((s) => (
                        <View
                            key={s}
                            style={[
                                styles.progressDot,
                                { backgroundColor: s <= step ? colors.primary : colors.backgroundLight }
                            ]}
                        />
                    ))}
                </View>
                {renderStep()}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                    onPress={handleNext}
                >
                    <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>
                        {step < 5 ? 'Weiter' : 'Fertig'}
                    </ThemedText>
                    <Entypo name="chevron-right" size={24} color={colors.buttonText} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    stepContainer: {
        width: '100%',
        alignItems: 'center',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        padding: 15,
        margin: 5,
        width: '45%',
    },
    categoryButtonText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    mapContainer: {
        width: '100%',
        height: 300,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    locationText: {
        marginTop: 10,
        fontSize: 16,
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'center',
    },
    radiusText: {
        fontSize: 18,
        fontWeight: '600',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    settingTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        marginLeft: 10,
        fontSize: 16,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        padding: 15,
        margin: 5,
        width: '45%',
    },
    languageButtonText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    eventSizeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    eventSizeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 15,
        width: '30%',
    },
    eventSizeButtonText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 25,
        width: '100%',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    listItemText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
    },
});