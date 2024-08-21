import { StyleSheet, View, FlatList, RefreshControl, Text, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SearchBar } from '@/components/SearchBar';
import React, { useEffect, useState, useCallback } from 'react';
import { EventCard, SearchParams } from '@/constants/Types';
import { API_URL, API_URL_SAVED_EVENT } from '@/config';
import { EventItem } from '@/components/EventItem';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const CARD_MARGIN = 24;

const serializeSearchParams = (params: SearchParams): string => {
  const serialized = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'date_range' && typeof value === 'object') {
        const start = Math.floor(new Date(value.start).getTime() / 1000);
        const end = Math.floor(new Date(value.end).getTime() / 1000);
        serialized.append(key, JSON.stringify({ start, end }));
      } else if (typeof value === 'object') {
        serialized.append(key, JSON.stringify(value));
      } else {
        serialized.append(key, value.toString());
      }
    }
  });

  return serialized.toString();
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [currLatitude, setCurrLatitude] = useState<number | null>(null);
  const [currLongitude, setCurrLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [savedEventIds, setSavedEventIds] = useState<number[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [apiData, setApiData] = useState<EventCard[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
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
          date_range: {
            start: new Date(Date.now()),
            end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
          radius: 20,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setError('Failed to get location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchData = async () => {
    if (!searchParams) return;
    
    try {
      const queryString = serializeSearchParams(searchParams);
      const response = await fetch(`${API_URL}?${queryString}`);
      console.log(decodeURIComponent(`${API_URL}?${queryString}`));
      console.log(`${API_URL}?${queryString}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setApiData(jsonData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Network Issue');
    }
  }

  useEffect(() => {
    if (searchParams) {
      fetchData();
    }
  }, [searchParams]);

  const reloadContent = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [searchParams]);

  const saveEvent = async (eventId: number) => {
    try {
      const userId = 1; 
      console.log(`${API_URL_SAVED_EVENT}${userId}/${eventId}`);
      // Prüfen, ob das Event bereits gespeichert ist
      const checkResponse = await fetch(`${API_URL_SAVED_EVENT}${userId}`);
      if (!checkResponse.ok) {
        throw new Error('Fehler beim Abrufen gespeicherter Events');
      }
      const savedEvents = await checkResponse.json();
      const isEventSaved = savedEvents.some((event: any) => event.event_id === eventId);

      let response;
      if (isEventSaved) {
        // Event entfernen
        console.log(`Unsaving: ${API_URL_SAVED_EVENT}${userId}/${eventId}`)
        response = await fetch(`${API_URL_SAVED_EVENT}${userId}/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Fehler beim Entfernen des gespeicherten Events');
        }
        console.log('Event erfolgreich entfernt');
        // Event-ID aus dem Zustand entfernen
        setSavedEventIds(savedEventIds.filter(id => id !== eventId));
      } else {
        // Event speichern
        console.log(`Saving: ${API_URL_SAVED_EVENT}${userId}/${eventId}`)
        response = await fetch(`${API_URL_SAVED_EVENT}${userId}/${eventId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Fehler beim Speichern des Events');
        }
        console.log('Event erfolgreich gespeichert');
        // Event-ID zum Zustand hinzufügen
        setSavedEventIds([...savedEventIds, eventId]);
      }
    } catch (error) {
      console.error('Fehler beim Speichern/Entfernen des Events:', error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
          <Text style={[styles.loadingText, {color: colors.text}]}>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer} >
          <Ionicons name="cloud-offline" size={100} color={colors.text} />
          <Text style={[styles.errorText, {color: colors.text}]}>Netzwerkfehler</Text>
        </View>
      );
    }

    if (apiData.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="search-outline" size={100} color={colors.text} />
          <Text style={[styles.errorText, {color: colors.text}]}>Keine Events gefunden</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={apiData}
        renderItem={({item}) => (<EventItem {...item} isSaved={savedEventIds.includes(item.id)} onSave={() => saveEvent(item.id)} />)}
        style={styles.cardList}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={reloadContent}
          />}
        horizontal={false}
      />
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <SearchBar onSearchChange={setSearchParams} />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  header : {
    paddingTop: '15%',
    padding: 25,
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
  cardCollection: {
    marginVertical: CARD_MARGIN / 2,
    marginHorizontal: CARD_MARGIN,
  },
  cardList: {
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    paddingBottom: CARD_MARGIN,
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