import { StyleSheet, View, FlatList, RefreshControl, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SearchBar } from '@/components/SearchBar';
import React, { useEffect, useState, useCallback } from 'react';
import { EventCard, SearchParams } from '@/constants/Types';
import { API_URL } from '@/config';
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      console.log('Permission has been already allowed');

      let location = await Location.getCurrentPositionAsync({});
      setCurrLatitude(location.coords.latitude);
      setCurrLongitude(location.coords.longitude);
    })();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const [apiData, setApiData] = useState<EventCard[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    tags: [""],
    latitude: currLatitude ?? 0,
    longitude: currLongitude ?? 11.7147,
    date_range: {
      start: new Date(1722463200 * 1000),
      end: new Date(1725055200 * 1000),
    },
    radius: 20,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
        if (searchParams) {
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
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        setError('Network Issue');
    }
  }

  useEffect(() => {fetchData();}, [searchParams])

  const reloadContent = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const renderContent = () => {
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
        renderItem={({item}) => (<EventItem {...item} />)}
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
});