import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity, ViewStyle, Share, Animated, Pressable, TouchableNativeFeedback, TouchableHighlight, Touchable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Event, EventCardPreview } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView, FlatList } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ThemedText } from './ThemedText';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import BottomSheet from 'reanimated-bottom-sheet';
import SubmitButton from './SubmitButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export enum EventItemType
{
  small,
  big
}

interface EventItemProps
{
  data: EventCardPreview;
  style?: ViewStyle;
  onSave?: () => void;
  onPress?: () => void;
  type?: EventItemType;
  likeable?: boolean;
}

const screenWidth = Dimensions.get('window').width;

export function EventItem({ data, style, onSave, onPress, type = EventItemType.big, likeable = true }: EventItemProps)
{
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;

  const [isSaved, setIsSaved] = useState(data?.eventSaved || false);
  const [isSavedAmount, setIsSavedAmount] = useState(data?.savedAmount || 0);
  const [showInterestedFriends, setShowInterestedFriends] = useState(false);

  const mapRef = useRef<MapView>(null);

  const router = useRouter();

  const onShare = async () =>
  {
    try
    {
      const eventLink = 'eventbuddy://event/' + data.id;
      await Share.share({
        message: `Check out this event: ${data.title} \n ${eventLink}`,
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

  const openEventDetails = () =>
  {
    router.push({ pathname: '/event', params: { eventID: data.id } });
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
    <>
      <View style={[styles.container, { backgroundColor: colors.backgroundAlt, borderRadius: 25 }, style]}>
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
          <TouchableHighlight onPress={onPress ?? openEventDetails}>
            {type == EventItemType.big ? (
              <>
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: data?.imageUrl || 'https://picsum.photos/600/400',
                      cache: 'force-cache'
                    }}
                    style={styles.image}
                  />

                  <View style={styles.overlayContainer}>
                    <View style={styles.overlayItem}>
                      <Ionicons name="pricetag" size={16} color="white" style={{ marginRight: 6 }} />
                      <Text style={styles.price}>Kostenlos</Text>
                    </View>
                    <View style={styles.overlayItem}>
                      <Ionicons name="calendar" size={16} color="white" style={{ marginRight: 6 }} />
                      <Text style={styles.price}>
                        {new Date(data?.startDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}
                      </Text>
                    </View>
                  </View>
                  <TouchableHighlight style={styles.heartButton} onPress={() =>
                  {
                    setIsSavedAmount(isSaved ? isSavedAmount - 1 : isSavedAmount + 1);
                    setIsSaved(!isSaved);
                    if (onSave)
                    {
                      onSave();
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
                    <ThemedText style={styles.title} numberOfLines={2}>{data?.title}</ThemedText>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="flame" size={16} color={colors.textPrimary} />
                      <ThemedText style={styles.rating}>{data?.matchScore}</ThemedText>
                    </View>
                  </View>
                  <View style={styles.interestedFriendsContainer}>
                    {isSaved && isSaved == true && (
                      <View style={styles.placeholderContainer}>
                        <ThemedText style={styles.placeholderText}>Teil das Event deinen Freunden</ThemedText>
                      </View>
                    ) || (
                        <View style={styles.placeholderContainer}>
                          <ThemedText style={styles.placeholderText}>Sei der erste der daran Interessiert ist.</ThemedText>
                        </View>
                      )}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.smallContainer}>
                <Image
                  source={{
                    uri: data?.imageUrl || 'https://picsum.photos/600/400',
                    cache: 'force-cache'
                  }}
                  style={styles.smallImage}
                />
                <View style={styles.smallContentContainer}>
                  <ThemedText style={styles.smallTitle} numberOfLines={1}>{data?.title}</ThemedText>
                  <Text style={styles.smallDate}>
                    {new Date(data?.startDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
                {likeable ? (
                  <TouchableHighlight style={styles.smallHeartButton} onPress={() =>
                  {
                    setIsSavedAmount(isSaved ? isSavedAmount - 1 : isSavedAmount + 1);
                    setIsSaved(!isSaved);
                    if (onSave)
                    {
                      onSave();
                    }
                  }}>
                    <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? 'red' : colors.textPrimary} />
                  </TouchableHighlight>

                ) : (<></>)}
              </View>
            )}
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
            </View>
          </View>
        </Modal>
      </View>
    </>
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
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  overlayItem: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 16,
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
    top: 12,
    right: 60,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 16,
  },
  contentContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 70,
    padding: 8,
  },
  smallImage: {
    width: 54,
    height: 54,
    borderRadius: 17,
    resizeMode: 'cover',
  },
  smallContentContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  smallTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  smallDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  smallHeartButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});