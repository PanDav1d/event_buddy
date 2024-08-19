import React, { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { EventCard } from '@/constants/Types';
import { Text, View, StyleSheet, Pressable, useColorScheme, ImageBackground, Modal, TextInput, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { FlatList, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { ListButton } from '@/components/ListButton';
import SubmitButton from '@/components/SubmitButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { API_URL } from '@/config';
import { Stack } from 'expo-router';

const { width, height } = Dimensions.get('window');

const data = [
    {
        id: 0,
        title: "Event erstellen",
        icon: 'create-outline',
        onPress: () => console.log('Create event'),
    },
    {
        id: 2,
        title: 'Einstellungen',
        icon: 'settings-outline',
        onPress: () => console.log('Settings'),
    },
    {
        id: 3,
        title: 'Logout',
        icon: 'log-out-outline',
        onPress: () => console.log('Logout'),
    },
]

const savedCards: EventCard[] = [
]

const savedCardItem = (data: any) => (
    <View style={styles.savedCardItem}>
        <ImageBackground source={{uri: data.image}} style={styles.savedCardItemImage}>
            <View style={styles.cardOverlay}>
                <ThemedText style={styles.savedCardItemText}>{data.title}</ThemedText>
                <ThemedText style={styles.savedCardItemDate}>{data.date}</ThemedText>
            </View>
        </ImageBackground>
    </View>
);

const availableTags = ['Musik', 'Sport', 'Kultur', 'Essen', 'Bildung'];

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const iconColor = Colors[colorScheme ?? 'light'].tint;
    const [modalVisible, setModalVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [eventLocation, setEventLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [mapRegion, setMapRegion] = useState({
        latitude: 52.520008,
        longitude: 13.404954,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const handleCreateEvent = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: eventTitle,
                    unix_time: Math.floor(eventDate.getTime() / 1000),
                    location: eventLocation,
                    description: eventDescription,
                    latitude: mapRegion.latitude,
                    longitude: mapRegion.longitude,
                    organizer: "Current User",  // Add this line
                    image_url: "https://picsum.photos/200/300",   // Add this line
                }),
            });
            const data = await response.json();
            console.log('Event created:', data);
            setModalVisible(false);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || eventDate;
        setShowDatePicker(false);
        setEventDate(currentDate);
    };

    const toggleTag = (tag: string) => {
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
                                    value={eventTitle}
                                    onChangeText={setEventTitle}
                                    placeholder="Event Titel"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <ThemedText style={styles.inputLabel}>Datum</ThemedText>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                    <Text>{eventDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={eventDate}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                )}
                            </View>
                            <View style={styles.inputContainer}>
                                <ThemedText style={styles.inputLabel}>Ort</ThemedText>
                                <TextInput
                                    style={styles.input}
                                    value={eventLocation}
                                    onChangeText={setEventLocation}
                                    placeholder="Event Ort"
                                />
                            </View>
                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    region={mapRegion}
                                    onRegionChangeComplete={setMapRegion}
                                >
                                    <Marker coordinate={mapRegion} />
                                </MapView>
                            </View>
                            <View style={styles.inputContainer}>
                                <ThemedText style={styles.inputLabel}>Beschreibung</ThemedText>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={eventDescription}
                                    onChangeText={setEventDescription}
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
});