// Imports React et React Native pour l'interface de sélection d'authentification
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, useColorScheme } from 'react-native';
import { router } from 'expo-router'; // Navigation entre les écrans
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Gestion des zones sécurisées
import Svg, { Path } from 'react-native-svg'; // Composants SVG pour les icônes

// Composant d'icône flèche de retour pour la navigation
const ChevronLeftIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15 18l-6-6 6-6" 
      fill="none" 
      stroke="#1DBAA3" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Configuration des polices utilisées dans l'application YANKAP
const FONTS = {
  primary: 'Inter',    // Police principale pour les titres
  secondary: 'Poppins', // Police secondaire pour les boutons
  tertiary: 'Roboto',   // Police pour le texte courant
};

// Styles de texte standardisés pour l'application
const TEXT_STYLES = {
  h1: { fontFamily: FONTS.primary, fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontFamily: FONTS.primary, fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontFamily: FONTS.primary, fontSize: 20, fontWeight: '600' as const },
  body: { fontFamily: FONTS.tertiary, fontSize: 16, fontWeight: 'normal' as const },
  bodySmall: { fontFamily: FONTS.tertiary, fontSize: 14, fontWeight: 'normal' as const },
  button: { fontFamily: FONTS.secondary, fontSize: 16, fontWeight: '600' as const },
};

// Configuration des thèmes clair et sombre pour l'application
const THEMES = {
  light: {
    background: '#F5F5F5',           // Arrière-plan gris clair
    textPrimary: '#1DBAA3',          // Couleur principale YANKAP (vert turquoise)
    textSecondary: '#666',           // Texte secondaire gris
    textTertiary: '#333',            // Texte tertiaire gris foncé
    statusBarStyle: 'dark-content' as const, // Contenu sombre de la barre de statut
    cardBackground: 'white',         // Arrière-plan des cartes
    cardBorder: '#E0E0E0',          // Bordure des cartes
  },
  dark: {
    background: '#121212',           // Arrière-plan sombre
    textPrimary: '#1DBAA3',          // Couleur principale YANKAP conservée
    textSecondary: '#B0B0B0',        // Texte secondaire gris clair
    textTertiary: '#FFFFFF',         // Texte tertiaire blanc
    statusBarStyle: 'light-content' as const, // Contenu clair de la barre de statut
    cardBackground: '#2A2A2A',       // Arrière-plan sombre des cartes
    cardBorder: '#404040',           // Bordure sombre des cartes
  },
};

// Icône représentant l'authentification par OTP
const OTPIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {/* Téléphone mobile */}
    <Path 
      d="M12 2C10.3 2 9 3.3 9 5V35C9 36.7 10.3 38 12 38H28C29.7 38 31 36.7 31 35V5C31 3.3 29.7 2 28 2H12Z" 
      fill="#1DBAA3" 
      opacity="0.1"
      stroke="#1DBAA3"
      strokeWidth="1.5"
    />
    {/* Écran du téléphone */}
    <Path 
      d="M11 7H29V31H11V7Z" 
      fill="none"
      stroke="#1DBAA3"
      strokeWidth="1"
    />
    {/* Code OTP affiché sur l'écran */}
    <Path 
      d="M14 15H17M14 19H17M20 15H23M20 19H23M26 15H29M26 19H29" 
      stroke="#1DBAA3" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    {/* Bouton home */}
    <Path 
      d="M20 34C20.6 34 21 33.6 21 33C21 32.4 20.6 32 20 32C19.4 32 19 32.4 19 33C19 33.6 19.4 34 20 34Z" 
      fill="#1DBAA3"
    />
  </Svg>
);

// Icône représentant l'authentification par mot de passe
const PasswordIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    {/* Corps du cadenas */}
    <Path 
      d="M10 18H30C31.1 18 32 18.9 32 20V34C32 35.1 31.1 36 30 36H10C8.9 36 8 35.1 8 34V20C8 18.9 8.9 18 10 18Z" 
      fill="#1DBAA3" 
      opacity="0.1"
      stroke="#1DBAA3"
      strokeWidth="1.5"
    />
    {/* Anse du cadenas */}
    <Path 
      d="M14 18V12C14 8.7 16.7 6 20 6C23.3 6 26 8.7 26 12V18" 
      fill="none"
      stroke="#1DBAA3"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Trou de serrure */}
    <Path 
      d="M20 24C21.1 24 22 24.9 22 26C22 27.1 21.1 28 20 28C18.9 28 18 27.1 18 26C18 24.9 18.9 24 20 24Z" 
      fill="#1DBAA3"
    />
    {/* Fente de la clé */}
    <Path 
      d="M20 28V31" 
      stroke="#1DBAA3" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </Svg>
);

