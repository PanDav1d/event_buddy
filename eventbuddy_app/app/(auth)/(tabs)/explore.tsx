import React, { useState, useEffect } from 'react';
import { ThemedText } from "@/components/ThemedText";
import { View, ScrollView, TextInput, StyleSheet, FlatList, TouchableOpacity, useColorScheme, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import NetworkClient from '@/services/NetworkClient';
import { useSession } from '@/components/ctx';
import { EventItem, EventItemType } from '@/components/EventItem';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

export default function ExploreScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const { session } = useSession();

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<{ users: { user: { id: number, username: string, buddyname: string }, hasReceivedRequest: boolean, hasSentRequest: boolean, isFriend: boolean }[], events: any[] } | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (searchText) {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            const newTimeout = setTimeout(() => {
                performSearch();
            }, 1500);
            setTypingTimeout(newTimeout);
        }
    }, [searchText]);

    const performSearch = async () => {
        if (session?.userID) {
            try {
                const results = await NetworkClient.search(session.userID, searchText);
                if (results && results.users && results.events) {
                    setSearchResults(results as { users: { user: { id: number, username: string, buddyname: string }, hasReceivedRequest: boolean, hasSentRequest: boolean, isFriend: boolean }[], events: any[] });
                } else {
                    console.error('Invalid search results format:', results);
                    setSearchResults(null);
                }
            } catch (error) {
                console.error('Error performing search:', error);
                setSearchResults(null);
            }
        }
    };

    const handleSearchSubmit = () => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        performSearch();
    };

    const renderSearchResult = ({ item, index }: { item: any, index: number }) => {
        if (item.user) {
            return (
                <Animated.View
                    entering={FadeInUp.delay(index * 100)}
                    exiting={FadeOutDown}>
                    <View style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]}>
                        <View style={[styles.profileImage, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                            <ThemedText style={styles.initialText}>{item.user.username.charAt(0).toUpperCase()}</ThemedText>
                        </View>
                        <View style={styles.friendInfo}>
                            <ThemedText style={styles.friendName}>{item.user.username}</ThemedText>
                            <ThemedText style={styles.friendBuddyname}>{item.user.buddyname}</ThemedText>
                        </View>
                        <TouchableOpacity onPress={() => item.user && handleFriendAction(item.user.id, item.isFriend, item.hasSentRequest)} style={styles.addFriendButton}>
                            {item.isFriend ? (
                                <Ionicons name="person-remove-outline" size={24} color={colors.primary} />
                            ) : item.hasSentRequest ? (
                                <ThemedText>Anfrage gesendet</ThemedText>
                            ) : (
                                <Ionicons name="person-add-outline" size={24} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            );
        } else {
            return (
                <Animated.View
                    entering={FadeInUp.delay(index * 100)}
                    exiting={FadeOutDown}>
                    <EventItem
                        data={item}
                        style={styles.eventItem}
                        type={EventItemType.small}
                        likeable={false} />
                </Animated.View>
            );
        }
    };

    const handleFriendAction = async (userId: number, isFriend: boolean | undefined, hasSentRequest: boolean | undefined) => {
        try {
            if (session?.userID) {
                if (isFriend) {
                    await NetworkClient.removeFriend(session.userID, userId);
                } else if (!hasSentRequest) {
                    await NetworkClient.sendFriendRequest(session.userID, userId);
                }
                performSearch();
            }
        } catch (error) {
            console.error('Error performing friend action:', error);
        }
    };

    const clearSearch = () => {
        setSearchText('');
        setSearchResults(null);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.backgroundAlt }]}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        placeholder="Suchen"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSearchSubmit}
                    />
                    {searchText ? (
                        <TouchableOpacity onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#999" style={styles.clearIcon} />
                        </TouchableOpacity>
                    ) : null}
                </View>
                {searchText && (
                    <TouchableOpacity style={styles.cancelButton} onPress={clearSearch}>
                        <ThemedText>Abbrechen</ThemedText>
                    </TouchableOpacity>
                )}
            </View>
            {searchResults ? (
                <View style={styles.searchResultsContainer}>
                    <FlatList
                        data={[...(searchResults.users || []), ...(searchResults.events || [])]}
                        renderItem={renderSearchResult}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.searchResultsList}
                        contentContainerStyle={styles.searchResultsContent}
                    />
                </View>
            ) : (
                <View style={styles.emptyStateContainer}>
                    <Ionicons name="search-outline" size={80} color={colors.textSecondary} style={styles.emptyStateIcon} />
                    <ThemedText style={styles.emptyStateTitle}>Entdecke Neues!</ThemedText>
                    <ThemedText style={styles.emptyStateSubtitle}>Suche nach Events und Personen</ThemedText>
                    <View style={styles.suggestionsContainer}>
                        <ThemedText style={styles.suggestionsTitle}>Vorschläge:</ThemedText>
                        <View style={styles.suggestionTags}>
                            <TouchableOpacity style={[styles.suggestionTag, { backgroundColor: colors.backgroundAlt }]} onPress={() => setSearchText('Party')}>
                                <ThemedText>🎉 Party</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.suggestionTag, { backgroundColor: colors.backgroundAlt }]} onPress={() => setSearchText('Sport')}>
                                <ThemedText>⚽ Sport</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.suggestionTag, { backgroundColor: colors.backgroundAlt }]} onPress={() => setSearchText('Musik')}>
                                <ThemedText>🎵 Musik</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    clearIcon: {
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    cancelButton: {
        marginLeft: 10,
        padding: 5,
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    emptyStateIcon: {
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        opacity: 0.7,
    },
    suggestionsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    suggestionsTitle: {
        fontSize: 18,
        marginBottom: 15,
    },
    suggestionTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    suggestionTag: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    searchResultsContainer: {
        flex: 1,
    },
    searchResultsList: {
        flex: 1,
    },
    searchResultsContent: {
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
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 16,
        marginBottom: 16,
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
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    initialText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '600',
    },
    friendBuddyname: {
        fontSize: 14,
        color: '#8E8E8E',
    },
    addFriendButton: {
        padding: 10,
    },
});
