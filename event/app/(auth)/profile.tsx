import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { EventCard } from '@/constants/Types';
import { View, StyleSheet, useColorScheme, ImageBackground, Modal, TextInput, TouchableOpacity, SafeAreaView, Dimensions, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import NetworkClient from '@/api/NetworkClient';
import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '@/components/ctx';


export default function ProfileScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { signOut } = useSession();
    const [savedCards, setSavedCards] = useState<EventCard[]>([]);

    const gridItems = [
        {
            id: 1,
            title: "Gespeicherte",
            icon: 'bookmark-outline',
            onPress: () => console.log('Gespeicherte'),
            gradient: ['#FF9A8B', '#FF6A88'],
        },
        {
            id: 2,
            title: 'Tickets',
            icon: 'ticket-outline',
            onPress: () => console.log('Tickets'),
            gradient: ['#4FACFE', '#00F2FE'],
        },
        {
            id: 3,
            title: 'Nachrichten',
            icon: 'chatbubble-outline',
            onPress: () => console.log('Nachrichten'),
            gradient: ['#43E97B', '#38F9D7'],
        },
        {
            id: 4,
            title: 'Freunde',
            icon: 'people-outline',
            onPress: () => console.log('Freunde'),
            gradient: ['#FA709A', '#FEE140'],
        },
    ];

    const listItems = [
        {
            id: 1,
            title: 'Einstellungen',
            icon: 'settings-outline',
            onPress: () => console.log('Einstellungen'),
        },
        {
            id: 2,
            title: 'Hilfe & Support',
            icon: 'help-circle-outline',
            onPress: () => console.log('Hilfe & Support'),
        },
        {
            id: 3,
            title: 'Datenschutz',
            icon: 'shield-outline',
            onPress: () => console.log('Datenschutz'),
        },
        {
            id: 4,
            title: 'Über uns',
            icon: 'information-circle-outline',
            onPress: () => console.log('Über uns'),
        },
        {
            id: 5,
            title: 'Abmelden',
            icon: 'log-out-outline',
            onPress: () => signOut(),
        }
    ];
    useEffect(() =>
    {
        fetchSavedEvents();
    }, []);

    const fetchSavedEvents = async () =>
    {
        try
        {
            const userId = 1; // Replace with actual user ID
            const fetchedEvents = await NetworkClient.getSavedEvents(userId);
            setSavedCards(fetchedEvents);
        } catch (error)
        {
            console.error('Error fetching saved events:', error);
        }
    };

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.gridContainer}>
                        {gridItems.map((item) => (
                            <TouchableOpacity key={item.id} style={[styles.gridItem, { backgroundColor: colors.backgroundAlt }]} onPress={item.onPress}>
                                <Ionicons name={item.icon as any} size={32} color={colors.primary} />
                                <ThemedText style={styles.gridItemText}>{item.title}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.listContainer}>
                        {listItems.map((item) => (
                            <TouchableOpacity key={item.id} style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]} onPress={item.onPress}>
                                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                                <ThemedText style={styles.listItemText}>{item.title}</ThemedText>
                                <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 20,
    },
    gridItem: {
        width: '48%',
        height: 120,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    gridItemText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
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