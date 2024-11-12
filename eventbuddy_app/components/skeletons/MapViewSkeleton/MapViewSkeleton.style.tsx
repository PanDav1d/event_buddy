import { Colors } from "@/constants/Colors";
import { StyleSheet, useColorScheme } from "react-native";

export const MapViewSkeletonStyle = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    return StyleSheet.create({
        placeholder: {
            height: 200,
        }
    });
}