// Composant principal de l'écran de choix d'authentification
export default function AuthChoiceScreen() {
  // Détection automatique du mode sombre/clair du système
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  
  // État pour suivre le mode d'authentification sélectionné
  const [selectedMode, setSelectedMode] = useState<'otp' | 'password' | null>(null);
  
  // Gestion des zones sécurisées pour les appareils avec encoche
  const insets = useSafeAreaInsets();

  // Sélection du thème approprié selon le mode
  const theme = isDark ? THEMES.dark : THEMES.light;

  // Effet pour synchroniser le thème avec les changements système
  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  // Gestionnaire de sélection du mode d'authentification
  const handleModeSelect = (mode: 'otp' | 'password') => {
    setSelectedMode(mode);
    // Breve pause pour l'animation visuelle puis navigation
    setTimeout(() => {
      router.push(`/authentication?mode=${mode}`);
    }, 200);
  };

  // Gestionnaire pour le mode test (contournement de l'authentification)
  const handleTestSkip = () => {
    console.log('Navigation vers les tabs en mode test...');
    router.push('/(tabs)/accueil');
  };

  return (
    <>
      {/* Configuration de la barre de statut avec transparence */}
      <StatusBar 
        barStyle={theme.statusBarStyle} 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      {/* Container principal de l'écran */}
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* En-tête personnalisé avec navigation et logo YANKAP */}
        <View style={[styles.customHeader, { 
          paddingTop: insets.top, 
          backgroundColor: 'white',
          borderBottomColor: isDark ? '#2A2A2A' : '#E5E5E5'
        }]}>
          {/* Bouton de retour */}
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon />
          </TouchableOpacity>
          
          {/* Titre yankap au centre */}
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>yankap</Text>
          
          {/* Espace pour équilibrer le layout */}
          <View style={styles.headerButton} />
        </View>

        {/* Section de contenu principal */}
        <View style={styles.content}>
          
          {/* Section titre et sous-titre */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.textTertiary }]}>
              Authentification
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Choisissez votre méthode d'authentification préférée
            </Text>
          </View>

          {/* Section des options d'authentification */}
          <View style={styles.optionsSection}>
            
            {/* Carte option SMS/OTP */}
            <TouchableOpacity 
              style={[
                styles.optionCard, 
                { 
                  backgroundColor: theme.cardBackground,
                  borderColor: selectedMode === 'otp' ? theme.textPrimary : theme.cardBorder,
                  borderWidth: selectedMode === 'otp' ? 2 : 1, // Bordure plus épaisse si sélectionné
                }
              ]}
              onPress={() => handleModeSelect('otp')}
              activeOpacity={0.7}
            >
              {/* Icône OTP */}
              <View style={styles.optionIcon}>
                <OTPIcon />
              </View>
              
              {/* Contenu textuel de l'option */}
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: theme.textTertiary }]}>
                  Par OTP
                </Text>
              </View>
              
              {/* Indicateur de sélection (coche) */}
              <View style={[styles.optionIndicator, { 
                backgroundColor: selectedMode === 'otp' ? theme.textPrimary : 'transparent' 
              }]}>
                {selectedMode === 'otp' && (
                  <Svg width="16" height="16" viewBox="0 0 16 16">
                    <Path 
                      d="M3.5 7L7 10.5L12.5 5" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </View>
            </TouchableOpacity>

            {/* Carte option Email/Mot de passe */}
            <TouchableOpacity 
              style={[
                styles.optionCard, 
                { 
                  backgroundColor: theme.cardBackground,
                  borderColor: selectedMode === 'password' ? theme.textPrimary : theme.cardBorder,
                  borderWidth: selectedMode === 'password' ? 2 : 1, // Bordure plus épaisse si sélectionné
                }
              ]}
              onPress={() => handleModeSelect('password')}
              activeOpacity={0.7}
            >
              {/* Icône Mot de passe */}
              <View style={styles.optionIcon}>
                <PasswordIcon />
              </View>
              
              {/* Contenu textuel de l'option */}
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: theme.textTertiary }]}>
                  Par mot de passe
                </Text>
              </View>
              
              {/* Indicateur de sélection (coche) */}
              <View style={[styles.optionIndicator, { 
                backgroundColor: selectedMode === 'password' ? theme.textPrimary : 'transparent' 
              }]}>
                {selectedMode === 'password' && (
                  <Svg width="16" height="16" viewBox="0 0 16 16">
                    <Path 
                      d="M3.5 7L7 10.5L12.5 5" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section inférieure avec boutons de test pour le développement */}
        <View style={styles.bottomInfo}>
          <TouchableOpacity 
            style={[styles.testButton, { borderColor: theme.textSecondary }]}
            onPress={handleTestSkip}
            activeOpacity={0.7}
          >
            <Text style={[styles.testButtonText, { color: theme.textSecondary }]}>
              🧪 Mode Test
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.testButton, { borderColor: theme.textPrimary, marginTop: 8 }]}
            onPress={() => router.push('/component-test')}
            activeOpacity={0.7}
          >
            <Text style={[styles.testButtonText, { color: theme.textPrimary }]}>
              🧩 Composants Test
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

