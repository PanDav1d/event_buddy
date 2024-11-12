import { ThemedText } from '@/components/ThemedText';
import { Image, View, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, SafeAreaView, Modal, Platform, Linking } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NetworkClient from '@/services/NetworkClient';
import { useState, useEffect } from 'react';
import { Event, EventCardPreview } from '@/constants/Types';
import { useSession } from '@/components/ctx';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicatorFullscreenComponent } from '@/components/ActivityIndicatorFullscreenComponent/ActivityIndicatorFullscreenComponent';
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { MapViewSkeleton } from '@/components/skeletons/MapViewSkeleton/MapViewSkeleton';

export default function EventScreen() {
    const { eventID } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { session } = useSession();

    const [event, setEvent] = useState<Event>();
    const [similarEvents, setSimiliarEvents] = useState<EventCardPreview[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [organizerEvents, setOrganizerEvents] = useState<EventCardPreview[]>();
    const [modalVisible, setModalVisible] = useState(false);

    const isSoldOut = () => {
        return event?.maxTickets && event?.soldTickets && event?.maxTickets <= event?.soldTickets;
    };
    const hasUrl = () => {
        return event?.ticketUrl != null || event?.ticketUrl != "";
    }

    const openBrowser = async () => {
        const url = event?.ticketUrl!; // Replace with your desired URL
        await WebBrowser.openBrowserAsync(url);
    };

    const openMaps = (eventName: string, lat: number, lng: number) => {
        const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = eventName;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url!);
    }

    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            const event = await NetworkClient.getEvent(Number(eventID), session?.userID!);
            if (event != null) {
                setEvent(event.event);
                setSimiliarEvents(event.similarEvents);
                setOrganizerEvents(event.organizerEvents);
            } else {
                router.back();
            }
            setIsLoading(false);
        };
        fetchEvent();
    }, [eventID]);

    if (isLoading) {
        return (
            <ActivityIndicatorFullscreenComponent />
        )
    }
    return (
        <GestureHandlerRootView>
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView>
                    <View style={styles.heroSection}>
                        <Image
                            style={styles.eventImage}
                            source={{ uri: event?.imageUrl || 'default-placeholder-url' }}
                        />
                        <LinearGradient
                            colors={colorScheme === 'dark' ? ['transparent', 'rgba(0,0,0,1)'] : ['transparent', 'rgba(255,255,255,1)']}
                            style={styles.gradient}
                            pointerEvents="none"
                        />
                        <View style={styles.headerButtons}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => router.back()}
                            >
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>
                            <View style={styles.rightButtons}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => {/* Implement save logic */ }}
                                >
                                    {event?.eventSaved! ? (
                                        <Ionicons name="heart" size={24} color='red' />
                                    ) : (
                                        <Ionicons name="heart-outline" size={24} color='white' />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => {/* Implement share logic */ }}
                                >
                                    <Ionicons name="share-outline" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.heroContent}>
                            <ThemedText style={styles.title}>{event?.title || 'Event'}</ThemedText>
                            <View style={styles.organizerRow}>
                                <ThemedText style={styles.organizer}>von {event?.organizerName || 'Organizer'}</ThemedText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.content}>
                        <View style={[styles.quickInfoCard, { backgroundColor: colors.primary }]}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <ThemedText style={styles.infoLabel}>Datum</ThemedText>
                                    <ThemedText style={styles.infoValue}>{new Date(event?.startDate!).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long' })}</ThemedText>
                                </View>
                                <View style={styles.infoSeparator} />
                                <View style={styles.infoItem}>
                                    <ThemedText style={styles.infoLabel}>Verfügbar</ThemedText>
                                    <ThemedText style={styles.infoValue}>
                                        {isSoldOut()
                                            ? 'Ausverkauft'
                                            : `${event?.maxTickets ? event.maxTickets - (event?.soldTickets || 0) : 0} Tickets`
                                        }
                                    </ThemedText>

                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Beschreibung</ThemedText>
                            <ThemedText style={styles.description}>{event?.description}</ThemedText>
                        </View>

                        <View style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Tickets & Preise</ThemedText>
                            {event?.pricingStructure?.toReversed().map((tier) => (
                                <View key={tier.id} style={styles.pricingTier}>
                                    <View style={styles.pricingHeader}>
                                        <ThemedText style={styles.tierTitle}>{tier.title}</ThemedText>
                                        <ThemedText style={styles.tierPrice}>€{tier.price}</ThemedText>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Standort</ThemedText>
                            <View style={styles.mapContainer}>
                                {event == undefined ? (
                                    <MapViewSkeleton />
                                ) : (
                                    <MapView
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: event.latitude,
                                            longitude: event.longitude,
                                            latitudeDelta: 0.02,
                                            longitudeDelta: 0.02,
                                        }}
                                        scrollEnabled={false}
                                        zoomEnabled={false}
                                        mapType='mutedStandard'
                                        cacheEnabled={true}
                                        onPress={() => openMaps(event.title, event.latitude, event.longitude)}
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
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.bottomSheet}>
                    <View style={styles.priceContainer}>
                        <ThemedText style={styles.priceLabel}>Preis</ThemedText>
                        <ThemedText style={styles.price}>{event?.pricingStructure != null && event.pricingStructure?.length > 0 ? `Ab ${Math.min(...event.pricingStructure.map(tier => tier.price))}€` : 'Kostenlos'}</ThemedText>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.buyButton,
                            { backgroundColor: hasUrl() ? '#ccc' : colors.buttonPrimary },
                            hasUrl() && { opacity: 0.5 }
                        ]}
                        onPress={() => !hasUrl() && setModalVisible(true)}
                        disabled={hasUrl()}
                    >
                        <ThemedText style={styles.buyButtonText}>
                            {hasUrl() ? 'Kein Ticket verfügbar' : 'Ticket kaufen'}
                        </ThemedText>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
            <Modal
                animationType="slide"
                presentationStyle="pageSheet"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            <ThemedText style={styles.closeButton}>Fertig</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            openBrowser();
                        }}>
                            <ThemedText style={styles.actionButton}>
                                <Ionicons name="arrow-redo-outline" size={24} color="white" />
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalContent}>
                        <WebView source={{ uri: event?.ticketUrl! }} style={styles.webview} />
                    </View>
                </SafeAreaView>
            </Modal >
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        backgroundColor: 'black',
        flex: 1,
    },
    heroSection: {
        height: 380,
        position: 'relative',
    },
    eventImage: {
        width: '100%',
        height: '100%',
    },
    heroContent: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
    },
    title: {
        fontSize: 34,
        fontWeight: '700',
        color: 'white',
        paddingTop: 20,
        marginBottom: 16,
        letterSpacing: 0.3,
        lineHeight: 30,
    },
    map: {
        // Add appropriate styles for the map
        width: '100%',
        height: 200, // Adjust as needed
    },
    organizerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    organizerAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#rgba(255,255,255,0.3)',
    },
    organizer: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
    },
    content: {
        padding: 24,
    },
    quickInfoCard: {
        borderRadius: 16,
        padding: 20,
        marginTop: -40,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.3)',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
    },
    infoSeparator: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
    },
    infoLabel: {
        fontWeight: 800,
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.8,
    },
    locationCard: {
        backgroundColor: 'rgba(245, 245, 245, 0.5)',
        borderRadius: 16,
        overflow: 'hidden',
    },
    mapPreview: {
        height: 200,
        backgroundColor: '#E0E0E0',
    },
    locationText: {
        padding: 16,
        fontSize: 16,
    },
    bottomSheet: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(200, 200, 200, 0.3)',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        opacity: 0.6,
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
    },
    buyButton: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    closeButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    actionButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    modalContent: {
        flex: 1,
    },
    modalTitle: {
        paddingTop: 20,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 14,
        lineHeight: 22,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '50%',
    },
    headerButtons: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    mapContainer: {
        height: 200,
        marginBottom: 24,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 8,
    },
    pricingTier: {
        padding: 20,
    },
    pricingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tierTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    tierPrice: {
        fontSize: 20,
        fontWeight: '700',
    },
    ticketTierContainer: {
        gap: 12,
        marginBottom: 24,
    },
    ticketTierCard: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ticketTierContent: {
        flex: 1,
    },
    ticketTierTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    ticketTierPrice: {
        fontSize: 20,
        fontWeight: '700',
    },
});
