import React from 'react';
import { Colors } from "@/constants/Colors";
import { useColorScheme, View, StyleSheet, Dimensions, FlatList, ImageBackground, TouchableOpacity, Linking, Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const itemWidth = width * 0.8;
const itemHeight = itemWidth * 0.55;

const djData = [
  { 
    name: 'DJ Awesome', 
    image: 'https://picsum.photos/id/12/200/300', 
    genres: ['House', 'Techno'],
    spotify: 'https://open.spotify.com/artist/...',
    soundcloud: 'https://soundcloud.com/...',
  },
  { 
    name: 'DJ Schnibba', 
    image: 'https://picsum.photos/id/43/200/300', 
    genres: ['EDM', 'Trance'],
    spotify: 'https://open.spotify.com/artist/...',
    soundcloud: 'https://soundcloud.com/...',
  },
  { 
    name: 'DJ Anders', 
    image: 'https://picsum.photos/id/32/200/300', 
    genres: ['Hip-Hop', 'R&B'],
    spotify: 'https://open.spotify.com/artist/...',
    soundcloud: 'https://soundcloud.com/...',
  },
  { 
    name: 'DJ Sowieso', 
    image: 'https://picsum.photos/id/11/200/300', 
    genres: ['Drum & Bass', 'Dubstep'],
    spotify: 'https://open.spotify.com/artist/...',
    soundcloud: 'https://soundcloud.com/...',
  },
];

export function DJWidget() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const renderItem = ({ item }: { item: (typeof djData)[0] }) => (
        <View style={styles.item}>
            <ImageBackground
                source={{ uri: item.image }}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}
            >
                <BlurView intensity={80} style={styles.blurView}>
                    <View style={styles.contentContainer}>
                        <View style={styles.topContainer}>
                            <Image source={{ uri: item.image }} style={styles.profileImage} />
                            <View style={styles.textContainer}>
                                <ThemedText style={styles.djName}>{item.name}</ThemedText>
                                <ThemedText style={styles.genres}>{item.genres.join(' • ')}</ThemedText>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(item.spotify)}>
                                <Ionicons name="musical-notes" size={18} color="#FFFFFF" />
                                <ThemedText style={styles.buttonText}>Spotify</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.soundcloudButton]} onPress={() => Linking.openURL(item.soundcloud)}>
                                <Ionicons name="logo-soundcloud" size={18} color="#FFFFFF" />
                                <ThemedText style={styles.buttonText}>SoundCloud</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </ImageBackground>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={djData}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                snapToInterval={itemWidth + 20}
                decelerationRate="fast"
                snapToAlignment="center"
            />
            <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    item: {
        width: itemWidth,
        height: itemHeight,
        marginRight: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    backgroundImage: {
        flex: 1,
    },
    backgroundImageStyle: {
        opacity: 0.9,
    },
    blurView: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    djName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    genres: {
        fontSize: 16,
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1DB954',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '48%',
    },
    soundcloudButton: {
        backgroundColor: '#FF7700',
    },
    buttonText: {
        color: '#FFFFFF',
        marginLeft: 5,
        fontSize: 14,
        fontWeight: 'bold',
    },
    arrowContainer: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 12,
        padding: 4,
    },
});