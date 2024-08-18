/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = 'black';
const tintColorDark = 'white';
const accentColor = '#FFA823';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    backgroundSecondary: '#eee',
    backgroundLight: '#fff',
    tint: tintColorLight,
    accent: accentColor,
    lightAccent: accentColor + '80',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#000',
    backgroundSecondary: '#26292b',
    backgroundLight: '#000',
    tint: tintColorDark,
    accent: accentColor,
    lightAccent: accentColor + '80',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
