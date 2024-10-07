import React, { useState } from 'react';
import { ThemedText } from "@/components/ThemedText";
import { View, ScrollView, TextInput, StyleSheet, FlatList, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function ExploreScreen()
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [searchText, setSearchText] = useState('');

    const searchResults = [
        { id: '1', title: 'Ergebnis 1' },
        { id: '2', title: 'Ergebnis 2' },
        { id: '3', title: 'Ergebnis 3' },
    ];

    const renderSearchResult = ({ item }: { item: { title: string } }) => (
        <View style={styles.searchResultItem}>
            <ThemedText>{item.title}</ThemedText>
        </View>
    );

    const clearSearch = () =>
    {
        setSearchText('');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.backgroundAlt }]}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        placeholder="Suchen"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText ? (
                        <TouchableOpacity onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#999" style={styles.clearIcon} />
                        </TouchableOpacity>
                    ) : null}
                </View>
                {searchText && (
                    <TouchableOpacity style={styles.cancelButton} onPress={clearSearch}>
                        <ThemedText>Abbrechen</ThemedText>
                    </TouchableOpacity>
                )}
            </View>
            {searchText ? (
                <View style={styles.searchResultsContainer}>
                    <FlatList
                        data={searchResults}
                        renderItem={renderSearchResult}
                        keyExtractor={item => item.id}
                        style={styles.searchResultsList}
                    />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Hier würden die Bilder oder Inhalte in einem Raster angezeigt werden */}
                    {/* Beispiel für ein Raster-Element */}
                    <View style={styles.gridItem}>
                        <View style={styles.imagePlaceholder}></View>
                    </View>
                    <View style={styles.gridItem}>
                        <View style={styles.imagePlaceholder}></View>
                    </View>
                    <View style={styles.gridItem}>
                        <View style={styles.imagePlaceholder}></View>
                    </View>
                    {/* Weitere Grid-Elemente hier hinzufügen */}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    clearIcon: {
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    cancelButton: {
        marginLeft: 10,
        padding: 5,
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 2,
    },
    gridItem: {
        width: '33%',
        aspectRatio: 1,
        padding: 1,
    },
    imagePlaceholder: {
        flex: 1,
        backgroundColor: '#e0e0e0',
    },
    searchResultsContainer: {
        flex: 1,
    },
    searchResultsList: {
        flex: 1,
    },
    searchResultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
});