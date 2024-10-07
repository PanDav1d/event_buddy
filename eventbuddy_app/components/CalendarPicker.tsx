import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native'
import { ThemedText } from "./ThemedText"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons'

interface CalendarPickerProps
{
    onDateChange: (startDate: number | null, endDate: number | null) => void
}

export function CalendarPicker({ onDateChange }: CalendarPickerProps)
{
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? 'light']

    const [startDate, setStartDate] = useState<number | null>(null)
    const [endDate, setEndDate] = useState<number | null>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const [modalVisible, setModalVisible] = useState(false)

    const showModal = () => { setModalVisible(true); }
    const hideModal = () => { setModalVisible(false); }

    const getDaysInMonth = (date: Date) =>
    {
        const year = date.getFullYear()
        const month = date.getMonth()
        return new Date(year, month + 1, 0).getDate()
    }

    const getMonthData = () =>
    {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const daysInMonth = getDaysInMonth(currentMonth)
        const firstDayOfMonth = new Date(year, month, 1).getDay()

        const monthData = []
        for (let i = 0; i < firstDayOfMonth; i++)
        {
            monthData.push(null)
        }
        for (let i = 1; i <= daysInMonth; i++)
        {
            monthData.push(new Date(year, month, i))
        }

        return monthData
    }

    const handleDatePress = (date: Date) =>
    {
        const unixTime = Math.floor(date.getTime() / 1000)
        if (!startDate || (startDate && endDate))
        {
            setStartDate(unixTime)
            setEndDate(null)
        } else if (unixTime > startDate)
        {
            setEndDate(unixTime)
        } else
        {
            setStartDate(unixTime)
            setEndDate(null)
        }
    }

    useEffect(() =>
    {
        onDateChange(startDate, endDate)
    }, [startDate, endDate])

    const renderDay = (date: Date | null) =>
    {
        if (!date) return <View style={styles.emptyDay} />

        const unixTime = Math.floor(date.getTime() / 1000)
        const isSelected = (startDate && unixTime === startDate) ||
            (endDate && unixTime === endDate)
        const isInRange = startDate && endDate && unixTime > startDate && unixTime < endDate

        return (
            <TouchableOpacity
                style={[
                    styles.day,
                    isSelected ? { backgroundColor: colors.primary } : undefined,
                    isInRange ? { backgroundColor: colors.buttonPrimary } : undefined,
                ]}
                onPress={() => handleDatePress(date)}
            >
                <ThemedText style={[styles.dayText, isSelected ? { color: colors.background } : undefined]}>
                    {date.getDate()}
                </ThemedText>
            </TouchableOpacity>
        )
    }

    const changeMonth = (increment: number) =>
    {
        const newMonth = new Date(currentMonth)
        newMonth.setMonth(newMonth.getMonth() + increment)
        setCurrentMonth(newMonth)
    }

    return (
        <Modal visible={modalVisible} animationType="slide" presentationStyle="formSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <ThemedText style={styles.monthText}>
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </ThemedText>
                    <TouchableOpacity onPress={() => changeMonth(1)}>
                        <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.calendar}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                            <ThemedText key={index} style={styles.weekDay}>{day}</ThemedText>
                        ))}
                        {getMonthData().map((date, index) => (
                            <View key={index}>{renderDay(date)}</View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

const { width, height } = Dimensions.get('window')
const daySize = width / 7

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height * 0.6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 50,
    },
    monthText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    calendar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    weekDay: {
        width: daySize,
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
    day: {
        width: daySize,
        height: daySize,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        textAlign: 'center',
        fontSize: 16,
    },
    emptyDay: {
        width: daySize,
        height: daySize,
    },
})