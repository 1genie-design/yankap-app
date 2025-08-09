import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, useColorScheme, TouchableOpacity, Animated, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';

// Thèmes
const THEMES = {
  light: {
    background: '#F5F5F5',
    textPrimary: '#1DBAA3',
    textSecondary: '#666',
    textTertiary: '#333',
    cardBackground: 'white',
    cardBorder: '#E0E0E0',
    successColor: '#4CAF50',
    primaryLight: '#E8F8F5',
  },
  dark: {
    background: '#121212',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    cardBackground: '#1F1F1F',
    cardBorder: '#333',
    successColor: '#4CAF50',
    primaryLight: 'rgba(29, 186, 163, 0.1)',
  },
};

// Styles de texte
const TEXT_STYLES = {
  h1: { fontSize: 24, fontWeight: 'bold' },
  h2: { fontSize: 20, fontWeight: '600' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
};

// Icônes
const ArrowLeftIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WifiIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z" stroke={color} strokeWidth="2"/>
    <Path d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" stroke={color} strokeWidth="2"/>
    <Path d="M9 17l2 2c.87-.87 2.13-.87 3 0l2-2C14.12 15.12 9.88 15.12 9 17z" stroke={color} strokeWidth="2"/>
    <Circle cx="12" cy="20" r="1" fill={color}/>
  </Svg>
);

const CheckIcon = ({ color = '#4CAF50' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PackageConfirmationPage = () => {
  const colorScheme = useColorScheme();
  const theme = THEMES[colorScheme || 'light'];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Récupération des paramètres
  const params = useLocalSearchParams();
  const { packageName, packageData, packagePrice, packageValidity } = params;

  useFocusEffect(
    React.useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      return () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
      };
    }, [])
  );

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // Simulation d'une transaction
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Achat réussi !',
        `Votre forfait ${packageData} a été activé avec succès.`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/recharge')
          }
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeftIcon color={theme.textSecondary} />
          </TouchableOpacity>
          <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Confirmation d'achat</Text>
        </View>

        <View style={styles.mainContent}>
          {/* Carte du forfait */}
          <View style={[styles.packageCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <View style={styles.packageHeader}>
              <View style={[styles.packageIcon, { backgroundColor: theme.primaryLight }]}>
                <WifiIcon color={theme.textPrimary} />
              </View>
              <View style={styles.packageInfo}>
                <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{packageName}</Text>
                <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                  Valide {packageValidity}
                </Text>
              </View>
            </View>

            <View style={styles.packageDetails}>
              <Text style={[TEXT_STYLES.h1, { color: theme.textPrimary, fontWeight: '700', textAlign: 'center' }]}>
                {packageData}
              </Text>
              <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary, fontWeight: '600', textAlign: 'center', marginTop: 8 }]}>
                {parseInt(packagePrice).toLocaleString()} FCFA
              </Text>
            </View>
          </View>

          {/* Détails de la transaction */}
          <View style={[styles.transactionCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>Détails de la transaction</Text>
            
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Forfait</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>{packageName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Volume</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>{packageData}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Validité</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>{packageValidity}</Text>
            </View>
            
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>Total à payer</Text>
              <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, fontWeight: '700' }]}>
                {parseInt(packagePrice).toLocaleString()} FCFA
              </Text>
            </View>
          </View>

          {/* Information importante */}
          <View style={[styles.infoCard, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
            <CheckIcon color={theme.successColor} />
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginLeft: 8 }]}>
              Votre forfait sera activé immédiatement après le paiement
            </Text>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: 'transparent', borderColor: theme.cardBorder }]}
              onPress={() => router.back()}
            >
              <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, fontWeight: '600' }]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: theme.textPrimary }]}
              onPress={handlePurchase}
              disabled={isProcessing}
            >
              <Text style={[TEXT_STYLES.body, { color: 'white', fontWeight: '600' }]}>
                {isProcessing ? 'Traitement...' : 'Confirmer l\'achat'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  packageCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  packageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packageInfo: {
    flex: 1,
  },
  packageDetails: {
    alignItems: 'center',
  },
  transactionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
    paddingTop: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default PackageConfirmationPage;
