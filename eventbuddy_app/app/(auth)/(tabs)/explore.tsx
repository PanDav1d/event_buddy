import React, { useState, useEffect } from 'react';
import { ThemedText } from "@/components/ThemedText";
import { View, ScrollView, TextInput, StyleSheet, FlatList, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';

export default function ExploreScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const { session } = useSession();

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<{ users: { user: { id: number, username: string, buddyname: string }, hasReceivedRequest: boolean, hasSentRequest: boolean, isFriend: boolean }[], events: { title: string }[] } | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() =>
    {
        if (searchText)
        {
            if (typingTimeout)
            {
                clearTimeout(typingTimeout);
            }
            const newTimeout = setTimeout(() =>
            {
                performSearch();
            }, 1500);
            setTypingTimeout(newTimeout);
        }
    }, [searchText]);

    const performSearch = async () =>
    {
        if (session?.userID)
        {
            try
            {
                const results = await NetworkClient.search(session.userID, searchText);
                if (results && results.users && results.events)
                {
                    setSearchResults(results as { users: { user: { id: number, username: string, buddyname: string }, hasReceivedRequest: boolean, hasSentRequest: boolean, isFriend: boolean }[], events: { title: string }[] });
                } else
                {
                    console.error('Invalid search results format:', results);
                    setSearchResults(null);
                }
            } catch (error)
            {
                console.error('Error performing search:', error);
                setSearchResults(null);
            }
        }
    };

    const handleSearchSubmit = () =>
    {
        if (typingTimeout)
        {
            clearTimeout(typingTimeout);
        }
        performSearch();
    };

    const renderSearchResult = ({ item }: { item: { user?: { id: number, username: string, buddyname: string }, hasReceivedRequest?: boolean, hasSentRequest?: boolean, isFriend?: boolean, title?: string } }) =>
    {
        if (item.user)
        {
            return (
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
            );
        } else if (item.title)
        {
            return (
                <View style={styles.searchResultItem}>
                    <ThemedText>{item.title}</ThemedText>
                </View>
            );
        } else
        {
            return null;
        }
    };

    const handleFriendAction = async (userId: number, isFriend: boolean | undefined, hasSentRequest: boolean | undefined) =>
    {
        try
        {
            if (session?.userID)
            {
                if (isFriend)
                {
                    await NetworkClient.removeFriend(session.userID, userId);
                } else if (!hasSentRequest)
                {
                    await NetworkClient.sendFriendRequest(session.userID, userId);
                }
                // Update the UI by re-fetching search results
                performSearch();
            }
        } catch (error)
        {
            console.error('Error performing friend action:', error);
        }
    };

    const clearSearch = () =>
    {
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
                    />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Hier würden die Bilder oder Inhalte in einem Raster angezeigt werden */}
                    {/* Beispiel für ein Raster-Element */}
                    <View style={styles.gridItem}>
                        <View style={styles.imagePlaceholder}></View>
                    </View>
                    <View style={styles.gridItem}>
                        <View style={styles.imagePlaceholder}></View>
                    </View>
                    <View style={styles.gridItem}>
                        <View style={styles.imagePlaceholder}></View>
                    </View>
                    {/* Weitere Grid-Elemente hier hinzufügen */}
                </ScrollView>
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
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 2,
    },
    gridItem: {
        width: '33%',
        aspectRatio: 1,
        padding: 1,
    },
    imagePlaceholder: {
        flex: 1,
        backgroundColor: '#e0e0e0',
    },
    searchResultsContainer: {
        flex: 1,
    },
    searchResultsList: {
        flex: 1,
    },
    searchResultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 20,
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