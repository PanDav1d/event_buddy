import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { View, StyleSheet, useColorScheme, SafeAreaView, Dimensions, RefreshControl, Modal, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import NetworkClient from '@/services/NetworkClient';
import { useSession } from '@/components/ctx';
import QRCode from 'react-native-qrcode-svg';
import { Ticket } from '@/constants/Types';
import SubmitButton from '@/components/SubmitButton';
import { EventItem, EventItemType } from '@/components/EventItem';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { TitleSeperator, TitleSeperatorType } from '@/components/TitleSeperator';
import { ActivityIndicatorFullscreenComponent } from '@/components/ActivityIndicatorFullscreenComponent/ActivityIndicatorFullscreenComponent';

const screenWidth = Dimensions.get('window').width;

export default function TicketsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { session } = useSession();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            if (session?.userID) {
                const userId = session.userID;
                const fetchedTickets = await NetworkClient.getUserTickets(userId);
                setTickets(fetchedTickets as Ticket[]);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchTickets().then(() => setRefreshing(false));
    }, []);

    const openQRModal = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTickets = tickets.filter(ticket => {
        const eventDate = new Date(ticket.event!.startDate);
        return eventDate.toDateString() === today.toDateString();
    });

    const futureTickets = tickets.filter(ticket => {
        const eventDate = new Date(ticket.event!.startDate);
        return eventDate > today && eventDate.toDateString() !== today.toDateString();
    }).sort((a, b) => new Date(a.event!.startDate).getTime() - new Date(b.event!.startDate).getTime());

    const pastTickets = tickets.filter(ticket => {
        const eventDate = new Date(ticket.event!.startDate);
        return eventDate < today;
    });

    const renderTicketSection = (sectionTickets: Ticket[], index: number) => {
        return sectionTickets.map((ticket, idx) => (
            <Animated.View
                key={ticket.id}
                entering={FadeInUp.delay((index * sectionTickets.length + idx) * 100)}
                exiting={FadeOutDown}>
                <EventItem
                    type={EventItemType.small}
                    data={ticket.event!}
                    style={{
                        ...(styles.eventItem as object),
                        ...(new Date(ticket.event!.startDate) < today ? styles.pastEvent as object : {})
                    }}
                    onPress={() => openQRModal(ticket)}
                    likeable={false} />
            </Animated.View>
        ));
    };

    if (isLoading) {
        return (
            <ActivityIndicatorFullscreenComponent />
        )
    }

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]} />
                    }>
                    <View style={styles.listContainer}>
                        {tickets.length > 0 ? (
                            <>
                                {todayTickets.length > 0 && (
                                    <>
                                        <TitleSeperator title="Jetzt Scannen" type={TitleSeperatorType.left} />
                                        {renderTicketSection(todayTickets, 0)}
                                    </>
                                )}
                                {futureTickets.length > 0 && (
                                    <>
                                        <TitleSeperator title="Zukünftige Events" type={TitleSeperatorType.left} />
                                        {renderTicketSection(futureTickets, 1)}
                                    </>
                                )}
                                {pastTickets.length > 0 && (
                                    <>
                                        <TitleSeperator title="Abgelaufene Events" type={TitleSeperatorType.left} />
                                        {renderTicketSection(pastTickets, 2)}
                                    </>
                                )}
                            </>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="ticket-outline" size={48} color={colors.textSecondary} />
                                <ThemedText style={styles.emptyText}>
                                    Sie haben noch keine Tickets gekauft. Finden Sie Events und sichern Sie sich Ihre Tickets.
                                </ThemedText>
                                <SubmitButton
                                    style={styles.findEventsButton}
                                    title='Mehr Events finden'
                                    onPress={() => router.push("/")} />
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={closeModal}
                presentationStyle="pageSheet">
                <View style={[styles.modalContainer, { backgroundColor: 'white' }]}>
                    {selectedTicket && (
                        <>
                            <ThemedText style={styles.modalTitle}>{selectedTicket.event!.title}</ThemedText>
                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={selectedTicket.qrCode}
                                    size={250}
                                    color={'black'}
                                />
                            </View>
                            <SubmitButton
                                onPress={closeModal}
                                title="Schließen"
                                style={styles.closeButton}
                            />
                        </>
                    )}
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 16,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    eventItem: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    pastEvent: {
        opacity: 0.5,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
        opacity: 0.6,
        lineHeight: 24,
    },
    findEventsButton: {
        marginTop: 24,
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        color: 'black',
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 32,
        paddingTop: 32,
    },
    qrContainer: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    closeButton: {
        marginTop: 32,
    },
});
