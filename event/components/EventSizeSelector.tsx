import React from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';

export const EventSizeSelector = ({ value, onChange }: { value: number; onChange: (value: number) => void }) =>
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [position] = React.useState(new Animated.Value(value));

    const getIcon = () =>
    {
        if (value === 0) return "user-friends";
        if (value === 1) return "users";
        return "user-astronaut";
    };

    const panResponder = React.useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) =>
        {
            const newPosition = Math.max(0, Math.min(2, value + gestureState.dx / 100));
            position.setValue(newPosition);
        },
        onPanResponderRelease: (_, gestureState) =>
        {
            const newValue = Math.round(Math.max(0, Math.min(2, value + gestureState.dx / 100)));
            onChange(newValue);
            Animated.spring(position, {
                toValue: newValue,
                useNativeDriver: false,
            }).start();
        },
    }), [value, onChange]);

    return (
        <View style={styles.eventSizeSelectorContainer}>
            <FontAwesome5 name={getIcon()} size={40} color={colors.primary} style={styles.eventSizeIcon} />
            <View style={[styles.sliderTrack, { backgroundColor: colors.backgroundLight }]}>
                <Animated.View
                    style={[
                        styles.sliderThumb,
                        {
                            backgroundColor: colors.primary,
                            transform: [{
                                translateX: position.interpolate({
                                    inputRange: [0, 2],
                                    outputRange: [0, 160] // Adjust based on your track width
                                })
                            }]
                        }
                    ]}
                    {...panResponder.panHandlers}
                />
            </View>
            <View style={styles.eventSizeLabelContainer}>
                <ThemedText style={styles.eventSizeLabel}>Klein</ThemedText>
                <ThemedText style={styles.eventSizeLabel}>Mittel</ThemedText>
                <ThemedText style={styles.eventSizeLabel}>Groß</ThemedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    eventSizeSelectorContainer: {
        width: '100%',
        alignItems: 'center',
    },
    eventSizeIcon: {
        marginBottom: 20,
    },
    sliderTrack: {
        width: 200,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
    },
    sliderThumb: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: 'absolute',
        left: 5,
    },
    eventSizeLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginTop: 10,
    },
    eventSizeLabel: {
        fontSize: 14,
    },
});