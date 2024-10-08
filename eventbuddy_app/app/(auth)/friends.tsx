import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { View, StyleSheet, useColorScheme, SafeAreaView, FlatList, RefreshControl, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import { Ionicons } from '@expo/vector-icons';
import { FriendRequestStatus } from '@/constants/FriendRequestRespondEnum';

const { width, height } = Dimensions.get('window');

export default function FriendsScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { session } = useSession();
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('friends');

    useEffect(() =>
    {
        fetchFriends();
        fetchRequests();
    }, []);

    const fetchFriends = async () =>
    {
        try
        {
            if (session?.userID)
            {
                const userId = session.userID;
                const fetchedFriends = await NetworkClient.getUserFriends(userId);
                setFriends(fetchedFriends as never[]);
            }
        } catch (error)
        {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchRequests = async () =>
    {
        try
        {
            if (session?.userID)
            {
                const userId = session.userID;
                const fetchedRequests = await NetworkClient.getFriendRequests(session.userID);
                setRequests(fetchedRequests as never[]);
            }
        } catch (error)
        {
            console.error('Error fetching friend requests:', error);
        }
    };

    const onRefresh = React.useCallback(() =>
    {
        setRefreshing(true);
        Promise.all([fetchFriends(), fetchRequests()]).then(() => setRefreshing(false));
    }, []);

    const handleUnfollow = async (friendId: number) =>
    {
        try
        {
            if (session?.userID)
            {
                setFriends(friends.filter((friend: any) => friend.id !== friendId));
                await NetworkClient.removeFriend(session.userID, friendId);
            } else
            {
                console.error('User ID is undefined');
            }
        } catch (error)
        {
            console.error('Error unfollowing friend:', error);
            fetchFriends(); // Refresh the list in case of error
        }
    };

    const handleRespondToRequest = async (requestId: number, status: FriendRequestStatus) =>
    {
        try
        {
            if (session?.userID)
            {
                setRequests(requests.filter((request: any) => request.id !== requestId));
                const success = await NetworkClient.respondFriendRequest(session.userID, requestId, status);
                if (success && status === FriendRequestStatus.accepted)
                {
                    fetchFriends();
                }
            } else
            {
                console.error('User ID is undefined');
            }
        } catch (error)
        {
            console.error('Error responding to friend request:', error);
            fetchRequests(); // Refresh the list in case of error
        }
    };

    const renderFriendItem = ({ item }: { item: { id: number; username: string; buddyname: string; profileImage: string } }) => (
        <View style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]}>
            <View style={[styles.profileImage, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                <ThemedText style={styles.initialText}>{item.username ? item.username.charAt(0).toUpperCase() : ''}</ThemedText>
            </View>
            <View style={styles.friendInfo}>
                <ThemedText style={styles.friendName}>{item.username}</ThemedText>
                <ThemedText style={styles.friendBuddyname}>{item.buddyname}</ThemedText>
            </View>
            <TouchableOpacity onPress={() => handleUnfollow(item.id)} style={styles.unfollowButton}>
                <Ionicons name="person-remove-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );

    const renderRequestItem = ({ item }: { item: { id: number; fromUsername: string; buddyname: string; profileImage: string; status: string } }) =>
    {
        if (item.status != "pending")
        {
            return null
        }
        return (
            <View style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]}>
                <View style={[styles.profileImage, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                    <ThemedText style={styles.initialText}>{item.fromUsername ? item.fromUsername.charAt(0).toUpperCase() : ''}</ThemedText>
                </View>
                <View style={styles.friendInfo}>
                    <ThemedText style={styles.friendName}>{item.fromUsername}</ThemedText>
                    <ThemedText style={styles.friendBuddyname}>{item.buddyname}</ThemedText>
                </View>
                <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.acceptButton} onPress={() => handleRespondToRequest(item.id, FriendRequestStatus.accepted)}>
                        <Ionicons name="checkmark-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleRespondToRequest(item.id, FriendRequestStatus.declined)}>
                        <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
                        onPress={() => setActiveTab('friends')}
                    >
                        <ThemedText style={styles.tabText}>Freunde</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
                        onPress={() => setActiveTab('requests')}
                    >
                        <ThemedText style={styles.tabText}>Anfragen</ThemedText>
                    </TouchableOpacity>
                </View>
                {activeTab === 'friends' ? (
                    <FlatList
                        data={friends}
                        renderItem={renderFriendItem}
                        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <ThemedText style={styles.emptyText}>
                                Du hast noch keine Freunde. Füge Freunde hinzu, um sie hier zu sehen.
                            </ThemedText>
                        }
                    />
                ) : (
                    <FlatList
                        data={requests}
                        renderItem={renderRequestItem}
                        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={
                            <ThemedText style={styles.emptyText}>
                                Keine ausstehenden Freundschaftsanfragen.
                            </ThemedText>
                        }
                    />
                )}
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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FF5722',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
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
    unfollowButton: {
        padding: 10,
    },
    requestActions: {
        flexDirection: 'row',
    },
    acceptButton: {
        padding: 10,
        marginRight: 10,
    },
    deleteButton: {
        padding: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#8E8E8E',
        paddingHorizontal: 20,
    },
});