import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { View, StyleSheet, useColorScheme, SafeAreaView, Dimensions, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import QRCode from 'react-native-qrcode-svg';
import { Ticket } from '@/constants/Types';
import SubmitButton from '@/components/SubmitButton';

const screenWidth = Dimensions.get('window').width;


export default function TicketsScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { session } = useSession();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() =>
    {
        fetchTickets();
    }, []);

    const fetchTickets = async () =>
    {
        try
        {
            if (session?.userID)
            {
                const userId = session.userID;
                const fetchedTickets = await NetworkClient.getUserTickets(userId);
                setTickets(fetchedTickets as Ticket[]);
            }
        } catch (error)
        {
            console.error('Error fetching tickets:', error);
        }
    };
    const onRefresh = React.useCallback(() =>
    {
        setRefreshing(true);
        fetchTickets().then(() => setRefreshing(false));
    }, []);

    const openQRModal = (ticket: Ticket) =>
    {
        setSelectedTicket(ticket);
        setModalVisible(true);
    };

    const closeModal = () =>
    {
        setModalVisible(false);
    };

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <ScrollView
                    style={[styles.scrollView, { backgroundColor: colors.background }]}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
                        {tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <TouchableOpacity
                                    key={ticket.id}
                                    style={[styles.ticketItem, { backgroundColor: colors.backgroundAlt }]}
                                    onPress={() => openQRModal(ticket)}
                                >
                                    <ThemedText style={[styles.ticketText, { color: colors.textPrimary }]}>
                                        Event ID: {ticket.eventId}
                                    </ThemedText>
                                    <ThemedText style={[styles.ticketText, { color: colors.textPrimary }]}>
                                        Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <ThemedText style={[styles.noTicketsText, { color: colors.textPrimary }]}>
                                You haven't purchased any tickets yet.
                            </ThemedText>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                presentationStyle="pageSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: "white", alignItems: 'center', justifyContent: 'center' }]}>
                    {selectedTicket && (
                        <>
                            <QRCode
                                value={selectedTicket.qrCode}
                                size={250}
                            />
                            <SubmitButton
                                onPress={closeModal}
                                title="Schließen"
                                style={{ marginTop: 20 }}
                            />
                        </>
                    )}
                </View>
            </Modal>
        </GestureHandlerRootView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    listContainer: {
        padding: 10,
    },
    ticketItem: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
    ticketText: {
        fontSize: 16,
    },
    noTicketsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
    },
    modalText: {
        fontSize: 18,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
    },
});