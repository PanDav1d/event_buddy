import { StyleSheet, Pressable, ScrollView, useColorScheme } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Colors } from "@/constants/Colors";

export const FilterBar = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [activeTab, setActiveTab] = React.useState("All");
    const tabs = ["All", "Music Festival", "Film Festival", "Food Festival", "Nightclub"];

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map((tab) => (
            <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab && { backgroundColor: colors.accent}, activeTab != tab && { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => setActiveTab(tab)} >
                <ThemedText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                </ThemedText>
            </Pressable>
        ))}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    tabsContainer: {
        borderRadius: 18,
        marginHorizontal: 16,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
    },
    activeTab: {
        backgroundColor: '#000',
    },
    tabText: {
        fontSize: 14,
    },
    activeTabText: {
        color: '#fff',
    },
});