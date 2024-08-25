import
{
    StyleSheet,
    Pressable,
    ScrollView,
    useColorScheme,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { DateQuickTab } from "@/constants/DateQuickTabs";
import { CalendarPicker } from "@/components/CalendarPicker";

interface FilterBarProps
{
    onDateFilterChange: (filter: DateQuickTab) => void;
}

export const FilterBar = ({ onDateFilterChange }: FilterBarProps) =>
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];

    const [activeTab, setActiveTab] = React.useState("Heute");
    const tabs = Object.values(DateQuickTab);

    const handleTabPress = (tab: DateQuickTab) =>
    {
        const activeTabKey = Object.keys(DateQuickTab)[Object.values(DateQuickTab).indexOf(tab)];
        setActiveTab(tab.toString());
        onDateFilterChange(tab);
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
        >
            <Pressable style={[styles.tab, { backgroundColor: colors.backgroundSecondary }]} onPress={() => console.log("Pressed")}>
                <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={colors.text}
                    style={styles.tabIcon}
                />
            </Pressable>
            {tabs.map((tab) => (
                <Pressable
                    key={tab}
                    style={[
                        styles.tab,
                        activeTab === tab &&
                        styles.activeTab && { backgroundColor: colors.accent },
                        activeTab != tab && { backgroundColor: colors.backgroundSecondary },
                    ]}
                    onPress={() => handleTabPress(tab)}
                >
                    <ThemedText
                        style={[styles.tabText, activeTab === tab && styles.activeTabText]}
                    >
                        {tab}
                    </ThemedText>
                </Pressable>
            ))}
        </ScrollView>
    );
};

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
        backgroundColor: "#f0f0f0",
    },
    activeTab: {
        backgroundColor: "#000",
    },
    tabText: {
        fontSize: 14,
    },
    tabIcon: {
        fontSize: 18,
    },
    activeTabText: {
        color: "#fff",
    },
});
