import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, Animated, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { TEXT_STYLES } from './index';

// Thèmes YANKAP
const THEMES = {
  light: {
    background: '#F5F5F5',
    textPrimary: '#666666',
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
  },
  dark: {
    background: '#121212',
    textPrimary: '#666666',
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
  },
};

// Icônes SVG
const ArrowLeftIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowUpIcon = ({ color = '#4CAF50' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M7 17l5-5 5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 12V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowDownIcon = ({ color = '#F44336' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M17 7l-5 5-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 12v9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ExchangeIcon = ({ color = '#FF9800' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M16 3l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 7H4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 21l-4-4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 17h16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ color = '#4CAF50' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ color = '#FF9800' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const XIcon = ({ color = '#F44336' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CopyIcon = ({ color = '#666' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke={color} strokeWidth="2" />
    <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={color} strokeWidth="2" />
  </Svg>
);

// Sector-specific icons for merchant payments
const RestaurantIcon = ({ color = '#666666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z" fill={color} />
    <Path d="M16 6v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill={color} />
  </Svg>
);

const PharmacyIcon = ({ color = '#666666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M21 5h-2.64l1.14-3.14L17.15 1l-1.46 4H3v2l2 6-2 6v2h18v-2l-2-6 2-6V5zM12 15h-2v2h-2v-2H6v-2h2v-2h2v2h2v2z" fill={color} />
  </Svg>
);

const ShoppingIcon = ({ color = '#666666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M7 4V2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2h5v2h-2v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6H2V4h5zM9 4h6V2H9v2z" fill={color} />
  </Svg>
);

const ServiceIcon = ({ color = '#666666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill={color} />
  </Svg>
);

const TransportIcon = ({ color = '#666666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill={color} />
  </Svg>
);

const getSectorIcon = (recipient: string) => {
  const name = recipient.toLowerCase();
  if (name.includes('restaurant') || name.includes('cafe') || name.includes('food')) {
    return RestaurantIcon;
  } else if (name.includes('pharmacie') || name.includes('pharmacy') || name.includes('medic')) {
    return PharmacyIcon;
  } else if (name.includes('boutique') || name.includes('shop') || name.includes('store') || name.includes('market')) {
    return ShoppingIcon;
  } else if (name.includes('transport') || name.includes('taxi') || name.includes('moto')) {
    return TransportIcon;
  } else {
    return ServiceIcon;
  }
};

const ReceiptIcon = ({ color = '#666' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2V8z" stroke={color} strokeWidth="2" />
    <Path d="M9 8h6M9 12h6M9 16h6" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const ShareIcon = ({ color = '#666' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2" />
    <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth="2" />
  </Svg>
);

// Données de transaction détaillées fictives
const getTransactionDetails = (id: string) => {
  const baseTransactions = {
    '1': {
      id: '1',
      type: 'received',
      title: 'Reçu de Marie Dupont',
      description: 'Remboursement restaurant',
      amount: '+2 500',
      currency: 'XAF',
      date: '14:30',
      fullDate: 'Aujourd\'hui, 14:30',
      status: 'completed',
      category: 'Transfert',
      reference: 'TXN-2024-001-YKP',
      fromAccount: 'Marie Dupont',
      fromPhone: '+237 6XX XXX 789',
      toAccount: 'Mon compte YANKAP',
      toPhone: '+237 6XX XXX 123',
      fees: '0',
      exchangeRate: null,
      method: 'Transfert P2P',
      network: 'YANKAP',
      location: 'Yaoundé, Cameroun',
    },
    '2': {
      id: '2',
      type: 'sent',
      title: 'Envoyé à Jean Tontine',
      description: 'Contribution tontine #3',
      amount: '-15 000',
      currency: 'XAF',
      date: '12:15',
      fullDate: 'Aujourd\'hui, 12:15',
      status: 'completed',
      category: 'Tontine',
      reference: 'TXN-2024-002-YKP',
      fromAccount: 'Mon compte YANKAP',
      fromPhone: '+237 6XX XXX 123',
      toAccount: 'Jean Tontine',
      toPhone: '+237 6XX XXX 456',
      fees: '75',
      exchangeRate: null,
      method: 'Transfert Tontine',
      network: 'YANKAP',
      location: 'Douala, Cameroun',
    },
    '3': {
      id: '3',
      type: 'exchange',
      title: 'Change de devise',
      description: 'XAF vers EUR',
      amount: '-50 000',
      currency: 'XAF',
      date: '10:45',
      fullDate: 'Aujourd\'hui, 10:45',
      status: 'pending',
      category: 'Change',
      reference: 'TXN-2024-003-YKP',
      fromAccount: 'Mon compte XAF',
      fromPhone: '+237 6XX XXX 123',
      toAccount: 'Mon compte EUR',
      toPhone: '+237 6XX XXX 123',
      fees: '500',
      exchangeRate: '1 EUR = 655.957 XAF',
      method: 'Change automatique',
      network: 'YANKAP Exchange',
      location: 'Service en ligne',
    },
  };

  return baseTransactions[id] || baseTransactions['1'];
};

export default function TransactionDetailScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Use passed parameters or fallback to hardcoded data
  const transaction = params.recipient ? {
    id: params.id as string,
    type: params.type as string || 'payment',
    title: `Paiement à ${params.recipient}`,
    description: 'Paiement marchand',
    amount: params.amount as string,
    currency: 'XAF',
    date: params.date as string,
    fullDate: params.date as string,
    status: params.status as string || 'completed',
    category: 'Paiement',
    reference: `PAY-2024-${params.id}-YKP`,
    fromAccount: 'Mon compte YANKAP',
    fromPhone: '+237 6XX XXX 123',
    toAccount: params.recipient as string,
    toPhone: params.phone as string,
    fees: '0',
    exchangeRate: null,
    method: 'Paiement marchand',
    network: 'YANKAP',
    location: 'Yaoundé, Cameroun',
  } : getTransactionDetails(params.id as string);

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fonction pour obtenir l'icône selon le type de transaction
  const getTransactionIcon = (type: string) => {
    // For merchant payments, use sector-specific icons
    if (type === 'payment' && transaction.category === 'Paiement' && params.recipient) {
      const SectorIcon = getSectorIcon(params.recipient as string);
      return <SectorIcon color='#666666' />;
    }
    
    switch (type) {
      case 'received':
        return <ArrowUpIcon color={theme.successColor} />;
      case 'sent':
        return <ArrowDownIcon color={theme.errorColor} />;
      case 'exchange':
        return <ExchangeIcon color={theme.warningColor} />;
      default:
        return <ExchangeIcon color={theme.textSecondary} />;
    }
  };

  // Fonction pour obtenir la couleur du montant
  const getAmountColor = (type: string) => {
    // For merchant payments, use gray color for consistency
    if (type === 'payment' && transaction.category === 'Paiement' && params.recipient) {
      return '#666666';
    }
    
    switch (type) {
      case 'received':
        return theme.successColor;
      case 'sent':
        return theme.errorColor;
      case 'exchange':
        return theme.warningColor;
      default:
        return theme.textTertiary;
    }
  };

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'completed': { icon: CheckIcon, color: theme.successColor, text: 'Terminé' },
      'Réussi': { icon: CheckIcon, color: theme.successColor, text: 'Réussi' },
      'pending': { icon: ClockIcon, color: theme.warningColor, text: 'En cours' },
      'En cours': { icon: ClockIcon, color: theme.warningColor, text: 'En cours' },
      'failed': { icon: XIcon, color: theme.errorColor, text: 'Échoué' },
      'Échoué': { icon: XIcon, color: theme.errorColor, text: 'Échoué' },
    };

    const config = statusConfig[status] || statusConfig['En cours'];
    const StatusIcon = config.icon;

    return (
      <View style={[styles.statusBadge, { backgroundColor: `${config.color}15` }]}>
        <StatusIcon color={config.color} />
        <Text style={[styles.statusText, { color: config.color }]}>
          {config.text}
        </Text>
      </View>
    );
  };  const handleGoBack = () => {
    router.back();
  };

  const handleCopyReference = () => {
    // Logique de copie de la référence
    console.log('Référence copiée:', transaction.reference);
  };

  const handleDownloadReceipt = () => {
    // Logique de téléchargement du reçu
    console.log('Téléchargement du reçu');
  };

  const handleShareTransaction = () => {
    // Logique de partage
    console.log('Partage de la transaction');
  };

  return (
    <>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      <Animated.View 
        style={[
          styles.container, 
          { 
            backgroundColor: theme.background,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Header avec bouton retour */}
        <View style={[styles.header, { borderBottomColor: theme.divider }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <ArrowLeftIcon color={theme.textPrimary} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Détails de la transaction
          </Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.cardBackground }]}
              onPress={handleShareTransaction}
            >
              <ShareIcon color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
        >
          {/* Section principale avec icône et montant */}
          <View style={[styles.mainSection, { backgroundColor: theme.cardBackground }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${getAmountColor(transaction.type)}15` }]}>
              {getTransactionIcon(transaction.type)}
            </View>
            
            <Text style={[styles.transactionTitle, { color: theme.textTertiary }]}>
              {transaction.title}
            </Text>
            
            <Text style={[styles.transactionDescription, { color: theme.textSecondary }]}>
              {transaction.description}
            </Text>
            
            <View style={styles.amountContainer}>
              <Text style={[styles.currency, { color: theme.textSecondary }]}>
                {transaction.currency}
              </Text>
              <Text style={[styles.amount, { color: getAmountColor(transaction.type) }]}>
                {transaction.amount}
              </Text>
            </View>
            
            <View style={styles.statusContainer}>
              {getStatusBadge(transaction.status)}
            </View>
          </View>

          {/* Carte reçu PDF unifiée */}
          <View style={[styles.receiptCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            {/* En-tête du reçu */}
            <View style={[styles.receiptHeader, { borderBottomColor: theme.divider }]}>
              <Text style={[styles.receiptTitle, { color: theme.textPrimary }]}>
                REÇU DE TRANSACTION
              </Text>
              <Text style={[styles.receiptSubtitle, { color: theme.textSecondary }]}>
                YANKAP - Service de paiement mobile
              </Text>
            </View>

            {/* Informations principales */}
            <View style={[styles.receiptSection, { borderBottomColor: theme.divider }]}>
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Référence :</Text>
                <View style={styles.receiptValueWithAction}>
                  <Text style={[styles.receiptValue, { color: theme.textTertiary }]}>
                    {transaction.reference}
                  </Text>
                  <TouchableOpacity onPress={handleCopyReference} style={styles.copyButton}>
                    <CopyIcon color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Date :</Text>
                <Text style={[styles.receiptValue, { color: theme.textTertiary }]}>
                  {transaction.fullDate}
                </Text>
              </View>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Statut :</Text>
                <View style={styles.receiptStatusBadge}>
                  {getStatusBadge(transaction.status)}
                </View>
              </View>
            </View>

            {/* Détails de la transaction */}
            <View style={[styles.receiptSection, { borderBottomColor: theme.divider }]}>
              <Text style={[styles.receiptSectionTitle, { color: theme.textPrimary }]}>
                DÉTAILS DE LA TRANSACTION
              </Text>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Type :</Text>
                <Text style={[styles.receiptValue, { color: theme.textTertiary }]}>
                  {transaction.category}
                </Text>
              </View>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Méthode :</Text>
                <Text style={[styles.receiptValue, { color: theme.textTertiary }]}>
                  {transaction.method}
                </Text>
              </View>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Réseau :</Text>
                <Text style={[styles.receiptValue, { color: theme.textTertiary }]}>
                  {transaction.network}
                </Text>
              </View>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Localisation :</Text>
                <Text style={[styles.receiptValue, { color: theme.textTertiary }]}>
                  {transaction.location}
                </Text>
              </View>
            </View>

            {/* Comptes impliqués */}
            <View style={[styles.receiptSection, { borderBottomColor: theme.divider }]}>
              <Text style={[styles.receiptSectionTitle, { color: theme.textPrimary }]}>
                COMPTES IMPLIQUÉS
              </Text>
              
              <View style={styles.receiptAccountBlock}>
                <Text style={[styles.receiptAccountLabel, { color: theme.textSecondary }]}>DE :</Text>
                <Text style={[styles.receiptAccountName, { color: theme.textTertiary }]}>
                  {transaction.fromAccount}
                </Text>
                <Text style={[styles.receiptAccountPhone, { color: theme.textSecondary }]}>
                  {transaction.fromPhone}
                </Text>
              </View>
              
              <View style={styles.receiptAccountBlock}>
                <Text style={[styles.receiptAccountLabel, { color: theme.textSecondary }]}>VERS :</Text>
                <Text style={[styles.receiptAccountName, { color: theme.textTertiary }]}>
                  {transaction.toAccount}
                </Text>
                <Text style={[styles.receiptAccountPhone, { color: theme.textSecondary }]}>
                  {transaction.toPhone}
                </Text>
              </View>
            </View>

            {/* Montants et frais */}
            <View style={[styles.receiptSection, { borderBottomColor: theme.divider }]}>
              <Text style={[styles.receiptSectionTitle, { color: theme.textPrimary }]}>
                RÉSUMÉ FINANCIER
              </Text>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Montant :</Text>
                <Text style={[styles.receiptAmountValue, { color: getAmountColor(transaction.type) }]}>
                  {transaction.amount} {transaction.currency}
                </Text>
              </View>
              
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Frais :</Text>
                <Text style={[styles.receiptValue, { color: theme.textTertiary }]}>
                  {transaction.fees} {transaction.currency}
                </Text>
              </View>
              
              {transaction.exchangeRate && (
                <View style={styles.receiptRow}>
                  <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Taux de change :</Text>
                  <Text style={[styles.receiptValue, { color: theme.textTertiary }]}>
                    {transaction.exchangeRate}
                  </Text>
                </View>
              )}
              
              {/* Total (si différent du montant principal) */}
              {parseInt(transaction.fees) > 0 && (
                <View style={[styles.receiptRow, styles.receiptTotalRow, { borderTopColor: theme.divider }]}>
                  <Text style={[styles.receiptTotalLabel, { color: theme.textPrimary }]}>TOTAL :</Text>
                  <Text style={[styles.receiptTotalValue, { color: theme.textPrimary }]}>
                    {transaction.type === 'sent' ? '-' : '+'}{Math.abs(parseInt(transaction.amount.replace(/[+-]/g, ''))) + parseInt(transaction.fees)} {transaction.currency}
                  </Text>
                </View>
              )}
            </View>

            {/* Pied de page du reçu */}
            <View style={styles.receiptFooter}>
              <Text style={[styles.receiptFooterText, { color: theme.textSecondary }]}>
                Merci d'utiliser YANKAP
              </Text>
              <Text style={[styles.receiptFooterText, { color: theme.textSecondary }]}>
                Support : support@yankap.com
              </Text>
              <Text style={[styles.receiptFooterNote, { color: theme.textSecondary }]}>
                Ce reçu fait foi de votre transaction
              </Text>
            </View>
          </View>

          {/* Espace pour les boutons fixes */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Boutons d'action fixes en bas */}
        <View style={[styles.fixedActionsSection, { backgroundColor: theme.background, borderTopColor: theme.divider }]}>
          <View style={styles.buttonsRow}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: theme.textPrimary }]}
              onPress={handleDownloadReceipt}
            >
              <ReceiptIcon color="white" />
              <Text style={[styles.primaryButtonText, { color: 'white' }]}>
                Imprimer
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { borderColor: theme.cardBorder, backgroundColor: theme.cardBackground }]}
              onPress={handleShareTransaction}
            >
              <ShareIcon color={theme.textSecondary} />
              <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>
                Partager
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 45,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...TEXT_STYLES.body,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  mainSection: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionTitle: {
    ...TEXT_STYLES.h3,
    textAlign: 'center',
    marginBottom: 4,
  },
  transactionDescription: {
    ...TEXT_STYLES.bodySmall,
    textAlign: 'center',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  currency: {
    ...TEXT_STYLES.bodySmall,
    marginRight: 6,
  },
  amount: {
    ...TEXT_STYLES.h2,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    ...TEXT_STYLES.caption,
    fontWeight: '600',
    marginLeft: 4,
  },
  receiptCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 8,
    padding: 0,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  receiptHeader: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  receiptTitle: {
    ...TEXT_STYLES.h3,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  receiptSubtitle: {
    ...TEXT_STYLES.caption,
    fontWeight: '500',
  },
  receiptSection: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  receiptSectionTitle: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  receiptLabel: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '500',
    flex: 1,
  },
  receiptValue: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1.2,
  },
  receiptAmountValue: {
    ...TEXT_STYLES.body,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1.2,
  },
  receiptValueWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
    justifyContent: 'flex-end',
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  receiptStatusBadge: {
    flex: 1.2,
    alignItems: 'flex-end',
  },
  receiptAccountBlock: {
    marginBottom: 10,
  },
  receiptAccountLabel: {
    ...TEXT_STYLES.caption,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  receiptAccountName: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '600',
    marginBottom: 1,
    marginLeft: 8,
  },
  receiptAccountPhone: {
    ...TEXT_STYLES.caption,
    marginLeft: 8,
  },
  receiptTotalRow: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  receiptTotalLabel: {
    ...TEXT_STYLES.body,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flex: 1,
  },
  receiptTotalValue: {
    ...TEXT_STYLES.body,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1.2,
  },
  receiptFooter: {
    padding: 16,
    paddingTop: 12,
    alignItems: 'center',
  },
  receiptFooterText: {
    ...TEXT_STYLES.caption,
    textAlign: 'center',
    marginBottom: 2,
  },
  receiptFooterNote: {
    ...TEXT_STYLES.caption,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 6,
  },
  bottomSpacer: {
    height: 120, // Espace pour les boutons fixes
  },
  fixedActionsSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 0.48,
  },
  primaryButtonText: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    flex: 0.48,
  },
  secondaryButtonText: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '600',
    marginLeft: 6,
  },
});