// Feuille de styles pour l'écran de choix d'authentification
const styles = StyleSheet.create({
  // Container principal occupant tout l'écran
  container: {
    flex: 1,
  },
  
  // En-tête personnalisé avec navigation et logo
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    minHeight: 60,
    marginHorizontal: 0,
    paddingHorizontal: 20,
  },
  
  // Style des boutons dans l'en-tête (retour et espace)
  headerButton: {
    padding: 8,
  },
  
  // Style du titre yankap dans l'en-tête
  headerTitle: {
    ...TEXT_STYLES.h2,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,          // Espacement entre les lettres
    textAlign: 'center',
  },
  
  // Container principal du contenu de la page
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',  // Centre le contenu verticalement
  },
  
  // Section titre et sous-titre
  titleSection: {
    marginBottom: 50,          // Espacement avant les options
    alignItems: 'center',
  },
  
  // Style du titre principal
  title: {
    ...TEXT_STYLES.h2,
    fontSize: 26,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 32,            // Hauteur de ligne pour la lisibilité
  },
  
  // Style du sous-titre explicatif
  subtitle: {
    ...TEXT_STYLES.body,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  
  // Container des options d'authentification
  optionsSection: {
    gap: 20,                   // Espacement entre les cartes d'options
  },
  
  // Style des cartes d'options d'authentification
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,          // Coins arrondis
    
    // Propriétés d'ombre pour iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    
    // Propriété d'élévation pour Android
    elevation: 3,
  },
  
  // Container de l'icône d'option
  optionIcon: {
    marginRight: 16,           // Espacement entre l'icône et le texte
  },
  
  // Container du contenu textuel de l'option
  optionContent: {
    flex: 1,                   // Occupe l'espace disponible
  },
  
  // Style du titre de l'option
  optionTitle: {
    ...TEXT_STYLES.h3,
    fontSize: 18,
    marginBottom: 6,
  },
  
  // Style pour les descriptions (actuellement non utilisé)
  optionDescription: {
    ...TEXT_STYLES.bodySmall,
    lineHeight: 20,
  },
  
  // Indicateur circulaire de sélection (coche)
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,          // Cercle parfait
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  
  // Section inférieure avec informations supplémentaires
  bottomInfo: {
    padding: 20,
    paddingBottom: 40,         // Espacement supplémentaire en bas
    alignItems: 'center',
  },
  
  // Style du bouton de test pour le développement
  testButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,          // Bouton arrondi
    borderStyle: 'dashed',     // Bordure en pointillés
  },
  
  // Style du texte du bouton de test
  testButtonText: {
    ...TEXT_STYLES.bodySmall,
    fontSize: 12,
    textAlign: 'center',
  },
});