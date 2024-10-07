import React from 'react'
import { Pressable, Text, StyleSheet, useColorScheme, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export const ListButton = (data: any, styles: any, color: any, onPress: () => void) =>
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    return (
        <Pressable onPress={data.id === 0 ? onPress : data.onPress} style={[styles.item, { backgroundColor: colors.backgroundAlt }]}>
            <View style={styles.itemContent}>
                <Ionicons name={data.icon} size={24} color={color} />
                <ThemedText style={styles.itemText}>{data.title}</ThemedText>
            </View>
        </Pressable>
    );
}
export default ListButton;