import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { View, StyleSheet, useColorScheme, SafeAreaView, FlatList, RefreshControl, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import { Ionicons } from '@expo/vector-icons';
import { FriendRequestStatus } from '@/constants/FriendRequestRespondEnum';
import { TitleSeperator } from '@/components/TitleSeperator';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

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
        Alert.alert(
            "Entfolgen",
            "Bist du sicher, dass du diesen Freund entfernen möchtest?",
            [
                {
                    text: "Abbrechen",
                    style: "cancel"
                },
                {
                    text: "Entfernen",
                    style: "destructive",
                    onPress: async () =>
                    {
                        try
                        {
                            if (session?.userID)
                            {
                                setFriends(friends.filter((friend: any) => friend.id !== friendId));
                                await NetworkClient.removeFriend(session.userID, friendId);
                            }
                        } catch (error)
                        {
                            console.error('Error unfollowing friend:', error);
                            fetchFriends();
                        }
                    }
                }
            ]
        );
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
            }
        } catch (error)
        {
            console.error('Error responding to friend request:', error);
            fetchRequests();
        }
    };

    const renderFriendItem = ({ item, index }: { item: { id: number; username: string; buddyname: string; profileImage: string }, index: number }) => (
        <Animated.View entering={FadeInUp.delay(index * 100)} exiting={FadeOutDown}>
            <TouchableOpacity style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]} activeOpacity={0.7}>
                <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    style={styles.profileImage}>
                    <ThemedText style={styles.initialText}>{item.username ? item.username.charAt(0).toUpperCase() : ''}</ThemedText>
                </LinearGradient>
                <View style={styles.friendInfo}>
                    <ThemedText style={styles.friendName}>{item.username}</ThemedText>
                    <ThemedText style={styles.friendBuddyname}>{item.buddyname}</ThemedText>
                </View>
                <TouchableOpacity
                    onPress={() => handleUnfollow(item.id)}
                    style={styles.unfollowButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="person-remove-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderRequestItem = ({ item, index }: { item: { id: number; fromUsername: string; buddyname: string; profileImage: string; status: string }, index: number }) => (
        <Animated.View entering={FadeInUp.delay(index * 100)} exiting={FadeOutDown}>
            <View style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]}>
                <LinearGradient
                    colors={[colors.secondary, colors.primary]}
                    style={styles.profileImage}>
                    <ThemedText style={styles.initialText}>{item.fromUsername ? item.fromUsername.charAt(0).toUpperCase() : ''}</ThemedText>
                </LinearGradient>
                <View style={styles.friendInfo}>
                    <ThemedText style={styles.friendName}>{item.fromUsername}</ThemedText>
                    <ThemedText style={styles.friendBuddyname}>{item.buddyname}</ThemedText>
                </View>
                <View style={styles.requestActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => handleRespondToRequest(item.id, FriendRequestStatus.accepted)}>
                        <Ionicons name="checkmark-outline" size={24} color={colors.success} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleRespondToRequest(item.id, FriendRequestStatus.declined)}>
                        <Ionicons name="close-outline" size={24} color={colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>
                    <FlatList
                        data={friends}
                        renderItem={renderFriendItem}
                        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
                                <ThemedText style={styles.emptyText}>
                                    Du hast noch keine Freunde. Füge Freunde hinzu, um sie hier zu sehen.
                                </ThemedText>
                            </View>
                        }
                        scrollEnabled={false}
                    />
                    <TitleSeperator title={'Deine Freundesanfragen'} />
                    <FlatList
                        data={requests}
                        renderItem={renderRequestItem}
                        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="mail-outline" size={48} color={colors.textSecondary} />
                                <ThemedText style={styles.emptyText}>
                                    Keine ausstehenden Freundschaftsanfragen.
                                </ThemedText>
                            </View>
                        }
                    />
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
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginVertical: 8,
        marginHorizontal: 16,
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
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    friendBuddyname: {
        fontSize: 14,
        opacity: 0.6,
    },
    unfollowButton: {
        padding: 8,
        borderRadius: 12,
    },
    requestActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    acceptButton: {
        marginRight: 8,
    },
    deleteButton: {},
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