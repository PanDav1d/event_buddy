import { StyleSheet, View, FlatList, RefreshControl, Text, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState, useCallback } from 'react';
import { EventCard, EventCardPreview } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { TitleSeperator } from '@/components/TitleSeperator';
import { EventCarousel } from '@/components/EventCarousel';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Title } from '@/components/Title';

const CARD_MARGIN = 8;

export default function IndexScreen()
{
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { session } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<EventCardPreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!session)
  {
    return <Redirect href={"/sign-in"} />
  }

  const fetchData = useCallback(async () =>
  {
    try
    {
      const allEvents = await NetworkClient.getEvents(session.userID);
      setEvents(allEvents);
      setError(null);
    } catch (error)
    {
      console.error('Error fetching data:', error);
      setError('Network Issue');
    } finally
    {
      setIsLoading(false);
    }
  }, [session.userID]);

  useEffect(() =>
  {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() =>
  {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [fetchData]);

  const renderEventCard = ({ item }: { item: EventCardPreview }) => (
    <View style={styles.eventCard}>
      <ThemedText style={[styles.eventTitle, { color: colors.textPrimary }]}>ID:{item.id}</ThemedText>
      <ThemedText style={[styles.eventTitle, { color: colors.textPrimary }]}>{item.title}</ThemedText>
      <ThemedText style={[styles.eventTitle, { color: colors.textPrimary }]}>{item.description}</ThemedText>
      <ThemedText style={[styles.eventTitle, { color: colors.textPrimary }]}>{new Date(item.start_date).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</ThemedText>
      <ThemedText style={[styles.eventTitle, { color: colors.textPrimary }]}>is Saved:{item.is_saved ? "true" : "false"}</ThemedText>
      <ThemedText style={[styles.eventTitle, { color: colors.textPrimary }]}>save amount:{item.amount_saved}</ThemedText>
      <TouchableOpacity onPress={() => NetworkClient.saveEvent(session.userID, item.id)}><Text style={{ color: colors.textTertiary }}>Like</Text></TouchableOpacity>
    </View>
  );

  const renderContent = () =>
  {
    if (isLoading)
    {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Laden...</Text>
        </View>
      );
    }

    if (error)
    {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline" size={100} color={colors.textPrimary} />
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>Netzwerkfehler</Text>
        </View>
      );
    }

    return (
      <>
        <EventCarousel title={"Für dich"} data={events} />
        <EventCarousel title={"In deiner Nähe"} data={events} />
      </>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <Title title='Eventbuddy' />
        <ScrollView>
          <ThemedText style={{ position: 'absolute', top: 14, right: 0, lineHeight: 0, backgroundColor: '#ffffffbb', zIndex: 999 }}>ID: {session.userID};{'\n'}username: {session.username};{'\n'}Token: {session.token}</ThemedText>
          {renderContent()}
        </ScrollView>
      </SafeAreaView >
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  eventCard: {
    flex: 1,
    margin: CARD_MARGIN,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});