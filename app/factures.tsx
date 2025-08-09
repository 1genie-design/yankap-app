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
  FlatList,
  Dimensions,
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

const FacturesPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState(0);
  const [contractNumber, setContractNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const { width: screenWidth } = Dimensions.get('window');
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

  const ElectricityIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const WaterIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const WifiIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z" stroke={color} strokeWidth="2"/>
      <Path d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" stroke={color} strokeWidth="2"/>
      <Path d="M9 17l2 2c.87-.87 2.13-.87 3 0l2-2C14.12 15.12 9.88 15.12 9 17z" stroke={color} strokeWidth="2"/>
      <Circle cx="12" cy="20" r="1" fill={color}/>
    </Svg>
  );

  const TvIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="8" y1="21" x2="16" y2="21" stroke={color} strokeWidth="2"/>
      <Line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const PhoneIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const SchoolIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2"/>
      <Path d="M2 12l10 5 10-5" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const CheckIcon = ({ color = theme.successColor }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ClockIcon = ({ color = theme.textSecondary }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CreditCardIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="1" y1="10" x2="23" y2="10" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const HistoryIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const SearchIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );

  // Fournisseurs de services
  const providers = [
    {
      id: 0,
      name: 'ENEO',
      type: 'Électricité',
      logo: '⚡',
      color: '#FFB000',
      icon: ElectricityIcon,
      description: 'Factures d\'électricité',
      contractPrefix: 'EN',
      fees: 150
    },
    {
      id: 1,
      name: 'CDE',
      type: 'Eau',
      logo: '💧',
      color: '#2196F3',
      icon: WaterIcon,
      description: 'Factures d\'eau',
      contractPrefix: 'CD',
      fees: 100
    },
    {
      id: 2,
      name: 'Orange',
      type: 'Internet',
      logo: '🟠',
      color: '#FF6600',
      icon: WifiIcon,
      description: 'Internet et Box',
      contractPrefix: 'OR',
      fees: 200
    },
    {
      id: 3,
      name: 'MTN',
      type: 'Internet',
      logo: '🟡',
      color: '#FFCC00',
      icon: WifiIcon,
      description: 'Internet et forfaits',
      contractPrefix: 'MT',
      fees: 200
    },
    {
      id: 4,
      name: 'Canal+',
      type: 'TV',
      logo: '📺',
      color: '#000000',
      icon: TvIcon,
      description: 'Télévision payante',
      contractPrefix: 'CN',
      fees: 300
    },
    {
      id: 5,
      name: 'Camtel',
      type: 'Téléphone',
      logo: '☎️',
      color: '#0066CC',
      icon: PhoneIcon,
      description: 'Téléphone fixe',
      contractPrefix: 'CT',
      fees: 150
    }
  ];

  // Historique des paiements
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 1,
      provider: 'ENEO',
      logo: '⚡',
      type: 'Électricité',
      contractNumber: 'EN123456789',
      customerName: 'YANKAP SERVICES',
      amount: 25000,
      date: '2024-08-07',
      status: 'Payé',
      reference: 'FAC001234567',
      dueDate: '2024-08-15'
    },
    {
      id: 2,
      provider: 'CDE',
      logo: '💧',
      type: 'Eau',
      contractNumber: 'CD987654321',
      customerName: 'YANKAP SERVICES',
      amount: 15000,
      date: '2024-08-05',
      status: 'Payé',
      reference: 'FAC001234568',
      dueDate: '2024-08-10'
    },
    {
      id: 3,
      provider: 'Orange',
      logo: '🟠',
      type: 'Internet',
      contractNumber: 'OR555444333',
      customerName: 'YANKAP SERVICES',
      amount: 35000,
      date: '2024-08-03',
      status: 'En attente',
      reference: 'FAC001234569',
      dueDate: '2024-08-12'
    },
    {
      id: 4,
      provider: 'Canal+',
      logo: '📺',
      type: 'TV',
      contractNumber: 'CN111222333',
      customerName: 'YANKAP SERVICES',
      amount: 28000,
      date: '2024-08-01',
      status: 'Payé',
      reference: 'FAC001234570',
      dueDate: '2024-08-08'
    }
  ]);

  const selectedProviderData = providers[selectedProvider];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Payé': return <CheckIcon color={theme.successColor} />;
      case 'En attente': return <ClockIcon color={theme.warningColor} />;
      case 'Retard': return <CheckIcon color={theme.errorColor} />;
      default: return <ClockIcon color={theme.textSecondary} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Payé': return theme.successColor;
      case 'En attente': return theme.warningColor;
      case 'Retard': return theme.errorColor;
      default: return theme.textSecondary;
    }
  };

  const handleCheckBill = () => {
    if (!contractNumber || contractNumber.length < 5) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de contrat valide.');
      return;
    }

    // Simulation de vérification de facture
    const mockBillAmount = Math.floor(Math.random() * 50000) + 5000;
    setAmount(mockBillAmount.toString());
    setCustomerName('YANKAP SERVICES');
    
    Alert.alert(
      'Facture trouvée',
      `Montant à payer: ${mockBillAmount.toLocaleString()} FCFA\nClient: YANKAP SERVICES\nÉchéance proche`,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const handlePayBill = () => {
    if (!contractNumber || !amount) {
      Alert.alert('Erreur', 'Veuillez d\'abord vérifier la facture.');
      return;
    }

    const provider = selectedProviderData.name;
    const totalAmount = parseInt(amount) + selectedProviderData.fees;

    Alert.alert(
      'Confirmer le paiement',
      `Payer ${amount} FCFA pour ${provider}\nContrat: ${contractNumber}\nFrais: ${selectedProviderData.fees} FCFA\nTotal: ${totalAmount.toLocaleString()} FCFA`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Payer', 
          onPress: () => {
            Alert.alert('Succès', 'Facture payée avec succès!');
            setContractNumber('');
            setAmount('');
            setCustomerName('');
          }
        }
      ]
    );
  };

  const renderProviderCard = ({ item, index }) => {
    const isSelected = selectedProvider === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.providerCard,
          {
            backgroundColor: isSelected ? theme.primaryLight : theme.cardBackground,
            borderColor: isSelected ? theme.textPrimary : theme.cardBorder
          }
        ]}
        onPress={() => {
          setSelectedProvider(item.id);
          setContractNumber('');
          setAmount('');
          setCustomerName('');
        }}
      >
        <View style={[styles.providerIcon, { backgroundColor: item.color + '15' }]}>
          <Text style={styles.providerLogo}>{item.logo}</Text>
        </View>
        <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, marginTop: 8, textAlign: 'center' }]}>
          {item.name}
        </Text>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, textAlign: 'center' }]}>
          {item.type}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPayment = () => (
    <View style={styles.tabContent}>
      {/* Sélection du fournisseur */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.cardHeader}>
          <CreditCardIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 8 }]}>Fournisseur</Text>
        </View>

        <FlatList
          data={providers}
          renderItem={renderProviderCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.providerRow}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Informations du contrat */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>
          Numéro de contrat
        </Text>
        
        <View style={styles.contractInputContainer}>
          <View style={[styles.contractPrefix, { backgroundColor: selectedProviderData.color + '15' }]}>
            <Text style={[TEXT_STYLES.body, { color: selectedProviderData.color }]}>
              {selectedProviderData.contractPrefix}
            </Text>
          </View>
          <TextInput
            style={[
              styles.contractInput, 
              { 
                backgroundColor: theme.inputBackground, 
                color: theme.textTertiary, 
                borderColor: theme.inputBorder 
              }
            ]}
            placeholder="Numéro de contrat"
            placeholderTextColor={theme.textSecondary}
            value={contractNumber}
            onChangeText={setContractNumber}
            keyboardType="default"
          />
        </View>

        {selectedProviderData && (
          <View style={[styles.providerInfo, { backgroundColor: selectedProviderData.color + '08' }]}>
            <selectedProviderData.icon color={selectedProviderData.color} />
            <View style={styles.providerDetails}>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                {selectedProviderData.name}
              </Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                {selectedProviderData.description}
              </Text>
            </View>
            <Text style={[TEXT_STYLES.caption, { color: selectedProviderData.color }]}>
              Frais: {selectedProviderData.fees} FCFA
            </Text>
          </View>
        )}
      </View>

      {/* Bouton de vérification */}
      <TouchableOpacity
        style={[
          styles.checkButton, 
          { 
            backgroundColor: contractNumber.length >= 5 ? theme.textPrimary : theme.cardBorder,
            opacity: contractNumber.length >= 5 ? 1 : 0.5
          }
        ]}
        onPress={handleCheckBill}
        disabled={contractNumber.length < 5}
      >
        <SearchIcon color="white" />
        <Text style={[TEXT_STYLES.button, { color: 'white', marginLeft: 8 }]}>
          Vérifier la facture
        </Text>
      </TouchableOpacity>

      {/* Détails de la facture */}
      {amount && customerName && (
        <View style={[styles.billDetails, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
          <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, marginBottom: 12 }]}>
            Détails de la facture
          </Text>
          
          <View style={styles.billRow}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Client</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>{customerName}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Contrat</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontFamily: 'monospace' }]}>
              {contractNumber}
            </Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Montant</Text>
            <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, fontWeight: '600' }]}>
              {parseInt(amount).toLocaleString()} FCFA
            </Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Frais</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>
              {selectedProviderData.fees.toLocaleString()} FCFA
            </Text>
          </View>
          
          <View style={[styles.billRow, styles.totalRow, { borderTopColor: theme.divider }]}>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>Total</Text>
            <Text style={[TEXT_STYLES.h2, { color: theme.textPrimary, fontWeight: '700' }]}>
              {(parseInt(amount) + selectedProviderData.fees).toLocaleString()} FCFA
            </Text>
          </View>
        </View>
      )}

      {/* Bouton de paiement */}
      {amount && (
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: theme.successColor }]}
          onPress={handlePayBill}
        >
          <CreditCardIcon color="white" />
          <Text style={[TEXT_STYLES.button, { color: 'white', marginLeft: 8 }]}>
            Payer maintenant
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      {/* En-tête */}
      <View style={[styles.historyHeader, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
        <HistoryIcon color={theme.textPrimary} />
        <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, marginLeft: 8 }]}>
          Historique des factures
        </Text>
      </View>

      {/* Liste des paiements */}
      {paymentHistory.map((payment) => (
        <View key={payment.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.paymentHeader}>
            <View style={styles.paymentMainInfo}>
              <View style={styles.paymentTitleRow}>
                <Text style={styles.providerLogo}>{payment.logo}</Text>
                <View style={styles.paymentDetails}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{payment.provider}</Text>
                  <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                    {payment.type}
                  </Text>
                </View>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 4 }]}>
                {new Date(payment.date).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            </View>
            <View style={styles.paymentAmount}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, fontWeight: '600' }]}>
                {payment.amount.toLocaleString()} FCFA
              </Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, textAlign: 'right' }]}>
                Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>

          <View style={[styles.paymentDetailsSection, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Contrat</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontFamily: 'monospace' }]}>
                {payment.contractNumber}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Client</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                {payment.customerName}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Référence</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontFamily: 'monospace' }]}>
                {payment.reference}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Statut</Text>
              <View style={styles.statusContainer}>
                {getStatusIcon(payment.status)}
                <Text style={[TEXT_STYLES.body, { color: getStatusColor(payment.status), marginLeft: 4 }]}>
                  {payment.status}
                </Text>
              </View>
            </View>
          </View>

          {payment.status === 'En attente' && (
            <TouchableOpacity
              style={[styles.payNowButton, { backgroundColor: theme.successColor }]}
              onPress={() => Alert.alert('Paiement', `Payer la facture ${payment.reference}`)}
            >
              <CreditCardIcon color="white" />
              <Text style={[TEXT_STYLES.caption, { color: 'white', marginLeft: 4 }]}>Payer</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const tabs = [
    { name: 'Payer', render: renderPayment },
    { name: 'Historique', render: renderHistory },
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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Factures</Text>
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
  providerRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  providerCard: {
    width: '30%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerLogo: {
    fontSize: 20,
  },
  contractInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  contractPrefix: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  contractInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    gap: 12,
  },
  providerDetails: {
    flex: 1,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  billDetails: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  payButton: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    marginLeft: 8,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  paymentDetailsSection: {
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
});

export default FacturesPage;
