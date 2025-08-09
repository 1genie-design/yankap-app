// Imports React et React Native pour l'interface utilisateur
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, useColorScheme, Animated } from 'react-native';
import { router } from 'expo-router'; // Navigation entre les écrans
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Gestion des zones sécurisées
import Svg, { Circle, Path, Rect, G } from 'react-native-svg'; // Composants SVG pour l'illustration

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
    statusBarStyle: 'dark-content' as const, // Contenu sombre de la barre de statut
    statusBarBackground: '#F5F5F5',  // Arrière-plan de la barre de statut
    buttonShadow: '#1DBAA3',         // Couleur de l'ombre des boutons
  },
  dark: {
    background: '#121212',           // Arrière-plan sombre
    textPrimary: '#1DBAA3',          // Couleur principale YANKAP conservée
    textSecondary: '#B0B0B0',        // Texte secondaire gris clair
    statusBarStyle: 'light-content' as const, // Contenu clair de la barre de statut
    statusBarBackground: '#121212',   // Arrière-plan sombre de la barre de statut
    buttonShadow: '#1DBAA3',         // Couleur de l'ombre des boutons
  },
};

// Composant d'icône de flèche animée pour le bouton de démarrage
const ArrowIcon = () => {
  // Références pour les animations de translation et d'opacité
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fonction d'animation de la flèche (mouvement de droite avec fondu)
    const animateArrow = () => {
      Animated.sequence([
        // Phase 1: Flèche se déplace vers la droite et s'estompe
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 4,           // Déplacement de 4 pixels vers la droite
            duration: 800,        // Durée de l'animation en millisecondes
            useNativeDriver: false, // Utilisation du driver JS pour la compatibilité
          }),
          Animated.timing(opacity, {
            toValue: 0.3,         // Opacité réduite à 30%
            duration: 800,
            useNativeDriver: false,
          }),
        ]),
        // Phase 2: Retour à la position et opacité initiales
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,           // Retour à la position originale
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 1,           // Opacité complète
            duration: 600,
            useNativeDriver: false,
          }),
        ]),
        // Phase 3: Pause avant la répétition de l'animation
        Animated.delay(1500),     // Attente de 1.5 seconde
      ]).start(() => animateArrow()); // Répétition infinie de l'animation
    };

    animateArrow(); // Démarrage de l'animation
  }, []);

  return (
    <View style={styles.arrowCircle}>
      <Animated.View style={{ transform: [{ translateX }], opacity }}>
        <Svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <Path 
            d="M8 1L12 5L8 9M11.5 5L1 5" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

// Composant d'illustration financière personnalisée pour l'écran de connexion YANKAP
const FinancialIllustration = ({ isDark }: { isDark: boolean }) => {
  // Adaptation des couleurs selon le thème sombre ou clair
  const phoneColor = isDark ? '#2A2A2A' : 'white';     // Couleur du téléphone
  const phoneBorder = isDark ? '#404040' : '#E0E0E0';  // Bordure du téléphone
  const screenColor = isDark ? '#1A1A1A' : '#F8F9FA';  // Couleur de l'écran
  return (
    <Svg width="280" height="200" viewBox="0 0 280 200" fill="none">
      {/* Fond avec cercles décoratifs */}
      <Circle cx="220" cy="40" r="25" fill="#1DBAA3" opacity="0.1" />
      <Circle cx="50" cy="160" r="35" fill="#1DBAA3" opacity="0.1" />
      
      {/* Smartphone principal */}
      <G>
        <Rect x="90" y="30" width="100" height="140" rx="12" fill={phoneColor} stroke={phoneBorder} strokeWidth="2"/>
        
        {/* Écran du téléphone */}
        <Rect x="100" y="45" width="80" height="110" rx="4" fill={screenColor}/>
        
        {/* Interface de l'app */}
        {/* Header */}
        <Rect x="105" y="50" width="70" height="4" rx="2" fill="#1DBAA3"/>
        
        {/* Graphique de revenus/dépenses */}
        <Path 
          d="M110 80 L120 75 L130 85 L140 70 L150 78 L160 65 L170 72" 
          stroke="#1DBAA3" 
          strokeWidth="2" 
          fill="none"
        />
        
        {/* Barres de statistiques */}
        <Rect x="110" y="95" width="12" height="20" rx="2" fill="#1DBAA3" opacity="0.7"/>
        <Rect x="125" y="100" width="12" height="15" rx="2" fill="#1DBAA3" opacity="0.5"/>
        <Rect x="140" y="90" width="12" height="25" rx="2" fill="#1DBAA3" opacity="0.8"/>
        <Rect x="155" y="105" width="12" height="10" rx="2" fill="#1DBAA3" opacity="0.4"/>
        
        {/* Boutons d'actions */}
        <Circle cx="125" cy="135" r="12" fill="#1DBAA3" opacity="0.2"/>
        <Circle cx="155" cy="135" r="12" fill="#1DBAA3" opacity="0.2"/>
        
        {/* Indicateurs de montants */}
        <Rect x="105" y="120" width="25" height="3" rx="1.5" fill="#4CAF50"/>
        <Rect x="135" y="120" width="20" height="3" rx="1.5" fill="#FF6B6B"/>
        <Rect x="160" y="120" width="15" height="3" rx="1.5" fill="#FFA726"/>
      </G>
      
      {/* Éléments flottants - Pièces de monnaie */}
      <G>
        <Circle cx="60" cy="70" r="12" fill="#FFD700" opacity="0.9"/>
        <Path d="M52 70 L68 70 M60 62 L60 78" stroke="#FFA000" strokeWidth="1.5"/>
        
        <Circle cx="210" cy="110" r="10" fill="#FFD700" opacity="0.8"/>
        <Path d="M204 110 L216 110 M210 104 L210 116" stroke="#FFA000" strokeWidth="1"/>
        
        <Circle cx="45" cy="120" r="8" fill="#FFD700" opacity="0.7"/>
        <Path d="M40 120 L50 120 M45 115 L45 125" stroke="#FFA000" strokeWidth="1"/>
      </G>
      
      {/* Flèches de transfert simples */}
      <G>
        <Path 
          d="M70 95 L80 95 L77 92 M80 95 L77 98" 
          stroke="#1DBAA3" 
          strokeWidth="2" 
          fill="none"
        />
        <Path 
          d="M200 85 L210 85 L207 82 M210 85 L207 88" 
          stroke="#1DBAA3" 
          strokeWidth="2" 
          fill="none"
        />
      </G>
      
      {/* Cartes de crédit stylisées */}
      <G>
        <Rect x="20" y="40" width="40" height="25" rx="4" fill="#1DBAA3" opacity="0.8"/>
        <Rect x="25" y="45" width="8" height="6" rx="1" fill="white" opacity="0.9"/>
        <Rect x="25" y="55" width="25" height="2" rx="1" fill="white" opacity="0.7"/>
        
        <Rect x="220" y="140" width="40" height="25" rx="4" fill="#6C63FF" opacity="0.8"/>
        <Rect x="225" y="145" width="8" height="6" rx="1" fill="white" opacity="0.9"/>
        <Rect x="225" y="155" width="25" height="2" rx="1" fill="white" opacity="0.7"/>
      </G>
    </Svg>
  );
};

// Composant principal de l'écran de connexion YANKAP
export default function LoginScreen() {
  // Détection automatique du mode sombre/clair du système
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  
  // Gestion des zones sécurisées (safe area) pour les appareils avec encoche
  const insets = useSafeAreaInsets();
  
  // Sélection du thème approprié selon le mode
  const theme = isDark ? THEMES.dark : THEMES.light;

  // Effet pour synchroniser le thème avec les changements système
  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  // Gestionnaire de navigation vers l'écran de choix d'authentification
  const handleStart = () => {
    router.push('/auth-choice');
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
        
        {/* En-tête personnalisé avec le logo YANKAP */}
        <View style={[styles.customHeader, { 
          paddingTop: insets.top, 
          backgroundColor: 'white',
          borderBottomColor: isDark ? '#2A2A2A' : '#E5E5E5'
        }]}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>yankap</Text>
        </View>

        {/* Section centrale avec l'illustration financière */}
        <View style={styles.illustrationContainer}>
          <FinancialIllustration isDark={isDark} />
        </View>

        {/* Section de contenu textuel avec description de l'app */}
        <View style={styles.content}>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Prenez le contrôle total de vos finances avec{' '}
            <Text style={[styles.highlight, { color: theme.textPrimary }]}>yankap</Text>.{'\n'}
            Suivez vos dépenses, gérez votre budget et{'\n'}
            atteignez vos objectifs financiers facilement.
          </Text>
        </View>

        {/* Section du bouton de démarrage avec animation */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.startButton, { shadowColor: theme.buttonShadow }]} 
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>démarrer</Text>
              <View style={styles.arrowContainer}>
                <ArrowIcon />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

// Feuille de styles pour l'écran de connexion
const styles = StyleSheet.create({
  // Container principal occupant tout l'écran
  container: {
    flex: 1,
  },
  
  // En-tête personnalisé avec le logo YANKAP
  customHeader: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 60,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  
  // Style du titre yankap dans l'en-tête
  headerTitle: {
    ...TEXT_STYLES.h2,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,          // Espacement entre les lettres
    textAlign: 'center',
  },
  
  // Container de l'illustration financière (zone principale)
  illustrationContainer: {
    flex: 2,                   // Occupe 2/4 de l'espace disponible
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  
  // Section du contenu textuel
  content: {
    flex: 1,                   // Occupe 1/4 de l'espace disponible
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,        // Espacement pour éviter que le bouton flottant masque le texte
  },
  
  // Style de la description de l'application
  description: {
    ...TEXT_STYLES.body,
    textAlign: 'center',
    lineHeight: 24,            // Hauteur de ligne pour la lisibilité
    paddingHorizontal: 20,
  },
  
  // Style pour mettre en évidence le nom YANKAP
  highlight: {
    fontWeight: '600',         // Poids de police semi-gras
  },
  
  // Container du bouton de démarrage (positionné en bas)
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingBottom: 40,         // Espacement supplémentaire en bas
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  
  // Style du bouton de démarrage principal
  startButton: {
    backgroundColor: '#1DBAA3', // Couleur principale YANKAP
    borderRadius: 12.5,        // Coins arrondis
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    
    // Propriétés d'ombre pour iOS
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    
    // Propriété d'élévation pour Android
    elevation: 6,
  },
  
  // Container du contenu interne du bouton
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',      // Pour le positionnement absolu de la flèche
  },
  
  // Container de la flèche animée
  arrowContainer: {
    position: 'absolute',
    right: 8,                  // Positionnée à droite du bouton
  },
  
  // Cercle de fond pour l'icône de flèche
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,          // Cercle parfait
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Blanc semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Style du texte du bouton
  buttonText: {
    ...TEXT_STYLES.button,
    fontSize: 18,
    fontWeight: '800',         // Poids de police extra-gras
    color: 'white',
    textTransform: 'lowercase', // Texte en minuscules
  },
});