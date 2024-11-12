import { ActivityIndicator, useColorScheme, View } from "react-native";
import { ActivityIndicatorFullscreenComponentStyles } from "./ActivityIndicatorFullscreenComponent.style";
import { Colors } from "@/constants/Colors";


export function ActivityIndicatorFullscreenComponent() {
    const styles = ActivityIndicatorFullscreenComponentStyles();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    return (
        <View style={styles.loading}>
            <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
    );
}
