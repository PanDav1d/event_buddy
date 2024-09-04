import { ThemedText } from '@/components/ThemedText';
import { Text, View, StyleSheet, useColorScheme, ImageBackground, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Image } from 'react-native';
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

    useEffect(() =>
    {
        const hardcodedEvent: EventCard = {
            id: 1,
            title: "Summer Music Festival",
            organizer: "City Events Co.",
            description: "Join us for a day of live music and fun in the sun!",
            image_url: "https://picsum.photos/id/158/200/300",
            unix_time: 1656172800, // June 25, 2023, 12:00:00 PM UTC
            location: "Central Park, New York",
            latitude: 40.7829,
            longitude: -73.9654,
            tags: ["music", "festival", "summer"],
            is_saved: false,
            amount_saved: 0,
        };

        setEvent(hardcodedEvent);
    }, [eventID]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>{event?.title || 'Event'}</ThemedText>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: event?.image_url }}
                        style={styles.image}
                    />
                </View>
                <View style={styles.content}>
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
                            <Ionicons name="time-outline" size={24} color={colors.textPrimary} />
                            <View style={styles.eventInfoText}>
                                <ThemedText style={styles.eventInfoTitle}>Uhrzeit</ThemedText>
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
                    <View style={styles.separator} />
                    <ThemedText style={styles.description}>
                        {event?.description || "Keine Beschreibung verfügbar..."}
                    </ThemedText>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.backgroundAlt }]}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                    <ThemedText style={styles.actionButtonText}>Zum Kalender</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={24} color={colors.primary} />
                    <ThemedText style={styles.actionButtonText}>Event speichern</ThemedText>
                </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
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
    content: {
        padding: 16,
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
    separator: {
        height: 1,
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
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
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
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
    buyButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buyButtonText: {
        color: Colors.light.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});