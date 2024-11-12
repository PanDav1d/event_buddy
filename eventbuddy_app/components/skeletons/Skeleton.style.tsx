import { Colors } from "@/constants/Colors";
import { StyleSheet, useColorScheme } from "react-native";

export function SkeletonStyle() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    return (StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            flex: 1,
        }
    }))
}
