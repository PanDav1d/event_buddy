import React, { useState, useEffect, useRef } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { EventCardPreview, CreateEventParams } from '@/constants/Types';
import { View, StyleSheet, useColorScheme, Modal, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Image, Animated, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import SubmitButton from '@/components/SubmitButton';
import { CameraView, CameraType, Camera } from 'expo-camera';
import Toast, { BaseToast } from 'react-native-toast-message';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const { signOut } = useSession();
    const [savedCards, setSavedCards] = useState<EventCardPreview[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fadeAnim = useState(new Animated.Value(1))[0];
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode | null }>({ title: '', content: null });

    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: colors.success,
                    backgroundColor: colors.backgroundAlt,
                }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '500',
                    color: colors.textPrimary
                }}
                text2Style={{
                    fontSize: 13,
                    color: colors.textSecondary
                }}
            />
        ),
        error: (props: any) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: colors.error,
                    backgroundColor: colors.backgroundAlt,
                }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '500',
                    color: colors.textPrimary
                }}
                text2Style={{
                    fontSize: 13,
                    color: colors.textSecondary
                }}
            />
        )
    };


    const profileImages = [
        require('@/assets/images/buddy/buddy_fine.svg'),
        require('@/assets/images/buddy/buddy_fine.svg'),
        require('@/assets/images/buddy/buddy_fine.svg')
    ];

    const openModal = (title: string, content: React.ReactNode) =>
    {
        setModalContent({ title, content });
        setModalVisible(true);
    };

    const closeModal = () =>
    {
        setModalVisible(false);
    };

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() =>
            {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % profileImages.length);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const gridItems = [
        {
            id: 1,
            title: "Gespeicherte",
            icon: 'bookmark-outline',
            onPress: () => router.push('/saved'),
            gradient: ['#FF9A8B', '#FF6A88'],
        },
        {
            id: 2,
            title: 'Tickets',
            icon: 'ticket-outline',
            onPress: () => router.push('/tickets'),
            gradient: ['#4FACFE', '#00F2FE'],
        },
        {
            id: 4,
            title: 'Freunde',
            icon: 'people-outline',
            onPress: () => router.push("/friends"),
            gradient: ['#FA709A', '#FEE140'],
        },
    ];

    const listItems = [
        {
            id: 0,
            title: 'Event erstellen',
            icon: 'create-outline',
            onPress: () => openModal('Event erstellen', <EventCreationForm closeModal={closeModal} />),
        },
        {
            id: 1,
            title: 'Einstellungen',
            icon: 'settings-outline',
            onPress: () => openModal('Einstellungen', <SettingsContent />),
        },
        {
            id: 2,
            title: 'Hilfe & Support',
            icon: 'help-circle-outline',
            onPress: () => openModal('Hilfe & Support', <HelpSupportContent />),
        },
        {
            id: 3,
            title: 'Datenschutz',
            icon: 'shield-outline',
            onPress: () => openModal('Datenschutz', <PrivacyContent />),
        },
        {
            id: 4,
            title: 'Über uns',
            icon: 'information-circle-outline',
            onPress: () => openModal('Über uns', <AboutUsContent />),
        },
        {
            id: 5,
            title: 'Tickets scannen',
            icon: 'barcode-outline',
            onPress: () => openModal('Tickets scannen', <ScanTicketsContent />),
        },
        {
            id: 6,
            title: 'Abmelden',
            icon: 'log-out-outline',
            onPress: () => signOut(),
        }
    ];

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

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.profileImageContainer}>
                        <Animated.Image
                            source={profileImages[currentImageIndex]}
                            style={[
                                styles.profileImage,
                                {
                                    opacity: fadeAnim,
                                },
                            ]}
                        />
                    </View>
                    <View style={styles.gridContainer}>
                        {gridItems.map((item) => (
                            <TouchableOpacity key={item.id} style={[styles.gridItem, { backgroundColor: colors.backgroundAlt }]} onPress={item.onPress}>
                                <Ionicons name={item.icon as any} size={32} color={colors.primary} />
                                <ThemedText style={styles.gridItemText}>{item.title}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.listContainer}>
                        {listItems.map((item) => (
                            <TouchableOpacity key={item.id} style={[styles.listItem, { backgroundColor: colors.backgroundAlt }]} onPress={item.onPress}>
                                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                                <ThemedText style={styles.listItemText}>{item.title}</ThemedText>
                                <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={closeModal}
                presentationStyle="formSheet"
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={styles.modalTitle}>{modalContent.title}</ThemedText>
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        {modalContent.content}
                    </View>
                    <Toast config={toastConfig} />
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
    profileImageContainer: {
        backgroundColor: "blue",
        height: height / 3,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 20,
    },
    gridItem: {
        width: '48%',
        height: 120,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    gridItemText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 75,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    listItemText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        zIndex: 1
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        height: '100%'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    formContainer: {
        padding: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 7,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    map: {
        width: '100%',
        borderRadius: 25,
        height: 200,
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderValue: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 20,
    },
    tagInputContainer: {
        marginBottom: 10,
    },
    tagInput: {
        height: 40,
        borderWidth: 1,
        borderRadius: 7,
        paddingHorizontal: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        margin: 4,
    },
    tagText: {
        color: 'white',
        marginRight: 5,
    },
    mapContainer: {
        height: 250,
        marginBottom: 20,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderRadius: 7,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    currentLocationButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        padding: 12,
        borderRadius: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});

const EventCreationForm = ({ closeModal }: { closeModal: () => void }) =>
{
    const [eventData, setEventData] = useState<CreateEventParams>({
        id: 0,
        title: '',
        description: '',
        imageUrl: '',
        latitude: 37.78825,
        longitude: -122.4324,
        organizerId: 0,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        eventSize: 0.5,
        noisiness: 0.5,
        musicStyles: [],
        interactivity: 0.5,
        crowdedness: 0.5,
        eventType: '',
        attendeeCount: 0,
        averageRating: 0,
        attendees: [],
        maxTickets: 100,
        soldTickets: 0,
    });
    const [location, setLocation] = useState<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
    const { session } = useSession();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [newMusicStyle, setNewMusicStyle] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef<MapView>(null);


    const moveToCurrentLocation = async () =>
    {
        let currentLocation = await Location.getCurrentPositionAsync({});
        mapRef.current?.animateToRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
        });
    };

    const searchLocation = async () =>
    {
        try
        {
            const results = await Location.geocodeAsync(searchQuery);
            if (results.length > 0)
            {
                const { latitude, longitude } = results[0];
                mapRef.current?.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                setLocation({ latitude, longitude });
            }
        } catch (error)
        {
            console.error('Error searching location:', error);
        }
    };

    useEffect(() =>
    {
        (async () =>
        {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted')
            {
                console.error('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
        })();
    }, []);

    const handleStartDateChange = (event: any, selectedDate?: Date) =>
    {
        if (selectedDate)
        {
            const newStartDate = selectedDate.toISOString();
            // If end date is before new start date, set end date to start date + 1 hour
            if (new Date(eventData.endDate) <= selectedDate)
            {
                const newEndDate = new Date(selectedDate);
                newEndDate.setHours(newEndDate.getHours() + 1);
                setEventData({
                    ...eventData,
                    startDate: newStartDate,
                    endDate: newEndDate.toISOString()
                });
            } else
            {
                setEventData({ ...eventData, startDate: newStartDate });
            }
        }
    };

    const handleEndDateChange = (event: any, selectedDate?: Date) =>
    {
        if (selectedDate)
        {
            if (selectedDate > new Date(eventData.startDate))
            {
                setEventData({ ...eventData, endDate: selectedDate.toISOString() });
            }
        }
    };

    const handleMapPress = (e: any) =>
    {
        setLocation({
            ...location,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
        });
    };

    const handleSubmit = async () =>
    {
        try
        {
            const newEvent = {
                ...eventData,
                organizerId: session?.userID!
            };
            await NetworkClient.addEvent(newEvent);
            closeModal();
        } catch (error)
        {
            console.error('Error creating event:', error);
        }
    };
    return (
        <ScrollView>
            <View style={styles.formContainer}>
                <ThemedText>Title:</ThemedText>
                <TextInput
                    style={[styles.input, { color: 'white' }]}
                    placeholder="Titel"
                    value={eventData.title}
                    onChangeText={(text) => setEventData({ ...eventData, title: text })}
                />

                <ThemedText>Description:</ThemedText>
                <TextInput
                    style={[styles.input, { color: 'white' }]}
                    placeholder="Beschreibung"
                    value={eventData.description}
                    onChangeText={(text) => setEventData({ ...eventData, description: text })}
                    multiline
                />

                <ThemedText>Image URL:</ThemedText>
                <TextInput
                    style={[styles.input, { color: 'white' }]}
                    placeholder="Bild URL"
                    value={eventData.imageUrl}
                    onChangeText={(text) => setEventData({ ...eventData, imageUrl: text })}
                />

                <ThemedText>Maximum Tickets:</ThemedText>
                <TextInput
                    style={[styles.input, { color: 'white' }]}
                    placeholder="Maximale Tickets"
                    value={eventData.maxTickets.toString()}
                    keyboardType="number-pad"
                    onChangeText={(text) => setEventData({ ...eventData, maxTickets: Number(text) })}
                />

                <ThemedText>Event Type:</ThemedText>
                <TextInput
                    style={[styles.input, { color: 'white' }]}
                    placeholder="Event Type"
                    value={eventData.eventType}
                    onChangeText={(text) => setEventData({ ...eventData, eventType: text })}
                />

                <ThemedText>Event Size:</ThemedText>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={eventData.eventSize}
                    onValueChange={(value: number) => setEventData({ ...eventData, eventSize: Math.round(value * 10) / 10 })}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.backgroundAlt}
                    thumbTintColor={colors.primary}
                />
                <ThemedText style={styles.sliderValue}>{eventData.eventSize * 100 + " %"}</ThemedText>

                <ThemedText>Noisiness:</ThemedText>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={eventData.noisiness}
                    onValueChange={(value: number) => setEventData({ ...eventData, noisiness: Math.round(value * 10) / 10 })}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.backgroundAlt}
                    thumbTintColor={colors.primary}
                />
                <ThemedText style={styles.sliderValue}>{eventData.noisiness * 100 + " %"}</ThemedText>

                <ThemedText>Interactivity:</ThemedText>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={eventData.interactivity}
                    onValueChange={(value: number) => setEventData({ ...eventData, interactivity: Math.round(value * 10) / 10 })}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.backgroundAlt}
                    thumbTintColor={colors.primary}
                />
                <ThemedText style={styles.sliderValue}>{eventData.interactivity * 100 + " %"}</ThemedText>

                <ThemedText>Crowdedness:</ThemedText>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={eventData.crowdedness}
                    onValueChange={(value: number) => setEventData({ ...eventData, crowdedness: Math.round(value * 10) / 10 })}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.backgroundAlt}
                    thumbTintColor={colors.primary}
                />
                <ThemedText style={styles.sliderValue}>{eventData.crowdedness * 100 + " %"}</ThemedText>


                <ThemedText>Music Styles:</ThemedText>
                <View style={styles.tagInputContainer}>
                    <TextInput
                        style={[styles.tagInput, { color: 'white' }]}
                        placeholder="Add music style"
                        value={newMusicStyle}
                        onChangeText={setNewMusicStyle}
                        onSubmitEditing={() =>
                        {
                            if (newMusicStyle.trim())
                            {
                                setEventData({
                                    ...eventData,
                                    musicStyles: [...eventData.musicStyles, newMusicStyle.trim()]
                                });
                                setNewMusicStyle('');
                            }
                        }}
                    />
                </View>
                <View style={styles.tagsContainer}>
                    {eventData.musicStyles.map((style, index) => (
                        <View key={index} style={[styles.tag, { backgroundColor: colors.primary }]}>
                            <ThemedText style={styles.tagText}>{style}</ThemedText>
                            <TouchableOpacity
                                onPress={() =>
                                {
                                    setEventData({
                                        ...eventData,
                                        musicStyles: eventData.musicStyles.filter((_, i) => i !== index)
                                    });
                                }}
                            >
                                <Ionicons name="close-circle" size={20} color={colors.textInverse} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.mapContainer}>
                    <TextInput
                        style={[styles.searchInput, { color: 'white' }]}
                        placeholder="Search location"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={searchLocation}
                    />
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        region={location ? {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        } : { latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0 }}
                        onPress={handleMapPress}
                    >
                        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
                    </MapView>
                    <TouchableOpacity
                        style={[styles.currentLocationButton, { backgroundColor: colors.primary }]}
                        onPress={moveToCurrentLocation}
                    >
                        <Ionicons name="locate" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <ThemedText>Start Datum:</ThemedText>
                <DateTimePicker
                    value={new Date(eventData.startDate)}
                    mode="datetime"
                    display="default"
                    onChange={handleStartDateChange}
                />

                <ThemedText>End Datum:</ThemedText>
                <DateTimePicker
                    value={new Date(eventData.endDate)}
                    mode="datetime"
                    display="default"
                    onChange={handleEndDateChange}
                    minimumDate={new Date(eventData.startDate)}
                />
                <SubmitButton onPress={handleSubmit} title={'Event erstellen'} style={{ marginTop: 20 }} />
            </View>
        </ScrollView>
    );
};
const SettingsContent = () => <ThemedText>Einstellungen-Inhalt hier</ThemedText>;
const HelpSupportContent = () => <ThemedText>Hilfe & Support-Inhalt hier</ThemedText>;
const PrivacyContent = () => <ThemedText>Datenschutz-Inhalt hier</ThemedText>;
const AboutUsContent = () => <ThemedText>Über uns-Inhalt hier</ThemedText>;

const ScanTicketsContent = () =>
{
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() =>
    {
        const getCameraPermissions = async () =>
        {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = async ({ data }: { data: string }) =>
    {
        setScanned(true);
        try
        {
            const response = await NetworkClient.verifyTicket(data);

            if (response.status == 200)
            {
                Toast.show({
                    type: 'success',
                    text1: 'Erfolgreich',
                    text2: 'Ticket wurde aktiviert',
                    position: 'top',
                    topOffset: 100,
                    visibilityTime: 2000
                });
            }
        } catch (error)
        {
            Toast.show({
                type: 'error',
                text1: 'Fehler',
                text2: 'Ticket ist nicht gültig',
                position: 'top',
                topOffset: 100,
                visibilityTime: 2000
            });
        }
        setTimeout(() => setScanned(false), 2000);
    };

    if (hasPermission === null)
    {
        return <ThemedText>Requesting camera permission...</ThemedText>;
    }
    if (hasPermission === false)
    {
        return <ThemedText>No access to camera</ThemedText>;
    }

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            <View style={{
                position: 'absolute',
                top: '25%',
                left: '15%',
                right: '15%',
                bottom: '35%',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 20,
            }} />
        </View>
    );
};
