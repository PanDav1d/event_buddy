import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity, ViewStyle, Share, Animated, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Event, EventCardPreview } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { FlatList } from 'react-native-gesture-handler';
import { EventItem } from './EventItem';
import { TitleSeperator, TitleSeperatorType } from '@/components/TitleSeperator';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

interface EventSpotlightProps
{
    title?: string;
    data: EventCardPreview;
}

export function EventSpotlight({ title, data }: EventSpotlightProps)
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { session } = useSession();
    const fadeAnim = new Animated.Value(0);

    React.useEffect(() =>
    {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const saveEvent = async (eventId: number) =>
    {
        try
        {
            await NetworkClient.saveEvent(session!.userID, eventId);
            // Add success feedback animation here
        } catch (error)
        {
            // Add error handling
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <LinearGradient
                colors={colorScheme === 'dark'
                    ? ['rgba(40, 40, 40, 0.9)', 'rgba(20, 20, 20, 0.95)']
                    : ['rgba(255, 255, 255, 0.9)', 'rgba(245, 245, 245, 0.95)']}
                style={styles.gradient}
            >
                {title && (
                    <View style={styles.titleContainer}>
                        <TitleSeperator type={TitleSeperatorType.left} title={title} />
                    </View>
                )}
                <EventItem
                    data={data}
                    style={styles.eventCardList}
                    onSave={() => saveEvent(data.id)}
                />
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    eventCardList: {
        alignSelf: 'center',
        width: '100%',
    },
    titleContainer: {
        marginBottom: 15,
    },
    container: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        borderRadius: 25,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginVertical: 20,
    },
    gradient: {
        padding: 20,
        borderRadius: 20,
    }
});