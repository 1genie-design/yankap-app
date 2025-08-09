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

const PaiementPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [transactionNote, setTransactionNote] = useState('');
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
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ClockIcon = ({ color = theme.warningColor }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const XIcon = ({ color = theme.errorColor }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );

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
      recipient: 'Marie Dubois', 
      amount: -15000, 
      type: 'Envoi', 
      date: '2024-08-07', 
      status: 'Réussi',
      phone: '+237 698 123 456'
    },
    { 
      id: 2, 
      recipient: 'Facture Orange', 
      amount: -5500, 
      type: 'Facture', 
      date: '2024-08-06', 
      status: 'Réussi',
      phone: 'Service'
    },
    { 
      id: 3, 
      recipient: 'Jean Paul', 
      amount: 25000, 
      type: 'Reçu', 
      date: '2024-08-05', 
      status: 'Réussi',
      phone: '+237 677 987 654'
    },
    { 
      id: 4, 
      recipient: 'Achat en ligne', 
      amount: -12300, 
      type: 'Paiement', 
      date: '2024-08-04', 
      status: 'En cours',
      phone: 'E-commerce'
    },
    { 
      id: 5, 
      recipient: 'Salaire', 
      amount: 180000, 
      type: 'Reçu', 
      date: '2024-08-01', 
      status: 'Réussi',
      phone: 'Employeur'
    },
  ];

  const quickActions = [
    { 
      id: 1, 
      title: 'Envoyer', 
      icon: <SendIcon color={theme.textPrimary} />,
      onPress: () => setActiveTab(1)
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
      `Envoyer ${amountValue.toLocaleString()} FCFA à ${recipient} via ${selectedMethod.name}?`,
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

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Solde principal */}
      <View style={[styles.balanceCard, { backgroundColor: theme.textPrimary }]}>
        <Text style={[TEXT_STYLES.caption, { color: 'rgba(255,255,255,0.8)' }]}>Solde principal</Text>
        <Text style={[TEXT_STYLES.h1, { color: 'white', fontSize: 32, marginVertical: 8 }]}>
          125,500 FCFA
        </Text>
        <Text style={[TEXT_STYLES.caption, { color: 'rgba(255,255,255,0.8)' }]}>
          Dernière mise à jour: Aujourd'hui 14:30
        </Text>
      </View>

      {/* Actions rapides */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>Actions rapides</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id}
              style={[styles.quickAction, { backgroundColor: theme.primaryLight }]}
              onPress={action.onPress}
            >
              {action.icon}
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, marginTop: 8, textAlign: 'center' }]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Transactions récentes */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.sectionHeader}>
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>Transactions récentes</Text>
          <TouchableOpacity onPress={() => setActiveTab(2)}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.slice(0, 3).map((transaction) => (
          <View key={transaction.id} style={[styles.transactionItem, { borderBottomColor: theme.divider }]}>
            <View style={styles.transactionIcon}>
              {transaction.type === 'Envoi' || transaction.type === 'Paiement' ? 
                <SendIcon color={theme.errorColor} /> : 
                transaction.type === 'Reçu' ? 
                <SendIcon color={theme.successColor} /> : 
                <ReceiptIcon color={theme.textPrimary} />
              }
            </View>
            <View style={styles.transactionDetails}>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>{transaction.recipient}</Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>{transaction.type}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={[
                TEXT_STYLES.body, 
                { 
                  color: transaction.amount > 0 ? theme.successColor : theme.errorColor,
                  fontWeight: '600'
                }
              ]}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} FCFA
              </Text>
              <View style={styles.statusContainer}>
                {getStatusIcon(transaction.status)}
                <Text style={[TEXT_STYLES.caption, { color: getStatusColor(transaction.status), marginLeft: 4 }]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSendMoney = () => (
    <View style={styles.tabContent}>
      {/* Formulaire d'envoi */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.cardHeader}>
          <SendIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 8 }]}>Envoyer de l'argent</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Destinataire *
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
            placeholder="Nom du destinataire"
            placeholderTextColor={theme.textSecondary}
            value={recipient}
            onChangeText={setRecipient}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Numéro de téléphone
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
            placeholder="+237 6XX XXX XXX"
            placeholderTextColor={theme.textSecondary}
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Montant (FCFA) *
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

      {/* Méthodes de paiement */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>Méthode de paiement</Text>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              { 
                borderColor: selectedPaymentMethod === method.id ? theme.textPrimary : theme.cardBorder,
                backgroundColor: selectedPaymentMethod === method.id ? theme.primaryLight : 'transparent'
              }
            ]}
            onPress={() => setSelectedPaymentMethod(method.id)}
          >
            <View style={styles.methodIcon}>
              {method.icon}
            </View>
            <View style={styles.methodDetails}>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>{method.name}</Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>{method.type}</Text>
            </View>
            <View style={[
              styles.radioButton, 
              { 
                borderColor: selectedPaymentMethod === method.id ? theme.textPrimary : theme.cardBorder,
                backgroundColor: selectedPaymentMethod === method.id ? theme.textPrimary : 'transparent'
              }
            ]}>
              {selectedPaymentMethod === method.id && (
                <CheckIcon color="white" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouton d'envoi */}
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: theme.textPrimary }]}
        onPress={handleSendMoney}
      >
        <SendIcon color="white" />
        <Text style={[TEXT_STYLES.button, { color: 'white', marginLeft: 8 }]}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      {/* En-tête avec filtre */}
      <View style={[styles.historyHeader, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
        <HistoryIcon color={theme.textPrimary} />
        <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, marginLeft: 8 }]}>
          Historique des transactions
        </Text>
      </View>

      {/* Liste complète des transactions */}
      {recentTransactions.map((transaction) => (
        <View key={transaction.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.transactionHeader}>
            <View style={styles.transactionIcon}>
              {transaction.type === 'Envoi' || transaction.type === 'Paiement' ? 
                <SendIcon color={theme.errorColor} /> : 
                transaction.type === 'Reçu' ? 
                <SendIcon color={theme.successColor} /> : 
                <ReceiptIcon color={theme.textPrimary} />
              }
            </View>
            <View style={styles.transactionMainInfo}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{transaction.recipient}</Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                {new Date(transaction.date).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={[
                TEXT_STYLES.h3, 
                { 
                  color: transaction.amount > 0 ? theme.successColor : theme.errorColor,
                  fontWeight: '600'
                }
              ]}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} FCFA
              </Text>
            </View>
          </View>

          <View style={[styles.transactionDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Type</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>{transaction.type}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Contact</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>{transaction.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Statut</Text>
              <View style={styles.statusContainer}>
                {getStatusIcon(transaction.status)}
                <Text style={[TEXT_STYLES.body, { color: getStatusColor(transaction.status), marginLeft: 4 }]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const tabs = [
    { name: 'Aperçu', render: renderOverview },
    { name: 'Envoyer', render: renderSendMoney },
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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Paiements</Text>
          </View>

          {/* Info Banner */}
          <View style={[styles.infoBanner, { backgroundColor: theme.primaryLight }]}>
            <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, textAlign: 'center' }]}>
              💳 Gérez vos paiements et transferts en toute sécurité
            </Text>
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
  balanceCard: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
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
});

export default PaiementPage;
