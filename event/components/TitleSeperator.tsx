import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

export enum TitleSeperatorType
{
    center,
    left,
}

interface TitleSeperatorProps
{
    title: string;
    type?: TitleSeperatorType;
}

export function TitleSeperator({ title, type = TitleSeperatorType.left }: TitleSeperatorProps)
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            {type === TitleSeperatorType.center && (
                <View style={[styles.line, { backgroundColor: colors.primary }]} />
            )}
            <ThemedText style={[
                styles.title,
                type === TitleSeperatorType.left && styles.titleLeft
            ]}>{title}</ThemedText>
            <View style={[styles.line, { backgroundColor: colors.primary }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 15,
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