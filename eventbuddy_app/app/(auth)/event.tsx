import { ThemedText } from '@/components/ThemedText';
import { Image, View, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NetworkClient from '@/api/NetworkClient';
import { useState, useEffect } from 'react';
import { Event, EventCardPreview } from '@/constants/Types';
import { useSession } from '@/components/ctx';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { EventItem } from '@/components/EventItem';
import { TitleSeperator } from '@/components/TitleSeperator';
import { EventCarousel } from '@/components/EventCarousel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function EventScreen()
{
    const { eventID } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { session } = useSession();

    const [event, setEvent] = useState<Event>();
    const [similarEvents, setSimiliarEvents] = useState<EventCardPreview[]>();
    const [organizerEvents, setOrganizerEvents] = useState<EventCardPreview[]>();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const isSoldOut = () =>
    {
        return event?.maxTickets && event?.soldTickets && event?.maxTickets <= event?.soldTickets;
    };



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

    const purchaseTicket = async () =>
    {
        try
        {
            if (!session?.userID || !eventID)
            {
                return;
            }
            const response = await NetworkClient.purchaseTicket(Number(session.userID), Number(eventID));
            if (response)
            {
                router.push('/tickets');
            }
        } catch (error)
        {
            console.log('Purchase failed:', error);
        }
    }

    const renderModalContent = () =>
    {
        switch (currentStep)
        {
            case 1:
                return (
                    <View style={styles.modalStepContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.stepProgress}>
                                {[1, 2, 3].map((step) => (
                                    <View key={step} style={[
                                        styles.stepDot,
                                        currentStep >= step && styles.stepDotActive && { backgroundColor: colors.primary }
                                    ]} />
                                ))}
                            </View>
                        </View>

                        <View style={styles.modalHero}>
                            <ThemedText style={styles.modalTitle}>Zusammenfassung</ThemedText>
                            <ThemedText style={styles.modalSubtitle}>Prüfe die Event Details</ThemedText>
                        </View>

                        <View style={styles.ticketCard}>
                            <View style={styles.ticketHeader}>
                                <ThemedText style={styles.ticketTitle}>{event?.title}</ThemedText>
                                <ThemedText style={styles.ticketPrice}>€{event?.price || 0}</ThemedText>
                            </View>

                            <View style={styles.ticketDetails}>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Datum</ThemedText>
                                    <ThemedText style={styles.detailValue}>{new Date(event?.startDate!).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.detailLabel}>Verfügbar</ThemedText>
                                    <ThemedText style={styles.detailValue}>
                                        {event?.maxTickets ? event.maxTickets - (event?.soldTickets || 0) : 0} Tickets
                                    </ThemedText>
                                </View>
                            </View>
                        </View>
                        <View style={styles.quantitySelector}>
                            <ThemedText style={styles.detailLabel}>Anzahl Tickets</ThemedText>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity
                                    style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                                    onPress={() => ticketQuantity > 1 && setTicketQuantity(prev => prev - 1)}
                                >
                                    <Ionicons name="remove" size={20} color="white" />
                                </TouchableOpacity>
                                <ThemedText style={styles.quantityText}>{ticketQuantity}</ThemedText>
                                <TouchableOpacity
                                    style={[styles.quantityButton, { backgroundColor: colors.primary }]}
                                    onPress={() => ticketQuantity < (event?.maxTickets || 0) - (event?.soldTickets || 0) && setTicketQuantity(prev => prev + 1)}
                                >
                                    <Ionicons name="add" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>


                        <TouchableOpacity
                            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                            onPress={() => setCurrentStep(2)}
                        >
                            <ThemedText style={styles.primaryButtonText}>Weiter zur Bezahlung</ThemedText>
                        </TouchableOpacity>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.modalStepContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.stepProgress}>
                                {[1, 2, 3].map((step) => (
                                    <View key={step} style={[
                                        styles.stepDot,
                                        currentStep >= step && styles.stepDotActive && { backgroundColor: colors.primary }
                                    ]} />
                                ))}
                            </View>
                        </View>

                        <View style={styles.modalHero}>
                            <ThemedText style={styles.modalTitle}>Zahlungsmittel</ThemedText>
                            <ThemedText style={styles.modalSubtitle}>Wähle deine Zahlungsmethode</ThemedText>
                        </View>

                        <View style={styles.paymentMethodsContainer}>
                            <TouchableOpacity style={styles.paymentMethod}>
                                <View style={styles.paymentMethodContent}>
                                    <View style={styles.paymentMethodIcon}>
                                        <Ionicons name='card-outline' size={26} color={'white'} />
                                    </View>
                                    <ThemedText style={styles.paymentMethodText}>Karte</ThemedText>
                                </View>
                                <View style={styles.paymentMethodCheck} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.paymentMethodsContainer}>
                            <TouchableOpacity style={styles.paymentMethod}>
                                <View style={styles.paymentMethodContent}>
                                    <View style={styles.paymentMethodIcon}>
                                        <Ionicons name='logo-paypal' size={26} color={'white'} />
                                    </View>
                                    <ThemedText style={styles.paymentMethodText}>PayPal</ThemedText>
                                </View>
                                <View style={styles.paymentMethodCheck} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => setCurrentStep(1)}
                            >
                                <ThemedText style={styles.secondaryButtonText}>Zurück</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                                onPress={() => setCurrentStep(3)}
                            >
                                <ThemedText style={styles.primaryButtonText}>Fortfahren</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.modalStepContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.stepProgress}>
                                {[1, 2, 3].map((step) => (
                                    <View key={step} style={[
                                        styles.stepDot,
                                        currentStep >= step && styles.stepDotActive && { backgroundColor: colors.primary }
                                    ]} />
                                ))}
                            </View>
                        </View>

                        <View style={styles.modalHero}>
                            <ThemedText style={styles.modalTitle}>Bestätigung</ThemedText>
                            <ThemedText style={styles.modalSubtitle}>Überprüfe deinen Kauf</ThemedText>
                        </View>

                        <View style={styles.summaryCard}>
                            <View style={styles.summarySection}>
                                <ThemedText style={styles.summaryLabel}>Event</ThemedText>
                                <ThemedText style={styles.summaryValue}>{event?.title}</ThemedText>
                            </View>
                            <View style={styles.summarySection}>
                                <ThemedText style={styles.summaryLabel}>Datum</ThemedText>
                                <ThemedText style={styles.summaryValue}>{new Date(event?.startDate!).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</ThemedText>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summarySection}>
                                <ThemedText style={styles.summaryLabel}>Brutto</ThemedText>
                                <ThemedText style={styles.summaryTotal}>€{event?.price || 0}</ThemedText>
                            </View>
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => setCurrentStep(2)}
                            >
                                <ThemedText style={styles.secondaryButtonText}>Zurück</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                                onPress={() =>
                                {
                                    purchaseTicket();
                                    setModalVisible(false);
                                    setCurrentStep(1);
                                }}
                            >
                                <ThemedText style={styles.primaryButtonText}>Kauf abschliessen</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
        }
    };
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
                            colors={['transparent', 'rgba(0,0,0,1)']}
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
                                    <Ionicons name="heart-outline" size={24} color="white" />
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
                                <View style={styles.organizerAvatar} />
                                <ThemedText style={styles.organizer}>{event?.organizerId || 'Organizer'}</ThemedText>
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
                            <ThemedText style={styles.sectionTitle}>Standort</ThemedText>
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
                        </View>
                    </View>

                    <View style={styles.section}>
                        <TitleSeperator title='Ähnliche Events' />
                        <EventCarousel data={similarEvents} />
                    </View>

                    <View style={styles.section}>
                        <TitleSeperator title={"Mehr von " + event?.organizerId} />
                        <EventCarousel data={organizerEvents} />
                    </View>

                </ScrollView>

                <View style={styles.bottomSheet}>
                    <View style={styles.priceContainer}>
                        <ThemedText style={styles.priceLabel}>Preis</ThemedText>
                        <ThemedText style={styles.price}>€{event?.price || 0}</ThemedText>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.buyButton,
                            { backgroundColor: isSoldOut() ? '#ccc' : colors.buttonPrimary },
                            isSoldOut() && { opacity: 0.5 }
                        ]}
                        onPress={() => !isSoldOut() && setModalVisible(true)}
                        disabled={isSoldOut()}
                    >
                        <ThemedText style={styles.buyButtonText}>
                            {isSoldOut() ? 'Ausverkauft' : 'Ticket kaufen'}
                        </ThemedText>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
            <Modal
                animationType="slide"
                presentationStyle="pageSheet"
                visible={modalVisible}
                onRequestClose={() =>
                {
                    setModalVisible(false);
                    setCurrentStep(1);
                }
                }
            >
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() =>
                            {
                                setModalVisible(false);
                                setCurrentStep(1);
                            }}
                        >
                            <ThemedText style={styles.closeButton}>Abbrechen</ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.stepIndicator}>Schritt {currentStep} von 3</ThemedText>
                    </View>
                    <View style={styles.modalContent}>
                        {renderModalContent()}
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
    stepIndicator: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalContent: {
        flex: 1,
        padding: 24,
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    modalButton: {
        padding: 16,
        borderRadius: 12,
        width: '48%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    backButton: {
        backgroundColor: '#666',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    paymentInfo: {
        backgroundColor: 'rgba(245, 245, 245, 0.5)',
        padding: 20,
        borderRadius: 16,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.3)',
    },
    summaryContainer: {
        backgroundColor: 'rgba(245, 245, 245, 0.5)',
        padding: 20,
        borderRadius: 16,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.3)',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 245, 245, 0.5)',
        padding: 16,
        borderRadius: 12,
        marginVertical: 12,
    },
    modalStepContainer: {
        flex: 1,
    },
    stepProgress: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    stepDotActive: {
        backgroundColor: '#007AFF',
    },
    modalHero: {
        marginBottom: 32,
    },
    modalSubtitle: {
        fontSize: 16,
        opacity: 0.6,
    },
    ticketCard: {
        backgroundColor: 'rgba(245, 245, 245, 0.5)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.3)',
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    ticketTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    ticketPrice: {
        fontSize: 24,
        fontWeight: '700',
    },
    ticketDetails: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailLabel: {
        opacity: 0.6,
    },
    detailValue: {
        fontWeight: '500',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'rgba(120, 120, 128, 0.2)',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 'auto',
    },
    paymentMethodsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    paymentMethod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.3)',
    },
    paymentMethodContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentMethodIcon: {
        width: 32,
        height: 32,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentMethodText: {
        fontSize: 16,
        fontWeight: '500',
    },
    paymentMethodCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    summaryCard: {
        backgroundColor: 'rgba(245, 245, 245, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.3)',
    },
    summarySection: {
        gap: 8,
        marginVertical: 12,
    },
    summaryLabel: {
        fontSize: 14,
        opacity: 0.6,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    summaryTotal: {
        fontSize: 24,
        fontWeight: '700',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        marginVertical: 12,
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
        backgroundColor: 'rgba(0,0,0,0.3)',
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
    quantitySelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        marginBottom: 40,
        borderTopWidth: 1,
        borderTopColor: 'rgba(200, 200, 200, 0.3)',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
    },

});