import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, useColorScheme, Animated, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

// Thèmes YANKAP
const THEMES = {
  light: {
    background: '#F5F5F5',
    textPrimary: '#1DBAA3',
    textSecondary: '#666',
    textTertiary: '#333',
    statusBarStyle: 'dark-content' as const,
    cardBackground: 'white',
    cardBorder: '#E0E0E0',
    inputBackground: '#FFFFFF',
    inputBorder: '#E0E0E0',
    successColor: '#4CAF50',
    warningColor: '#FF9800',
    errorColor: '#F44336',
    infoColor: '#2196F3',
    primaryLight: '#E8F8F5',
    secondaryColor: '#444444', // Gris foncé pour les éléments secondaires
    secondaryLight: '#F5F5F5', // Gris clair pour les backgrounds
  },
  dark: {
    background: '#121212',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    statusBarStyle: 'light-content' as const,
    cardBackground: '#1F1F1F',
    cardBorder: '#333',
    inputBackground: '#1F1F1F',
    inputBorder: '#333',
    successColor: '#4CAF50',
    warningColor: '#FF9800',
    errorColor: '#F44336',
    infoColor: '#2196F3',
    primaryLight: 'rgba(29, 186, 163, 0.1)',
    secondaryColor: '#CCCCCC', // Gris clair pour les éléments secondaires (mode sombre)
    secondaryLight: '#2A2A2A', // Gris foncé pour les backgrounds
  },
};

// Icônes SVG modernes pour les services
const SearchIcon = ({ color = '#666' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const PaymentIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="12" rx="3" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M2 10h20" stroke={color} strokeWidth="2"/>
    <Path d="M6 14h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const PhoneIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M12 18h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const TransferIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M7 17l5-5 5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M17 7l-5 5-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const BillIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M14 2v6h6" stroke={color} strokeWidth="2"/>
    <Path d="M16 13H8" stroke={color} strokeWidth="2"/>
    <Path d="M16 17H8" stroke={color} strokeWidth="2"/>
    <Path d="M10 9H8" stroke={color} strokeWidth="2"/>
  </Svg>
);

const LoanIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2"/>
    <Path d="M2 12l10 5 10-5" stroke={color} strokeWidth="2"/>
  </Svg>
);

const CurrencyIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M16 8a4 4 0 0 0-8 0c0 1.5 1 3 2.5 3.5L12 13l1.5-1.5C15 11 16 9.5 16 8z" stroke={color} strokeWidth="1.5" fill="none"/>
  </Svg>
);

const LicenseIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M9 9h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M9 15h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Circle cx="7" cy="9" r="1" fill={color}/>
    <Circle cx="7" cy="15" r="1" fill={color}/>
    <Path d="M16 3v4l-2-1-2 1V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const StreamingIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="8" cy="12" r="2" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M14 10l4 2-4 2v-4z" fill={color}/>
    <Path d="M6 4v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M10 4v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M14 4v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M18 4v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

