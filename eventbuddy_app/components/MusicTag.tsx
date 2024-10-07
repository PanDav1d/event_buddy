import React from 'react';
import { Colors } from "@/constants/Colors";
import { useColorScheme, View, StyleSheet, Dimensions, FlatList, ImageBackground } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const itemWidth = (width - 60) / 2;
const itemHeight = itemWidth * 0.6; // Reduced the height by adjusting this value

const genreImages = {
  Jazz: 'https://picsum.photos/id/23/200/300',
  Rock: 'https://picsum.photos/id/43/200/300',
  Pop: 'https://picsum.photos/id/98/200/300',
  Classical: 'https://picsum.photos/id/237/200/300',
};

const genreColors = {
  Jazz: '#1E90FF',
  Rock: '#DC143C',
  Pop: '#FF69B4',
  Classical: '#DAA520',
};

export function MusicTag({ genres = ["Jazz", "Rock", "Pop", "Classical"] }) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const renderItem = ({ item }: { item: string }) => (
        <ImageBackground
            source={{ uri: genreImages[item as keyof typeof genreImages] }}
            style={[styles.item, { backgroundColor: genreColors[item as keyof typeof genreColors] }]}
            imageStyle={styles.backgroundImage}
        >
            <View style={styles.overlay}>
                <View style={styles.iconContainer}>
                    <Ionicons name="musical-notes" size={28} color={colors.backgroundLight} />
                </View>
                <ThemedText style={styles.genreText}>{item}</ThemedText>
            </View>
        </ImageBackground>
    );

    return (
        <FlatList
            data={genres}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            numColumns={2}
            columnWrapperStyle={styles.row}
        />
    );
}

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    item: {
        width: itemWidth,
        height: itemHeight,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    backgroundImage: {
        opacity: 0.6,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    iconContainer: {
        marginBottom: 10,
    },
    genreText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
    },
});