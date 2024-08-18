import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { EventCardCollection } from '@/components/EventCardCollection';
import { EventCard } from '@/constants/Types';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [selectedEvent, setSelectedEvent] = useState<EventCard | null>(null);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [initialRegion, setInitialRegion] = useState({
    latitude: 51.1657,
    longitude: 10.4515,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  const events: EventCard[] = [
    { 
      id: 1, 
      title: 'Concert', 
      coordinate: { latitude: 52.5200, longitude: 13.4050 }, 
      description: 'An amazing concert event',
      organizer: 'Music Promotions Inc.',
      image_url: 'https://example.com/concert.jpg',
      date: '2023-07-15',
      time: '20:00',
      location: 'Berlin Concert Hall',
      tags: ['Music', 'Festival', 'Outdoor', 'Live Performance']
    },
    { 
      id: 2, 
      title: 'Sports Game', 
      coordinate: { latitude: 48.1351, longitude: 11.5820 }, 
      description: 'Exciting sports game',
      organizer: 'Munich Sports Association',
      image_url: 'https://example.com/sports.jpg',
      date: '2023-07-20',
      time: '15:00',
      location: 'Munich Stadium',
      tags: ['Sports', 'Game', 'Outdoor', 'Live Performance']
    },
    { 
      id: 3, 
      title: 'Art Exhibition', 
      coordinate: { latitude: 50.1109, longitude: 8.6821 }, 
      description: 'Beautiful art exhibition',
      organizer: 'Frankfurt Art Gallery',
      image_url: 'https://example.com/art.jpg',
      date: '2023-07-25',
      time: '10:00',
      location: 'Frankfurt Exhibition Center',
      tags: ['Art', 'Exhibition', 'Indoor', 'Art Exhibition']
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleMarkerPress = (event: EventCard) => {
    setSelectedEvent(event);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedEvent(null));
  };

  useEffect(() => {
    if (selectedEvent === null) {
      modalAnimation.setValue(0);
    }
  }, [selectedEvent]);

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={event.coordinate}
            onPress={() => handleMarkerPress(event)}
          >
            <View style={styles.markerContainer}>
              <LinearGradient
                colors={['#FF5A5F', '#FF414D']}
                style={styles.markerBubble}
              >
                <Text style={styles.markerText}>{event.title}</Text>
              </LinearGradient>
              <View style={styles.markerArrow} />
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{event.title}</Text>
                <Text style={styles.calloutInfo}>{event.date} at {event.time}</Text>
                <Text style={styles.calloutInfo}>{event.location}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {selectedEvent && (
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateY: modalTranslateY }] }
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.eventCardWrapper}>
            <EventCardCollection
              id={selectedEvent.id}
              title={selectedEvent.title}
              organizer={selectedEvent.organizer}
              description={selectedEvent.description}
              image_url={selectedEvent.image_url}
              date={selectedEvent.date}
              time={selectedEvent.time}
              location={selectedEvent.location}
              coordinate={selectedEvent.coordinate}
              tags={selectedEvent.tags}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: 20,
    padding: 10,
  },
  markerText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  markerArrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#FF414D',
    borderWidth: 8,
    alignSelf: 'center',
    marginTop: -8,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutInfo: {
    fontSize: 12,
    color: '#666',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    height: height * 0.7,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  eventCardWrapper: {
    width: '100%',
    height: '100%',
    paddingTop: 40,
  },
});

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];