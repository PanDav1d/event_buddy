import { View,  useColorScheme, Modal } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from '@/constants/Colors';
import React from "react";

export function InformationModal() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <Modal
            animationType="slide"
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => { setModalVisible(false);}}
            presentationStyle="pageSheet"
        >

        </Modal>
    );
}