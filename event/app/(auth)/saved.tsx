import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { EventCard } from '@/constants/Types';
import { View, StyleSheet, useColorScheme, SafeAreaView, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import { EventItem } from '@/components/EventItem';

const screenWidth = Dimensions.get('window').width;

export default function SavedScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { signOut, session } = useSession();
    const [savedCards, setSavedCards] = useState<EventCard[]>([]);

    useEffect(() =>
    {
        fetchSavedEvents();
    }, []);

    const fetchSavedEvents = async () =>
    {
        try
        {
            if (session?.userID)
            {
                const userId = session.userID;
                const fetchedEvents = await NetworkClient.getSavedEvents(userId);
                console.log('Fetched events:', fetchedEvents);
                setSavedCards(fetchedEvents);
            }
        } catch (error)
        {
            console.error('Error fetching saved events:', error);
        }
    };

    const toggleSaveEvent = async (eventId: number) =>
    {
        if (session?.userID)
        {
            await NetworkClient.saveEvent(session.userID, eventId);
            fetchSavedEvents();
        }
    };

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.listContainer}>
                        {savedCards.map((event) => (
                            <EventItem
                                key={event.id}
                                {...event}
                                style={styles.eventItem}
                                onSave={() => toggleSaveEvent(event.id)}
                            />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
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
    scrollView: {
        flex: 1,
    },
    listContainer: {
        padding: 10,
    },
    eventItem: {
        width: '100%',
        marginBottom: 20,
    },
});