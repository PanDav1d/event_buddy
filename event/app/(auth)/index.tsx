import { StyleSheet, View, FlatList, RefreshControl, Text, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SearchBar } from '@/components/SearchBar';
import React, { useEffect, useState, useCallback } from 'react';
import { EventCard, SearchParams } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import NetworkClient from '@/api/NetworkClient';
import { EventCarousel } from '@/components/EventCarousel';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useSession } from '@/components/ctx';
import { Redirect } from 'expo-router';

const CARD_MARGIN = 24;

export default function IndexScreen()
{
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { session } = useSession();

  const [currLatitude, setCurrLatitude] = useState<number | null>(null);
  const [currLongitude, setCurrLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const [refreshing, setRefreshing] = useState(false);



  const [apiData, setApiData] = useState<EventCard[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!session)
  {
    return <Redirect href={"/sign-in"} />
  }

  useEffect(() =>
  {
    (async () =>
    {
      try
      {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted')
        {
          console.log('Permission to access location was denied');
          throw new Error('Location permission denied');
        }
        console.log('Permission has been already allowed');

        let location = await Location.getCurrentPositionAsync({});
        setCurrLatitude(location.coords.latitude);
        setCurrLongitude(location.coords.longitude);

        setSearchParams({
          tags: [""],
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          start_date: Math.floor(Date.now() / 1000),
          end_date: Math.floor((Date.now() + 14 * 24 * 60 * 60 * 1000) / 1000),
          radius: 20,
        });
      } catch (error)
      {
        console.error('Error getting location:', error);
        setError('Failed to get location');
      } finally
      {
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchData = async () =>
  {
    if (!searchParams) return;

    try
    {
      const events = await NetworkClient.getEvents(searchParams, session.userID);
      setApiData(events);
      setError(null);
    } catch (error)
    {
      console.error('Error fetching data:', error);
      setError('Network Issue');
    }
  }

  useEffect(() =>
  {
    if (searchParams)
    {
      fetchData();
    }
  }, [searchParams]);

  const onRefresh = useCallback(() =>
  {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [searchParams]);

  const saveEvent = async (eventId: number) =>
  {
    NetworkClient.saveEvent(session.userID, eventId);
  };

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
        <View style={styles.errorContainer} >
          <Ionicons name="cloud-offline" size={100} color={colors.textPrimary} />
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>Netzwerkfehler</Text>
        </View>
      );
    }

    if (apiData.length === 0)
    {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="search-outline" size={100} color={colors.textPrimary} />
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>Keine Events gefunden</Text>
        </View>
      );
    }

    return (
      <GestureHandlerRootView>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <EventCarousel title="Highlights" data={apiData} />
          <EventCarousel title="Shows" data={apiData} />
        </ScrollView>
      </GestureHandlerRootView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar onSearchChange={setSearchParams} />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: '15%',
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    elevation: 5,
    zIndex: 100
  },
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
});