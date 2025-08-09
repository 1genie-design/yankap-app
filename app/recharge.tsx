import React, { useState, useRef, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    secondaryLight: '#F5F5F5', // Gris clair pour les backgrounds
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
    secondaryLight: '#2A2A2A', // Gris foncé pour les backgrounds en mode sombre
  },
};

const RechargePage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOperator, setSelectedOperator] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('yankap');
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
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

  const PhoneIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M12 18h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
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

  const ZapIcon = ({ color = theme.warningColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  const ChevronRightIcon = ({ color = theme.textPrimary }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ChevronDownIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const PhoneRechargeIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M12 18h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M12 6v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M10 8h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );

  // Données des opérateurs
  const operators = [
    {
      id: 0,
      name: 'Orange',
      logo: '🟠',
      color: '#FF6600',
      prefix: ['069', '065', '066', '067'],
      type: 'mobile',
      plans: {
        credit: [500, 1000, 2000, 5000, 10000],
        data: [
          { amount: 1000, data: '500MB', validity: '24h' },
          { amount: 2000, data: '1GB', validity: '7 jours' },
          { amount: 5000, data: '3GB', validity: '30 jours' },
          { amount: 10000, data: '7GB', validity: '30 jours' },
        ]
      }
    },
    {
      id: 1,
      name: 'MTN',
      logo: '🟡',
      color: '#FFCC00',
      prefix: ['067', '065', '068'],
      type: 'mobile',
      plans: {
        credit: [500, 1000, 2000, 5000, 10000],
        data: [
          { amount: 1000, data: '600MB', validity: '24h' },
          { amount: 2000, data: '1.2GB', validity: '7 jours' },
          { amount: 5000, data: '3.5GB', validity: '30 jours' },
          { amount: 10000, data: '8GB', validity: '30 jours' },
        ]
      }
    },
    {
      id: 2,
      name: 'Camtel',
      logo: '🔵',
      color: '#0066CC',
      prefix: ['067', '024'],
      type: 'mobile',
      plans: {
        credit: [500, 1000, 2000, 5000, 10000],
        data: [
          { amount: 1000, data: '800MB', validity: '24h' },
          { amount: 2000, data: '1.5GB', validity: '7 jours' },
          { amount: 5000, data: '4GB', validity: '30 jours' },
          { amount: 10000, data: '10GB', validity: '30 jours' },
        ]
      }
    },
    {
      id: 3,
      name: 'Nexttel',
      logo: '🟢',
      color: '#00CC66',
      prefix: ['066', '061'],
      type: 'mobile',
      plans: {
        credit: [500, 1000, 2000, 5000, 10000],
        data: [
          { amount: 1000, data: '400MB', validity: '24h' },
          { amount: 2000, data: '1GB', validity: '7 jours' },
          { amount: 5000, data: '2.5GB', validity: '30 jours' },
          { amount: 10000, data: '6GB', validity: '30 jours' },
        ]
      }
    }
  ];

  // Méthodes de paiement disponibles
  const paymentOptions = [
    {
      id: 'yankap',
      name: 'YANKAP',
      description: 'Solde actuel : 50,000 FCFA',
      icon: '💳',
      available: true,
      badge: 'Recommandé'
    },
    {
      id: 'visa',
      name: 'Visa',
      description: '**** 1234',
      icon: '💳',
      available: true,
      badge: null
    },
    {
      id: 'mastercard',
      name: 'MasterCard',
      description: '**** 5678',
      icon: '💳',
      available: true,
      badge: null
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      description: 'Orange Money, MTN Money',
      icon: '📱',
      available: true,
      badge: null
    }
  ];

  // Historique des recharges
  const [rechargeHistory, setRechargeHistory] = useState([
    {
      id: 1,
      operator: 'Orange',
      logo: '🟠',
      phoneNumber: '696123456',
      amount: 5000,
      type: 'Crédit',
      date: '2024-08-07',
      status: 'Réussi',
      reference: 'RCH001234567'
    },
    {
      id: 2,
      operator: 'MTN',
      logo: '🟡',
      phoneNumber: '677987654',
      amount: 2000,
      type: 'Data',
      date: '2024-08-06',
      status: 'Réussi',
      reference: 'RCH001234568',
      dataDetails: '1.2GB - 7 jours'
    },
    {
      id: 3,
      operator: 'Orange',
      logo: '🟠',
      phoneNumber: '696123456',
      amount: 1000,
      type: 'Crédit',
      date: '2024-08-05',
      status: 'En cours',
      reference: 'RCH001234569'
    },
    {
      id: 4,
      operator: 'Camtel',
      logo: '🔵',
      phoneNumber: '671555444',
      amount: 10000,
      type: 'Data',
      date: '2024-08-03',
      status: 'Réussi',
      reference: 'RCH001234570',
      dataDetails: '10GB - 30 jours'
    }
  ]);

  const selectedOperatorData = operators[selectedOperator];

  const detectOperator = (phone) => {
    if (phone.length < 3) return 0;
    
    const prefix = phone.substring(0, 3);
    for (let i = 0; i < operators.length; i++) {
      if (operators[i].prefix.includes(prefix)) {
        return i;
      }
    }
    return 0;
  };

  // Fonction pour sauvegarder le numéro de téléphone
  const savePhoneNumber = async (number) => {
    try {
      await AsyncStorage.setItem('lastPhoneNumber', number);
    } catch (error) {
      console.log('Erreur lors de la sauvegarde du numéro:', error);
    }
  };

  // Fonction pour charger le numéro de téléphone sauvegardé
  const loadPhoneNumber = async () => {
    try {
      const savedNumber = await AsyncStorage.getItem('lastPhoneNumber');
      if (savedNumber) {
        setPhoneNumber(savedNumber);
        if (savedNumber.length >= 3) {
          const detectedOperator = detectOperator(savedNumber);
          setSelectedOperator(detectedOperator);
        }
      }
    } catch (error) {
      console.log('Erreur lors du chargement du numéro:', error);
    }
  };

  // Charger le numéro sauvegardé au démarrage
  useEffect(() => {
    loadPhoneNumber();
  }, []);

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    // Sauvegarder le numéro dès qu'il est modifié
    if (text.length >= 9) {
      savePhoneNumber(text);
    }
    if (text.length >= 3) {
      const detectedOperator = detectOperator(text);
      setSelectedOperator(detectedOperator);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Réussi': return <CheckIcon color={theme.successColor} />;
      case 'En cours': return <ClockIcon color={theme.warningColor} />;
      case 'Échoué': return <CheckIcon color={theme.errorColor} />;
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

  const handleRecharge = () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide.');
      return;
    }

    const amount = selectedAmount || customAmount;
    if (!amount) {
      Alert.alert('Erreur', 'Veuillez sélectionner un montant.');
      return;
    }

    const operator = selectedOperatorData.name;

    Alert.alert(
      'Confirmer la recharge',
      `Recharger ${amount} FCFA de crédit ${operator}\nNuméro: ${phoneNumber}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            Alert.alert('Succès', 'Recharge effectuée avec succès!');
            setPhoneNumber('');
            setSelectedAmount('');
            setCustomAmount('');
          }
        }
      ]
    );
  };

  const renderRecharge = () => (
    <View style={styles.tabContent}>
      {/* Carte de recharge unifiée */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>Recharge mobile</Text>
        
        {/* Numéro de téléphone */}
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
          Numéro de téléphone
        </Text>
        <View style={styles.phoneInputContainer}>
          <View style={[styles.countryCode, { backgroundColor: theme.secondaryLight }]}>
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>+237</Text>
          </View>
          <TextInput
            style={[
              styles.phoneInput, 
              { 
                backgroundColor: theme.inputBackground, 
                color: theme.textTertiary, 
                borderColor: theme.inputBorder 
              }
            ]}
            placeholder="6XXXXXXXX"
            placeholderTextColor={theme.textSecondary}
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={9}
          />
        </View>

        {phoneNumber.length >= 3 && (
          <View style={[styles.operatorDetected, { backgroundColor: selectedOperatorData.color + '15' }]}>
            <Text style={styles.operatorLogo}>{selectedOperatorData.logo}</Text>
            <Text style={[TEXT_STYLES.caption, { color: selectedOperatorData.color, marginLeft: 8 }]}>
              {selectedOperatorData.name} détecté
            </Text>
          </View>
        )}

        {/* Séparateur */}
        <View style={[styles.separator, { backgroundColor: theme.divider }]} />

        {/* Montant à recharger */}
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
          Montant à recharger (FCFA)
        </Text>
        
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: theme.inputBackground, 
              color: theme.textTertiary, 
              borderColor: customAmount ? theme.textPrimary : theme.inputBorder 
            }
          ]}
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          value={customAmount}
          onChangeText={(text) => {
            setCustomAmount(text);
            setSelectedAmount(null);
          }}
          keyboardType="numeric"
        />
        
        {/* Montants rapides */}
        <View style={styles.quickAmounts}>
          {[500, 1000, 2000, 5000].map((amount, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickAmountButton, 
                { 
                  borderColor: selectedAmount === amount ? theme.textPrimary : theme.cardBorder,
                  backgroundColor: selectedAmount === amount ? `${theme.textPrimary}10` : 'transparent'
                }
              ]}
              onPress={() => {
                setSelectedAmount(amount);
                setCustomAmount(amount.toString());
              }}
            >
              <Text style={[
                TEXT_STYLES.caption, 
                { 
                  color: selectedAmount === amount ? theme.textPrimary : theme.textSecondary,
                  fontWeight: selectedAmount === amount ? '600' : 'normal'
                }
              ]}>
                {amount.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Système de paiement */}
        <View style={styles.paymentSection}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Méthode de paiement
          </Text>
          
          <TouchableOpacity
            style={[
              styles.paymentDropdown,
              {
                backgroundColor: theme.inputBackground,
                borderColor: showPaymentDropdown ? theme.textPrimary : theme.inputBorder,
              }
            ]}
            onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}
          >
            <View style={styles.dropdownContent}>
              {selectedPaymentMethod ? (
                <View style={styles.selectedPaymentInfo}>
                  <Text style={styles.paymentIcon}>
                    {paymentOptions.find(p => p.id === selectedPaymentMethod)?.icon}
                  </Text>
                  <View style={styles.paymentTextInfo}>
                    <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
                      {paymentOptions.find(p => p.id === selectedPaymentMethod)?.name}
                    </Text>
                    <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                      {paymentOptions.find(p => p.id === selectedPaymentMethod)?.description}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>
                  Sélectionner une méthode
                </Text>
              )}
              <ChevronDownIcon color={theme.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Dropdown des options de paiement */}
          {showPaymentDropdown && (
            <View style={[styles.dropdownOptions, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
              {paymentOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.dropdownOption,
                    selectedPaymentMethod === option.id && { backgroundColor: `${theme.textPrimary}10` }
                  ]}
                  onPress={() => {
                    setSelectedPaymentMethod(option.id);
                    setShowPaymentDropdown(false);
                  }}
                  disabled={!option.available}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.paymentIcon}>{option.icon}</Text>
                    <View style={styles.paymentTextInfo}>
                      <View style={styles.optionHeader}>
                        <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
                          {option.name}
                        </Text>
                        {option.badge && (
                          <View style={[styles.optionBadge, { backgroundColor: theme.warningColor }]}>
                            <Text style={[TEXT_STYLES.caption, { color: '#fff', fontSize: 10 }]}>
                              {option.badge}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                        {option.description}
                      </Text>
                    </View>
                    {selectedPaymentMethod === option.id && (
                      <CheckIcon color={theme.successColor} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bouton Acheter un forfait */}
        <TouchableOpacity
          style={styles.buyPackageLink}
          onPress={() => router.push('/forfait-packages')}
          activeOpacity={0.7}
        >
          <Text style={[TEXT_STYLES.body, { color: theme.textPrimary }]}>
            Acheter un forfait
          </Text>
          <ChevronRightIcon color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      {/* Liste compacte des recharges */}
      {rechargeHistory.map((recharge) => (
        <TouchableOpacity 
          key={recharge.id} 
          style={[styles.compactTransactionCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
          onPress={() => {
            router.push({
              pathname: '/transaction-detail',
              params: {
                id: recharge.id,
                recipient: recharge.operator,
                amount: recharge.amount,
                date: recharge.date,
                status: recharge.status,
                phone: recharge.phoneNumber,
                type: 'Recharge',
                reference: recharge.reference
              }
            });
          }}
          activeOpacity={0.7}
        >
          <View style={styles.compactTransactionHeader}>
            <View style={styles.compactTransactionIcon}>
              <PhoneRechargeIcon color="#B0B0B0" />
            </View>
            <View style={styles.compactTransactionInfo}>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
                Recharge {recharge.operator}
              </Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, fontSize: 12 }]}>
                +237 {recharge.phoneNumber} • {new Date(recharge.date).toLocaleDateString('fr-FR', { 
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
                {recharge.amount.toLocaleString()} FCFA
              </Text>
              <View style={styles.compactTransactionStatus}>
                <View style={[
                  styles.statusContainer, 
                  { backgroundColor: `${getStatusColor(recharge.status)}15` }
                ]}>
                  <View style={styles.statusIconContainer}>
                    {getStatusIcon(recharge.status)}
                  </View>
                  <Text style={[TEXT_STYLES.caption, { color: getStatusColor(recharge.status), fontSize: 10, marginLeft: 4 }]}>
                    {recharge.status}
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
    { name: 'Recharger', render: renderRecharge },
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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Recharges</Text>
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
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: activeTab === 0 ? 100 : 40 }}
          >
            {tabs[activeTab].render()}
          </ScrollView>

          {/* Bouton de recharge fixe en bas */}
          {activeTab === 0 && (
            <View style={[styles.fixedBottomContainer, { backgroundColor: theme.background }]}>
              {(selectedAmount || customAmount) && phoneNumber.length >= 9 && (
                <View style={styles.rechargeSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Opérateur:</Text>
                    <View style={styles.operatorSummary}>
                      <Text style={styles.operatorLogo}>{selectedOperatorData.logo}</Text>
                      <Text style={[styles.summaryValue, { color: theme.textTertiary, marginLeft: 4 }]}>
                        {selectedOperatorData.name}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Numéro:</Text>
                    <Text style={[styles.summaryValue, { color: theme.textTertiary }]}>+237 {phoneNumber}</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Montant:</Text>
                    <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
                      {(selectedAmount || customAmount)} FCFA
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.rechargeButton, 
                  { 
                    backgroundColor: theme.textPrimary,
                    opacity: (selectedAmount || customAmount) && phoneNumber.length >= 9 ? 1 : 0.5
                  }
                ]}
                onPress={handleRecharge}
                disabled={!(selectedAmount || customAmount) || phoneNumber.length < 9}
              >
                <ZapIcon color="white" />
                <Text style={[TEXT_STYLES.button, { color: 'white', marginLeft: 8 }]}>Recharger maintenant</Text>
              </TouchableOpacity>
            </View>
          )}
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  operatorDetected: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    borderRadius: 6,
  },
  operatorLogo: {
    fontSize: 24,
  },
  rechargeSummary: {
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
  operatorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rechargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  buyPackageButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  buyPackageLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  separator: {
    height: 1,
    marginVertical: 20,
  },
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
  // Styles pour le système de paiement
  paymentSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  paymentDropdown: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentTextInfo: {
    flex: 1,
  },
  dropdownOptions: {
    marginTop: 8,
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
});

export default RechargePage;
