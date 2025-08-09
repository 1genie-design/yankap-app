import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

const StreamingPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
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

  const PlayIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Polygon points="5,3 19,12 5,21" fill={color}/>
    </Svg>
  );

  const PauseIcon = ({ color = theme.warningColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="4" width="4" height="16" fill={color}/>
      <Rect x="14" y="4" width="4" height="16" fill={color}/>
    </Svg>
  );

  const MonitorIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="8" y1="21" x2="16" y2="21" stroke={color} strokeWidth="2"/>
      <Line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const MusicIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M9 18V5l12-2v13" stroke={color} strokeWidth="2" fill="none"/>
      <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <Circle cx="18" cy="16" r="3" stroke={color} strokeWidth="2" fill="none"/>
    </Svg>
  );

  const CalendarIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CreditCardIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="1" y1="10" x2="23" y2="10" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const CheckIcon = ({ color = theme.successColor }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const StarIcon = ({ color = '#FFD700', filled = true }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Polygon 
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" 
        stroke={color} 
        strokeWidth="1" 
        fill={filled ? color : 'none'}
      />
    </Svg>
  );

  // Données des plateformes
  const streamingPlatforms = [
    {
      id: 1,
      name: 'Netflix',
      description: 'Films et séries en streaming',
      price: '8,500 FCFA/mois',
      category: 'Vidéo',
      rating: 4.5,
      badge: 'Populaire',
      features: ['Contenu original', '4K Ultra HD', 'Téléchargement hors ligne', '4 écrans simultanés'],
      color: '#E50914'
    },
    {
      id: 2,
      name: 'Disney+',
      description: 'Univers Disney, Marvel, Star Wars',
      price: '6,000 FCFA/mois',
      category: 'Vidéo',
      rating: 4.7,
      badge: 'Famille',
      features: ['Contenu Disney exclusif', '4K disponible', 'Profils famille', '10 appareils'],
      color: '#113CCF'
    },
    {
      id: 3,
      name: 'Spotify Premium',
      description: 'Musique illimitée sans pub',
      price: '3,500 FCFA/mois',
      category: 'Musique',
      rating: 4.8,
      badge: 'Recommandé',
      features: ['50M+ chansons', 'Qualité haute', 'Mode hors ligne', 'Pas de publicité'],
      color: '#1DB954'
    },
    {
      id: 4,
      name: 'Amazon Prime Video',
      description: 'Vidéo et livraison rapide',
      price: '7,200 FCFA/mois',
      category: 'Vidéo',
      rating: 4.3,
      badge: 'Pack complet',
      features: ['Prime Video', 'Livraison gratuite', 'Prime Music', 'Prime Reading'],
      color: '#FF9900'
    },
    {
      id: 5,
      name: 'YouTube Premium',
      description: 'YouTube sans pub + YouTube Music',
      price: '4,800 FCFA/mois',
      category: 'Vidéo',
      rating: 4.4,
      badge: 'Nouveau',
      features: ['Sans publicité', 'Lecture en arrière-plan', 'YouTube Music', 'Téléchargements'],
      color: '#FF0000'
    },
    {
      id: 6,
      name: 'Apple Music',
      description: 'Musique et radio en streaming',
      price: '4,200 FCFA/mois',
      category: 'Musique',
      rating: 4.6,
      badge: 'Qualité audio',
      features: ['Audio spatial', 'Lossless', 'Radio live', 'Playlists curées'],
      color: '#FC3C44'
    }
  ];

  // Données des abonnements utilisateur
  const [userSubscriptions, setUserSubscriptions] = useState([
    {
      id: 1,
      name: 'Netflix',
      price: 8500,
      startDate: '2024-01-15',
      nextBilling: '2024-09-15',
      status: 'Actif',
      autoRenew: true,
      canPause: true,
      isPaused: false,
      color: '#E50914'
    },
    {
      id: 2,
      name: 'Spotify Premium',
      price: 3500,
      startDate: '2024-03-01',
      nextBilling: '2024-09-01',
      status: 'Actif',
      autoRenew: true,
      canPause: true,
      isPaused: false,
      color: '#1DB954'
    },
    {
      id: 3,
      name: 'YouTube Premium',
      price: 4800,
      startDate: '2024-07-01',
      nextBilling: '2024-08-25',
      status: 'Expire bientôt',
      autoRenew: false,
      canPause: false,
      isPaused: false,
      color: '#FF0000'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const categories = ['Tous', 'Vidéo', 'Musique'];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Populaire': return '#4CAF50';
      case 'Famille': return '#2196F3';
      case 'Recommandé': return '#FF9800';
      case 'Pack complet': return '#9C27B0';
      case 'Nouveau': return '#E91E63';
      case 'Qualité audio': return '#FF5722';
      default: return theme.textPrimary;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return theme.successColor;
      case 'Expire bientôt': return theme.warningColor;
      case 'Expiré': return theme.errorColor;
      case 'Pausé': return theme.textSecondary;
      default: return theme.textSecondary;
    }
  };

  const filteredPlatforms = selectedCategory === 'Tous' 
    ? streamingPlatforms 
    : streamingPlatforms.filter(platform => platform.category === selectedCategory);

  const calculateTotalCost = () => {
    return userSubscriptions
      .filter(sub => sub.status === 'Actif' && !sub.isPaused)
      .reduce((total, sub) => total + sub.price, 0);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} filled={true} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key={fullStars} filled={false} />);
    }
    
    return (
      <View style={styles.starsContainer}>
        {stars}
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginLeft: 4 }]}>
          {rating}
        </Text>
      </View>
    );
  };

  const toggleAutoRenew = (subscriptionId) => {
    setUserSubscriptions(prev => 
      prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, autoRenew: !sub.autoRenew }
          : sub
      )
    );
  };

  const togglePause = (subscriptionId) => {
    setUserSubscriptions(prev => 
      prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, isPaused: !sub.isPaused }
          : sub
      )
    );
  };

  const handleSubscribe = (platform) => {
    Alert.alert(
      'S\'abonner',
      `Souhaitez-vous vous abonner à ${platform.name}?\n\nPrix: ${platform.price}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'S\'abonner', 
          onPress: () => {
            Alert.alert('Succès', `Abonnement à ${platform.name} activé!`);
          }
        }
      ]
    );
  };

  const renderPlatforms = () => (
    <View style={styles.tabContent}>
      {/* Filtres par catégorie */}
      <View style={styles.filterContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              {
                backgroundColor: selectedCategory === category ? theme.textPrimary : theme.cardBackground,
                borderColor: theme.cardBorder
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              TEXT_STYLES.caption,
              { 
                color: selectedCategory === category ? 'white' : theme.textSecondary,
                fontWeight: selectedCategory === category ? '600' : '400'
              }
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des plateformes */}
      {filteredPlatforms.map((platform) => (
        <View key={platform.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.platformHeader}>
              <View style={styles.platformInfo}>
                <View style={[styles.platformIcon, { backgroundColor: platform.color }]}>
                  {platform.category === 'Vidéo' ? <MonitorIcon color="white" /> : <MusicIcon color="white" />}
                </View>
                <View style={styles.platformDetails}>
                  <View style={styles.titleRow}>
                    <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{platform.name}</Text>
                    <View style={[styles.badge, { borderColor: getBadgeColor(platform.badge) }]}>
                      <Text style={[TEXT_STYLES.caption, { color: getBadgeColor(platform.badge), fontWeight: '600' }]}>
                        {platform.badge}
                      </Text>
                    </View>
                  </View>
                  <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                    {platform.description}
                  </Text>
                  {renderStars(platform.rating)}
                </View>
              </View>
              <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
                {platform.price}
              </Text>
            </View>
          </View>

          <View style={[styles.featuresContainer, { borderTopColor: theme.divider }]}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
              Fonctionnalités incluses:
            </Text>
            {platform.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <CheckIcon color={theme.successColor} />
                <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginLeft: 8 }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.subscribeButton, { backgroundColor: theme.textPrimary }]}
            onPress={() => handleSubscribe(platform)}
          >
            <Text style={[TEXT_STYLES.button, { color: 'white' }]}>S'abonner</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderMySubscriptions = () => (
    <View style={styles.tabContent}>
      {/* Résumé des abonnements */}
      <View style={[styles.summaryCard, { backgroundColor: theme.primaryLight, borderLeftColor: theme.textPrimary }]}>
        <View style={styles.summaryHeader}>
          <CreditCardIcon color={theme.textPrimary} />
          <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, marginLeft: 8 }]}>Mes abonnements</Text>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={[TEXT_STYLES.h2, { color: theme.textPrimary }]}>
              {userSubscriptions.filter(sub => sub.status === 'Actif' && !sub.isPaused).length}
            </Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Actifs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[TEXT_STYLES.h2, { color: theme.textPrimary }]}>
              {calculateTotalCost().toLocaleString()}
            </Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>FCFA/mois</Text>
          </View>
        </View>
      </View>

      {/* Liste des abonnements */}
      {userSubscriptions.map((subscription) => (
        <View key={subscription.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.subscriptionHeader}>
            <View style={styles.subscriptionInfo}>
              <View style={[styles.platformIcon, { backgroundColor: subscription.color }]}>
                <PlayIcon color="white" />
              </View>
              <View style={styles.subscriptionDetails}>
                <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{subscription.name}</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(subscription.status) }]} />
                  <Text style={[TEXT_STYLES.caption, { color: getStatusColor(subscription.status), marginLeft: 4 }]}>
                    {subscription.isPaused ? 'Pausé' : subscription.status}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>
              {subscription.price.toLocaleString()} FCFA
            </Text>
          </View>

          <View style={[styles.subscriptionDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Date de début</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                {new Date(subscription.startDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Prochaine facturation</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                {new Date(subscription.nextBilling).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Renouvellement automatique</Text>
              <Switch
                value={subscription.autoRenew}
                onValueChange={() => toggleAutoRenew(subscription.id)}
                trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
                thumbColor={subscription.autoRenew ? 'white' : theme.textSecondary}
              />
            </View>
          </View>

          <View style={styles.actionButtons}>
            {subscription.canPause && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: subscription.isPaused ? theme.successColor : theme.warningColor }]}
                onPress={() => togglePause(subscription.id)}
              >
                {subscription.isPaused ? <PlayIcon color="white" /> : <PauseIcon color="white" />}
                <Text style={[TEXT_STYLES.caption, { color: 'white', marginLeft: 4 }]}>
                  {subscription.isPaused ? 'Reprendre' : 'Pause'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.errorColor }]}
              onPress={() => Alert.alert('Annuler l\'abonnement', `Êtes-vous sûr de vouloir annuler ${subscription.name}?`)}
            >
              <Text style={[TEXT_STYLES.caption, { color: 'white' }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const tabs = [
    { name: 'Plateformes', render: renderPlatforms },
    { name: 'Mes abonnements', render: renderMySubscriptions },
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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Streaming</Text>
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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
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
  cardHeader: {
    marginBottom: 12,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  platformInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  platformDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
  subscribeButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  subscriptionDetails: {
    flex: 1,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
  },
});

export default StreamingPage;
