import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity, ViewStyle, Share, Animated, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { EventCard } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { FlatList } from 'react-native-gesture-handler';
import { EventItem } from './EventItem';
import { TitleSeperator, TitleSeperatorType } from '@/components/TitleSeperator';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';

interface EventCarouselProps
{
    title?: string;
    data: EventCard[];
}

export function EventCarousel({ title, data }: EventCarouselProps)
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
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={({ item }) => <EventItem {...item} style={styles.eventCardList} onSave={() => saveEvent(item.id)} />}
            />
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