import { StyleSheet, useColorScheme } from "react-native";


export const ActivityIndicatorFullscreenComponentStyles = () => {
    return StyleSheet.create({
        loading: {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
        }
    });
}
