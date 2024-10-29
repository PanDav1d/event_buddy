import { StyleSheet, View, RefreshControl, Text, TouchableHighlight } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState, useCallback } from 'react';
import { EventCardPreview } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import NetworkClient from '@/api/NetworkClient';
import { useSession } from '@/components/ctx';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { EventCarousel } from '@/components/EventCarousel';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Title } from '@/components/Title';
import { EventSpotlight } from '@/components/EventSpotlight';
import { EventItemType } from '@/components/EventItem';
import { BlurView } from 'expo-blur';

const CARD_MARGIN = 8;

export default function IndexScreen()
{
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { session } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sections, setSections] = useState<Record<string, EventCardPreview[]>>({});
  const [error, setError] = useState<string | null>(null);

  if (!session)
  {
    return <Redirect href={"/sign-in"} />
  }

  const fetchData = useCallback(async () =>
  {
    const feedData = await NetworkClient.getFeed(session.userID);
    setSections(feedData);
    setIsLoading(false);
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

  const renderSkeletonLoading = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonItem}>
        <View style={styles.skeletonTitleSeparator} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.skeletonEventItem}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonText} />
            </View>
          </View>
          <View style={styles.skeletonEventItem}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonText} />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.skeletonItem}>
        <View style={styles.skeletonTitleSeparator} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.skeletonEventItem}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonText} />
            </View>
          </View>
          <View style={styles.skeletonEventItem}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonText} />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderContent = () =>
  {
    if (isLoading)
    {
      return renderSkeletonLoading();
    }

    /*
    if (events.length == 0)
    {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={100} color={colors.textPrimary} />
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>Keine Events gefunden</Text>
        </View>
      );
    }
      */

    if (error == "error")
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
        {sections["Im Spotlight"] && (
          <EventSpotlight
            title='Im Spotlight'
            data={sections["Im Spotlight"][0]}
          />
        )}
        {Object.entries(sections).map(([title, events]) => (
          title !== "Im Spotlight" && (
            <EventCarousel
              key={title}
              title={title}
              data={events}
            />
          )
        ))}
      </>
    );
  };

  return (
    <GestureHandlerRootView>
      <BlurView style={StyleSheet.absoluteFill} tint={colorScheme === 'dark' ? 'dark' : 'light'} intensity={100}>
        <SafeAreaView>
          <Title title='Eventbuddy' />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          >
            {renderContent()}
            <TouchableHighlight style={[styles.discoverButton, { backgroundColor: colors.primary, marginBottom: 150 }]} onPress={() => router.navigate("/explore")}>
              <View style={styles.discoverButtonContent}>
                <Ionicons name="search-outline" size={24} color={colors.textInverse} style={styles.discoverIcon} />
                <ThemedText style={[styles.discoverText, { color: colors.textInverse }]}>Entdecke mehr</ThemedText>
              </View>
            </TouchableHighlight>
          </ScrollView>
        </SafeAreaView>
      </BlurView>
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
  discoverButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  discoverButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  discoverIcon: {
    marginRight: 8,
  },
  discoverText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonItem: {
    marginBottom: 30,
  },
  skeletonTitleSeparator: {
    height: 24,
    width: '60%',
    backgroundColor: '#E1E9EE',
    marginBottom: 20,
    borderRadius: 4,
  },
  skeletonEventItem: {
    width: 300,
    marginRight: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  skeletonImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E1E9EE',
  },
  skeletonContent: {
    padding: 20,
  },
  skeletonTitle: {
    width: '80%',
    height: 20,
    backgroundColor: '#E1E9EE',
    marginBottom: 10,
    borderRadius: 4,
  },
  skeletonText: {
    width: '60%',
    height: 15,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
});