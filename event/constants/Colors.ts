/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const primaryColor = '#FF5722';  // Markenfarbe Orange

export const Colors = {
  light: {
    primary: primaryColor,  // Markenfarbe Orange
    secondary: '#FFC107',
    tertiary: '#4CAF50',
    
    background: '#FFFFFF',  // Haupt-Hintergrundfarbe
    backgroundAlt: '#FAFAFA',  // Alternative Hintergrundfarbe (leicht abgedunkelt)
    backgroundLight: '#FFFFFF',  // Hellste Hintergrundfarbe
    backgroundDark: '#F0F0F0',  // Dunklere Hintergrundfarbe
    surface: '#F5F5F5',  // Oberfläche (z.B. Karten, Modale)
    overlay: 'rgba(0, 0, 0, 0.5)',  // Overlay-Farbe
    
    textPrimary: '#212121',  // Haupttextfarbe
    textSecondary: '#757575',  // Sekundäre Textfarbe
    textTertiary: '#9E9E9E',  // Tertiäre Textfarbe
    textInverse: '#FFFFFF',  // Inverse Textfarbe (z.B. auf dunklen Oberflächen)
    link: '#1976D2',  // Farbe für Links
    
    border: '#E0E0E0',  // Rahmenfarbe
    divider: '#BDBDBD',  // Trennlinienfarbe
    
    success: '#4CAF50',  // Erfolgsfarbe
    error: '#F44336',  // Fehlerfarbe
    warning: '#FFC107',  // Warnfarbe
    info: '#2196F3',  // Informationsfarbe
    
    buttonPrimary: primaryColor,  // Haupt-Schaltflächenfarbe
    buttonSecondary: '#FFC107',  // Sekundäre Schaltflächenfarbe
    buttonDisabled: '#BDBDBD',  // Deaktivierte Schaltflächenfarbe
    buttonText: '#FFFFFF',  // Textfarbe für Schaltflächen
    hover: '#E64A19',  // Hover-Zustand Farbe
    focus: '#D84315',  // Fokus-Zustand Farbe
    active: '#FF7043',  // Aktiver Zustand Farbe
    
    shadow: '#BDBDBD',  // Schattenfarbe
    elevation: '#F5F5F5',  // Farbe für erhobene Oberflächen
    glow: primaryColor,  // Glüheffekt
    
    badge: primaryColor,  // Farbe für Badges
    notification: primaryColor,  // Farbe für Benachrichtigungen
    
    backgroundSuccess: '#E8F5E9',  // Hintergrundfarbe für Erfolgsmeldungen
    backgroundError: '#FFEBEE',  // Hintergrundfarbe für Fehlermeldungen
    backgroundWarning: '#FFF8E1',  // Hintergrundfarbe für Warnungen
    backgroundInfo: '#E3F2FD',  // Hintergrundfarbe für Informationen
    
    gradientPrimary: 'linear-gradient(45deg, #FF5722, #FF7043)',  // Primärer Farbverlauf
    gradientSecondary: 'linear-gradient(45deg, #FFC107, #FFD54F)',  // Sekundärer Farbverlauf
    overlayTransparent: 'rgba(0, 0, 0, 0.3)',  // Transparenter Overlay
    primaryTransparent: 'rgba(255, 87, 34, 0.3)',  // Transparenter Overlay

    tagInactive : '#E0E0E0',
    tagActive : primaryColor,
  },
  dark: {
    primary: primaryColor,  // Markenfarbe Orange
    secondary: '#FFC107',
    tertiary: '#4CAF50',
    
    background: '#121212',  // Haupt-Hintergrundfarbe
    backgroundAlt: '#1F1F1F',  // Alternative Hintergrundfarbe (leicht aufgehellt)
    backgroundLight: '#1E1E1E',  // Hellere Hintergrundfarbe
    backgroundDark: '#0D0D0D',  // Dunklere Hintergrundfarbe
    surface: '#1E1E1E',  // Oberfläche (z.B. Karten, Modale)
    overlay: 'rgba(255, 255, 255, 0.5)',  // Overlay-Farbe
    
    textPrimary: '#E0E0E0',  // Haupttextfarbe
    textSecondary: '#BDBDBD',  // Sekundäre Textfarbe
    textTertiary: '#9E9E9E',  // Tertiäre Textfarbe
    textInverse: '#212121',  // Inverse Textfarbe (z.B. auf hellen Oberflächen)
    link: '#90CAF9',  // Farbe für Links
    
    border: '#333333',  // Rahmenfarbe
    divider: '#424242',  // Trennlinienfarbe
    
    success: '#4CAF50',  // Erfolgsfarbe
    error: '#F44336',  // Fehlerfarbe
    warning: '#FFC107',  // Warnfarbe
    info: '#2196F3',  // Informationsfarbe
    
    buttonPrimary: primaryColor,  // Haupt-Schaltflächenfarbe
    buttonSecondary: '#FFC107',  // Sekundäre Schaltflächenfarbe
    buttonDisabled: '#424242',  // Deaktivierte Schaltflächenfarbe
    buttonText: '#E0E0E0',  // Textfarbe für Schaltflächen
    hover: '#FF7043',  // Hover-Zustand Farbe
    focus: '#D84315',  // Fokus-Zustand Farbe
    active: '#E64A19',  // Aktiver Zustand Farbe
    
    shadow: '#000000',  // Schattenfarbe
    elevation: '#2C2C2C',  // Farbe für erhobene Oberflächen
    glow: primaryColor,  // Glüheffekt
    
    badge: primaryColor,  // Farbe für Badges
    notification: primaryColor,  // Farbe für Benachrichtigungen
    
    backgroundSuccess: '#1B5E20',  // Hintergrundfarbe für Erfolgsmeldungen
    backgroundError: '#B71C1C',  // Hintergrundfarbe für Fehlermeldungen
    backgroundWarning: '#FF8F00',  // Hintergrundfarbe für Warnungen
    backgroundInfo: '#1565C0',  // Hintergrundfarbe für Informationen
    
    gradientPrimary: 'linear-gradient(45deg, #FF5722, #E64A19)',  // Primärer Farbverlauf
    gradientSecondary: 'linear-gradient(45deg, #FFC107, #FFD54F)',  // Sekundärer Farbverlauf
    overlayTransparent: 'rgba(255, 255, 255, 0.3)',  // Transparenter Overlay
    primaryTransparent: 'rgba(255, 87, 34, 0.3)',  // Transparenter Overlay

    tagInactive : '#424242',
    tagActive : primaryColor,
  }
};

