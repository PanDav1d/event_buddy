import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    tabBar={() => null}
      screenOptions={{
        headerShown: false,
      }}>
    </Tabs>
  );
}
