import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity, ViewStyle, Share, Animated, Pressable, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { EventCard } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView, FlatList } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ThemedText } from './ThemedText';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import BottomSheet from 'reanimated-bottom-sheet';


const screenWidth = Dimensions.get('window').width;

export function EventItem(props: EventCard & { style?: ViewStyle, onSave?: () => void })
{
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;

  const [isSaved, setIsSaved] = useState(props.is_saved);
  const [isSavedAmount, setIsSavedAmount] = useState(props.amount_saved);
  const [showInterestedFriends, setShowInterestedFriends] = useState(false);

  const mapRef = useRef<MapView>(null);

  const router = useRouter();

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

  const handleEventPress = () =>
  {
    router.push({ pathname: '/event', params: { eventID: props.id } });
  }

  const renderInterestedFriend = ({ item }: { item: string }) => (
    <View style={styles.interestedFriendItem}>
      <View style={styles.interestedFriendAvatar}>
        <ThemedText style={styles.interestedFriendInitial}>{item[0]}</ThemedText>
      </View>
      <ThemedText style={styles.interestedFriendName}>{item}</ThemedText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundAlt, borderRadius: 25 }, props.style]}>
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
        <TouchableHighlight onPress={handleEventPress}>
          <>
            <View style={styles.imageContainer}>
              <Image source={{ uri: props.image_url }} style={styles.image} />
              <View style={styles.overlayContainer}>
                <View style={styles.overlayItem}>
                  <Text style={styles.price}>Ab 12.99€</Text>
                </View>
                <View style={styles.overlayItem}>
                  <Text style={styles.price}>
                    {new Date(Math.floor(props.unix_time / 1000)).toLocaleDateString('de-DE', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
              </View>
              <TouchableHighlight style={styles.heartButton} onPress={() =>
              {
                setIsSavedAmount(isSaved ? isSavedAmount - 1 : isSavedAmount + 1);
                setIsSaved(!isSaved);
                if (props.onSave)
                {
                  props.onSave();
                }
              }}>
                <>
                  <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={24} color={isSaved ? 'red' : 'white'} />
                  {isSavedAmount > 0 && <Text style={styles.savedAmount}>{isSavedAmount}</Text>}
                </>
              </TouchableHighlight>
              <TouchableHighlight style={styles.shareButton} onPress={onShare}>
                <Ionicons name="share-outline" size={24} color="white" />
              </TouchableHighlight>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.titleRow}>
                <ThemedText style={styles.title} numberOfLines={2}>{props.title}</ThemedText>
                <View style={styles.ratingContainer}>
                  <Ionicons name="flame" size={16} color={colors.textPrimary} />
                  <ThemedText style={styles.rating}>Sponsored</ThemedText>
                </View>
              </View>
              <View style={styles.interestedFriendsContainer}>
                {props.interestedFriends && props.interestedFriends.length > 0 ? (
                  <TouchableOpacity onPress={() => setShowInterestedFriends(true)}>
                    <View style={styles.interestedFriendsAvatars}>
                      {props.interestedFriends.slice(0, 3).map((friend, index) => (
                        <View key={index} style={[styles.interestedFriendAvatar, { marginLeft: index * -8 }]}>
                          <Text style={styles.interestedFriendInitial}>{friend[0]}</Text>
                        </View>
                      ))}
                    </View>
                    <ThemedText style={styles.interestedFriendsText}>
                      {props.interestedFriends.length} {props.interestedFriends.length === 1 ? 'Freund interessiert' : 'Freunde interessiert'}
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <ThemedText style={styles.placeholderText}>Sei der Erste, der Interesse zeigt!</ThemedText>
                  </View>
                )}
              </View>
            </View>
          </>
        </TouchableHighlight>
      </Animated.View>
      <Modal
        visible={showInterestedFriends}
        transparent={true}
        animationType="slide"
        onDismiss={() => setShowInterestedFriends(false)}
        onRequestClose={() => setShowInterestedFriends(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundAlt }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Interessierte Freunde</ThemedText>
              <TouchableOpacity onPress={() => setShowInterestedFriends(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={props.interestedFriends}
              renderItem={renderInterestedFriend}
              keyExtractor={(item) => item}
              style={styles.interestedFriendsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth * 0.85,
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
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  overlayContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlayItem: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
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
    alignItems: 'center',
  },
  savedAmount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
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
  interestedFriendsContainer: {
    marginTop: 12,
    height: 50,
    justifyContent: 'center',
  },
  interestedFriendsAvatars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  interestedFriendAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  interestedFriendInitial: {
    color: 'white',
    fontWeight: 'bold',
  },
  interestedFriendsText: {
    fontSize: 14,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
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
  interestedFriendsList: {
    maxHeight: '100%',
    marginBottom: '10%',
  },
  interestedFriendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  interestedFriendName: {
    marginLeft: 12,
    fontSize: 16,
  },
});