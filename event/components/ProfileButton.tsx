import { View, StatusBar, Text, StyleSheet, Pressable, ScrollView, Modal, Animated, useColorScheme, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SearchParams } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { useRouter } from 'expo-router';

interface SearchBarProps {
    onSearchChange: (params: SearchParams) => void;
}

export function ProfileButton() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const handlePress = () => {
        router.push('/profile');
    };

    return(
        <Pressable onPress={handlePress}>
            <Ionicons name="person-circle-outline" size={40} color={colorScheme === 'light' ? 'black' : 'white'} />
        </Pressable>
    );
}