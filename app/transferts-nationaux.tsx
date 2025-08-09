import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  useColorScheme,
  StatusBar,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, G, Polygon, Line } from 'react-native-svg';
import { TEXT_STYLES } from './index';

// Thèmes YANKAP cohérents
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
    divider: '#E8E8E8',
    primaryLight: '#E8F8F5',
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
    divider: '#333',
    primaryLight: 'rgba(29, 186, 163, 0.1)',
  },
};

const TransfertsPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [isExpress, setIsExpress] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const theme = THEMES[colorScheme || 'light'];

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

  // Icônes SVG
  const ArrowLeftIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const SendIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const GlobeIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M2 12h20" stroke={color} strokeWidth="2"/>
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const ClockIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CheckIcon = ({ color = theme.successColor }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const UserIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2"/>
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
    </Svg>
  );

  const MapPinIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="2"/>
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const CreditCardIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="1" y1="10" x2="23" y2="10" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const ShieldIcon = ({ color = theme.successColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ZapIcon = ({ color = theme.warningColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  // Données des pays disponibles
  const countries = [
    {
      id: 0,
      name: 'France',
      code: 'FR',
      flag: '🇫🇷',
      currency: 'EUR',
      exchangeRate: 655.957,
      fees: { standard: 2500, express: 4500 },
      deliveryTime: { standard: '2-4 jours', express: '24h' },
      partnerLogos: ['Western Union', 'MoneyGram', 'Ria']
    },
    {
      id: 1,
      name: 'États-Unis',
      code: 'US',
      flag: '🇺🇸',
      currency: 'USD',
      exchangeRate: 590.25,
      fees: { standard: 3000, express: 5500 },
      deliveryTime: { standard: '3-5 jours', express: '24-48h' },
      partnerLogos: ['Western Union', 'MoneyGram', 'Remitly']
    },
    {
      id: 2,
      name: 'Canada',
      code: 'CA',
      flag: '🇨🇦',
      currency: 'CAD',
      exchangeRate: 435.80,
      fees: { standard: 2800, express: 5000 },
      deliveryTime: { standard: '2-4 jours', express: '24h' },
      partnerLogos: ['Western Union', 'MoneyGram', 'Wise']
    },
    {
      id: 3,
      name: 'Royaume-Uni',
      code: 'GB',
      flag: '🇬🇧',
      currency: 'GBP',
      exchangeRate: 750.42,
      fees: { standard: 2200, express: 4200 },
      deliveryTime: { standard: '1-3 jours', express: '2-6h' },
      partnerLogos: ['Western Union', 'Wise', 'Remitly']
    },
    {
      id: 4,
      name: 'Allemagne',
      code: 'DE',
      flag: '🇩🇪',
      currency: 'EUR',
      exchangeRate: 655.957,
      fees: { standard: 2500, express: 4500 },
      deliveryTime: { standard: '2-4 jours', express: '24h' },
      partnerLogos: ['Western Union', 'MoneyGram', 'Wise']
    },
    {
      id: 5,
      name: 'Suisse',
      code: 'CH',
      flag: '🇨🇭',
      currency: 'CHF',
      exchangeRate: 642.15,
      fees: { standard: 3200, express: 5800 },
      deliveryTime: { standard: '2-4 jours', express: '24h' },
      partnerLogos: ['Western Union', 'MoneyGram', 'Wise']
    }
  ];

  // Données des transferts récents
  const [recentTransfers, setRecentTransfers] = useState([
    {
      id: 1,
      recipient: 'Marie Dubois',
      country: 'France',
      flag: '🇫🇷',
      amount: 50000,
      currency: 'EUR',
      convertedAmount: 76.2,
      date: '2024-08-07',
      status: 'Livré',
      reference: 'TR001234567',
      deliveryTime: 'Express'
    },
    {
      id: 2,
      recipient: 'John Smith',
      country: 'États-Unis',
      flag: '🇺🇸',
      amount: 100000,
      currency: 'USD',
      convertedAmount: 169.4,
      date: '2024-08-05',
      status: 'En transit',
      reference: 'TR001234568',
      deliveryTime: 'Standard'
    },
    {
      id: 3,
      recipient: 'Pierre Martin',
      country: 'Canada',
      flag: '🇨🇦',
      amount: 75000,
      currency: 'CAD',
      convertedAmount: 172.1,
      date: '2024-08-03',
      status: 'Livré',
      reference: 'TR001234569',
      deliveryTime: 'Express'
    },
    {
      id: 4,
      recipient: 'Emma Johnson',
      country: 'Royaume-Uni',
      flag: '🇬🇧',
      amount: 120000,
      currency: 'GBP',
      convertedAmount: 159.9,
      date: '2024-08-01',
      status: 'Livré',
      reference: 'TR001234570',
      deliveryTime: 'Standard'
    }
  ]);

  const selectedCountryData = countries[selectedCountry];
  const fees = isExpress ? selectedCountryData.fees.express : selectedCountryData.fees.standard;
  const deliveryTime = isExpress ? selectedCountryData.deliveryTime.express : selectedCountryData.deliveryTime.standard;

  const calculateConversion = (amountFCFA) => {
    if (!amountFCFA || amountFCFA === '') return 0;
    const numAmount = parseFloat(amountFCFA);
    return (numAmount / selectedCountryData.exchangeRate).toFixed(2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Livré': return theme.successColor;
      case 'En transit': return theme.warningColor;
      case 'En attente': return theme.textSecondary;
      case 'Annulé': return theme.errorColor;
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Livré': return <CheckIcon color={theme.successColor} />;
      case 'En transit': return <ClockIcon color={theme.warningColor} />;
      case 'En attente': return <ClockIcon color={theme.textSecondary} />;
      case 'Annulé': return <CheckIcon color={theme.errorColor} />;
      default: return <ClockIcon color={theme.textSecondary} />;
    }
  };

  const handleSendTransfer = () => {
    if (!amount || !recipientName || !recipientPhone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    const amountValue = parseFloat(amount);
    const totalCost = amountValue + fees;
    const convertedAmount = calculateConversion(amountValue);
    
    Alert.alert(
      'Confirmer le transfert',
      `Envoyer ${amountValue.toLocaleString()} FCFA (${convertedAmount} ${selectedCountryData.currency}) à ${recipientName} en ${selectedCountryData.name}?\n\nFrais: ${fees.toLocaleString()} FCFA\nTotal: ${totalCost.toLocaleString()} FCFA\nDélai: ${deliveryTime}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            Alert.alert('Succès', 'Transfert initié avec succès! Vous recevrez une confirmation par SMS.');
            // Reset form
            setAmount('');
            setRecipientName('');
            setRecipientPhone('');
            setRecipientAddress('');
            setTransferReason('');
          }
        }
      ]
    );
  };

  const renderSendTransfer = () => (
    <View style={styles.tabContent}>
      {/* Sélection du pays */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.cardHeader}>
          <GlobeIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 8 }]}>Pays de destination</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countrySelector}>
          {countries.map((country) => (
            <TouchableOpacity
              key={country.id}
              style={[
                styles.countryCard,
                {
                  backgroundColor: selectedCountry === country.id ? theme.primaryLight : theme.cardBackground,
                  borderColor: selectedCountry === country.id ? theme.textPrimary : theme.cardBorder
                }
              ]}
              onPress={() => setSelectedCountry(country.id)}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginTop: 4, textAlign: 'center' }]}>
                {country.name}
              </Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, fontSize: 10 }]}>
                1 {country.currency} = {country.exchangeRate.toFixed(0)} FCFA
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Formulaire de transfert */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.cardHeader}>
          <SendIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 8 }]}>Informations du transfert</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Montant à envoyer (FCFA) *
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.inputBackground, 
                color: theme.textTertiary, 
                borderColor: theme.inputBorder 
              }
            ]}
            placeholder="Ex: 100000"
            placeholderTextColor={theme.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          {amount && (
            <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, marginTop: 4 }]}>
              ≈ {calculateConversion(amount)} {selectedCountryData.currency}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Nom complet du destinataire *
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.inputBackground, 
                color: theme.textTertiary, 
                borderColor: theme.inputBorder 
              }
            ]}
            placeholder="Prénom et nom"
            placeholderTextColor={theme.textSecondary}
            value={recipientName}
            onChangeText={setRecipientName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Numéro de téléphone *
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.inputBackground, 
                color: theme.textTertiary, 
                borderColor: theme.inputBorder 
              }
            ]}
            placeholder="Numéro du destinataire"
            placeholderTextColor={theme.textSecondary}
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Adresse complète
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.inputBackground, 
                color: theme.textTertiary, 
                borderColor: theme.inputBorder,
                height: 80,
                textAlignVertical: 'top'
              }
            ]}
            placeholder="Adresse du destinataire..."
            placeholderTextColor={theme.textSecondary}
            value={recipientAddress}
            onChangeText={setRecipientAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Motif du transfert
          </Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.inputBackground, 
                color: theme.textTertiary, 
                borderColor: theme.inputBorder 
              }
            ]}
            placeholder="Ex: Soutien familial, frais d'études..."
            placeholderTextColor={theme.textSecondary}
            value={transferReason}
            onChangeText={setTransferReason}
          />
        </View>
      </View>

      {/* Options de livraison */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>Options de livraison</Text>
        
        <View style={styles.deliveryOptions}>
          <TouchableOpacity
            style={[
              styles.deliveryOption,
              {
                backgroundColor: !isExpress ? theme.primaryLight : 'transparent',
                borderColor: !isExpress ? theme.textPrimary : theme.cardBorder
              }
            ]}
            onPress={() => setIsExpress(false)}
          >
            <View style={styles.deliveryHeader}>
              <ClockIcon color={theme.textPrimary} />
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, marginLeft: 8 }]}>Standard</Text>
            </View>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginVertical: 4 }]}>
              {selectedCountryData.deliveryTime.standard}
            </Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
              {selectedCountryData.fees.standard.toLocaleString()} FCFA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deliveryOption,
              {
                backgroundColor: isExpress ? theme.primaryLight : 'transparent',
                borderColor: isExpress ? theme.textPrimary : theme.cardBorder
              }
            ]}
            onPress={() => setIsExpress(true)}
          >
            <View style={styles.deliveryHeader}>
              <ZapIcon color={theme.warningColor} />
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, marginLeft: 8 }]}>Express</Text>
            </View>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginVertical: 4 }]}>
              {selectedCountryData.deliveryTime.express}
            </Text>
            <Text style={[TEXT_STYLES.body, { color: theme.warningColor, fontWeight: '600' }]}>
              {selectedCountryData.fees.express.toLocaleString()} FCFA
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Résumé du coût */}
      {amount && (
        <View style={[styles.costSummary, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
          <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, marginBottom: 12 }]}>Résumé</Text>
          
          <View style={styles.costRow}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Montant</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
              {parseFloat(amount).toLocaleString()} FCFA
            </Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Frais de transfert</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
              {fees.toLocaleString()} FCFA
            </Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Total à débiter</Text>
            <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, fontWeight: '600' }]}>
              {(parseFloat(amount) + fees).toLocaleString()} FCFA
            </Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Le destinataire recevra</Text>
            <Text style={[TEXT_STYLES.h3, { color: theme.successColor, fontWeight: '600' }]}>
              {calculateConversion(amount)} {selectedCountryData.currency}
            </Text>
          </View>
        </View>
      )}

      {/* Bouton d'envoi */}
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: theme.textPrimary }]}
        onPress={handleSendTransfer}
      >
        <SendIcon color="white" />
        <Text style={[TEXT_STYLES.button, { color: 'white', marginLeft: 8 }]}>Envoyer le transfert</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      {/* En-tête */}
      <View style={[styles.historyHeader, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
        <SendIcon color={theme.textPrimary} />
        <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, marginLeft: 8 }]}>
          Historique des transferts internationaux
        </Text>
      </View>

      {/* Liste des transferts */}
      {recentTransfers.map((transfer) => (
        <View key={transfer.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.transferHeader}>
            <View style={styles.transferMainInfo}>
              <View style={styles.transferTitleRow}>
                <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{transfer.recipient}</Text>
                <Text style={styles.countryFlag}>{transfer.flag}</Text>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                {transfer.country} • {new Date(transfer.date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.transferAmount}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, fontWeight: '600' }]}>
                {transfer.amount.toLocaleString()} FCFA
              </Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, textAlign: 'right' }]}>
                ≈ {transfer.convertedAmount} {transfer.currency}
              </Text>
            </View>
          </View>

          <View style={[styles.transferDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Référence</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontFamily: 'monospace' }]}>
                {transfer.reference}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Type de livraison</Text>
              <View style={styles.deliveryTypeContainer}>
                {transfer.deliveryTime === 'Express' ? (
                  <ZapIcon color={theme.warningColor} />
                ) : (
                  <ClockIcon color={theme.textSecondary} />
                )}
                <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, marginLeft: 4 }]}>
                  {transfer.deliveryTime}
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Statut</Text>
              <View style={styles.statusContainer}>
                {getStatusIcon(transfer.status)}
                <Text style={[TEXT_STYLES.body, { color: getStatusColor(transfer.status), marginLeft: 4 }]}>
                  {transfer.status}
                </Text>
              </View>
            </View>
          </View>

          {transfer.status === 'En transit' && (
            <TouchableOpacity
              style={[styles.trackButton, { backgroundColor: theme.warningColor }]}
              onPress={() => Alert.alert('Suivi', `Transfert ${transfer.reference} en cours de livraison.`)}
            >
              <MapPinIcon color="white" />
              <Text style={[TEXT_STYLES.caption, { color: 'white', marginLeft: 4 }]}>Suivre</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderInfo = () => (
    <View style={styles.tabContent}>
      {/* Partenaires */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.cardHeader}>
          <ShieldIcon color={theme.successColor} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 8 }]}>Nos partenaires de confiance</Text>
        </View>
        
        <View style={styles.partnersGrid}>
          {selectedCountryData.partnerLogos.map((partner, index) => (
            <View key={index} style={[styles.partnerCard, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
              <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600', textAlign: 'center' }]}>
                {partner}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Informations de sécurité */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>Sécurité et réglementation</Text>
        
        <View style={styles.securityItem}>
          <ShieldIcon color={theme.successColor} />
          <View style={styles.securityText}>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>Transferts sécurisés</Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
              Tous nos transferts sont protégés par un cryptage de niveau bancaire
            </Text>
          </View>
        </View>

        <View style={styles.securityItem}>
          <CheckIcon color={theme.successColor} />
          <View style={styles.securityText}>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>Conformité réglementaire</Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
              Agréé par les autorités financières du Cameroun et des pays destinataires
            </Text>
          </View>
        </View>

        <View style={styles.securityItem}>
          <CreditCardIcon color={theme.textPrimary} />
          <View style={styles.securityText}>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>Garantie de remboursement</Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
              Remboursement intégral en cas de problème de livraison
            </Text>
          </View>
        </View>
      </View>

      {/* Taux de change */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>Taux de change du jour</Text>
        
        {countries.map((country) => (
          <View key={country.id} style={styles.exchangeRateItem}>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyFlag}>{country.flag}</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, marginLeft: 8 }]}>
                1 {country.currency}
              </Text>
            </View>
            <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
              {country.exchangeRate.toFixed(2)} FCFA
            </Text>
          </View>
        ))}
        
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 12, textAlign: 'center' }]}>
          Taux mis à jour le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* FAQ rapide */}
      <View style={[styles.card, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, marginBottom: 16 }]}>💡 Questions fréquentes</Text>
        
        <View style={styles.faqItem}>
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
            Quel est le délai de livraison ?
          </Text>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 4 }]}>
            2-4 jours en mode standard, 24h en mode express selon le pays de destination.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
            Y a-t-il une limite de montant ?
          </Text>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 4 }]}>
            Minimum 10,000 FCFA, maximum 2,000,000 FCFA par transfert selon la réglementation.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
            Comment suivre mon transfert ?
          </Text>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 4 }]}>
            Vous recevrez un SMS avec le numéro de suivi et pourrez vérifier le statut dans l'historique.
          </Text>
        </View>
      </View>
    </View>
  );

  const tabs = [
    { name: 'Envoyer', render: renderSendTransfer },
    { name: 'Historique', render: renderHistory },
    { name: 'Informations', render: renderInfo },
  ];

  return (
    <>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Transferts internationaux</Text>
          </View>



          {/* Tab Navigation */}
          <View style={[styles.tabContainer, { borderBottomColor: theme.cardBorder }]}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tab,
                  activeTab === index && { borderBottomColor: theme.textPrimary }
                ]}
                onPress={() => setActiveTab(index)}
              >
                <Text style={[
                  TEXT_STYLES.caption,
                  { 
                    color: activeTab === index ? theme.textPrimary : theme.textSecondary,
                    fontWeight: activeTab === index ? '600' : '400'
                  }
                ]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {tabs[activeTab].render()}
            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
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
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  infoBanner: {
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1DBAA3',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countrySelector: {
    marginHorizontal: -4,
  },
  countryCard: {
    width: 100,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  deliveryOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  deliveryOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costSummary: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  transferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transferMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  transferTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transferAmount: {
    alignItems: 'flex-end',
  },
  transferDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  deliveryTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  partnersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  partnerCard: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  securityText: {
    flex: 1,
    marginLeft: 12,
  },
  exchangeRateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyFlag: {
    fontSize: 20,
  },
  faqItem: {
    marginBottom: 16,
  },
});

export default TransfertsPage;
