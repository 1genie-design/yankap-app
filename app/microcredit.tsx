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
  Modal,
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

const MicrocreditPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('6');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [showSimulator, setShowSimulator] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const carouselRef = useRef(null);

  const { width: screenWidth } = Dimensions.get('window');
  const cardWidth = screenWidth - 60; // 20px margin de chaque côté + 20px padding

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

  const CoinIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const TrendingUpIcon = ({ color = theme.successColor }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Polygon points="13,6 18,6 18,11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Path d="M6 18L18 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ClockIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CheckIcon = ({ color = theme.successColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const XIcon = ({ color = theme.errorColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );

  const CalculatorIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="8" y1="6" x2="16" y2="6" stroke={color} strokeWidth="2"/>
      <Line x1="8" y1="10" x2="8" y2="10.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="12" y1="10" x2="12" y2="10.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="16" y1="10" x2="16" y2="10.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="8" y1="14" x2="8" y2="14.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="12" y1="14" x2="12" y2="14.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="16" y1="14" x2="16" y2="14.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="8" y1="18" x2="8" y2="18.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="12" y1="18" x2="16" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );

  const ShieldIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const FileTextIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" fill="none"/>
      <Polygon points="14,2 14,8 20,8" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2"/>
      <Line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2"/>
      <Line x1="10" y1="9" x2="8" y2="9" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const UserCheckIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2"/>
      <Circle cx="8.5" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M17 11l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  // Données des offres de microcrédits
  const microcreditOffers = [
    {
      id: 1,
      name: 'Crédit Express',
      minAmount: 50000,
      maxAmount: 500000,
      interestRate: 12,
      maxDuration: 12,
      features: ['Approbation rapide', 'Sans garantie', 'Remboursement flexible'],
      description: 'Idéal pour les besoins urgents',
      badge: 'Populaire',
      badgeColor: '#4CAF50',
      processingTime: '24h'
    },
    {
      id: 2,
      name: 'Crédit Entreprise',
      minAmount: 200000,
      maxAmount: 2000000,
      interestRate: 8,
      maxDuration: 24,
      features: ['Taux préférentiel', 'Accompagnement business', 'Période de grâce'],
      description: 'Pour développer votre activité',
      badge: 'Recommandé',
      badgeColor: '#FF9800',
      processingTime: '72h'
    },
    {
      id: 3,
      name: 'Crédit Étudiant',
      minAmount: 25000,
      maxAmount: 300000,
      interestRate: 6,
      maxDuration: 18,
      features: ['Taux réduit', 'Report de paiement', 'Conditions souples'],
      description: 'Financez vos études facilement',
      badge: 'Étudiant',
      badgeColor: '#2196F3',
      processingTime: '48h'
    },
    {
      id: 4,
      name: 'Crédit Agricole',
      minAmount: 100000,
      maxAmount: 1500000,
      interestRate: 10,
      maxDuration: 36,
      features: ['Adapté aux cycles agricoles', 'Remboursement saisonnier', 'Conseil agricole'],
      description: 'Spécialement conçu pour l\'agriculture',
      badge: 'Agricole',
      badgeColor: '#8BC34A',
      processingTime: '5 jours'
    }
  ];

  // Données des prêts utilisateur
  const [userLoans, setUserLoans] = useState([
    {
      id: 1,
      type: 'Crédit Express',
      amount: 250000,
      remainingAmount: 120000,
      monthlyPayment: 22500,
      nextPayment: '2024-08-15',
      status: 'Actif',
      progress: 52
    },
    {
      id: 2,
      type: 'Crédit Entreprise',
      amount: 800000,
      remainingAmount: 560000,
      monthlyPayment: 45000,
      nextPayment: '2024-08-20',
      status: 'Actif',
      progress: 30
    },
    {
      id: 3,
      type: 'Crédit Express',
      amount: 150000,
      remainingAmount: 0,
      monthlyPayment: 0,
      nextPayment: '-',
      status: 'Remboursé',
      progress: 100
    }
  ]);

  // Score de crédit utilisateur
  const creditScore = {
    score: 720,
    status: 'Bon',
    factors: [
      { name: 'Historique de paiement', score: 85, status: 'Excellent' },
      { name: 'Utilisation du crédit', score: 65, status: 'Bon' },
      { name: 'Ancienneté des comptes', score: 70, status: 'Bon' },
      { name: 'Types de crédit', score: 75, status: 'Très bon' }
    ]
  };

  const calculateMonthlyPayment = (amount, rate, months) => {
    const monthlyRate = rate / 100 / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
  };

  const getScoreColor = (score) => {
    if (score >= 750) return theme.successColor;
    if (score >= 650) return theme.textPrimary;
    if (score >= 550) return theme.warningColor;
    return theme.errorColor;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Actif': return <ClockIcon color={theme.textPrimary} />;
      case 'Remboursé': return <CheckIcon color={theme.successColor} />;
      case 'En retard': return <XIcon color={theme.errorColor} />;
      default: return <ClockIcon color={theme.textSecondary} />;
    }
  };

  const handleLoanApplication = (offer) => {
    Alert.alert(
      'Demande de crédit',
      `Souhaitez-vous faire une demande pour ${offer.name}?\n\nMontant: ${loanAmount || offer.minAmount.toLocaleString()} FCFA\nDurée: ${loanDuration} mois\nTaux: ${offer.interestRate}%`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Continuer', 
          onPress: () => {
            Alert.alert('Succès', 'Votre demande a été soumise! Vous recevrez une réponse sous ' + offer.processingTime);
          }
        }
      ]
    );
  };

  const onScroll = (event) => {
    const slideSize = cardWidth + 20; // largeur de la carte + espacement
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentOfferIndex(index);
  };

  const renderOfferCard = ({ item: offer, index }) => (
    <View style={[styles.carouselCard, { width: cardWidth, backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
      <View style={styles.cardHeader}>
        <View style={styles.offerTitleRow}>
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{offer.name}</Text>
          <View style={[styles.badge, { borderColor: offer.badgeColor }]}>
            <Text style={[TEXT_STYLES.caption, { color: offer.badgeColor, fontWeight: '600' }]}>
              {offer.badge}
            </Text>
          </View>
        </View>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 12 }]}>
          {offer.description}
        </Text>
        
        <View style={styles.offerDetails}>
          <View style={styles.detailItem}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Montant</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
              {offer.minAmount.toLocaleString()} - {offer.maxAmount.toLocaleString()} FCFA
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Taux d'intérêt</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
              {offer.interestRate}% / an
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Durée max</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
              {offer.maxDuration} mois
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Traitement</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.successColor, fontWeight: '600' }]}>
              {offer.processingTime}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.featuresContainer, { borderTopColor: theme.divider }]}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>Avantages inclus:</Text>
        {offer.features.map((feature, featureIndex) => (
          <View key={featureIndex} style={styles.featureItem}>
            <CheckIcon color={theme.successColor} />
            <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginLeft: 8 }]}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.applyButton, { backgroundColor: theme.textPrimary }]}
        onPress={() => handleLoanApplication(offer)}
      >
        <Text style={[TEXT_STYLES.button, { color: 'white' }]}>Faire une demande</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCreditOffers = () => (
    <View style={styles.tabContent}>
      <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, marginBottom: 20, textAlign: 'center' }]}>
        Choisissez l'offre de microcrédit qui correspond à vos besoins
      </Text>

      <FlatList
        ref={carouselRef}
        data={microcreditOffers}
        renderItem={renderOfferCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + 20}
        snapToAlignment="start"
        contentInset={{
          top: 0,
          left: 20,
          bottom: 0,
          right: 20,
        }}
        contentContainerStyle={{
          paddingHorizontal: 10,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {/* Indicateurs de pagination */}
      <View style={styles.paginationContainer}>
        {microcreditOffers.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === currentOfferIndex ? theme.textPrimary : theme.cardBorder,
              }
            ]}
            onPress={() => {
              carouselRef.current?.scrollToIndex({
                index,
                animated: true,
              });
              setCurrentOfferIndex(index);
            }}
          />
        ))}
      </View>

      {/* Informations sur l'offre actuelle */}
      <View style={[styles.currentOfferInfo, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
        <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, textAlign: 'center' }]}>
          💡 {microcreditOffers[currentOfferIndex]?.name} - {microcreditOffers[currentOfferIndex]?.badge}
        </Text>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, textAlign: 'center', marginTop: 4 }]}>
          Swipez pour découvrir d'autres offres
        </Text>
      </View>
    </View>
  );

  const renderMyLoans = () => (
    <View style={styles.tabContent}>
      {/* Résumé des prêts */}
      <View style={[styles.summaryCard, { backgroundColor: theme.primaryLight, borderLeftColor: theme.textPrimary }]}>
        <View style={styles.summaryHeader}>
          <CoinIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, marginLeft: 8 }]}>Mes prêts</Text>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={[TEXT_STYLES.h2, { color: theme.textPrimary }]}>
              {userLoans.filter(loan => loan.status === 'Actif').length}
            </Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Actifs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[TEXT_STYLES.h2, { color: theme.textPrimary }]}>
              {userLoans.reduce((total, loan) => total + loan.remainingAmount, 0).toLocaleString()}
            </Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>FCFA restant</Text>
          </View>
        </View>
      </View>

      {userLoans.map((loan) => (
        <View key={loan.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.loanHeader}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{loan.type}</Text>
              <View style={styles.statusContainer}>
                {getStatusIcon(loan.status)}
                <Text style={[TEXT_STYLES.caption, { 
                  color: loan.status === 'Actif' ? theme.textPrimary : 
                         loan.status === 'Remboursé' ? theme.successColor : theme.errorColor,
                  marginLeft: 4 
                }]}>
                  {loan.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Progression</Text>
                <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, fontWeight: '600' }]}>
                  {loan.progress}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.cardBorder }]}>
                <View style={[
                  styles.progressFill, 
                  { 
                    width: `${loan.progress}%`, 
                    backgroundColor: loan.status === 'Remboursé' ? theme.successColor : theme.textPrimary 
                  }
                ]} />
              </View>
            </View>
          </View>

          <View style={[styles.loanDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Montant initial</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
                {loan.amount.toLocaleString()} FCFA
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Montant restant</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
                {loan.remainingAmount.toLocaleString()} FCFA
              </Text>
            </View>
            {loan.status === 'Actif' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Paiement mensuel</Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.warningColor, fontWeight: '600' }]}>
                    {loan.monthlyPayment.toLocaleString()} FCFA
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Prochain paiement</Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
                    {new Date(loan.nextPayment).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </>
            )}
          </View>

          {loan.status === 'Actif' && (
            <TouchableOpacity
              style={[styles.payButton, { backgroundColor: theme.successColor }]}
              onPress={() => Alert.alert('Paiement', 'Redirection vers la page de paiement...')}
            >
              <Text style={[TEXT_STYLES.button, { color: 'white' }]}>Effectuer un paiement</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderCreditScore = () => (
    <View style={styles.tabContent}>
      {/* Score principal */}
      <View style={[styles.scoreCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.scoreHeader}>
          <ShieldIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 8 }]}>Score de crédit</Text>
        </View>
        
        <View style={styles.scoreDisplay}>
          <Text style={[TEXT_STYLES.h1, { color: getScoreColor(creditScore.score), fontSize: 48 }]}>
            {creditScore.score}
          </Text>
          <Text style={[TEXT_STYLES.body, { color: getScoreColor(creditScore.score), fontWeight: '600' }]}>
            {creditScore.status}
          </Text>
        </View>

        <View style={styles.scoreRange}>
          <View style={styles.rangeItem}>
            <Text style={[TEXT_STYLES.caption, { color: theme.errorColor }]}>300-549</Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.errorColor }]}>Mauvais</Text>
          </View>
          <View style={styles.rangeItem}>
            <Text style={[TEXT_STYLES.caption, { color: theme.warningColor }]}>550-649</Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.warningColor }]}>Moyen</Text>
          </View>
          <View style={styles.rangeItem}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>650-749</Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>Bon</Text>
          </View>
          <View style={styles.rangeItem}>
            <Text style={[TEXT_STYLES.caption, { color: theme.successColor }]}>750-850</Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.successColor }]}>Excellent</Text>
          </View>
        </View>
      </View>

      {/* Facteurs du score */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 16 }]}>
          Facteurs influençant votre score
        </Text>
        
        {creditScore.factors.map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>{factor.name}</Text>
              <Text style={[TEXT_STYLES.caption, { 
                color: factor.score >= 80 ? theme.successColor : 
                       factor.score >= 70 ? theme.textPrimary : 
                       factor.score >= 60 ? theme.warningColor : theme.errorColor,
                fontWeight: '600'
              }]}>
                {factor.status}
              </Text>
            </View>
            <View style={styles.factorProgress}>
              <View style={[styles.progressBar, { backgroundColor: theme.cardBorder }]}>
                <View style={[
                  styles.progressFill, 
                  { 
                    width: `${factor.score}%`, 
                    backgroundColor: factor.score >= 80 ? theme.successColor : 
                                   factor.score >= 70 ? theme.textPrimary : 
                                   factor.score >= 60 ? theme.warningColor : theme.errorColor
                  }
                ]} />
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginLeft: 8 }]}>
                {factor.score}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Conseils pour améliorer le score */}
      <View style={[styles.card, { backgroundColor: theme.primaryLight, borderColor: theme.textPrimary }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, marginBottom: 16 }]}>
          💡 Conseils pour améliorer votre score
        </Text>
        
        <View style={styles.tipItem}>
          <CheckIcon color={theme.successColor} />
          <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginLeft: 8 }]}>
            Payez vos mensualités à temps chaque mois
          </Text>
        </View>
        <View style={styles.tipItem}>
          <CheckIcon color={theme.successColor} />
          <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginLeft: 8 }]}>
            Maintenez un faible taux d'utilisation du crédit
          </Text>
        </View>
        <View style={styles.tipItem}>
          <CheckIcon color={theme.successColor} />
          <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginLeft: 8 }]}>
            Évitez de multiplier les demandes de crédit
          </Text>
        </View>
        <View style={styles.tipItem}>
          <CheckIcon color={theme.successColor} />
          <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginLeft: 8 }]}>
            Diversifiez vos types de crédit progressivement
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSimulator = () => (
    <View style={styles.tabContent}>
      <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, marginBottom: 20, textAlign: 'center' }]}>
        Simulez votre prêt et découvrez vos mensualités
      </Text>

      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <View style={styles.simulatorHeader}>
          <CalculatorIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 8 }]}>Simulateur de prêt</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Montant souhaité (FCFA)
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
            placeholder="Ex: 500000"
            placeholderTextColor={theme.textSecondary}
            value={loanAmount}
            onChangeText={setLoanAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Durée (mois)
          </Text>
          <View style={styles.durationSelector}>
            {['6', '12', '18', '24', '36'].map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  { 
                    backgroundColor: loanDuration === duration ? theme.textPrimary : theme.cardBorder,
                    borderColor: theme.cardBorder
                  }
                ]}
                onPress={() => setLoanDuration(duration)}
              >
                <Text style={[
                  TEXT_STYLES.caption,
                  { color: loanDuration === duration ? 'white' : theme.textSecondary }
                ]}>
                  {duration}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Motif du prêt
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
            placeholder="Ex: Développement d'activité"
            placeholderTextColor={theme.textSecondary}
            value={loanPurpose}
            onChangeText={setLoanPurpose}
          />
        </View>

        {loanAmount && (
          <View style={[styles.simulationResult, { backgroundColor: theme.primaryLight }]}>
            <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, marginBottom: 12 }]}>
              Résultat de la simulation
            </Text>
            
            <View style={styles.resultRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Montant emprunté</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>
                {parseInt(loanAmount).toLocaleString()} FCFA
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Mensualité (taux 10%)</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
                {calculateMonthlyPayment(parseInt(loanAmount), 10, parseInt(loanDuration)).toLocaleString()} FCFA
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Coût total</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.warningColor, fontWeight: '600' }]}>
                {(calculateMonthlyPayment(parseInt(loanAmount), 10, parseInt(loanDuration)) * parseInt(loanDuration)).toLocaleString()} FCFA
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.simulateButton, { backgroundColor: theme.textPrimary }]}
          onPress={() => Alert.alert('Simulation', 'Simulation mise à jour!')}
        >
          <Text style={[TEXT_STYLES.button, { color: 'white' }]}>Mettre à jour la simulation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const tabs = [
    { name: 'Offres', render: renderCreditOffers },
    { name: 'Mes prêts', render: renderMyLoans },
    { name: 'Score crédit', render: renderCreditScore },
    { name: 'Simulateur', render: renderSimulator },
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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Microcrédit</Text>
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
    borderBottomColor: '#E0E0E0',
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
  summaryCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  carouselCard: {
    marginHorizontal: 10,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardHeader: {
    marginBottom: 12,
  },
  offerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  offerDetails: {
    marginVertical: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  featuresContainer: {
    marginVertical: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  applyButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  loanDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  payButton: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  scoreCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rangeItem: {
    alignItems: 'center',
    flex: 1,
  },
  factorItem: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  factorProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  simulatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  durationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 45,
    alignItems: 'center',
  },
  simulationResult: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1DBAA3',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  simulateButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  currentOfferInfo: {
    marginTop: 12,
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
  },
});

export default MicrocreditPage;
