import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { CreateEventParams, EventCard } from '@/constants/Types';
import { Text, View, StyleSheet, useColorScheme, ImageBackground, Modal, TextInput, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { FlatList, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { ListButton } from '@/components/ListButton';
import SubmitButton from '@/components/SubmitButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import NetworkClient from '@/api/NetworkClient';

const { width, height } = Dimensions.get('window');

const data = [
    {
        id: 0,
        title: "Event erstellen",
        icon: 'create-outline',
        onPress: () => console.log('Erstellen'),
    },
    {
        id: 2,
        title: 'Einstellungen',
        icon: 'settings-outline',
        onPress: () => console.log('Einstellung'),
    },
    {
        id: 3,
        title: 'Abmelden',
        icon: 'log-out-outline',
        onPress: () => console.log('Abmelden'),
    },
]

const savedCardItem = (data: any) => (
    <View style={styles.savedCardItem}>
        <ImageBackground source={{ uri: data.image }} style={styles.savedCardItemImage}>
            <View style={styles.cardOverlay}>
                <ThemedText style={styles.savedCardItemText}>{data.title}</ThemedText>
                <ThemedText style={styles.savedCardItemDate}>{data.date}</ThemedText>
            </View>
        </ImageBackground>
    </View>
);

const availableTags = ['Musik', 'Sport', 'Kultur', 'Essen', 'Bildung'];

export default function ProfileScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const iconColor = Colors[colorScheme ?? 'light'].tint;
    const [modalVisible, setModalVisible] = useState(false);
    const [createEventParams, setCreateEventParams] = useState<CreateEventParams>(
        {
            title: '',
            description: '',
            unix_time: new Date().getTime(),
            image_url: 'https://picsum.photos/id/1018/200/300',
            location: '',
            latitude: 0,
            longitude: 0,
            organizer: 1,
        }
    );
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [mapRegion, setMapRegion] = useState({
        latitude: 52.520008,
        longitude: 13.404954,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [savedCards, setSavedCards] = useState<EventCard[]>([]);

    useEffect(() =>
    {
        fetchSavedEvents();
    }, []);

    const fetchSavedEvents = async () =>
    {
        try
        {
            const userId = 1; // Replace with actual user ID
            const fetchedEvents = await NetworkClient.getSavedEvents(userId);
            setSavedCards(fetchedEvents);
        } catch (error)
        {
            console.error('Error fetching saved events:', error);
        }
    };

    const getCurrentLocation = async () =>
    {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted')
        {
            console.log('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    const handleCreateEvent = async () =>
    {
        try
        {
            const calculated_time = Math.floor(createEventParams.unix_time / 1000);
            setCreateEventParams({
                ...createEventParams,
                unix_time: calculated_time,
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
            });
            console.log("Trying to create event with params:", createEventParams);
            await NetworkClient.createEvent(createEventParams)
            setModalVisible(false);
        } catch (error)
        {
            console.error('Error creating event:', error);
        }
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) =>
    {
        const currentDate = selectedDate || new Date(createEventParams.unix_time);
        setCreateEventParams({
            ...createEventParams,
            unix_time: currentDate.getTime(),
        });
    };

    const toggleTag = (tag: string) =>
    {
        setSelectedTags(prevTags =>
            prevTags.includes(tag)
                ? prevTags.filter(t => t !== tag)
                : [...prevTags, tag]
        );
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.header}>
                        <ThemedText style={styles.title}>Profil</ThemedText>
                    </View>
                    <View style={styles.savedEventsSection}>
                        <ThemedText style={styles.sectionTitle}>Gespeichert</ThemedText>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                            {savedCards.map((item) => savedCardItem(item))}
                        </ScrollView>
                    </View>
                    <View style={styles.menuSection}>
                        {data.map((item) => ListButton(item, styles, iconColor, () => setModalVisible(true)))}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={iconColor} />
                            </TouchableOpacity>
                            <ThemedText style={styles.modalTitle}>Neues Event erstellen</ThemedText>
                        </View>
                        <ScrollView>
                            <View style={styles.inputContainer}>
                                <ThemedText style={styles.inputLabel}>Titel</ThemedText>
                                <TextInput
                                    style={styles.input}
                                    value={createEventParams.title}
                                    onChangeText={(text) => setCreateEventParams({ ...createEventParams, title: text })}
                                    placeholder="Event Titel"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <ThemedText style={styles.inputLabel}>Datum</ThemedText>
                                <DateTimePicker
                                    style={{ alignSelf: 'flex-start' }}
                                    value={new Date(createEventParams.unix_time)}
                                    mode="datetime"
                                    display="inline"
                                    accentColor={colors.accent}
                                    onChange={handleDateChange}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <ThemedText style={styles.inputLabel}>Ort</ThemedText>
                                <TextInput
                                    style={styles.input}
                                    value={createEventParams.location}
                                    onChangeText={(text) => setCreateEventParams({ ...createEventParams, location: text })}
                                    placeholder="Event Ort"
                                />
                            </View>
                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    region={mapRegion}
                                    onRegionChangeComplete={setMapRegion}>
                                    <Marker coordinate={mapRegion} />
                                </MapView>
                                <TouchableOpacity
                                    style={styles.currentLocationButton}
                                    onPress={getCurrentLocation}>
                                    <Ionicons name="locate" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputContainer}>
                                <ThemedText style={styles.inputLabel}>Beschreibung</ThemedText>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={createEventParams.description}
                                    onChangeText={(text) => setCreateEventParams({ ...createEventParams, description: text })}
                                    placeholder="Event Beschreibung"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <ThemedText style={styles.inputLabel}>Tags</ThemedText>
                                <View style={styles.tagContainer}>
                                    {availableTags.map(tag => (
                                        <TouchableOpacity
                                            key={tag}
                                            style={[
                                                styles.tag,
                                                selectedTags.includes(tag) && styles.selectedTag
                                            ]}
                                            onPress={() => toggleTag(tag)}
                                        >
                                            <Text style={selectedTags.includes(tag) ? styles.selectedTagText : styles.tagText}>
                                                {tag}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                        <SubmitButton title='Event erstellen' onPress={handleCreateEvent} />
                    </View>
                </View>
            </Modal>
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
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        padding: 20,
    },
    menuSection: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    item: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    itemText: {
        marginLeft: 15,
        fontSize: 18,
        fontWeight: '600',
    },
    savedEventsSection: {
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    savedCardItem: {
        width: width * 0.7,
        height: 200,
        marginRight: 15,
        borderRadius: 20,
        overflow: 'hidden',
    },
    savedCardItemImage: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
        padding: 15,
    },
    savedCardItemText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    savedCardItemDate: {
        fontSize: 16,
        color: 'white',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '95%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        backgroundColor: 'white',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    mapContainer: {
        height: 200,
        marginBottom: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 10,
        margin: 5,
    },
    selectedTag: {
        backgroundColor: '#007AFF',
    },
    tagText: {
        color: '#333',
    },
    selectedTagText: {
        color: 'white',
    },
    currentLocationButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});