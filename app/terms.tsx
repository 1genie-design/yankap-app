import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const BackIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Constantes
const YANKAP_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

// Thèmes
const THEMES = {
  light: {
    background: '#F5F5F5',
    textPrimary: '#1DBAA3',
    textSecondary: '#666',
    textTertiary: '#333',
    statusBarStyle: 'dark-content' as const,
    cardBackground: 'white',
    cardBorder: '#E0E0E0',
  },
  dark: {
    background: '#121212',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    statusBarStyle: 'light-content' as const,
    cardBackground: '#1F1F1F',
    cardBorder: '#333',
  },
};

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar 
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
        translucent={true}
      />
      
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.cardBorder }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <BackIcon color={theme.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.textTertiary }]}>
              Termes et Conditions
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Conditions d'utilisation YANKAP
            </Text>
          </View>
        </View>

        {/* Contenu */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* Introduction */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>
              📋 Conditions d'utilisation
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
              Version 1.0 - Août 2025
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Bienvenue sur YANKAP ! Ces termes et conditions décrivent les règles 
              et réglementations pour l'utilisation de l'application YANKAP.
            </Text>
          </View>

          {/* Section 1 */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>
              1. Acceptation des Termes
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              En accédant et en utilisant cette application, vous acceptez d'être lié par les 
              termes et conditions. N'utilisez pas YANKAP si vous n'acceptez pas 
              tous les termes et conditions énoncés sur cette page.
            </Text>
          </View>

          {/* Section 2 */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>
              2. Utilisation de l'Application
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Vous vous engagez à utiliser YANKAP de manière responsable :
              {'\n'}• Ne pas enfreindre les lois locales ou internationales
              {'\n'}• Ne pas compromettre la sécurité de l'application
              {'\n'}• Respecter les droits d'autres utilisateurs
            </Text>
          </View>

          {/* Section 3 */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>
              3. Protection des Données
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Nous prenons la protection de vos données très au sérieux :
              {'\n'}• Chiffrement de toutes les données sensibles
              {'\n'}• Stockage sécurisé des informations personnelles
              {'\n'}• Accès limité aux données autorisées uniquement
              {'\n'}• Conformité aux réglementations de protection des données
            </Text>
          </View>

          {/* Section 4 */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>
              4. Services Financiers
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              YANKAP fournit une plateforme pour la gestion des tontines et services financiers. 
              Vous comprenez que :
              {'\n'}• Les transactions sont sujettes aux conditions bancaires
              {'\n'}• Les frais peuvent s'appliquer selon votre utilisation
              {'\n'}• La responsabilité financière vous incombe
              {'\n\n'}Les services sont fournis "en l'état" et nous nous réservons 
              le droit de modifier ou d'interrompre les services à tout moment.
            </Text>
          </View>

          {/* Section 5 */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>
              5. Responsabilités
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Nous nous engageons à :
              {'\n'}• Maintenir la sécurité de nos systèmes
              {'\n'}• Protéger vos données personnelles
              {'\n'}• Assurer la disponibilité des services
              {'\n'}• Fourniture d'un service de qualité
              {'\n'}• Support client réactif
            </Text>
          </View>

          {/* Section 6 */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>
              6. Limitation de Responsabilité
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              YANKAP ne pourra être tenue responsable des :
              {'\n'}• Pertes financières indirectes
              {'\n'}• Interruptions de service temporaires
              {'\n'}• Actions de tiers
              {'\n'}• Erreurs ou omissions dans le contenu
              {'\n'}• Problèmes techniques temporaires
            </Text>
          </View>

          {/* Section 7 */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.textTertiary }]}>
              7. Modifications des Termes
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Nous pouvons réviser ces termes à tout moment en mettant à jour 
              cette page. Vous serez averti des changements importants.
              {'\n\n'}La poursuite de l'utilisation après notification constitue 
              l'acceptation des nouveaux termes.
            </Text>
          </View>

          {/* Contact */}
          <View style={[styles.card, { backgroundColor: theme.textPrimary, borderColor: theme.textPrimary }]}>
            <Text style={[styles.cardTitle, { color: 'white' }]}>
              📞 Contact
            </Text>
            <Text style={[styles.cardSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>
              Pour toute question concernant ces termes
            </Text>
            <Text style={[styles.description, { color: 'rgba(255,255,255,0.9)' }]}>
              Email : legal@yankap.com
              {'\n'}Téléphone : +223 XX XX XX XX
              {'\n'}Adresse : Bamako, Mali
              {'\n\n'}Notre équipe support est disponible du lundi au vendredi, 
              de 8h à 18h (GMT+1).
            </Text>
          </View>

        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});