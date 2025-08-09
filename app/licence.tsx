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

const LicencePage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
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

  // Icônes SVG simplifiées
  const ArrowLeftIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const OfficeIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="9" y1="9" x2="15" y2="9" stroke={color} strokeWidth="2"/>
      <Line x1="9" y1="15" x2="15" y2="15" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const DesignIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const CodeIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="m18 16 4-4-4-4M6 8l-4 4 4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const MusicIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M9 18V5l12-2v13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <Circle cx="18" cy="16" r="3" stroke={color} strokeWidth="2" fill="none"/>
    </Svg>
  );

  const StarIcon = ({ color = theme.warningColor, filled = false }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? color : "none"}>
      <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CheckIcon = ({ color = theme.successColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ClockIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const SettingsIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="1"/>
    </Svg>
  );

  // Données du catalogue de licences
  const catalogueData = [
    {
      id: 1,
      name: 'Microsoft Office 365',
      category: 'Bureautique',
      icon: <OfficeIcon color="#0078D4" />,
      price: '12,000 FCFA/mois',
      rating: 4.8,
      badge: 'Populaire',
      description: 'Suite bureautique complète',
      features: ['Word, Excel, PowerPoint', 'OneDrive 1TB', 'Teams inclus'],
      badgeColor: '#4CAF50'
    },
    {
      id: 2,
      name: 'Adobe Creative Suite',
      category: 'Design',
      icon: <DesignIcon color="#FF0000" />,
      price: '25,000 FCFA/mois',
      rating: 4.9,
      badge: 'Pro',
      description: 'Outils de création professionnels',
      features: ['Photoshop, Illustrator', 'Premiere Pro', 'Cloud sync'],
      badgeColor: '#FF9800'
    },
    {
      id: 3,
      name: 'Spotify Premium',
      category: 'Multimédia',
      icon: <MusicIcon color="#1DB954" />,
      price: '3,500 FCFA/mois',
      rating: 4.6,
      badge: 'Recommandé',
      description: 'Musique en streaming illimitée',
      features: ['Sans publicité', 'Téléchargement offline', 'Qualité haute'],
      badgeColor: '#2196F3'
    },
    {
      id: 4,
      name: 'GitHub Pro',
      category: 'Développement',
      icon: <CodeIcon color="#333" />,
      price: '6,000 FCFA/mois',
      rating: 4.5,
      badge: 'Dev',
      description: 'Plateforme de développement collaborative',
      features: ['Repos privés illimités', 'GitHub Actions', 'Support prioritaire'],
      badgeColor: '#9C27B0'
    },
    {
      id: 5,
      name: 'Figma Professional',
      category: 'Design',
      icon: <DesignIcon color="#F24E1E" />,
      price: '15,000 FCFA/mois',
      rating: 4.8,
      badge: 'Nouveau',
      description: 'Outil de design collaboratif',
      features: ['Collaboration temps réel', 'Prototypage avancé', 'Versions illimitées'],
      badgeColor: '#E91E63'
    },
    {
      id: 6,
      name: 'Canva Pro',
      category: 'Design',
      icon: <DesignIcon color="#00C4CC" />,
      price: '8,000 FCFA/mois',
      rating: 4.4,
      badge: 'Populaire',
      description: 'Design graphique simplifié',
      features: ['Templates premium', 'Background Remover', 'Brand Kit'],
      badgeColor: '#4CAF50'
    }
  ];

  // Données des licences utilisateur
  const [userLicences, setUserLicences] = useState([
    {
      id: 1,
      name: 'Microsoft Office 365',
      icon: <OfficeIcon color="#0078D4" />,
      price: '12,000 FCFA/mois',
      startDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'Active',
      daysLeft: 159,
      autoRenew: true
    },
    {
      id: 2,
      name: 'Spotify Premium',
      icon: <MusicIcon color="#1DB954" />,
      price: '3,500 FCFA/mois',
      startDate: '2024-07-01',
      expiryDate: '2024-08-31',
      status: 'Expire bientôt',
      daysLeft: 23,
      autoRenew: false
    },
    {
      id: 3,
      name: 'GitHub Pro',
      icon: <CodeIcon color="#333" />,
      price: '6,000 FCFA/mois',
      startDate: '2024-06-01',
      expiryDate: '2025-06-01',
      status: 'Active',
      daysLeft: 297,
      autoRenew: true
    }
  ]);

  const categories = ['Tous', 'Bureautique', 'Design', 'Développement', 'Multimédia'];

  const getFilteredCatalogue = () => {
    if (selectedCategory === 'Tous') {
      return catalogueData;
    }
    return catalogueData.filter(item => item.category === selectedCategory);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return theme.successColor;
      case 'Expire bientôt': return theme.warningColor;
      case 'Expiré': return theme.errorColor;
      default: return theme.textSecondary;
    }
  };

  const handlePurchase = (product) => {
    Alert.alert(
      'Acheter une licence',
      `Souhaitez-vous acheter ${product.name}?\n\nPrix: ${product.price}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Acheter', 
          onPress: () => {
            Alert.alert('Succès', 'Licence ajoutée à vos abonnements!');
          }
        }
      ]
    );
  };

  const handleRenewal = (licence) => {
    Alert.alert(
      'Renouvellement',
      `Souhaitez-vous renouveler ${licence.name}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Renouveler', 
          onPress: () => {
            Alert.alert('Succès', 'Licence renouvelée avec succès!');
          }
        }
      ]
    );
  };

  const toggleAutoRenew = (licenceId) => {
    setUserLicences(prev => 
      prev.map(licence => 
        licence.id === licenceId 
          ? { ...licence, autoRenew: !licence.autoRenew }
          : licence
      )
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} color={theme.warningColor} filled={true} />);
    }
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" color={theme.warningColor} filled={false} />);
    }
    return stars;
  };

  const renderCatalogue = () => (
    <View style={styles.tabContent}>
      <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, marginBottom: 20, textAlign: 'center' }]}>
        Découvrez et achetez des licences pour vos logiciels favoris
      </Text>

      {/* Filtres par catégorie */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
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
      </ScrollView>

      {/* Liste des produits */}
      {getFilteredCatalogue().map((product) => (
        <View key={product.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              {product.icon}
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.productTitleRow}>
                <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{product.name}</Text>
                <View style={[styles.badge, { backgroundColor: product.badgeColor }]}>
                  <Text style={[TEXT_STYLES.caption, { color: 'white', fontWeight: '600' }]}>{product.badge}</Text>
                </View>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 4 }]}>{product.description}</Text>
              
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(product.rating)}
                </View>
                <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginLeft: 8 }]}>
                  {product.rating}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.featuresContainer, { borderTopColor: theme.divider }]}>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>Fonctionnalités incluses:</Text>
            {product.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <CheckIcon color={theme.successColor} />
                <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginLeft: 8 }]}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.cardFooter}>
            <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary }]}>{product.price}</Text>
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: theme.textPrimary }]}
              onPress={() => handlePurchase(product)}
            >
              <Text style={[TEXT_STYLES.button, { color: 'white' }]}>Acheter</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMyLicences = () => (
    <View style={styles.tabContent}>
      <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, marginBottom: 20, textAlign: 'center' }]}>
        Gérez vos abonnements et licences actives
      </Text>

      {/* Résumé */}
      <View style={[styles.summaryCard, { backgroundColor: theme.primaryLight, borderLeftColor: theme.textPrimary }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, marginBottom: 12 }]}>Mes licences</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={[TEXT_STYLES.h2, { color: theme.textPrimary }]}>
              {userLicences.filter(l => l.status === 'Active').length}
            </Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Actives</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[TEXT_STYLES.h2, { color: theme.textPrimary }]}>
              {userLicences.reduce((total, l) => total + parseInt(l.price.replace(/[^\d]/g, '')), 0).toLocaleString()}
            </Text>
            <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>FCFA/mois</Text>
          </View>
        </View>
      </View>

      {userLicences.map((licence) => (
        <View key={licence.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              {licence.icon}
            </View>
            <View style={styles.cardInfo}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{licence.name}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(licence.status) }]} />
                <Text style={[TEXT_STYLES.caption, { color: getStatusColor(licence.status), marginLeft: 6 }]}>
                  {licence.status}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.licenceDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Prix</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>{licence.price}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Expire le</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                {new Date(licence.expiryDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Jours restants</Text>
              <View style={styles.daysContainer}>
                <ClockIcon color={licence.daysLeft < 30 ? theme.warningColor : theme.textSecondary} />
                <Text style={[TEXT_STYLES.caption, { 
                  color: licence.daysLeft < 30 ? theme.warningColor : theme.textTertiary, 
                  marginLeft: 4 
                }]}>
                  {licence.daysLeft} jours
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Renouvellement auto</Text>
              <Switch
                value={licence.autoRenew}
                onValueChange={() => toggleAutoRenew(licence.id)}
                trackColor={{ false: theme.cardBorder, true: theme.primaryLight }}
                thumbColor={licence.autoRenew ? theme.textPrimary : theme.textSecondary}
              />
            </View>
          </View>

          <View style={styles.licenceActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.cardBackground, borderColor: theme.textPrimary }]}
              onPress={() => Alert.alert('Gestion', 'Paramètres de la licence...')}
            >
              <SettingsIcon color={theme.textPrimary} />
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, marginLeft: 8 }]}>Gérer</Text>
            </TouchableOpacity>
            
            {licence.status === 'Expire bientôt' && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.textPrimary }]}
                onPress={() => handleRenewal(licence)}
              >
                <Text style={[TEXT_STYLES.caption, { color: 'white' }]}>Renouveler</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const tabs = [
    { name: 'Catalogue', render: renderCatalogue },
    { name: 'Mes licences', render: renderMyLicences },
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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Licences Produits</Text>
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
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  summaryCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 12,
    padding: 8,
  },
  cardInfo: {
    flex: 1,
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  buyButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
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
  licenceDetails: {
    borderTopWidth: 0.5,
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  licenceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default LicencePage;
