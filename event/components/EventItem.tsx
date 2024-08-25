import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity, ViewStyle, Share, Animated, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { EventCard } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ThemedText } from './ThemedText';
import MapView, { Marker } from 'react-native-maps';

export function EventItem(props: EventCard & { style?: ViewStyle, onSave?: () => void })
{
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [modalVisible, setModalVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;

  const [isSaved, setIsSaved] = useState(props.is_saved);
  const [isSavedAmount, setIsSavedAmount] = useState(props.amount_saved);

  const mapRef = useRef<MapView>(null);

  const toggleModal = () =>
  {
    if (modalVisible)
    {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    } else
    {
      setModalVisible(true);
    }
  };

  useEffect(() =>
  {
    if (modalVisible)
    {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const onShare = async () =>
  {
    try
    {
      await Share.share({
        message: `Check out this event: ${props.title}`,
      });
    } catch (error)
    {
      console.error(error);
    }
  };

  const addToCalendar = () =>
  {
    // Implement calendar functionality here
    console.log('Add to calendar');
  };

  const saveEvent = () =>
  {
    // Implement save event functionality here
    console.log('Save event');
  };

  const buyTickets = () =>
  {
    // Implement buy tickets functionality here
    console.log('Buy tickets');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundAlt, borderRadius: 25, marginBottom: 20 }, props.style]}>
      <Animated.View style={[
        styles.card,
        {
          transform: [
            { scale: scaleValue },
            { translateY: translateYValue }
          ],
          opacity: opacityValue,
        },
      ]}>
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: props.image_url }} style={styles.image} />
            <View style={styles.overlay_left}>
              <Text style={styles.price}>Ab 12.99€</Text>
            </View>
            <View style={styles.overlay_right}>
              <Text style={styles.price}>
                {new Date(Math.floor(props.unix_time / 1000)).toLocaleDateString('de-DE', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>

            </View>
            <TouchableOpacity style={styles.heartButton} onPress={() =>
            {
              setIsSavedAmount(isSaved ? isSavedAmount - 1 : isSavedAmount + 1);
              setIsSaved(!isSaved);
              if (props.onSave)
              {
                props.onSave();
              }
            }}>
              <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={24} color={isSaved ? 'red' : 'white'} />
              {isSavedAmount == 0 ? '' : <Text style={[styles.price, { textAlign: 'center' }]}>{isSavedAmount}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={onShare}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title} numberOfLines={2}>{props.title}</ThemedText>
              <Pressable style={[{ backgroundColor: colors.buttonPrimary }, styles.buyButton]}><ThemedText>Ticket Kaufen</ThemedText></Pressable>
              {/*<View style={styles.ratingContainer}>
                <Ionicons name="flame" size={16} color={colors.textPrimary} />
                <ThemedText style={styles.rating}>4.9</ThemedText>
              </View>*/}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onDismiss={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalHeader}>
          <Pressable onPress={() => setModalVisible(false)}>
            <Ionicons name="arrow-back" size={24} color={colorScheme === 'light' ? 'black' : 'white'} />
          </Pressable>
          <ThemedText style={styles.modalTitle} numberOfLines={1} ellipsizeMode="tail">{props.title}</ThemedText>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={{ uri: props.image_url }} style={styles.modalImage} />
          <View style={styles.modalContentContainer}>
            <Text style={styles.modalTitle}>{props.title}</Text>
            <View style={styles.modalRatingContainer}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <Text style={styles.modalRating}>4.9 · Popular Event</Text>
            </View>
            <Text style={styles.modalSubtitle}>{props.location}</Text>

            {/*
                <View style={styles.separator} />
                <Text style={styles.modalSectionTitle}>Musik Genres</Text>
                <MusicTag />

                <View style={styles.separator} />
                <Text style={styles.modalSectionTitle}>DJs</Text>
                <DJWidget />

                */}

            <View style={styles.separator} />
            <View style={styles.modalEventDetails}>
              <View style={styles.modalEventInfo}>
                <Ionicons name="calendar-outline" size={24} color="black" />
                <View style={styles.modalEventInfoText}>
                  <Text style={styles.modalEventInfoTitle}>Datum</Text>
                  <Text style={styles.modalEventInfoSubtitle}>{new Date(props.unix_time * 1000).toISOString().split('T')[0]}</Text>
                </View>
              </View>
              <View style={styles.modalEventInfo}>
                <Ionicons name="time-outline" size={24} color="black" />
                <View style={styles.modalEventInfoText}>
                  <Text style={styles.modalEventInfoTitle}>Uhrzeit</Text>
                  <Text style={styles.modalEventInfoSubtitle}>{new Date(props.unix_time * 1000).toISOString().split('T')[1].split('.')[0]}</Text>
                </View>
              </View>
              <View style={styles.modalEventInfo}>
                <Ionicons name="location-outline" size={24} color="black" />
                <View style={styles.modalEventInfoText}>
                  <Text style={styles.modalEventInfoTitle}>Standort</Text>
                  <Text style={styles.modalEventInfoSubtitle}>{props.location}</Text>
                </View>
              </View>

              <View style={styles.mapContainer}>
                <MapView
                  ref={mapRef}
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
            <Text style={styles.modalSectionTitle}>Ticket Preise</Text>
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
            <Text style={styles.modalDescription}>
              {props.description || "Keine Beschreibung verfügbar..."}
            </Text>
          </View>
        </ScrollView>
        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.actionButton} onPress={addToCalendar}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Zum Kalender</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={saveEvent}>
            <Ionicons name="heart-outline" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Event speichern</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.primary }]} onPress={buyTickets}>
            <Text style={styles.buyButtonText}>Ticket kaufen</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'column',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay_left: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  overlay_right: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  price: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 24,
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 64,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 24,
  },
  contentContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#717171',
    marginBottom: 6,
    fontSize: 16,
  },
  date: {
    color: '#717171',
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  eventDetails: {
    marginTop: 12,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#717171',
    marginBottom: 6,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginTop: 60,
  },
  closeButton: {
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalContentContainer: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalRating: {
    marginLeft: 4,
    fontSize: 16,
    color: Colors.light.primary,
  },
  modalSubtitle: {
    fontSize: 18,
    color: '#717171',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 24,
  },
  modalEventDetails: {
    marginBottom: 24,
  },
  modalEventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalEventInfoText: {
    marginLeft: 16,
  },
  modalEventInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalEventInfoSubtitle: {
    fontSize: 14,
    color: '#717171',
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ticketPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ticketType: {
    fontSize: 16,
    color: '#404040',
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#404040',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.light.primary,
  },
  buyButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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