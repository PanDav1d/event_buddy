import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity, ViewStyle, Share, Animated, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { EventCard } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { EventItem } from '@/components/EventItem';

interface EventHighlightProps
{
    title?: string;
    data: EventCard;
}

export function EventHighlight({ title, data }: EventHighlightProps)
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <EventItem {...data} onSave={() => console.log("saved")} />
    );
}