// Données des services
const SERVICES_DATA = [
  {
    id: 'payment',
    title: 'Paiements',
    description: 'Paiements marchands et en ligne',
    icon: PaymentIcon,
    color: '#1DBAA3',
    badge: null,
    badgeColor: null
  },
  {
    id: 'recharge',
    title: 'Recharges',
    description: 'Crédit téléphonique et data',
    icon: PhoneIcon,
    color: '#2196F3',
    badge: null,
    badgeColor: null
  },
  {
    id: 'transfer',
    title: 'Transferts',
    description: 'Envois d\'argent internationaux',
    icon: TransferIcon,
    color: '#FF9800',
    badge: null,
    badgeColor: null
  },
  {
    id: 'bills',
    title: 'Factures',
    description: 'Électricité, eau, internet',
    icon: BillIcon,
    color: '#9C27B0',
    badge: null,
    badgeColor: null
  },
  {
    id: 'loans',
    title: 'Microcrédits',
    description: 'Prêts express et flexible',
    icon: LoanIcon,
    color: '#E91E63',
    badge: 'Nouveau',
    badgeColor: '#E91E63'
  },
  {
    id: 'administratif',
    title: 'Administratif',
    description: 'Gestion administrative et paperasse',
    icon: CurrencyIcon,
    color: '#607D8B',
    badge: null,
    badgeColor: null
  },
  {
    id: 'license',
    title: 'Licence Produits',
    description: 'Gestion des licences logicielles',
    icon: LicenseIcon,
    color: '#795548',
    badge: null,
    badgeColor: null
  },
  {
    id: 'streaming',
    title: 'Streaming',
    description: 'Services de streaming vidéo',
    icon: StreamingIcon,
    color: '#FF5722',
    badge: 'Nouveau',
    badgeColor: '#FF5722'
  }
];

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;

  // 🎭 Animation disparition/apparition avec slide down
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  // États pour la recherche
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour les sections dépliables
  const [isOtherServicesExpanded, setIsOtherServicesExpanded] = useState(false);

  // Organisation des services par sections
  const mostUsedServices = SERVICES_DATA.filter(service => 
    ['payment', 'recharge'].includes(service.id)
  );

  const recommendedServices = SERVICES_DATA.filter(service => 
    ['transfer', 'bills'].includes(service.id)
  );

  const otherServices = SERVICES_DATA.filter(service => 
    !['payment', 'recharge', 'transfer', 'bills'].includes(service.id)
  );

  // Fonction de filtrage des services
  const getFilteredServices = () => {
    if (searchQuery === '') {
      return { mostUsed: mostUsedServices, recommended: recommendedServices, others: otherServices };
    }
    
    const filtered = SERVICES_DATA.filter(service => 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return { mostUsed: [], recommended: [], others: filtered };
  };

  const { mostUsed, recommended, others } = getFilteredServices();

  useFocusEffect(
    React.useCallback(() => {
      // Phase 1 : Démarrer invisible et en haut
      fadeAnim.setValue(0);
      slideAnim.setValue(-50);
      
      // Phase 2 : Délai de 300ms puis apparition
      const timer = setTimeout(() => {
        // Phase 3 : Apparition avec slide down
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);
      
      return () => {
        clearTimeout(timer);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      };
    }, [fadeAnim, slideAnim])
  );

  const handleServicePress = (service) => {
    switch (service.id) {
      case 'payment':
        router.push('/paiement');
        break;
      case 'bills':
        router.push('/factures');
        break;
      case 'recharge':
        router.push('/recharge');
        break;
      case 'transfer':
        router.push('/transferts-nationaux');
        break;
      case 'loans':
        router.push('/microcredit');
        break;
      case 'administratif':
        router.push('/administratif');
        break;
      case 'license':
        router.push('/licence');
        break;
      case 'streaming':
        router.push('/streaming');
        break;
      default:
        // Pour les autres services non encore implémentés
        console.log('Service sélectionné:', service.title);
        // TODO: Implémenter les autres services
        break;
    }
  };

  return (
    <>
      <StatusBar 
        barStyle={theme.statusBarStyle} 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      <Animated.View style={[styles.container, { 
        backgroundColor: theme.background,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        
        {/* Grille des services */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Barre de recherche interactive */}
          <View style={styles.searchAndFiltersRow}>
            {showSearchBar ? (
              /* Mode recherche : Barre de recherche avec bouton de fermeture */
              <View style={styles.searchBarContainer}>
                <TouchableOpacity 
                  style={[
                    styles.searchIcon, 
                    { 
                      borderColor: theme.cardBorder,
                      backgroundColor: 'transparent'
                    }
                  ]}
                  onPress={() => {
                    setShowSearchBar(false);
                    setSearchQuery('');
                  }}
                >
                  <SearchIcon color={theme.textSecondary} />
                </TouchableOpacity>
                
                <View style={[styles.searchInput, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
                  <TextInput
                    style={[styles.searchInputText, { color: theme.textPrimary }]}
                    placeholder="Rechercher un service..."
                    placeholderTextColor={theme.textSecondary}
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                    }}
                    onSubmitEditing={() => {
                      // Valider la recherche et masquer la barre
                      setShowSearchBar(false);
                    }}
                    autoFocus={true}
                    returnKeyType="search"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                      <Text style={[styles.clearSearchText, { color: theme.textSecondary }]}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              /* Mode normal : Titre avec bouton de recherche */
              <View style={[styles.servicesHeader, { marginBottom: 20 }]}>
                <TouchableOpacity 
                  style={[
                    styles.searchIconButton, 
                    { 
                      borderColor: searchQuery !== '' ? '#1DBAA3' : theme.cardBorder,
                      backgroundColor: searchQuery !== '' ? '#1DBAA308' : 'transparent'
                    }
                  ]}
                  onPress={() => setShowSearchBar(true)}
                >
                  <SearchIcon color={searchQuery !== '' ? '#1DBAA3' : theme.textSecondary} />
                </TouchableOpacity>
                <Text style={[styles.servicesTitle, { color: theme.textSecondary }]}>
                  Tous vos services financiers
                </Text>
              </View>
            )}
          </View>
          
          {/* Affichage conditionnel : recherche ou sections */}
          {searchQuery !== '' ? (
            /* Mode recherche : Affichage simple des résultats */
            <View style={styles.servicesGrid}>
              {others.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[styles.serviceCard, { 
                    backgroundColor: theme.cardBackground, 
                    borderColor: theme.cardBorder 
                  }]}
                  onPress={() => handleServicePress(service)}
                  activeOpacity={0.7}
                >
                  {/* Badge si présent */}
                  {service.badge && (
                    <View style={[styles.serviceBadge, { backgroundColor: `${service.badgeColor}15` }]}>
                      <Text style={[styles.serviceBadgeText, { color: service.badgeColor }]}>
                        {service.badge}
                      </Text>
                    </View>
                  )}
                  
                  {/* Icône */}
                  <View style={[styles.serviceIconContainer, { backgroundColor: `${service.color}15` }]}>
                    <service.icon color={service.color} />
                  </View>
                  
                  {/* Contenu */}
                  <View style={styles.serviceContent}>
                    <Text style={[styles.serviceTitle, { color: theme.textTertiary }]} numberOfLines={1}>
                      {service.title}
                    </Text>
                    <Text style={[styles.serviceDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                      {service.description}
                    </Text>
                  </View>
                  
                  {/* Indicateur d'action */}
                  <View style={[styles.serviceArrow, { backgroundColor: `${service.color}10` }]}>
                    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <Path 
                        d="M9 18l6-6-6-6" 
                        stroke={service.color} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            /* Mode normal : Affichage par sections */
            <>
              {/* Section 1: Utilisés récemment */}
              <View style={styles.sectionContainer}>
                <View style={[styles.sectionHeader, { borderBottomColor: '#E0E0E0' }]}>
                  <Text style={[styles.sectionTitle, { color: theme.secondaryColor }]}>Utilisés récemment</Text>
                </View>
                
                <View style={styles.servicesGrid}>
                  {mostUsed.map((service) => (
                    <TouchableOpacity
                      key={service.id}
                      style={[styles.serviceCard, { 
                        backgroundColor: theme.cardBackground, 
                        borderColor: theme.cardBorder 
                      }]}
                      onPress={() => handleServicePress(service)}
                      activeOpacity={0.7}
                    >
                      {/* Badge si présent */}
                      {service.badge && (
                        <View style={[styles.serviceBadge, { backgroundColor: `${service.badgeColor}15` }]}>
                          <Text style={[styles.serviceBadgeText, { color: service.badgeColor }]}>
                            {service.badge}
                          </Text>
                        </View>
                      )}
                      
                      {/* Icône */}
                      <View style={[styles.serviceIconContainer, { backgroundColor: `${service.color}15` }]}>
                        <service.icon color={service.color} />
                      </View>
                      
                      {/* Contenu */}
                      <View style={styles.serviceContent}>
                        <Text style={[styles.serviceTitle, { color: theme.textTertiary }]} numberOfLines={1}>
                          {service.title}
                        </Text>
                        <Text style={[styles.serviceDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                          {service.description}
                        </Text>
                      </View>
                      
                      {/* Indicateur d'action */}
                      <View style={[styles.serviceArrow, { backgroundColor: `${service.color}10` }]}>
                        <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <Path 
                            d="M9 18l6-6-6-6" 
                            stroke={service.color} 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Section 2: Recommandés */}
              <View style={styles.sectionContainer}>
                <View style={[styles.sectionHeader, { borderBottomColor: '#E0E0E0' }]}>
                  <Text style={[styles.sectionTitle, { color: theme.secondaryColor }]}>Recommandés</Text>
                </View>
                
                <View style={styles.servicesGrid}>
                  {recommended.map((service) => (
                    <TouchableOpacity
                      key={service.id}
                      style={[styles.serviceCard, { 
                        backgroundColor: theme.cardBackground, 
                        borderColor: theme.cardBorder 
                      }]}
                      onPress={() => handleServicePress(service)}
                      activeOpacity={0.7}
                    >
                      {/* Badge si présent */}
                      {service.badge && (
                        <View style={[styles.serviceBadge, { backgroundColor: `${service.badgeColor}15` }]}>
                          <Text style={[styles.serviceBadgeText, { color: service.badgeColor }]}>
                            {service.badge}
                          </Text>
                        </View>
                      )}
                      
                      {/* Icône */}
                      <View style={[styles.serviceIconContainer, { backgroundColor: `${service.color}15` }]}>
                        <service.icon color={service.color} />
                      </View>
                      
                      {/* Contenu */}
                      <View style={styles.serviceContent}>
                        <Text style={[styles.serviceTitle, { color: theme.textTertiary }]} numberOfLines={1}>
                          {service.title}
                        </Text>
                        <Text style={[styles.serviceDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                          {service.description}
                        </Text>
                      </View>
                      
                      {/* Indicateur d'action */}
                      <View style={[styles.serviceArrow, { backgroundColor: `${service.color}10` }]}>
                        <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <Path 
                            d="M9 18l6-6-6-6" 
                            stroke={service.color} 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Section 3: Autres services */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={[styles.sectionHeader, { borderBottomColor: '#E0E0E0' }]}
                  onPress={() => setIsOtherServicesExpanded(!isOtherServicesExpanded)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sectionTitle, { color: theme.secondaryColor }]}>Autres services</Text>
                  <Animated.View style={{
                    transform: [{
                      rotate: isOtherServicesExpanded ? '180deg' : '0deg'
                    }]
                  }}>
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <Path 
                        d="M6 9l6 6 6-6" 
                        stroke={theme.textSecondary} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </Animated.View>
                </TouchableOpacity>
                
                {isOtherServicesExpanded && (
                  <View style={styles.servicesGrid}>
                    {others.map((service) => (
                      <TouchableOpacity
                        key={service.id}
                        style={[styles.serviceCard, { 
                          backgroundColor: theme.cardBackground, 
                          borderColor: theme.cardBorder 
                        }]}
                        onPress={() => handleServicePress(service)}
                        activeOpacity={0.7}
                      >
                        {/* Badge si présent */}
                        {service.badge && (
                          <View style={[styles.serviceBadge, { backgroundColor: `${service.badgeColor}15` }]}>
                            <Text style={[styles.serviceBadgeText, { color: service.badgeColor }]}>
                              {service.badge}
                            </Text>
                          </View>
                        )}
                        
                        {/* Icône */}
                        <View style={[styles.serviceIconContainer, { backgroundColor: `${service.color}15` }]}>
                          <service.icon color={service.color} />
                        </View>
                        
                        {/* Contenu */}
                        <View style={styles.serviceContent}>
                          <Text style={[styles.serviceTitle, { color: theme.textTertiary }]} numberOfLines={1}>
                            {service.title}
                          </Text>
                          <Text style={[styles.serviceDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                            {service.description}
                          </Text>
                        </View>
                        
                        {/* Indicateur d'action */}
                        <View style={[styles.serviceArrow, { backgroundColor: `${service.color}10` }]}>
                          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <Path 
                              d="M9 18l6-6-6-6" 
                              stroke={service.color} 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </Svg>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </>
          )}

          {/* Espacement pour la navbar */}
          <View style={{ height: 100 }} />
        </ScrollView>
        
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Scroll et contenu
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Titre des services
  servicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    gap: 8,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Recherche et filtres
  searchAndFiltersRow: {
    marginBottom: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    gap: 8,
  },
  searchInputText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  clearSearchButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  
  // Grille des services
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  
  // Carte de service
  serviceCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    position: 'relative',
  },
  
  // Badge
  serviceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  serviceBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  
  // Icône
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Contenu
  serviceContent: {
    flex: 1,
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  
  // Flèche d'action
  serviceArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});