import { View, StatusBar, Text, StyleSheet, Pressable, ScrollView, Modal, Animated, useColorScheme, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SearchParams } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { useRouter } from 'expo-router';

interface SearchBarProps
{
    onSearchChange: (params: SearchParams) => void;
}

export function ProfileButton({ style }: { style?: ViewStyle | ViewStyle[] })
{
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const handlePress = () =>
    {
        router.push('/profile');
    };

    return (
        <Pressable onPress={handlePress} style={style}>
            <Ionicons name="person-circle-outline" size={40} color={colors.textPrimary} />
        </Pressable>
    );
}