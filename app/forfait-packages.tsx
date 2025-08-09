import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, useColorScheme, TouchableOpacity, ScrollView, Animated, Dimensions, StatusBar, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

// Thèmes
const THEMES = {
  light: {
    background: '#F5F5F5',
    textPrimary: '#1DBAA3',
    textSecondary: '#666',
    textTertiary: '#333',
    cardBackground: 'white',
    cardBorder: '#E0E0E0',
    inputBackground: '#FFFFFF',
    inputBorder: '#E0E0E0',
    successColor: '#4CAF50',
    warningColor: '#FF9800',
    errorColor: '#F44336',
    primaryLight: '#E8F8F5',
    secondaryColor: '#444444',
    secondaryLight: '#F5F5F5',
  },
  dark: {
    background: '#121212',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    cardBackground: '#1F1F1F',
    cardBorder: '#333',
    inputBackground: '#1F1F1F',
    inputBorder: '#333',
    successColor: '#4CAF50',
    warningColor: '#FF9800',
    errorColor: '#F44336',
    primaryLight: 'rgba(29, 186, 163, 0.1)',
    secondaryColor: '#CCCCCC',
    secondaryLight: '#2A2A2A',
  },
};

// Styles de texte
const TEXT_STYLES = {
  h1: { fontSize: 24, fontWeight: 'bold' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
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
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ForfaitPackagesPage = () => {
  const colorScheme = useColorScheme();
  const theme = THEMES[colorScheme || 'light'];
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('yankap'); // yankap, credit, phone
  const [payerPhoneNumber, setPayerPhoneNumber] = useState('');
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const { width: screenWidth } = Dimensions.get('window');

  // Fonction pour charger le numéro de téléphone sauvegardé
  const loadPhoneNumber = async () => {
    try {
      const savedNumber = await AsyncStorage.getItem('lastPhoneNumber');
      if (savedNumber) {
        setPhoneNumber(savedNumber);
      }
    } catch (error) {
      console.log('Erreur lors du chargement du numéro:', error);
    }
  };

  // Charger le numéro sauvegardé au démarrage
  useEffect(() => {
    loadPhoneNumber();
  }, []);

  // Données des opérateurs pour la détection
  const operators = [
    { name: 'MTN', prefix: ['650', '651', '652', '653', '654', '680', '681', '682', '683'], logo: '🟡' },
    { name: 'Orange', prefix: ['655', '656', '657', '658', '659', '697', '698', '699'], logo: '🟠' },
    { name: 'Camtel', prefix: ['233', '242', '243'], logo: '🔵' },
    { name: 'Nextel', prefix: ['666', '667', '668'], logo: '🟣' },
    { name: 'Yoomee', prefix: ['620', '621', '622'], logo: '🟢' },
  ];

  // Options de paiement
  const paymentOptions = [
    { 
      id: 'yankap', 
      name: 'Portefeuille YANKAP', 
      type: 'Solde: 125,500 FCFA', 
      icon: '💳',
      balance: 125500
    },
    { 
      id: 'visa', 
      name: 'Visa **** 1234', 
      type: 'Carte de crédit', 
      icon: '💳',
      balance: null
    },
    { 
      id: 'mastercard', 
      name: 'MasterCard **** 5678', 
      type: 'Carte de débit', 
      icon: '💳',
      balance: null
    },
    { 
      id: 'phone', 
      name: 'Compte mobile', 
      type: 'Paiement par téléphone', 
      icon: '📱',
      balance: null
    },
  ];

  // Fonction pour détecter l'opérateur
  const detectOperator = (phone) => {
    if (phone.length < 3) return null;
    
    const prefix = phone.substring(0, 3);
    for (let i = 0; i < operators.length; i++) {
      if (operators[i].prefix.includes(prefix)) {
        return operators[i];
      }
    }
    return null;
  };

  // Fonction pour gérer l'achat
  const handlePurchase = () => {
    if (selectedPackage) {
      setTempPhoneNumber(phoneNumber || ''); // Pré-remplir avec le numéro sauvegardé s'il existe
      setPaymentMethod('yankap'); // Par défaut
      setPayerPhoneNumber('');
      setShowPaymentDropdown(false);
      setShowPhoneModal(true);
    }
  };

  // Fonction pour confirmer l'achat avec le numéro
  const confirmPurchase = async () => {
    if (tempPhoneNumber.length < 9) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de bénéficiaire valide (9 chiffres)');
      return;
    }

    if (paymentMethod === 'phone' && payerPhoneNumber.length < 9) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de payeur valide (9 chiffres)');
      return;
    }

    const detectedOperator = detectOperator(tempPhoneNumber);
    const payerOperator = paymentMethod === 'phone' ? detectOperator(payerPhoneNumber) : null;
    const selectedPaymentOption = paymentOptions.find(opt => opt.id === paymentMethod);
    
    // Sauvegarder le numéro pour la prochaine fois
    try {
      await AsyncStorage.setItem('lastPhoneNumber', tempPhoneNumber);
    } catch (error) {
      console.log('Erreur lors de la sauvegarde:', error);
    }

    setShowPhoneModal(false);
    
    let paymentInfo = '';
    switch (paymentMethod) {
      case 'yankap':
        paymentInfo = `${selectedPaymentOption?.name}\n${selectedPaymentOption?.type}`;
        break;
      case 'visa':
      case 'mastercard':
        paymentInfo = `${selectedPaymentOption?.name}\n${selectedPaymentOption?.type}`;
        break;
      case 'phone':
        paymentInfo = `+237 ${payerPhoneNumber}${payerOperator ? ` (${payerOperator.name})` : ''}`;
        break;
      default:
        paymentInfo = selectedPaymentOption?.name || 'Méthode inconnue';
    }
    
    Alert.alert(
      'Confirmation d\'achat',
      `Forfait: ${selectedPackage.name}\nVolume: ${selectedPackage.data}\nPrix: ${selectedPackage.price.toLocaleString()} FCFA\n\nBénéficiaire: +237 ${tempPhoneNumber}${detectedOperator ? ` (${detectedOperator.name})` : ''}\n\nPaiement:\n${paymentInfo}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            Alert.alert('Succès', 'Votre forfait a été acheté avec succès !');
            setSelectedPackage(null);
            setTempPhoneNumber('');
            setPayerPhoneNumber('');
            setPaymentMethod('yankap');
          }
        }
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      // Recharger le numéro de téléphone quand la page est focusée
      loadPhoneNumber();
      
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

  // Données des forfaits
  const packageCategories = [
    { id: 'tous', name: 'Tous' },
    { id: 'mtn', name: 'MTN' },
    { id: 'orange', name: 'Orange' },
    { id: 'camtel', name: 'Camtel' },
    { id: 'nextel', name: 'Nextel' },
    { id: 'yoomee', name: 'Yoomee' },
  ];

  const packages = {
    tous: [
      // MTN
      {
        id: 1,
        name: 'MTN Data 1GB',
        data: '1GB',
        price: 2000,
        validity: '7 jours',
        operator: 'MTN',
        popular: false,
      },
      {
        id: 2,
        name: 'Orange Internet 2GB',
        data: '2GB',
        price: 3500,
        validity: '15 jours',
        operator: 'Orange',
        popular: true,
      },
      {
        id: 3,
        name: 'Camtel Forfait 500MB',
        data: '500MB',
        price: 1500,
        validity: '5 jours',
        operator: 'Camtel',
        popular: false,
      },
      {
        id: 4,
        name: 'Nextel Data 3GB',
        data: '3GB',
        price: 4000,
        validity: '30 jours',
        operator: 'Nextel',
        popular: false,
      },
    ],
    mtn: [
      {
        id: 5,
        name: 'MTN Data 500MB',
        data: '500MB',
        price: 1000,
        validity: '3 jours',
        operator: 'MTN',
        popular: false,
      },
      {
        id: 6,
        name: 'MTN Data 1GB',
        data: '1GB',
        price: 2000,
        validity: '7 jours',
        operator: 'MTN',
        popular: true,
      },
      {
        id: 7,
        name: 'MTN Data 3GB',
        data: '3GB',
        price: 5000,
        validity: '15 jours',
        operator: 'MTN',
        popular: false,
      },
      {
        id: 8,
        name: 'MTN Data 7GB',
        data: '7GB',
        price: 10000,
        validity: '30 jours',
        operator: 'MTN',
        popular: false,
      },
    ],
    orange: [
      {
        id: 9,
        name: 'Orange Internet 800MB',
        data: '800MB',
        price: 1500,
        validity: '5 jours',
        operator: 'Orange',
        popular: false,
      },
      {
        id: 10,
        name: 'Orange Internet 2GB',
        data: '2GB',
        price: 3500,
        validity: '15 jours',
        operator: 'Orange',
        popular: true,
      },
      {
        id: 11,
        name: 'Orange Internet 5GB',
        data: '5GB',
        price: 7500,
        validity: '30 jours',
        operator: 'Orange',
        popular: false,
      },
      {
        id: 12,
        name: 'Orange Internet 10GB',
        data: '10GB',
        price: 12000,
        validity: '30 jours',
        operator: 'Orange',
        popular: false,
      },
    ],
    camtel: [
      {
        id: 13,
        name: 'Camtel Forfait 300MB',
        data: '300MB',
        price: 800,
        validity: '2 jours',
        operator: 'Camtel',
        popular: false,
      },
      {
        id: 14,
        name: 'Camtel Forfait 500MB',
        data: '500MB',
        price: 1500,
        validity: '5 jours',
        operator: 'Camtel',
        popular: true,
      },
      {
        id: 15,
        name: 'Camtel Forfait 1GB',
        data: '1GB',
        price: 2500,
        validity: '10 jours',
        operator: 'Camtel',
        popular: false,
      },
      {
        id: 16,
        name: 'Camtel Forfait 2GB',
        data: '2GB',
        price: 4000,
        validity: '20 jours',
        operator: 'Camtel',
        popular: false,
      },
    ],
    nextel: [
      {
        id: 17,
        name: 'Nextel Data 1GB',
        data: '1GB',
        price: 2200,
        validity: '7 jours',
        operator: 'Nextel',
        popular: false,
      },
      {
        id: 18,
        name: 'Nextel Data 3GB',
        data: '3GB',
        price: 4000,
        validity: '30 jours',
        operator: 'Nextel',
        popular: true,
      },
      {
        id: 19,
        name: 'Nextel Data 5GB',
        data: '5GB',
        price: 6500,
        validity: '30 jours',
        operator: 'Nextel',
        popular: false,
      },
      {
        id: 20,
        name: 'Nextel Data 8GB',
        data: '8GB',
        price: 9000,
        validity: '30 jours',
        operator: 'Nextel',
        popular: false,
      },
    ],
    yoomee: [
      {
        id: 21,
        name: 'Yoomee Forfait 600MB',
        data: '600MB',
        price: 1200,
        validity: '4 jours',
        operator: 'Yoomee',
        popular: false,
      },
      {
        id: 22,
        name: 'Yoomee Forfait 1.5GB',
        data: '1.5GB',
        price: 2800,
        validity: '12 jours',
        operator: 'Yoomee',
        popular: true,
      },
      {
        id: 23,
        name: 'Yoomee Forfait 4GB',
        data: '4GB',
        price: 5500,
        validity: '25 jours',
        operator: 'Yoomee',
        popular: false,
      },
      {
        id: 24,
        name: 'Yoomee Forfait 6GB',
        data: '6GB',
        price: 8000,
        validity: '30 jours',
        operator: 'Yoomee',
        popular: false,
      },
    ],
  };

  const renderPackageCard = (packageItem) => (
    <TouchableOpacity
      key={packageItem.id}
      style={[
        styles.packageCard,
        {
          backgroundColor: selectedPackage?.id === packageItem.id ? `${theme.textPrimary}15` : theme.cardBackground,
          borderColor: selectedPackage?.id === packageItem.id ? theme.textPrimary : theme.cardBorder,
          borderWidth: selectedPackage?.id === packageItem.id ? 2 : 1,
        }
      ]}
      onPress={() => {
        setSelectedPackage(packageItem);
      }}
      activeOpacity={0.7}
    >
      {/* Contenu en ligne */}
      <View style={styles.packageRow}>
        <View style={styles.packageLeftContent}>
          <Text style={[styles.packageTitle, { color: theme.textTertiary }]} numberOfLines={1}>
            {packageItem.name}
          </Text>
          <Text style={[styles.packageValidityText, { color: theme.textSecondary }]} numberOfLines={1}>
            Valable {packageItem.validity}
          </Text>
        </View>
        
        <View style={styles.packageRightContent}>
          <Text style={[styles.packageData, { color: theme.textPrimary }]} numberOfLines={1}>
            {packageItem.data}
          </Text>
          <Text style={[styles.packagePrice, { color: theme.textTertiary }]} numberOfLines={1}>
            {packageItem.price.toLocaleString()} FCFA
          </Text>
        </View>
        
        {/* Indicateur d'action */}
        <View style={[styles.packageArrow, { backgroundColor: `${theme.textPrimary}10` }]}>
          <Svg width="8" height="8" viewBox="0 0 24 24" fill="none">
            <Path 
              d="M9 18l6-6-6-6" 
              stroke={theme.textPrimary} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent={true} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Animated.View style={[styles.content, { 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }],
          paddingTop: insets.top
        }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeftIcon color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Forfaits Disponibles</Text>
            <View style={styles.headerSpacer} />
          </View>

        {/* Navigation des catégories sous forme d'onglets */}
        <ScrollView 
          style={styles.packagesScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.packagesContainer}
        >
          {/* Onglets des catégories */}
          <View style={styles.tabContainer}>
            {packageCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.tab,
                  selectedCategory === category.id && { borderBottomColor: theme.textPrimary }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.tabText,
                  { 
                    color: selectedCategory === category.id ? theme.textPrimary : theme.textSecondary,
                    fontWeight: selectedCategory === category.id ? '600' : '400'
                  }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section des forfaits */}
          <View style={styles.sectionContainer}>
            <View style={styles.packagesGrid}>
              {packages[selectedCategory]?.map(renderPackageCard)}
            </View>
          </View>
          
          {/* Espacement pour la navbar */}
          <View style={{ height: 100 }} />
        </ScrollView>
        
        {/* Bouton fixe en bas */}
        <View style={[styles.fixedBottomContainer, { backgroundColor: theme.background }]}>
          {selectedPackage ? (
            /* Résumé du forfait sélectionné */
            <View style={styles.packageSummary}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Forfait sélectionné:</Text>
                <Text style={[styles.summaryValue, { color: theme.textTertiary }]}>{selectedPackage.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Volume:</Text>
                <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{selectedPackage.data}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Prix:</Text>
                <Text style={[styles.summaryValue, { color: theme.textTertiary }]}>{selectedPackage.price.toLocaleString()} FCFA</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Validité:</Text>
                <Text style={[styles.summaryValue, { color: theme.textSecondary }]}>{selectedPackage.validity}</Text>
              </View>
            </View>
          ) : null}
          
          <TouchableOpacity
            style={[
              styles.rechargeButton,
              { 
                backgroundColor: theme.textPrimary,
                opacity: selectedPackage ? 1 : 0.5
              }
            ]}
            onPress={handlePurchase}
            disabled={!selectedPackage}
          >
            <Text style={[TEXT_STYLES.body, { color: 'white', fontWeight: '600' as const }]}>
              {selectedPackage ? 'Valider l\'achat' : 'Sélectionnez un forfait'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal pour la saisie du numéro de téléphone */}
        <Modal
          visible={showPhoneModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPhoneModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 20, textAlign: 'center' }]}>
                Achat de forfait
              </Text>

              {/* Section 1: Forfait sélectionné */}
              <View style={[styles.modalSection, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.modalSectionTitle, { color: theme.textTertiary }]}>Forfait sélectionné</Text>
                <Text style={[styles.sectionValue, { color: theme.textPrimary }]}>{selectedPackage?.name}</Text>
                <Text style={[styles.sectionSubValue, { color: theme.textSecondary }]}>
                  {selectedPackage?.data} • {selectedPackage?.price.toLocaleString()} FCFA
                </Text>
              </View>

              {/* Section 2: Numéro du bénéficiaire */}
              <View style={styles.modalSection}>
                <View style={styles.modalSectionHeader}>
                  <Text style={[styles.modalSectionTitle, { color: theme.textTertiary }]}>Numéro du bénéficiaire</Text>
                  {tempPhoneNumber.length >= 3 && detectOperator(tempPhoneNumber) && (
                    <View style={styles.operatorDisplay}>
                      <Text style={[styles.operatorIcon, { color: theme.textTertiary }]}>
                        {detectOperator(tempPhoneNumber).logo}
                      </Text>
                      <Text style={[styles.operatorName, { color: theme.textSecondary }]}>
                        {detectOperator(tempPhoneNumber).name}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={[styles.phoneInputContainer, { 
                  backgroundColor: theme.inputBackground, 
                  borderColor: theme.inputBorder,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingRight: 4
                }]}>
                  <Text style={[styles.countryCode, { color: theme.textTertiary }]}>+237</Text>
                  <TextInput
                    style={[styles.phoneInput, { 
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      color: theme.textTertiary,
                      paddingRight: 0
                    }]}
                    value={tempPhoneNumber}
                    onChangeText={setTempPhoneNumber}
                    placeholder="696123456"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    maxLength={9}
                    autoFocus={true}
                  />
                </View>
              </View>

              {/* Section 3: Méthode de paiement */}
              <View style={styles.modalSection}>
                <View style={styles.modalSectionHeader}>
                  <Text style={[styles.modalSectionTitle, { color: theme.textTertiary }]}>Paiement</Text>
                  {paymentMethod === 'phone' && payerPhoneNumber.length >= 3 && detectOperator(payerPhoneNumber) && (
                    <View style={styles.operatorDisplay}>
                      <Text style={[styles.operatorIcon, { color: theme.textTertiary }]}>
                        {detectOperator(payerPhoneNumber).logo}
                      </Text>
                      <Text style={[styles.operatorName, { color: theme.textSecondary }]}>
                        {detectOperator(payerPhoneNumber).name}
                      </Text>
                    </View>
                  )}
                </View>
                
                {paymentMethod === 'phone' ? (
                  // Mode saisie de numéro
                  <View style={[styles.phoneInputContainer, { 
                    backgroundColor: theme.inputBackground, 
                    borderColor: theme.inputBorder,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingRight: 0
                  }]}>
                    <Text style={[styles.countryCode, { color: theme.textTertiary }]}>+237</Text>
                    <TextInput
                      style={[styles.phoneInput, { 
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        color: theme.textTertiary,
                        paddingRight: 0
                      }]}
                      value={payerPhoneNumber}
                      onChangeText={setPayerPhoneNumber}
                      placeholder="696123456"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="numeric"
                      maxLength={9}
                      autoFocus={true}
                    />
                    <TouchableOpacity
                      style={styles.dropdownToggle}
                      onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}
                    >
                      <Text style={[styles.dropdownArrow, { color: theme.textSecondary }]}>
                        {showPaymentDropdown ? '▲' : '▼'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  // Mode dropdown normal
                  <TouchableOpacity
                    style={[styles.dropdownButton, { 
                      backgroundColor: theme.inputBackground, 
                      borderColor: theme.inputBorder 
                    }]}
                    onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}
                  >
                    <View style={styles.paymentMethodDisplay}>
                      <Text style={[styles.dropdownText, { color: theme.textTertiary }]}>
                        {paymentMethod ? 
                          paymentOptions.find(opt => opt.id === paymentMethod)?.icon + ' ' + 
                          paymentOptions.find(opt => opt.id === paymentMethod)?.name
                          : 'Sélectionner le mode de paiement'}
                      </Text>
                      {paymentMethod && paymentOptions.find(opt => opt.id === paymentMethod)?.type && (
                        <Text style={[styles.paymentMethodType, { color: theme.textSecondary }]}>
                          {paymentOptions.find(opt => opt.id === paymentMethod)?.type}
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.dropdownArrow, { color: theme.textSecondary }]}>
                      {showPaymentDropdown ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>
                )}

                {showPaymentDropdown && (
                  <View style={[styles.dropdownList, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
                    {paymentOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={[styles.dropdownItem, { 
                          backgroundColor: paymentMethod === option.id ? theme.primaryLight : 'transparent' 
                        }]}
                        onPress={() => {
                          setPaymentMethod(option.id);
                          setShowPaymentDropdown(false);
                          if (option.id !== 'phone') {
                            setPayerPhoneNumber('');
                          }
                        }}
                      >
                        <View style={styles.paymentOptionContent}>
                          <View style={styles.paymentOptionMain}>
                            <Text style={[styles.dropdownItemText, { color: theme.textTertiary }]}>
                              {option.icon} {option.name}
                            </Text>
                            <Text style={[styles.paymentOptionType, { color: theme.textSecondary }]}>
                              {option.type}
                            </Text>
                          </View>
                          {paymentMethod === option.id && (
                            <Text style={[styles.checkmark, { color: theme.textPrimary }]}>✓</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setShowPhoneModal(false);
                    setShowPaymentDropdown(false);
                  }}
                >
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton, { 
                    backgroundColor: theme.textPrimary,
                    opacity: (tempPhoneNumber.length >= 9 && 
                             (paymentMethod === 'yankap' || paymentMethod === 'visa' || paymentMethod === 'mastercard' || 
                              (paymentMethod === 'phone' && payerPhoneNumber.length >= 9))) ? 1 : 0.5
                  }]}
                  onPress={confirmPurchase}
                  disabled={tempPhoneNumber.length < 9 || 
                           (paymentMethod === 'phone' && payerPhoneNumber.length < 9)}
                >
                  <Text style={[TEXT_STYLES.body, { color: 'white', fontWeight: '600' }]}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </Animated.View>
    </View>
    </>
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginRight: 16,
  },
  headerSpacer: {
    width: 24, // Même largeur que l'icône pour équilibrer
  },
  
  // Onglets
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  
  // Sections
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Grille des catégories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  
  // Carte de catégorie
  categoryCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    position: 'relative',
    borderWidth: 1,
  },
  
  // Icône de catégorie
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Contenu de catégorie
  categoryContent: {
    flex: 1,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  // Flèche de catégorie
  categoryArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  
  // Grille des forfaits
  packagesGrid: {
    flexDirection: 'column',
    gap: 4,
  },
  
  // Badge du forfait
  packageBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  packageBadgeText: {
    fontSize: 8,
    fontWeight: '600',
  },
  
  // Mise en page en ligne
  packageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageLeftContent: {
    flex: 2,
  },
  packageRightContent: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 8,
  },
  
  // Icône du forfait
  packageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Contenu du forfait
  packageContent: {
    flex: 1,
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 1,
  },
  packageValidityText: {
    fontSize: 10,
    fontWeight: '400',
  },
  packageData: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 1,
  },
  packagePrice: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  
  // Flèche du forfait
  packageArrow: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesScrollView: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  packagesScrollView: {
    flex: 1,
  },
  packagesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  packageCard: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packageTitleContainer: {
    flex: 1,
  },
  packageDataContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // Bouton fixe en bas
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  packageSummary: {
    backgroundColor: 'rgba(29, 186, 163, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  rechargeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Styles du modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  modalSection: {
    marginVertical: 0,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 0,
  },
  modalSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  operatorDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operatorIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  operatorName: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubValue: {
    fontSize: 14,
    fontWeight: '400',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
    marginRight: 10,
    paddingVertical: 12,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'left',
  },
  operatorInfo: {
    alignItems: 'center',
    marginBottom: 5,
  },
  operatorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  operatorLogo: {
    fontSize: 20,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentMethodDisplay: {
    flex: 1,
  },
  paymentMethodType: {
    fontSize: 12,
    marginTop: 2,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 14,
  },
  dropdownList: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  paymentOptionMain: {
    flex: 1,
  },
  paymentOptionType: {
    fontSize: 12,
    marginTop: 2,
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  payerPhoneContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  payerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  dropdownToggle: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    marginRight: 4,
  },
  confirmButton: {
    // backgroundColor will be set dynamically
  },
});

export default ForfaitPackagesPage;
