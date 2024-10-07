import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity, ViewStyle, Share, Animated, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { EventCard } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ThemedText } from './ThemedText';
import MapView, { Marker } from 'react-native-maps';
import { MusicTag } from './MusicTag';
import { DJWidget } from './DJWidget';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

export function EventItemPage(props: EventCard) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleStateChange = ({ nativeEvent }: { nativeEvent: { oldState: number; translationX: number } }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      if (nativeEvent.translationX > 50) {
        Animated.timing(translateX, {
          toValue: Dimensions.get('window').width,
          duration: 300,
          useNativeDriver: true,
        }).start(() => navigation.goBack());
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={handleGesture}
        onHandlerStateChange={handleStateChange}
        >
        <Animated.View style={[
            styles.container,
            {
                transform: [{ translateX }],
            },
        ]}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="close-outline" size={24} color={colorScheme === 'light' ? 'black' : 'white'} />
            </Pressable>
            <ThemedText style={styles.title} numberOfLines={1} ellipsizeMode="tail">{props.title}</ThemedText>
            <View style={{width: 24}} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: props.image_url }} style={styles.image} />
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{props.title}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={Colors.light.tint} />
                <Text style={styles.rating}>4.9 · Popular Event</Text>
              </View>
              <Text style={styles.subtitle}>{props.location}</Text>

              <View style={styles.separator} />
              <Text style={styles.sectionTitle}>Musik Genres</Text>
              <MusicTag />

              <View style={styles.separator} />
              <Text style={styles.sectionTitle}>DJs</Text>
              <DJWidget />

              <View style={styles.separator} />
              <View style={styles.eventDetails}>
                <View style={styles.eventInfo}>
                  <Ionicons name="calendar-outline" size={24} color="black" />
                  <View style={styles.eventInfoText}>
                    <Text style={styles.eventInfoTitle}>Datum</Text>
                    <Text style={styles.eventInfoSubtitle}>{new Date(props.unix_time).toLocaleDateString()}</Text>
                  </View>
                </View>
                <View style={styles.eventInfo}>
                  <Ionicons name="time-outline" size={24} color="black" />
                  <View style={styles.eventInfoText}>
                    <Text style={styles.eventInfoTitle}>Uhrzeit</Text>
                    <Text style={styles.eventInfoSubtitle}>{new Date(props.unix_time).toLocaleTimeString()}</Text>
                  </View>
                </View>
                <View style={styles.eventInfo}>
                  <Ionicons name="location-outline" size={24} color="black" />
                  <View style={styles.eventInfoText}>
                    <Text style={styles.eventInfoTitle}>Standort</Text>
                    <Text style={styles.eventInfoSubtitle}>{props.location}</Text>
                  </View>
                </View>

                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: props.latitude,
                        longitude: props.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    >
                    <Marker
                      coordinate={{
                          latitude: props.latitude,
                          longitude: props.longitude,
                        }}
                        />
                  </MapView>
                </View>
              </View>
              <View style={styles.separator} />
              <Text style={styles.sectionTitle}>Ticket Preise</Text>
              <View style={styles.ticketPriceContainer}>
                <Text style={styles.ticketType}>Eintritt</Text>
                <Text style={styles.ticketPrice}>12.99€</Text>
              </View>
              <View style={styles.ticketPriceContainer}>
                <Text style={styles.ticketType}>VIP Eintritt</Text>
                <Text style={styles.ticketPrice}>29.99€</Text>
              </View>
              <View style={styles.ticketPriceContainer}>
                <Text style={styles.ticketType}>Gruppe (5+ personen)</Text>
                <Text style={styles.ticketPrice}>9.99€ pro person</Text>
              </View>
              <View style={styles.separator} />
              <Text style={styles.description}>
                {props.description || "No description available."}
              </Text>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.actionButton} onPress={()=>console.log("calendar")}>
              <Ionicons name="calendar" size={24} color={Colors.light.tint} />
              <Text style={styles.actionButtonText}>Zum Kalender</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={()=>console.log("bookmark")}>
              <Ionicons name="bookmark" size={24} color={Colors.light.tint} />
              <Text style={styles.actionButtonText}>Event speichern</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buyButton, {backgroundColor: colors.accent}]} onPress={()=>console}>
              <Text style={styles.buyButtonText}>Ticket kaufen</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
      textAlign: 'center',
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    contentContainer: {
      padding: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    rating: {
      marginLeft: 8,
      color: Colors.light.tint,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginTop: 8,
    },
    separator: {
      height: 1,
      backgroundColor: '#ccc',
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    eventDetails: {
      marginTop: 16,
    },
    eventInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    eventInfoText: {
      marginLeft: 16,
    },
    eventInfoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    eventInfoSubtitle: {
      fontSize: 14,
      color: '#666',
    },
    mapContainer: {
      height: 200,
      marginTop: 16,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    ticketPriceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    ticketType: {
      fontSize: 16,
    },
    ticketPrice: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#111',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButtonText: {
      marginLeft: 8,
      color: Colors.light.tint,
    },
    buyButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    buyButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });