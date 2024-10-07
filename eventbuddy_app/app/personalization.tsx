import React, { useState, useEffect, SetStateAction } from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, Switch, Dimensions, Image, Animated, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { EventSizeSelector } from '@/components/EventSizeSelector';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LocationObjectCoords } from 'expo-location';



const { width, height } = Dimensions.get('window');

export default function PersonalizationScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const totalSteps = 7;

    const [step, setStep] = useState(0);

    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);


    const [username, setUsername] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [location, setLocation] = useState({ latitude: 52.520008, longitude: 13.404954 });
    const [radius, setRadius] = useState(10);
    const [includeInternational, setIncludeInternational] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);
    const [preferredEventSize, setPreferredEventSize] = useState(0);
    const [animation] = useState(new Animated.Value(0));

    useEffect(() =>
    {
        animation.setValue(0);
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

    useEffect(() =>
    {
        getCurrentLocation();
    }, []);


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

    const getCurrentLocation = async () =>
    {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted')
        {
            console.log('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
        setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    };
    const GridItem = ({ category, isSelected, onPress }: { category: { icon: string; name: string }, isSelected: boolean, onPress: () => void }) => (
        <TouchableOpacity
            style={[
                styles.categoryButton,
                { backgroundColor: isSelected ? colors.tagActive : colors.tagInactive }
            ]}
            onPress={onPress}
        >
            <FontAwesome5 name={category.icon} size={24} color={colors.textPrimary} />
            <ThemedText style={styles.categoryButtonText}>{category.name}</ThemedText>
        </TouchableOpacity>
    );

    const Grid = ({ items, numColumns, renderItem }: { items: any[], numColumns: number, renderItem: (item: any) => React.ReactNode }) =>
    {
        const rows = Math.ceil(items.length / numColumns);
        return (
            <View style={styles.gridContainer}>
                {[...Array(rows)].map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.gridRow}>
                        {items.slice(rowIndex * numColumns, (rowIndex + 1) * numColumns).map((item, index) => (
                            <View key={index} style={styles.gridItem}>
                                {renderItem(item)}
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    const renderStep = () =>
    {
        const opacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [150, 0],
        });

        switch (step)
        {
            case 0:
                return (
                    <Animated.View style={[styles.stepContainer, { opacity, transform: [{ translateY }] }]}>
                        <ThemedText style={styles.stepTitle}>Welche Veranstaltungen interessieren Sie?</ThemedText>
                        <ScrollView contentContainerStyle={styles.buttonContainer}>
                            <Grid
                                items={allCategories}
                                numColumns={2}
                                renderItem={(category) => (
                                    <GridItem
                                        category={category}
                                        isSelected={selectedCategories.includes(category.name)}
                                        onPress={() => toggleCategory(category.name)}
                                    />
                                )}
                            />
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
                            <TouchableOpacity
                                style={styles.recenterButton}
                                onPress={() =>
                                {
                                    if (currentLocation && 'latitude' in currentLocation && 'longitude' in currentLocation)
                                    {
                                        setLocation({ latitude: currentLocation.latitude, longitude: currentLocation.longitude });
                                    }
                                }}                            >
                                <Ionicons name="locate" size={24} color={colors.primary} />
                            </TouchableOpacity>
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
                                <ThemedText style={styles.listItemText}>Internationale Events</ThemedText>
                                <Switch
                                    style={styles.listItemSwitch}
                                    value={includeInternational}
                                    onValueChange={setIncludeInternational}
                                    trackColor={{ false: colors.backgroundLight, true: colors.primary }}
                                    thumbColor={includeInternational ? colors.secondary : colors.backgroundLight}
                                />
                            </View>
                            <View style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]}>
                                <Ionicons name="notifications-outline" size={24} color={colors.primary} />
                                <ThemedText style={styles.listItemText}>Benachrichtigungen</ThemedText>
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
                        <EventSizeSelector
                            value={preferredEventSize}
                            onChange={(value) => setPreferredEventSize(value)}
                        />
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
            <GestureHandlerRootView style={styles.gestureContainer}>
                <View style={styles.progressContainer}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => (
                        <View
                            key={s}
                            style={[
                                styles.progressDot,
                                { backgroundColor: s <= step ? colors.primary : colors.backgroundLight }
                            ]}
                        />
                    ))}
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {renderStep()}
                </ScrollView>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
                    onPress={handleNext}
                >
                    <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>
                        {step < totalSteps ? 'Weiter' : 'Fertig'}
                    </ThemedText>
                    <Entypo name="chevron-right" size={24} color={colors.buttonText} />
                </TouchableOpacity>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gestureContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
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
        justifyContent: 'flex-start',
        borderRadius: 15,
        padding: 15,
        aspectRatio: 4 / 2,
    },
    categoryButtonText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
    mapContainer: {
        width: '100%',
        height: "auto",
        aspectRatio: 0.9,
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
        margin: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    listContainer: {
        width: '100%',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    listItemText: {
        marginLeft: 15,
        fontSize: 16,
    },
    listItemSwitch: {
        marginLeft: 10,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    gridContainer: {
        width: '100%',
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    gridItem: {
        width: '48%', // Adjust as needed
    },
    recenterButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

});