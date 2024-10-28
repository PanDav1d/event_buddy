import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

export enum TitleType
{
    center,
    left,
}

interface TitleProps
{
    title: string;
    type?: TitleType;
}

export function Title({ title, type = TitleType.left }: TitleProps)
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            {type === TitleType.center && (
                <View style={[styles.line, { backgroundColor: colors.primary }]} />
            )}
            <ThemedText style={[
                styles.title,
                type === TitleType.left && styles.titleLeft
            ]}>{title}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    title: {
        paddingVertical: 10,
        fontSize: 32,
        fontWeight: 'bold',
        paddingHorizontal: 26,
        textTransform: 'uppercase',
    },
    titleLeft: {
        paddingLeft: 0,
    },
    line: {
        flex: 1,
        height: 2,
    }
});