import { View, StatusBar, Text, StyleSheet, Pressable, ScrollView, Modal, Animated, useColorScheme, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import React, { useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { FilterBar } from "./FilterBar";
import { SearchParams } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { CalendarPicker } from "@/components/CalendarPicker";
import { ProfileButton } from "@/components/ProfileButton";
import { SafeAreaView } from "react-native-safe-area-context";


interface SearchBarProps {
    onSearchChange: (params: SearchParams) => void;
}

export function SearchBar({ onSearchChange }: SearchBarProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [text, setText] = React.useState("");
    const [activeTab, setActiveTab] = React.useState("All");
    const [modalVisible, setModalVisible] = React.useState(false);
    const [showAllTags, setShowAllTags] = useState(false);
    const tabs = ["All", "Music Festival", "Film Festival", "Food Festival", "Nightclub"];
    const slideAnimation = useRef(new Animated.Value(0)).current;

    const allTags = ["Music", "Film", "Food", "Nightlife", "Art", "Sports", "Technology", "Fashion", "Education", "Health"];

    const [searchParams, setSearchParams] = useState<SearchParams>({
        tags: [],
        latitude: 52.520008,
        longitude: 13.404954,
        radius: 10,
        date_range: {
            start: new Date(),
            end: new Date()
        }
    });
    

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            console.log('Permission has been already allowed');

            let location = await Location.getCurrentPositionAsync({});
            setSearchParams(prevParams => ({
                ...prevParams,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
            }));
        })();
    }, []);

    useEffect(() => {
        if (modalVisible) {
            Animated.timing(slideAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [modalVisible]);

    const translateY = slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [600, 0],
    });

    const handleSearch = () => {
        onSearchChange(searchParams);
        setModalVisible(false);
    }

    const handleParamChange = (key: string, value: any, updateMap?: boolean) => {
        setSearchParams(prevParams => ({
            ...prevParams,
            [key]: value
        }));

        if (key === 'radius' && updateMap) {
            updateMapRegion(value);
        }
    }

    const updateMapRegion = (radius: number) => {
        if (mapRef.current) {
            const latitude = searchParams.latitude;
            const longitude = searchParams.longitude;
            const latDelta = radius * 2 / 111.32;
            const lonDelta = radius * 2 / (111.32 * Math.cos(latitude * (Math.PI / 180)));
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: latDelta,
                longitudeDelta: lonDelta,
            }, 500);
        }
    }

    const toggleTag = (tag: string) => {
        setSearchParams(prevParams => {
            const newTags = prevParams.tags.includes(tag)
                ? prevParams.tags.filter(t => t !== tag)
                : [...prevParams.tags, tag];
            return { ...prevParams, tags: newTags };
        });
    }

    const renderTags = () => {
        const selectedTags = searchParams.tags;
        const unselectedTags = allTags.filter(tag => !selectedTags.includes(tag));
        const tagsToShow = showAllTags ? [...selectedTags, ...unselectedTags] : [...selectedTags, ...unselectedTags.slice(0, Math.max(0, 5 - selectedTags.length))];
        
        return (
            <View style={styles.tagContainer}>
                {tagsToShow.map((tag, index) => (
                    <Pressable
                        key={index}
                        style={[
                            styles.tag,
                            searchParams.tags.includes(tag) && {backgroundColor: colors.accent}
                        ]}
                        onPress={() => toggleTag(tag)} >
                        <ThemedText style={searchParams.tags.includes(tag) ? styles.selectedTagText : styles.tagText}>
                            {tag}
                        </ThemedText>
                    </Pressable>
                ))}
                {!showAllTags && tagsToShow.length < allTags.length && (
                    <Pressable
                        style={styles.showMoreButton}
                        onPress={() => setShowAllTags(true)}
                    >
                        <ThemedText style={styles.showMoreText}>Mehr...</ThemedText>
                    </Pressable>
                )}
                {showAllTags && (
                    <Pressable
                        style={styles.showMoreButton}
                        onPress={() => setShowAllTags(false)}>
                        <ThemedText style={styles.showMoreText}>Weniger...</ThemedText>
                    </Pressable>
                )}
            </View>
        );
    }

    const handleMapRegionChange = (region: { latitude: any; longitude: any; }) => {
        setSearchParams(prevParams => ({
            ...prevParams,
                latitude: region.latitude,
                longitude: region.longitude
        }));
    }

    const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
        if (startDate && endDate) {
            setSearchParams(prevParams => ({
                ...prevParams,
                date_range: {
                    start: startDate,
                    end: endDate
                }
            }));
        }
    }

    return (
        <SafeAreaView style={styles.searchBar}>
            <View style={styles.searchContainer}>
                <Pressable style={[styles.searchButton, {backgroundColor: colors.backgroundSecondary}]} onPress={() => setModalVisible(true)}>
                    <Ionicons name="search-outline" size={24} color={colorScheme === 'light' ? 'black' : 'white'} />
                    <ThemedText>Suchen und Filtern</ThemedText>
                </Pressable>
                <ProfileButton />
            </View>
            <FilterBar />
            <Modal
                animationType="slide"
                visible={modalVisible}
                presentationStyle="pageSheet"
                onRequestClose={() => setModalVisible(false)}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <Pressable onPress={() => setModalVisible(false)}>
                            <Ionicons name="close-outline" size={24} color={colorScheme === 'light' ? 'black' : 'white'} />
                        </Pressable>
                        <ThemedText style={styles.modalTitle}>Filter</ThemedText>
                        <View style={{width: 24}} />
                    </View>
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{flex: 1}}
                    >
                        <ScrollView>
                            <View style={styles.filterOption}>
                                <ThemedText>Tags</ThemedText>
                                {renderTags()}
                            </View>
                            <View style={styles.filterOption}>
                                <ThemedText>Standort</ThemedText>
                                <View style={styles.mapContainer}>
                                    <MapView
                                        ref={mapRef}
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: searchParams.latitude,
                                            longitude: searchParams.longitude,
                                            latitudeDelta: searchParams.radius * 2 / 111.32,
                                            longitudeDelta: searchParams.radius * 2 / (111.32 * Math.cos(searchParams.latitude * (Math.PI / 180))),
                                        }}
                                        onRegionChangeComplete={handleMapRegionChange}>
                                        <Marker
                                            coordinate={{
                                                latitude: searchParams.latitude,
                                                longitude: searchParams.longitude,
                                            }}
                                        />
                                        <Circle
                                            center={{
                                                latitude: searchParams.latitude,
                                                longitude: searchParams.longitude,
                                            }}
                                            radius={searchParams.radius * 1000}
                                            fillColor="rgba(0, 0, 255, 0.1)"
                                            strokeColor="rgba(0, 0, 255, 0.5)"
                                        />
                                    </MapView>
                                </View>
                            </View>
                            <View style={styles.filterOption}>
                                <ThemedText>Radius: {searchParams.radius} km</ThemedText>
                                <Slider
                                    style={{width: '100%', height: 40}}
                                    minimumValue={2}
                                    maximumValue={250}
                                    step={1}
                                    value={searchParams.radius}
                                    onSlidingComplete={(value) => handleParamChange('radius', value, true)}
                                    onValueChange={(value) => handleParamChange('radius', value, false)}
                                    minimumTrackTintColor={colors.accent}
                                    maximumTrackTintColor="#000000"
                                />
                            </View>

                            <CalendarPicker onDateChange={handleDateChange} />

                        </ScrollView>
                        <SubmitButton title="Filter anwenden" onPress={handleSearch} />
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchBar:{
        paddingBottom: '4%',
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
    },
    input: {
        borderColor: 'white',
        color: 'white',
        width: '80%',
        borderRadius: 15,
    },
    searchButton:{
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        gap: 10,
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 15,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalContent: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 20,
        paddingBottom: '10%'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterOption: {
        marginBottom: 20,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    tag: {
        backgroundColor: '#e0e0e0',
        borderRadius: 25,
        padding: 10,
        paddingLeft: 17,
        paddingRight: 17,
        margin: 5,
    },
    tagText: {
        color: '#333',
    },
    selectedTagText: {
        color: 'white',
    },
    showMoreButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 10,
        margin: 5,
    },
    showMoreText: {
        color: '#222',
    },
    mapContainer: {
        height: 200,
        marginTop: 10,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 25,
    }
});