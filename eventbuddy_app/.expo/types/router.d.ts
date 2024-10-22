/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/` | `/(auth)/(tabs)` | `/(auth)/(tabs)/` | `/(auth)/(tabs)/explore` | `/(auth)/(tabs)/profile` | `/(auth)/event` | `/(auth)/explore` | `/(auth)/friends` | `/(auth)/profile` | `/(auth)/saved` | `/(auth)/tickets` | `/(tabs)` | `/(tabs)/` | `/(tabs)/explore` | `/(tabs)/profile` | `/_sitemap` | `/event` | `/explore` | `/friends` | `/personalization` | `/profile` | `/register` | `/saved` | `/sign-in` | `/tickets`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
