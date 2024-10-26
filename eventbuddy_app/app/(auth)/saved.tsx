import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { Event, EventCardPreview } from '@/constants/Types';
import { View, StyleSheet, useColorScheme, SafeAreaView, Dimensions, RefreshControl, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import { EventItem, EventItemType } from '@/components/EventItem';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

export default function SavedScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { signOut, session } = useSession();
    const [savedCards, setSavedCards] = useState<EventCardPreview[]>([]);
    const [refreshing, setRefreshing] = useState(false);

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

    const onRefresh = React.useCallback(() =>
    {
        setRefreshing(true);
        fetchSavedEvents().then(() => setRefreshing(false));
    }, []);

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
                        {savedCards.length > 0 ? (
                            savedCards.map((event, index) => (
                                <Animated.View
                                    key={event.id}
                                    entering={FadeInUp.delay(index * 100)}
                                    exiting={FadeOutDown}>
                                    <EventItem
                                        data={event}
                                        style={styles.eventItem}
                                        type={EventItemType.small}
                                        onSave={() => toggleSaveEvent(event.id)} />
                                </Animated.View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="bookmark-outline" size={48} color={colors.textSecondary} />
                                <ThemedText style={styles.emptyText}>
                                    Sie haben noch keine Events geliked. Speichern Sie Events, um sie hier zu sehen.
                                </ThemedText>
                            </View>
                        )}
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
});