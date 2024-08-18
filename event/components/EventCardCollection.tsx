import { View, FlatList, Text, StyleSheet, Dimensions, Image, ImageBackground, useColorScheme, Pressable, ScrollView } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import LinearGradient from 'react-native-linear-gradient';
import Carousel from "react-native-reanimated-carousel";
import { EventCard } from "@/constants/Types";
import { useState } from "react";


const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.65;
const CARD_WIDTH = width * 0.9;
const CARD_MARGIN = 28;

export function EventCardCollection(props: EventCard & {style? : any}) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openInformationModal = () => {
        setIsModalVisible(true);
    }

    const closeInformationModal = () => {
        setIsModalVisible(false);
    }

    const eventCards = [
        <View style={[styles.card, {backgroundColor: colors.backgroundSecondary}]}>
            <ImageBackground source={{uri: props.image_url}} style={styles.image}>
                <View style={styles.actionButtonBar}>
                    <Pressable style={[styles.actionButton, {backgroundColor: colors.accent}]} onTouchEnd={() => console.log("Bookmarked")}>
                        <Ionicons name="heart-outline" size={24} color="white" />
                    </Pressable>
                    <Pressable style={[styles.actionButton, {backgroundColor: colors.accent}]} onTouchEnd={() => console.log("Shared")}>
                        <Ionicons name="share-outline" size={24} color="white" />
                    </Pressable>
                </View>
                <View style={styles.firstCard}>
                    <ThemedText style={styles.title}>{props.title}</ThemedText>
                    <ThemedText style={styles.secondTitle}>{props.date}</ThemedText>
                </View>
            </ImageBackground>
        </View>,
        <View style={[styles.card, styles.secondCard, {backgroundColor: colors.backgroundSecondary}]}>
            <ScrollView>
                <View style={styles.organizerContainer}>
                    <Ionicons name="person-outline" size={24} color={colors.text} style={styles.icon} />
                    <ThemedText style={styles.organizerText}>Organisator: {props.organizer}</ThemedText>
                </View>
                <View style={styles.descriptionContainer}>
                    <Ionicons name="information-circle-outline" size={24} color={colors.text} style={styles.icon} />
                    <ThemedText style={styles.descriptionText}>Beschreibung: {props.description}</ThemedText>
                </View>
            </ScrollView>
        </View>,
        <View style={[styles.card, styles.thirdCard, {backgroundColor: colors.backgroundSecondary}]}>
            <View style={styles.thirdCardMap}> 
                <ThemedText style={styles.mapText}>Hier ist die Karte</ThemedText>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Ionicons name="location-outline" size={24} color={colors.text} style={styles.infoIcon} />
                    <ThemedText style={styles.infoText}>{props.location}</ThemedText>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="person-outline" size={24} color={colors.text} style={styles.infoIcon} />
                    <ThemedText style={styles.infoText}>{props.organizer}</ThemedText>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="calendar-outline" size={24} color={colors.text} style={styles.infoIcon} />
                    <ThemedText style={styles.infoText}>{props.date} {props.time}</ThemedText>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="pricetag-outline" size={24} color={colors.text} style={styles.infoIcon} />
                    <ThemedText style={styles.infoText}>#{props.id.toString().padStart(6, '0')}</ThemedText>
                </View>
            </View>
            <Pressable style={[styles.calendarPressable, {backgroundColor: colors.accent}]} onTouchEnd={() => openInformationModal()}>
                <ThemedText style={styles.calendarButtonText}>Infos öffnen</ThemedText>
                <Ionicons name="information-outline" size={24} color={colors.tint} />
            </Pressable>
            <Pressable style={[styles.calendarPressable, {backgroundColor: colors.accent}]} onTouchEnd={() => console.log("Link clicked")}>
                <ThemedText style={styles.calendarButtonText}>Zum Kalender hinzufügen</ThemedText>
                <Ionicons name="calendar-outline" size={24} color={colors.tint} />
            </Pressable>
        </View>
    ];

    return(
        <View>
            <Carousel
                style={props.style}
                width={width}
                height={CARD_HEIGHT}
                data={eventCards}
                renderItem={({item}) => item}
                mode="horizontal-stack"
                modeConfig={{
                    stackInterval: 0,
                    snapDirection: 'left',
                    rotateZDeg: 0,
                }}
                scrollAnimationDuration={1000}
                autoPlay={false}
                loop={false}
                 />
        </View>
    );
}

const styles = StyleSheet.create({
    firstCard : {
        position: 'absolute',
        bottom: '25%',
        left: '10%',
        width: '100%',
    },
    secondCard : {
        padding: '8%',
        flex: 1,
        justifyContent: 'center',
    },
    organizerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: 10,
    },
    organizerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionText: {
        fontSize: 16,
        flex: 1,
    },
    thirdCard : {
        padding: '6%',
        flex: 1,
        justifyContent: 'space-between',
    },
    thirdCardMap : {
        height : '45%',
        backgroundColor: '#E8E8E8',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    mapText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoContainer: {
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoIcon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 16,
    },
    calendarPressable : {
        padding: '5%',
        width: '100%',
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
        color: 'white',
    },
    image : {
        flex: 1,
        resizeMode: 'cover',
    },
    title:{
        padding: 10,
        fontSize: 36,
        fontWeight: 'bold'
    },
    secondTitle:{
        paddingLeft: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
    card : {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 45,
        overflow: 'hidden',
    },
    actionButton : {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 14,
    },
    actionButtonBar : {
        top: 10,
        right: 10,
        gap: 6,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        padding: 10,
    }
})