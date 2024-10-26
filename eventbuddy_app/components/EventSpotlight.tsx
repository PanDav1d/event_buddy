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

    const saveEvent = async (eventId: number) =>
    {
        NetworkClient.saveEvent(session!.userID, eventId);
    };

    return (
        <View style={styles.container}>
            {title && <TitleSeperator type={TitleSeperatorType.left} title={title} />}
            <EventItem {...data} style={styles.eventCardList} onSave={() => saveEvent(data.id)} />
        </View>
    );
}

const styles = StyleSheet.create({
    eventCardList: {
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 20,
    },
    container: {
        backgroundColor: "#222",
        borderRadius: 25,
        paddingBottom: 25,
        marginHorizontal: 10,
        marginVertical: 20,
    }
})