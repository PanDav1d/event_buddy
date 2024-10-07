import { ThemedText } from '@/components/ThemedText';
import { Text, View, StyleSheet, useColorScheme, ImageBackground, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Image, Animated, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import NetworkClient from '@/api/NetworkClient';
import { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { EventCard } from '@/constants/Types';

export default function EventScreen()
{
    const { eventID } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const [event, setEvent] = useState<EventCard>();
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() =>
    {
        const fetchEvent = async () =>
        {
            const event = await NetworkClient.getEvent(Number(eventID));
            if (event != null)
            {
                setEvent(event);
            } else
            {
                router.back();
            }
        };

        fetchEvent();
    }, [eventID]);

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View style={[styles.header, { opacity: headerOpacity, backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>{event?.title || 'Event'}</ThemedText>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={styles.scrollViewContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                <Animated.View style={[styles.imageContainer, { opacity: imageOpacity }]}>
                    <Image
                        source={{ uri: event?.image_url }}
                        style={styles.image}
                    />
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={colors.background} />
                    </TouchableOpacity>
                </Animated.View>
                <View style={styles.content}>
                    <ThemedText style={styles.title}>{event?.title || 'Event'}</ThemedText>
                    <ThemedText style={styles.organizer}>{event?.organizer || 'Organizer'}</ThemedText>

                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={20} color={colors.primary} />
                        <Ionicons name="star" size={20} color={colors.primary} />
                        <Ionicons name="star" size={20} color={colors.primary} />
                        <Ionicons name="star" size={20} color={colors.primary} />
                        <Ionicons name="star-half" size={20} color={colors.primary} />
                        <ThemedText style={styles.ratingText}>4.7 • 2.5K Bewertungen</ThemedText>
                    </View>

                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="cloud-download-outline" size={24} color={colors.primary} />
                            <ThemedText style={styles.actionButtonText}>Ticket kaufen</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="share-outline" size={24} color={colors.primary} />
                            <ThemedText style={styles.actionButtonText}>Teilen</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.separator} />

                    <ThemedText style={styles.sectionTitle}>Über dieses Event</ThemedText>
                    <ThemedText style={styles.description}>
                        {event?.description || "Keine Beschreibung verfügbar..."}
                    </ThemedText>

                    <View style={styles.separator} />

                    <ThemedText style={styles.sectionTitle}>Event Details</ThemedText>
                    <View style={styles.eventDetails}>
                        <View style={styles.eventInfo}>
                            <Ionicons name="calendar-outline" size={24} color={colors.textPrimary} />
                            <View style={styles.eventInfoText}>
                                <ThemedText style={styles.eventInfoTitle}>Datum</ThemedText>
                                <ThemedText style={styles.eventInfoSubtitle}>
                                    {event?.unix_time || 'TBA'}
                                </ThemedText>
                            </View>
                        </View>
                        <View style={styles.eventInfo}>
                            <Ionicons name="location-outline" size={24} color={colors.textPrimary} />
                            <View style={styles.eventInfoText}>
                                <ThemedText style={styles.eventInfoTitle}>Standort</ThemedText>
                                <ThemedText style={styles.eventInfoSubtitle}>
                                    {event?.location || 'TBA'}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: event?.latitude || 0,
                                longitude: event?.longitude || 0,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                        >
                            {event && (
                                <Marker
                                    coordinate={{
                                        latitude: event.latitude,
                                        longitude: event.longitude,
                                    }}
                                />
                            )}
                        </MapView>
                    </View>

                    <View style={styles.separator} />

                    <ThemedText style={styles.sectionTitle}>Ticket Preise</ThemedText>
                    <View style={styles.ticketPriceContainer}>
                        <ThemedText style={styles.ticketType}>Eintritt</ThemedText>
                        <ThemedText style={styles.ticketPrice}>12.99€</ThemedText>
                    </View>
                    <View style={styles.ticketPriceContainer}>
                        <ThemedText style={styles.ticketType}>VIP Eintritt</ThemedText>
                        <ThemedText style={styles.ticketPrice}>29.99€</ThemedText>
                    </View>
                    <View style={styles.ticketPriceContainer}>
                        <ThemedText style={styles.ticketType}>Gruppe (5+ personen)</ThemedText>
                        <ThemedText style={styles.ticketPrice}>9.99€ pro person</ThemedText>
                    </View>
                </View>
            </Animated.ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.backgroundAlt }]}>
                <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.primary }]}>
                    <ThemedText style={styles.buyButtonText}>Ticket kaufen</ThemedText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
        left: 0,
        right: 0,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        zIndex: 1000,
    },
    headerBackButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    imageContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    organizer: {
        fontSize: 18,
        color: Colors.light.textSecondary,
        marginBottom: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    actionButtonText: {
        marginTop: 4,
        fontSize: 12,
        color: Colors.light.primary,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.light.textPrimary,
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    eventDetails: {
        marginBottom: 24,
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventInfoText: {
        marginLeft: 16,
    },
    eventInfoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventInfoSubtitle: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    mapContainer: {
        height: 200,
        marginBottom: 24,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 8,
    },
    ticketPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    ticketType: {
        fontSize: 16,
    },
    ticketPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
    },
    buyButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    buyButtonText: {
        color: Colors.light.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});