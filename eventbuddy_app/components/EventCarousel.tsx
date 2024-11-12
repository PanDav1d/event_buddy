import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity, ViewStyle, Share, Animated, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Event, EventCardPreview } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { FlatList } from 'react-native-gesture-handler';
import { EventItem, EventItemType } from './EventItem';
import { TitleSeperator, TitleSeperatorType } from '@/components/TitleSeperator';
import NetworkClient from '@/services/NetworkClient';
import { useSession } from '@/components/ctx';

interface EventCarouselProps {
    title?: string;
    data: EventCardPreview[];
    eventCardType?: EventItemType;
}

export function EventCarousel({ title, data, eventCardType }: EventCarouselProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { session } = useSession();

    const toggleSaveEvent = async (eventId: number) => {
        if (session?.userID) {
            const response = await NetworkClient.saveEvent(session.userID, eventId);
            console.log(response);
            const updatedData = data.map(event =>
                event.id === eventId
                    ? { ...event, eventSaved: !event.eventSaved }
                    : event
            );
        }
    };

    return (
        <View style={styles.container}>
            {title && <TitleSeperator type={TitleSeperatorType.left} title={title} />}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={({ item }) => <EventItem type={eventCardType} data={item} style={styles.eventCardList} onSave={() => toggleSaveEvent(item.id)} />} />
        </View>
    );
}

const styles = StyleSheet.create({
    eventCardList: {
        marginHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 20,
    },
    container: {
        marginHorizontal: 10,
        marginVertical: 20,
    }
})
