import { View, StatusBar, Text, StyleSheet, Pressable, ScrollView, Modal, Animated, useColorScheme } from "react-native";
import { TextInput } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import React, { useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { Colors } from "@/constants/Colors";

export const FilterBar = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [text, setText] = React.useState("");
    const [activeTab, setActiveTab] = React.useState("All");
    const [modalVisible, setModalVisible] = React.useState(false);
    const tabs = ["All", "Music Festival", "Film Festival", "Food Festival", "Nightclub"];
    const slideAnimation = useRef(new Animated.Value(0)).current;

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
        marginTop: 8,
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