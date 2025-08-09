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
    secondaryColor: '#444444',
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
    secondaryColor: '#CCCCCC',
  },
};

const PaiementPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [transactionNote, setTransactionNote] = useState('');
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
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

  const CreditCardIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="1" y1="10" x2="23" y2="10" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const WalletIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="18" cy="14" r="3" stroke={color} strokeWidth="2" fill="none"/>
    </Svg>
  );

  const ReceiptIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2V4a2 2 0 00-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Path d="M8 6h8M8 10h8M8 14h5" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const RechargeIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const PhoneIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M12 18h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const HistoryIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const UserIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2"/>
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
    </Svg>
  );

  const CheckIcon = ({ color = theme.successColor }) => (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ClockIcon = ({ color = theme.warningColor }) => (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const XIcon = ({ color = theme.errorColor }) => (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const SquareIcon = ({ color = 'white' }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    </Svg>
  );

  const QRCodeIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path 
        d="M3 7V5a2 2 0 0 1 2-2h2m0 16H5a2 2 0 0 1-2-2v-2m16 2v2a2 2 0 0 1-2 2h-2m0-16h2a2 2 0 0 1 2 2v2" 
        stroke={color} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Rect 
        x="8" 
        y="8" 
        width="8" 
        height="8" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M10 10h4v4h-4z" 
        fill={color}
      />
    </Svg>
  );

  const CloseIcon = ({ color = '#FFFFFF' }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const FlashlightIcon = ({ color = '#FFFFFF' }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M9 2h6l3 7v13H6V9l3-7z" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M12 7v5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="12" cy="16" r="1" fill={color}/>
    </Svg>
  );

  // Icônes spécifiques pour les secteurs d'activité
  const ShoppingCartIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="8" cy="21" r="1" stroke={color} strokeWidth="2"/>
      <Circle cx="19" cy="21" r="1" stroke={color} strokeWidth="2"/>
      <Path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const FuelIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M3 3v18h6V3z" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M9 12h4l3 8 3-8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 12V3" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const PharmaIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );

  const RestaurantIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2h-3v13a2 2 0 01-2 2 2 2 0 01-2-2V2h-1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const FashionIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M6 2l3 6v8a4 4 0 0 0 8 0V8l3-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Path d="M12 18h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );

  const TaxiIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M5 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" stroke={color} strokeWidth="2"/>
      <Path d="M5 17H3v-6l2-5h9l4 5v6h-2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M6 12h12" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  // Fonction pour obtenir l'icône selon le secteur d'activité
  const getSectorIcon = (phone) => {
    if (phone.includes('Alimentation') || phone.includes('Épicerie')) {
      return <ShoppingCartIcon color="#B0B0B0" />;
    } else if (phone.includes('Carburant') || phone.includes('Station-service')) {
      return <FuelIcon color="#B0B0B0" />;
    } else if (phone.includes('Restaurant') || phone.includes('Restauration')) {
      return <RestaurantIcon color="#B0B0B0" />;
    } else if (phone.includes('Mode') || phone.includes('Vêtements')) {
      return <FashionIcon color="#B0B0B0" />;
    } else if (phone.includes('Transport') || phone.includes('Mobilité')) {
      return <TaxiIcon color="#B0B0B0" />;
    } else {
      return <SendIcon color="#B0B0B0" />;
    }
  };

  // Données
  const paymentMethods = [
    { 
      id: 0, 
      name: 'Portefeuille YANKAP', 
      type: 'Solde: 125,500 FCFA', 
      icon: <WalletIcon color={theme.textPrimary} />,
      balance: 125500
    },
    { 
      id: 1, 
      name: 'Visa **** 1234', 
      type: 'Carte de crédit', 
      icon: <CreditCardIcon color={theme.textPrimary} />,
      balance: null
    },
    { 
      id: 2, 
      name: 'MasterCard **** 5678', 
      type: 'Carte de débit', 
      icon: <CreditCardIcon color={theme.textPrimary} />,
      balance: null
    },
  ];

  const recentTransactions = [
    { 
      id: 1, 
      recipient: 'Supermarché Casino', 
      amount: -25000, 
      type: 'Paiement marchand', 
      date: '2024-08-07', 
      status: 'Réussi',
      phone: 'Alimentation & Épicerie'
    },
    { 
      id: 2, 
      recipient: 'Station Shell Bonapriso', 
      amount: -15500, 
      type: 'Paiement marchand', 
      date: '2024-08-06', 
      status: 'Réussi',
      phone: 'Carburant & Station-service'
    },
    { 
      id: 3, 
      recipient: 'Pharmacie du Centre', 
      amount: -8200, 
      type: 'Paiement marchand', 
      date: '2024-08-05', 
      status: 'Réussi',
      phone: 'Santé & Pharmacie'
    },
    { 
      id: 4, 
      recipient: 'Restaurant Le Palmier', 
      amount: -12300, 
      type: 'Paiement marchand', 
      date: '2024-08-04', 
      status: 'En cours',
      phone: 'Restaurant & Restauration'
    },
    { 
      id: 5, 
      recipient: 'Boutique Fashion Style', 
      amount: -35000, 
      type: 'Paiement marchand', 
      date: '2024-08-03', 
      status: 'Réussi',
      phone: 'Mode & Vêtements'
    },
    { 
      id: 6, 
      recipient: 'Taxi Central Douala', 
      amount: -4500, 
      type: 'Paiement marchand', 
      date: '2024-08-02', 
      status: 'Réussi',
      phone: 'Transport & Mobilité'
    },
    { 
      id: 7, 
      recipient: 'Station Service Total', 
      amount: -25000, 
      type: 'Paiement marchand', 
      date: '2024-08-01', 
      status: 'Échoué',
      phone: 'Carburant & Énergie'
    },
  ];

  const quickActions = [
    { 
      id: 1, 
      title: 'Payer', 
      icon: <SendIcon color={theme.textPrimary} />,
      onPress: () => setActiveTab(0)
    },
    { 
      id: 2, 
      title: 'Factures', 
      icon: <ReceiptIcon color={theme.textPrimary} />,
      onPress: () => Alert.alert('Factures', 'Fonctionnalité en développement')
    },
    { 
      id: 3, 
      title: 'Recharger', 
      icon: <RechargeIcon color={theme.textPrimary} />,
      onPress: () => router.push('/recharge')
    },
    { 
      id: 4, 
      title: 'Mobile', 
      icon: <PhoneIcon color={theme.textPrimary} />,
      onPress: () => Alert.alert('Mobile Money', 'Fonctionnalité en développement')
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Réussi': return <CheckIcon color={theme.successColor} />;
      case 'En cours': return <ClockIcon color={theme.warningColor} />;
      case 'Échoué': return <XIcon color={theme.errorColor} />;
      default: return <ClockIcon color={theme.textSecondary} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Réussi': return theme.successColor;
      case 'En cours': return theme.warningColor;
      case 'Échoué': return theme.errorColor;
      default: return theme.textSecondary;
    }
  };

  const handleSendMoney = () => {
    if (!amount || !recipient) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    const amountValue = parseFloat(amount);
    const selectedMethod = paymentMethods[selectedPaymentMethod];
    
    if (selectedMethod.balance !== null && amountValue > selectedMethod.balance) {
      Alert.alert('Erreur', 'Solde insuffisant dans votre portefeuille.');
      return;
    }

    Alert.alert(
      'Confirmer le paiement',
      `Payer ${amountValue.toLocaleString()} FCFA à ${recipient} via ${selectedMethod.name}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            Alert.alert('Succès', 'Paiement envoyé avec succès!');
            setAmount('');
            setRecipient('');
            setRecipientPhone('');
            setTransactionNote('');
          }
        }
      ]
    );
  };

  const quickAmounts = ['5,000', '10,000', '25,000', '50,000'];

  const renderSendMoney = () => (
    <View style={styles.tabContent}>
      {/* Solde principal */}
      <View style={[styles.balanceCard, { 
        backgroundColor: '#F5F5F5', 
        borderColor: theme.cardBorder, 
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }]}>
        <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, fontWeight: '500' }]}>Solde principal</Text>
        <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary, fontSize: 20, fontWeight: '700' }]}>
          125,500 FCFA
        </Text>
      </View>

      {/* Formulaire d'envoi */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.cardHeader}>
          <SendIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 8 }]}>Informations du vendeur</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Nom du vendeur *
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
            placeholder="Nom de l'entreprise ou du vendeur"
            placeholderTextColor={theme.textSecondary}
            value={recipient}
            onChangeText={setRecipient}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Code marchand
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
            placeholder="Ex: MC123456"
            placeholderTextColor={theme.textSecondary}
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Montant à payer (FCFA) *
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
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          
          {/* Montants rapides */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[styles.quickAmountButton, { borderColor: theme.cardBorder }]}
                onPress={() => setAmount(quickAmount.replace(',', ''))}
              >
                <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                  {quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Note (optionnel)
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
            placeholder="Ajouter une note..."
            placeholderTextColor={theme.textSecondary}
            value={transactionNote}
            onChangeText={setTransactionNote}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      {/* Liste complète des transactions */}
      {recentTransactions.map((transaction) => (
        <TouchableOpacity 
          key={transaction.id} 
          style={[styles.compactTransactionCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
          onPress={() => {
            router.push({
              pathname: '/transaction-detail',
              params: {
                id: transaction.id,
                recipient: transaction.recipient,
                amount: transaction.amount,
                date: transaction.date,
                status: transaction.status,
                phone: transaction.phone,
                type: transaction.type
              }
            });
          }}
          activeOpacity={0.7}
        >
          <View style={styles.compactTransactionHeader}>
            <View style={styles.compactTransactionIcon}>
              {getSectorIcon(transaction.phone)}
            </View>
            <View style={styles.compactTransactionInfo}>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>{transaction.recipient}</Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, fontSize: 12 }]}>
                {transaction.phone} • {new Date(transaction.date).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </Text>
            </View>
            <View style={styles.compactTransactionAmount}>
              <Text style={[
                TEXT_STYLES.body, 
                { 
                  color: theme.textTertiary,
                  fontWeight: '700',
                  fontSize: 15
                }
              ]}>
                {transaction.amount.toLocaleString()} FCFA
              </Text>
              <View style={styles.compactTransactionStatus}>
                <View style={[
                  styles.statusContainer, 
                  { backgroundColor: `${getStatusColor(transaction.status)}15` }
                ]}>
                  <View style={styles.statusIconContainer}>
                    {getStatusIcon(transaction.status)}
                  </View>
                  <Text style={[TEXT_STYLES.caption, { color: getStatusColor(transaction.status), fontSize: 10, marginLeft: 4 }]}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const tabs = [
    { name: 'Payer', render: renderSendMoney },
    { name: 'Historique', render: renderHistory },
  ];

  // Fonction pour traiter un QR code scanné
  const handleQRScanned = (data) => {
    setShowQRScanner(false);
    
    try {
      // Essayer de parser le QR code comme JSON
      const qrData = JSON.parse(data);
      
      if (qrData.recipient) {
        setRecipient(qrData.recipient);
      }
      if (qrData.amount) {
        setAmount(qrData.amount.toString());
      }
      if (qrData.phone) {
        setRecipientPhone(qrData.phone);
      }
      
      // Basculer vers l'onglet "Payer" si on était sur "Historique"
      setActiveTab(0);
      
      Alert.alert(
        'QR Code détecté',
        `Données importées depuis le QR code${qrData.recipient ? `\nDestinataire: ${qrData.recipient}` : ''}${qrData.amount ? `\nMontant: ${qrData.amount} FCFA` : ''}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      // Si ce n'est pas du JSON, traiter comme texte simple
      setRecipient(data);
      setActiveTab(0);
      
      Alert.alert(
        'QR Code détecté',
        `Destinataire importé: ${data}`,
        [{ text: 'OK' }]
      );
    }
  };

  // Fonction pour simuler un scan QR (pour la démo)
  const simulateQRScan = () => {
    const mockQRData = {
      recipient: "Restaurant Le Savana",
      amount: 15000,
      phone: "Restaurant & Restauration"
    };
    
    setTimeout(() => {
      handleQRScanned(JSON.stringify(mockQRData));
    }, 2000); // Simule un délai de scan
  };

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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Paiements</Text>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => {
                setShowQRScanner(true);
              }}
            >
              <QRCodeIcon color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Info Banner */}


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
            <View style={{ height: activeTab === 0 ? 200 : 40 }} />
          </ScrollView>

          {/* Carte de méthode de paiement fixe (visible seulement dans l'onglet Payer) */}
          {activeTab === 0 && (
            <View style={[styles.fixedPaymentCard, { 
              backgroundColor: theme.cardBackground, 
              borderTopColor: theme.cardBorder,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5
            }]}>
              {/* Méthodes de paiement */}
              
              {/* Méthode sélectionnée avec bouton Carré */}
              <View style={[styles.paymentMethodRow, { marginBottom: 8 }]}>
                <TouchableOpacity
                  style={[
                    styles.selectedPaymentMethodCompact,
                    { 
                      borderColor: theme.cardBorder,
                      backgroundColor: theme.primaryLight,
                      flex: 1,
                      marginRight: 12
                    }
                  ]}
                  onPress={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                >
                  <View style={styles.methodIcon}>
                    {paymentMethods[selectedPaymentMethod].icon}
                  </View>
                  <View style={styles.methodDetails}>
                    <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                      {paymentMethods[selectedPaymentMethod].name}
                    </Text>
                    <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                      {paymentMethods[selectedPaymentMethod].type}
                    </Text>
                  </View>
                  <View style={[styles.chevronContainer, { 
                    transform: [{ rotate: isPaymentDropdownOpen ? '180deg' : '0deg' }] 
                  }]}>
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <Path 
                        d="M6 9l6 6 6-6" 
                        stroke={theme.textSecondary} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </TouchableOpacity>

                {/* Bouton Carré */}
                <TouchableOpacity
                  style={[styles.squareButton, { backgroundColor: theme.textPrimary }]}
                  onPress={handleSendMoney}
                >
                  <SendIcon color="white" />
                </TouchableOpacity>
              </View>

              {/* Dropdown des autres méthodes */}
              {isPaymentDropdownOpen && (
                <View style={[styles.paymentDropdown, { 
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.cardBorder 
                }]}>
                  {paymentMethods.map((method, index) => (
                    index !== selectedPaymentMethod && (
                      <TouchableOpacity
                        key={method.id}
                        style={[styles.dropdownMethod, { borderBottomColor: theme.cardBorder }]}
                        onPress={() => {
                          setSelectedPaymentMethod(index);
                          setIsPaymentDropdownOpen(false);
                        }}
                      >
                        <View style={styles.methodIcon}>
                          {method.icon}
                        </View>
                        <View style={styles.methodDetails}>
                          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>{method.name}</Text>
                          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>{method.type}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  ))}
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {/* Scanner QR Code Modal */}
        {showQRScanner && (
          <View style={styles.qrScannerModal}>
            {/* En-tête du scanner */}
            <View style={styles.qrScannerHeader}>
              <TouchableOpacity
                style={styles.qrCloseButton}
                onPress={() => setShowQRScanner(false)}
              >
                <CloseIcon color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.qrScannerTitle}>Scanner QR Code</Text>
              <TouchableOpacity style={styles.qrFlashlightButton}>
                <FlashlightIcon color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Zone de scan */}
            <View style={styles.qrScannerContainer}>
              <View style={styles.qrScannerOverlay}>
                {/* Carré de scan */}
                <View style={styles.qrScannerSquare}>
                  <View style={[styles.qrCorner, styles.qrCornerTopLeft]} />
                  <View style={[styles.qrCorner, styles.qrCornerTopRight]} />
                  <View style={[styles.qrCorner, styles.qrCornerBottomLeft]} />
                  <View style={[styles.qrCorner, styles.qrCornerBottomRight]} />
                </View>
              </View>
            </View>

            {/* Instructions et actions */}
            <View style={styles.qrScannerFooter}>
              <Text style={styles.qrScannerInstructions}>
                Placez le QR code dans le cadre pour le scanner
              </Text>
              
              {/* Bouton de démonstration */}
              <TouchableOpacity 
                style={styles.qrDemoButton}
                onPress={simulateQRScan}
              >
                <Text style={styles.qrDemoButtonText}>Simuler un scan (Démo)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  qrButton: {
    marginLeft: 'auto',
    padding: 8,
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
  balanceCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(29, 186, 163, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickAmountButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(29, 186, 163, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionMainInfo: {
    flex: 1,
    marginLeft: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  fixedPaymentCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  selectedPaymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  paymentDropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  dropdownMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedPaymentMethodCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  squareButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactTransactionCard: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  compactTransactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTransactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  compactTransactionInfo: {
    flex: 1,
  },
  compactTransactionAmount: {
    alignItems: 'flex-end',
  },
  compactTransactionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusIconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Scanner QR Code
  qrScannerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
  },
  qrScannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  qrCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrScannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qrFlashlightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrScannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrScannerOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrScannerSquare: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  qrCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#1DBAA3',
    borderWidth: 4,
  },
  qrCornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  qrCornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  qrCornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  qrCornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  qrScannerFooter: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  qrScannerInstructions: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  qrDemoButton: {
    backgroundColor: '#1DBAA3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  qrDemoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaiementPage;
