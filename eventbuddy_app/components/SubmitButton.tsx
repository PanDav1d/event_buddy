import React from 'react'
import { Pressable, Text, StyleSheet, useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';

const SubmitButton = ({ onPress, title }: { onPress: () => void, title: string }) =>
{
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.primary },
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
    >
      <ThemedText style={styles.text}>{title}</ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonPressed: {
    opacity: 0.8,
    elevation: 2,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
})

export default SubmitButton