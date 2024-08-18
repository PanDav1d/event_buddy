import { StyleSheet, Dimensions, View, FlatList, RefreshControl } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SearchBar } from '@/components/SearchBar';
import { EventCardCollection } from '@/components/EventCardCollection';
import React, { useEffect, useState, useCallback } from 'react';
import { EventCard, SearchParams } from '@/constants/Types';
import { API_URL } from '@/config';
import { EventItem } from '@/components/EventItem';


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

  const [refreshing, setRefreshing] = useState(false);

  const [apiData, setApiData] = useState<EventCard[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>();

const fetchData = async () => {
    try {
        if (searchParams) {
            const queryString = serializeSearchParams(searchParams);
            const response = await fetch(`${API_URL}?${queryString}`);
            console.log(decodeURIComponent(`${API_URL}?${queryString}`));
            console.log(`${API_URL}?${queryString}`);
            const jsonData = await response.json();
            setApiData(jsonData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

  useEffect(() => {
    fetchData();
  }, [searchParams])

  const reloadContent = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}>
      <SearchBar onSearchChange={setSearchParams} />
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
});