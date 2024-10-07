import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";


export default function TabsLayout()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { position: 'absolute' },
                tabBarBackground: () => (
                    <BlurView tint={colorScheme === 'dark' ? 'dark' : 'light'} intensity={100} style={{ flex: 1 }} />
                ),
                tabBarActiveTintColor: colors.textPrimary,
                tabBarInactiveTintColor: colors.textSecondary,
            }}
        >
            <Tabs.Screen name="index" options={{
                title: "Home",
                tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} style={{ marginBottom: -3, color }} />,
            }} />
            <Tabs.Screen name="profile" options={{
                title: "Profile",
                tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "person" : "person-outline"} style={{ marginBottom: -3, color }} />,
            }} />
            <Tabs.Screen name="explore" options={{
                title: "Explore",
                tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "search" : "search-outline"} style={{ marginBottom: -3, color }} />,
            }} />
        </Tabs>
    );
}