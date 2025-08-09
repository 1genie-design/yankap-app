import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, Animated, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Thèmes YANKAP
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
  },
};

// Icônes SVG
const SearchIcon = ({ color = '#666' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const FilterIcon = ({ color = '#666' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowUpIcon = ({ color = '#4CAF50' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M7 17l5-5 5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 12V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowDownIcon = ({ color = '#F44336' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M17 7l-5 5-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 12v9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ color = '#4CAF50' }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ color = '#FF9800' }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ExchangeIcon = ({ color = '#FF9800' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M16 3l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 7H4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 21l-4-4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 17h16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = ({ color = '#666' }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Données de transactions fictives
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'received',
    title: 'Reçu de Marie Dupont',
    description: 'Remboursement restaurant',
    amount: '+2 500',
    currency: 'XAF',
    date: '14:30',
    status: 'completed',
    category: 'Transfert'
  },
  {
    id: '2',
    type: 'sent',
    title: 'Envoyé à Jean Tontine',
    description: 'Contribution tontine #3',
    amount: '-15 000',
    currency: 'XAF',
    date: '12:15',
    status: 'completed',
    category: 'Tontine'
  },
  {
    id: '3',
    type: 'exchange',
    title: 'Change de devise',
    description: 'XAF vers EUR',
    amount: '-50 000',
    currency: 'XAF',
    date: '10:45',
    status: 'pending',
    category: 'Change'
  },
  {
    id: '4',
    type: 'received',
    title: 'Virement Orange Money',
    description: 'Rechargement compte',
    amount: '+25 000',
    currency: 'XAF',
    date: '09:20',
    status: 'completed',
    category: 'Rechargement'
  },
  {
    id: '5',
    type: 'sent',
    title: 'Paiement facture',
    description: 'Electricity Bill - ENEO',
    amount: '-8 750',
    currency: 'XAF',
    date: 'Hier',
    status: 'completed',
    category: 'Facture'
  },
  {
    id: '6',
    type: 'received',
    title: 'Cashback',
    description: 'Bonus fidélité YANKAP',
    amount: '+500',
    currency: 'XAF',
    date: 'Hier',
    status: 'completed',
    category: 'Bonus'
  }
];

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('passe');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    period: 'all', // 'today', 'week', 'month', 'all'
    amountRange: 'all', // 'small', 'medium', 'large', 'all'
    status: 'all', // 'completed', 'pending', 'failed', 'all'
    customPeriod: { start: '', end: '' }, // plage personnalisée
    customAmount: { min: '', max: '' }, // montant personnalisé
  });

  // 🎭 Animation disparition/apparition avec slide down
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

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

  // Fonction pour obtenir l'icône selon le type de transaction
  const getTransactionIcon = (type: string) => {
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

  // Fonction pour obtenir le statut avec badge
  const getStatusBadge = (status: string) => {
    const isCompleted = status === 'completed';
    return (
      <View style={[
        styles.statusBadge,
        {
          backgroundColor: isCompleted ? `${theme.successColor}20` : `${theme.warningColor}20`,
        }
      ]}>
        {isCompleted ? (
          <CheckIcon color={theme.successColor} />
        ) : (
          <ClockIcon color={theme.warningColor} />
        )}
      </View>
    );
  };

  // Filtres disponibles
  const filters = ['Tous', 'Transfert', 'Recharge', 'Retrait', 'Paiement'];
  
  // Options de filtres spéciaux disponibles dans le dropdown
  const periodOptions = [
    { key: 'all', label: 'Toutes' },
    { key: 'today', label: "Aujourd'hui" },
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
    { key: 'custom', label: 'Personnalisée' },
  ];

  const amountOptions = [
    { key: 'all', label: 'Tous montants' },
    { key: 'small', label: '< 10 000 XAF' },
    { key: 'medium', label: '10K - 100K XAF' },
    { key: 'large', label: '> 100 000 XAF' },
    { key: 'custom', label: 'Plage personnalisée' },
  ];

  const statusOptions = [
    { key: 'all', label: 'Tous statuts' },
    { key: 'completed', label: 'Terminé' },
    { key: 'pending', label: 'En attente' },
    { key: 'failed', label: 'Échoué' },
  ];

  // Fonction pour gérer la sélection des filtres
  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  // Fonction pour gérer la sélection dans le dropdown de filtres spéciaux
  const handleSpecialFilterPress = (filterKey) => {
    setSelectedFilter(filterKey);
    setShowFilterDropdown(false);
  };

  // Fonction pour appliquer les filtres avancés depuis le dropdown
  const applyAdvancedFiltersFromDropdown = () => {
    setShowFilterDropdown(false);
  };

  // Fonction pour obtenir les filtres dynamiques basés sur la recherche
  const getDynamicFilters = () => {
    // Toujours afficher tous les filtres, même en mode recherche
    return filters;
  };

  // Fonction pour déterminer si des filtres avancés sont actifs
  const isAdvancedFilterActive = () => {
    return advancedFilters.period !== 'all' || 
           advancedFilters.amountRange !== 'all' || 
           advancedFilters.status !== 'all';
  };

  // Fonction pour obtenir le texte du filtre avec les filtres avancés
  const getFilterDisplayText = (filter) => {
    let displayText = filter;
    
    // Si on est en recherche, ajouter le terme recherché au filtre sélectionné
    if (searchQuery !== '' && filter === selectedFilter) {
      displayText = `${filter} + ${searchQuery}`;
    }

    // Ne montrer les filtres spéciaux que pour le filtre sélectionné ET s'il n'y a pas de recherche
    if (selectedFilter !== filter || !isAdvancedFilterActive() || searchQuery !== '') {
      return displayText;
    }

    let specialFilters = [];
    
    // Ajouter le filtre de période
    if (advancedFilters.period !== 'all') {
      switch (advancedFilters.period) {
        case 'today':
          specialFilters.push("Aujourd'hui");
          break;
        case 'week':
          specialFilters.push('Cette semaine');
          break;
        case 'month':
          specialFilters.push('Ce mois');
          break;
        case 'custom':
          if (advancedFilters.customPeriod.start && advancedFilters.customPeriod.end) {
            specialFilters.push(`${advancedFilters.customPeriod.start} - ${advancedFilters.customPeriod.end}`);
          } else {
            specialFilters.push('Période personnalisée');
          }
          break;
      }
    }

    // Ajouter le filtre de montant
    if (advancedFilters.amountRange !== 'all') {
      switch (advancedFilters.amountRange) {
        case 'small':
          specialFilters.push('< 10K XAF');
          break;
        case 'medium':
          specialFilters.push('10K-100K XAF');
          break;
        case 'large':
          specialFilters.push('> 100K XAF');
          break;
        case 'custom':
          if (advancedFilters.customAmount.min || advancedFilters.customAmount.max) {
            const min = advancedFilters.customAmount.min || '0';
            const max = advancedFilters.customAmount.max || '∞';
            specialFilters.push(`${min}-${max} XAF`);
          } else {
            specialFilters.push('Montant personnalisé');
          }
          break;
      }
    }

    // Ajouter le filtre de statut
    if (advancedFilters.status !== 'all') {
      switch (advancedFilters.status) {
        case 'completed':
          specialFilters.push('Terminé');
          break;
        case 'pending':
          specialFilters.push('En attente');
          break;
        case 'failed':
          specialFilters.push('Échoué');
          break;
      }
    }

    // Combiner le filtre de base avec les filtres spéciaux
    if (specialFilters.length > 0) {
      return `${filter} - ${specialFilters.join(', ')}`;
    }
    
    return filter;
  };

  // Fonction pour réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSelectedFilter('Tous');
    setSearchQuery('');
    setShowSearchBar(false);
    setAdvancedFilters({
      period: 'all',
      amountRange: 'all',
      status: 'all',
      customPeriod: { start: '', end: '' },
      customAmount: { min: '', max: '' },
    });
    setShowFilterModal(false);
  };

  // Filtrer les transactions
  const filteredTransactions = MOCK_TRANSACTIONS.filter(transaction => {
    // Filtre par catégorie simple
    let matchesFilter = selectedFilter === 'Tous' || selectedFilter === 'all';
    
    if (!matchesFilter) {
      switch (selectedFilter) {
        case 'Transfert':
          matchesFilter = transaction.category === 'Transfert' || transaction.type === 'received' || transaction.type === 'sent';
          break;
        case 'Recharge':
          matchesFilter = transaction.category === 'Rechargement';
          break;
        case 'Retrait':
          matchesFilter = transaction.type === 'sent';
          break;
        case 'Paiement':
          matchesFilter = transaction.category === 'Facture';
          break;
        default:
          matchesFilter = transaction.category === selectedFilter;
      }
    }
    
    // Filtre par recherche textuelle
    const matchesSearch = searchQuery === '' || 
                         transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrer par onglet (Passé vs À venir)
    const isCompleted = transaction.status === 'completed';
    const matchesTab = activeTab === 'passe' ? isCompleted : !isCompleted;
    
    // Filtres avancés - Statut
    const matchesStatus = advancedFilters.status === 'all' || transaction.status === advancedFilters.status;
    
    // Filtres avancés - Montant
    let matchesAmount = true;
    if (advancedFilters.amountRange !== 'all') {
      const amount = Math.abs(parseInt(transaction.amount.replace(/[^0-9]/g, '')));
      
      if (advancedFilters.amountRange === 'custom') {
        const min = advancedFilters.customAmount.min ? parseInt(advancedFilters.customAmount.min) : 0;
        const max = advancedFilters.customAmount.max ? parseInt(advancedFilters.customAmount.max) : Infinity;
        matchesAmount = amount >= min && amount <= max;
      } else {
        switch (advancedFilters.amountRange) {
          case 'small':
            matchesAmount = amount < 10000;
            break;
          case 'medium':
            matchesAmount = amount >= 10000 && amount <= 100000;
            break;
          case 'large':
            matchesAmount = amount > 100000;
            break;
        }
      }
    }
    
    return matchesFilter && matchesSearch && matchesTab && matchesStatus && matchesAmount;
  });

  return (
    <Animated.View style={[styles.container, { 
      backgroundColor: theme.background,
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }]}>
      
      {/* En-tête avec onglets */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.cardBorder }]}>
        
        {/* Système d'onglets */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                borderBottomWidth: 2,
                borderBottomColor: activeTab === 'passe' ? theme.textPrimary : 'transparent',
              }
            ]}
            onPress={() => setActiveTab('passe')}
          >
            <Text style={[
              styles.tabText,
              { 
                color: activeTab === 'passe' ? theme.textPrimary : theme.textSecondary,
              }
            ]}>
              passé
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              {
                borderBottomWidth: 2,
                borderBottomColor: activeTab === 'avenir' ? theme.textPrimary : 'transparent',
              }
            ]}
            onPress={() => setActiveTab('avenir')}
          >
            <Text style={[
              styles.tabText,
              { 
                color: activeTab === 'avenir' ? theme.textPrimary : theme.textSecondary,
              }
            ]}>
              à venir
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barre de filtres avec icônes */}
        <View style={styles.searchAndFiltersRow}>
          {showSearchBar ? (
            /* Mode recherche : Barre de recherche avec bouton de recherche permanent */
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
                  placeholder="nom, date, opération ect..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    // Ne plus forcer le filtre à "Tous" - garder le filtre actuel
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
              
              <TouchableOpacity 
                style={[
                  styles.filterIcon, 
                  { 
                    borderColor: isAdvancedFilterActive() ? '#1DBAA3' : theme.cardBorder,
                    backgroundColor: isAdvancedFilterActive() ? '#1DBAA310' : 'transparent'
                  }
                ]}
                onPress={() => setShowFilterModal(true)}
              >
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path 
                    d="M3 4.5H21L16.5 11.1V19.5L7.5 16.5V11.1L3 4.5Z" 
                    stroke={isAdvancedFilterActive() ? '#1DBAA3' : theme.textSecondary} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </Svg>
                {isAdvancedFilterActive() && (
                  <View style={styles.filterIndicator}>
                    <View style={[styles.filterDot, { backgroundColor: '#1DBAA3' }]} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* Mode normal : Icône de recherche, filtres, icône filtre */
            <View style={styles.filtersRowWithIcons}>
              <TouchableOpacity 
                style={[
                  styles.searchIcon, 
                  { 
                    borderColor: searchQuery !== '' ? '#1DBAA3' : theme.cardBorder,
                    backgroundColor: searchQuery !== '' ? '#1DBAA310' : 'transparent'
                  }
                ]}
                onPress={() => setShowSearchBar(true)}
              >
                <SearchIcon color={searchQuery !== '' ? '#1DBAA3' : theme.textSecondary} />
                {searchQuery !== '' && (
                  <View style={styles.searchIndicator}>
                    <View style={[styles.searchDot, { backgroundColor: '#1DBAA3' }]} />
                  </View>
                )}
              </TouchableOpacity>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
                {getDynamicFilters().map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: selectedFilter === filter ? theme.textPrimary : theme.inputBackground,
                        borderColor: theme.cardBorder,
                      }
                    ]}
                    onPress={() => handleFilterPress(filter)}
                  >
                    <Text style={[
                      styles.filterText,
                      { color: selectedFilter === filter ? 'white' : theme.textSecondary }
                    ]}>
                      {getFilterDisplayText(filter)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity 
                style={[
                  styles.filterIcon, 
                  { 
                    borderColor: isAdvancedFilterActive() || showFilterDropdown ? '#1DBAA3' : theme.cardBorder,
                    backgroundColor: isAdvancedFilterActive() || showFilterDropdown ? '#1DBAA310' : 'transparent'
                  }
                ]}
                onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path 
                    d="M3 4.5H21L16.5 11.1V19.5L7.5 16.5V11.1L3 4.5Z" 
                    stroke={isAdvancedFilterActive() || showFilterDropdown ? '#1DBAA3' : theme.textSecondary} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </Svg>
                {(isAdvancedFilterActive() || showFilterDropdown) && (
                  <View style={styles.filterIndicator}>
                    <View style={[styles.filterDot, { backgroundColor: '#1DBAA3' }]} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Dropdown des filtres spéciaux */}
      {showFilterDropdown && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity 
            style={styles.dropdownBackdrop} 
            onPress={() => setShowFilterDropdown(false)}
            activeOpacity={1}
          />
          <View style={[styles.dropdownContent, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            {/* Header avec bouton de fermeture */}
            <View style={[styles.dropdownHeader, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[styles.dropdownTitle, { color: theme.textPrimary }]}>
                Filtres avancés
              </Text>
              <TouchableOpacity 
                style={styles.dropdownCloseButton}
                onPress={() => setShowFilterDropdown(false)}
              >
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path 
                    d="M18 6L6 18M6 6L18 18" 
                    stroke={theme.textSecondary} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                  />
                </Svg>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.dropdownScrollView} showsVerticalScrollIndicator={false}>
            
            {/* Filtre par Période */}
            <View style={styles.dropdownSection}>
              <Text style={[styles.dropdownSectionTitle, { color: theme.textPrimary }]}>
                Période
              </Text>
              <View style={styles.dropdownFilterOptions}>
                {periodOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.dropdownFilterOption,
                      {
                        backgroundColor: advancedFilters.period === option.key ? theme.textPrimary : theme.inputBackground,
                        borderColor: theme.cardBorder,
                      }
                    ]}
                    onPress={() => setAdvancedFilters(prev => ({ ...prev, period: option.key }))}
                  >
                    <Text style={[
                      styles.dropdownFilterOptionText,
                      { color: advancedFilters.period === option.key ? 'white' : theme.textSecondary }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Champs de saisie pour période personnalisée */}
              {advancedFilters.period === 'custom' && (
                <View style={styles.dropdownCustomInputs}>
                  <View style={styles.dropdownInputGroup}>
                    <Text style={[styles.dropdownInputLabel, { color: theme.textSecondary }]}>Du</Text>
                    <TextInput
                      style={[styles.dropdownCustomInput, { 
                        borderColor: theme.cardBorder, 
                        color: theme.textPrimary,
                        backgroundColor: theme.inputBackground 
                      }]}
                      placeholder="JJ/MM/AAAA"
                      placeholderTextColor={theme.textSecondary}
                      value={advancedFilters.customPeriod.start}
                      onChangeText={(text) => setAdvancedFilters(prev => ({
                        ...prev,
                        customPeriod: { ...prev.customPeriod, start: text }
                      }))}
                    />
                  </View>
                  <View style={styles.dropdownInputGroup}>
                    <Text style={[styles.dropdownInputLabel, { color: theme.textSecondary }]}>Au</Text>
                    <TextInput
                      style={[styles.dropdownCustomInput, { 
                        borderColor: theme.cardBorder, 
                        color: theme.textPrimary,
                        backgroundColor: theme.inputBackground 
                      }]}
                      placeholder="JJ/MM/AAAA"
                      placeholderTextColor={theme.textSecondary}
                      value={advancedFilters.customPeriod.end}
                      onChangeText={(text) => setAdvancedFilters(prev => ({
                        ...prev,
                        customPeriod: { ...prev.customPeriod, end: text }
                      }))}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Filtre par Montant */}
            <View style={styles.dropdownSection}>
              <Text style={[styles.dropdownSectionTitle, { color: theme.textPrimary }]}>
                Montant
              </Text>
              <View style={styles.dropdownFilterOptions}>
                {amountOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.dropdownFilterOption,
                      {
                        backgroundColor: advancedFilters.amountRange === option.key ? theme.textPrimary : theme.inputBackground,
                        borderColor: theme.cardBorder,
                      }
                    ]}
                    onPress={() => setAdvancedFilters(prev => ({ ...prev, amountRange: option.key }))}
                  >
                    <Text style={[
                      styles.dropdownFilterOptionText,
                      { color: advancedFilters.amountRange === option.key ? 'white' : theme.textSecondary }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Champs de saisie pour montant personnalisé */}
              {advancedFilters.amountRange === 'custom' && (
                <View style={styles.dropdownCustomInputs}>
                  <View style={styles.dropdownInputGroup}>
                    <Text style={[styles.dropdownInputLabel, { color: theme.textSecondary }]}>Minimum</Text>
                    <TextInput
                      style={[styles.dropdownCustomInput, { 
                        borderColor: theme.cardBorder, 
                        color: theme.textPrimary,
                        backgroundColor: theme.inputBackground 
                      }]}
                      placeholder="0"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="numeric"
                      value={advancedFilters.customAmount.min}
                      onChangeText={(text) => setAdvancedFilters(prev => ({
                        ...prev,
                        customAmount: { ...prev.customAmount, min: text }
                      }))}
                    />
                  </View>
                  <View style={styles.dropdownInputGroup}>
                    <Text style={[styles.dropdownInputLabel, { color: theme.textSecondary }]}>Maximum</Text>
                    <TextInput
                      style={[styles.dropdownCustomInput, { 
                        borderColor: theme.cardBorder, 
                        color: theme.textPrimary,
                        backgroundColor: theme.inputBackground 
                      }]}
                      placeholder="999999999"
                      placeholderTextColor={theme.textSecondary}
                      keyboardType="numeric"
                      value={advancedFilters.customAmount.max}
                      onChangeText={(text) => setAdvancedFilters(prev => ({
                        ...prev,
                        customAmount: { ...prev.customAmount, max: text }
                      }))}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Filtre par Statut */}
            <View style={styles.dropdownSection}>
              <Text style={[styles.dropdownSectionTitle, { color: theme.textPrimary }]}>
                Statut
              </Text>
              <View style={styles.dropdownFilterOptions}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.dropdownFilterOption,
                      {
                        backgroundColor: advancedFilters.status === option.key ? theme.textPrimary : theme.inputBackground,
                        borderColor: theme.cardBorder,
                      }
                    ]}
                    onPress={() => setAdvancedFilters(prev => ({ ...prev, status: option.key }))}
                  >
                    <Text style={[
                      styles.dropdownFilterOptionText,
                      { color: advancedFilters.status === option.key ? 'white' : theme.textSecondary }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            </ScrollView>
            
            {/* Actions du dropdown */}
            <View style={[styles.dropdownActions, { borderTopColor: theme.cardBorder }]}>
              <TouchableOpacity 
                style={[styles.dropdownResetButton, { borderColor: theme.cardBorder }]}
                onPress={resetAllFilters}
              >
                <Text style={[styles.dropdownResetButtonText, { color: theme.textSecondary }]}>
                  Tout effacer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.dropdownApplyButton, { backgroundColor: theme.textPrimary }]}
                onPress={applyAdvancedFiltersFromDropdown}
              >
                <Text style={[styles.dropdownApplyButtonText, { color: 'white' }]}>
                  Appliquer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Liste des transactions */}
      <ScrollView 
        style={styles.transactionsList} 
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setShowFilterDropdown(false)}
      >
        {filteredTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={[styles.transactionCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
            activeOpacity={0.7}
            onPress={() => router.push(`/transaction-detail?id=${transaction.id}`)}
          >
            {/* Icône et détails */}
            <View style={styles.transactionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${getAmountColor(transaction.type)}15` }]}>
                {getTransactionIcon(transaction.type)}
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionTitle, { color: theme.textTertiary }]} numberOfLines={1}>
                  {transaction.title}
                </Text>
                <Text style={[styles.transactionDescription, { color: theme.textSecondary }]} numberOfLines={1}>
                  {transaction.description}
                </Text>
                <View style={styles.transactionMeta}>
                  <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>
                    {transaction.date}
                  </Text>
                  {getStatusBadge(transaction.status)}
                </View>
              </View>
            </View>

            {/* Montant */}
            <View style={styles.transactionRight}>
              <Text style={[styles.transactionCurrency, { color: theme.textSecondary }]}>
                {transaction.currency}
              </Text>
              <Text style={[styles.transactionAmount, { color: getAmountColor(transaction.type) }]}>
                {transaction.amount}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Message si aucune transaction */}
        {filteredTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Aucune transaction trouvée
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Essayez de modifier vos critères de recherche
            </Text>
          </View>
        )}

        {/* Espacement pour la navbar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Modal de Filtres Avancés */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            {/* En-tête du modal */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Filtres Avancés
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path 
                    d="M18 6L6 18M6 6L18 18" 
                    stroke={theme.textSecondary} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                  />
                </Svg>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Filtre par Période */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.textPrimary }]}>
                  Période
                </Text>
                <View style={styles.filterOptions}>
                  {[
                    { key: 'all', label: 'Toutes' },
                    { key: 'today', label: "Aujourd'hui" },
                    { key: 'week', label: 'Cette semaine' },
                    { key: 'month', label: 'Ce mois' },
                    { key: 'custom', label: 'Personnalisée' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: advancedFilters.period === option.key ? theme.textPrimary : theme.inputBackground,
                          borderColor: theme.cardBorder,
                        }
                      ]}
                      onPress={() => setAdvancedFilters(prev => ({ ...prev, period: option.key }))}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { color: advancedFilters.period === option.key ? 'white' : theme.textSecondary }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Champs de saisie pour période personnalisée */}
                {advancedFilters.period === 'custom' && (
                  <View style={styles.customInputs}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Du</Text>
                      <TextInput
                        style={[styles.customInput, { 
                          borderColor: theme.cardBorder, 
                          color: theme.textPrimary,
                          backgroundColor: theme.inputBackground 
                        }]}
                        placeholder="JJ/MM/AAAA"
                        placeholderTextColor={theme.textSecondary}
                        value={advancedFilters.customPeriod.start}
                        onChangeText={(text) => setAdvancedFilters(prev => ({
                          ...prev,
                          customPeriod: { ...prev.customPeriod, start: text }
                        }))}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Au</Text>
                      <TextInput
                        style={[styles.customInput, { 
                          borderColor: theme.cardBorder, 
                          color: theme.textPrimary,
                          backgroundColor: theme.inputBackground 
                        }]}
                        placeholder="JJ/MM/AAAA"
                        placeholderTextColor={theme.textSecondary}
                        value={advancedFilters.customPeriod.end}
                        onChangeText={(text) => setAdvancedFilters(prev => ({
                          ...prev,
                          customPeriod: { ...prev.customPeriod, end: text }
                        }))}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Filtre par Montant */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.textPrimary }]}>
                  Montant
                </Text>
                <View style={styles.filterOptions}>
                  {[
                    { key: 'all', label: 'Tous montants' },
                    { key: 'small', label: '< 10 000 XAF' },
                    { key: 'medium', label: '10K - 100K XAF' },
                    { key: 'large', label: '> 100 000 XAF' },
                    { key: 'custom', label: 'Plage personnalisée' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: advancedFilters.amountRange === option.key ? theme.textPrimary : theme.inputBackground,
                          borderColor: theme.cardBorder,
                        }
                      ]}
                      onPress={() => setAdvancedFilters(prev => ({ ...prev, amountRange: option.key }))}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { color: advancedFilters.amountRange === option.key ? 'white' : theme.textSecondary }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                {/* Champs de saisie pour montant personnalisé */}
                {advancedFilters.amountRange === 'custom' && (
                  <View style={styles.customInputs}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Minimum</Text>
                      <TextInput
                        style={[styles.customInput, { 
                          borderColor: theme.cardBorder, 
                          color: theme.textPrimary,
                          backgroundColor: theme.inputBackground 
                        }]}
                        placeholder="0"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="numeric"
                        value={advancedFilters.customAmount.min}
                        onChangeText={(text) => setAdvancedFilters(prev => ({
                          ...prev,
                          customAmount: { ...prev.customAmount, min: text }
                        }))}
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Maximum</Text>
                      <TextInput
                        style={[styles.customInput, { 
                          borderColor: theme.cardBorder, 
                          color: theme.textPrimary,
                          backgroundColor: theme.inputBackground 
                        }]}
                        placeholder="999999999"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="numeric"
                        value={advancedFilters.customAmount.max}
                        onChangeText={(text) => setAdvancedFilters(prev => ({
                          ...prev,
                          customAmount: { ...prev.customAmount, max: text }
                        }))}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Filtre par Statut */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: theme.textPrimary }]}>
                  Statut
                </Text>
                <View style={styles.filterOptions}>
                  {[
                    { key: 'all', label: 'Tous statuts' },
                    { key: 'completed', label: 'Terminé' },
                    { key: 'pending', label: 'En attente' },
                    { key: 'failed', label: 'Échoué' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: advancedFilters.status === option.key ? theme.textPrimary : theme.inputBackground,
                          borderColor: theme.cardBorder,
                        }
                      ]}
                      onPress={() => setAdvancedFilters(prev => ({ ...prev, status: option.key }))}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { color: advancedFilters.status === option.key ? 'white' : theme.textSecondary }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Actions du modal */}
            <View style={[styles.modalActions, { borderTopColor: theme.cardBorder }]}>
              <TouchableOpacity 
                style={[styles.resetButton, { borderColor: theme.cardBorder }]}
                onPress={resetAllFilters}
              >
                <Text style={[styles.resetButtonText, { color: theme.textSecondary }]}>
                  Tout effacer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.applyButton, { backgroundColor: theme.textPrimary }]}
                onPress={() => {
                  // Si des filtres avancés sont appliqués, remettre le filtre simple à "Tous"
                  if (advancedFilters.period !== 'all' || 
                      advancedFilters.amountRange !== 'all' || 
                      advancedFilters.status !== 'all') {
                    setSelectedFilter('Tous');
                  }
                  setShowFilterModal(false);
                }}
              >
                <Text style={[styles.applyButtonText, { color: 'white' }]}>
                  Appliquer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // En-tête
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  
  // Onglets
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Filtres
  searchAndFiltersRow: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    height: 36,
    flex: 1,
  },
  searchInputText: {
    flex: 1,
    fontSize: 14,
  },
  clearSearchButton: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filtersRowWithIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 12,
  },
  searchIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  searchIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  searchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filtersContainer: {
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 60,
    maxWidth: 250,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 12,
    maxWidth: 200,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  removeFilterIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    opacity: 0.8,
  },
  filterIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Dropdown pour Transfert
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContent: {
    position: 'absolute',
    top: 70, // Remonter le dropdown
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 380, // Réduire la hauteur maximale
    paddingTop: 5, // Réduire le padding top
  },
  dropdownScrollView: {
    flex: 1,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8, // Réduire le padding vertical
    borderBottomWidth: 1,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownCloseButton: {
    padding: 4,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownOptionText: {
    fontSize: 15,
    flex: 1,
  },
  dropdownSection: {
    paddingHorizontal: 16,
    paddingVertical: 8, // Réduire l'espacement vertical
  },
  dropdownSectionTitle: {
    fontSize: 14, // Réduire la taille de police
    fontWeight: '600',
    marginBottom: 8, // Réduire la marge
  },
  dropdownFilterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6, // Réduire l'espacement
    marginBottom: 6, // Réduire la marge
  },
  dropdownFilterOption: {
    paddingHorizontal: 12, // Réduire le padding horizontal
    paddingVertical: 6, // Réduire le padding vertical
    borderRadius: 16, // Réduire le radius pour un style plus compact
    borderWidth: 1,
    marginBottom: 6, // Réduire la marge
  },
  dropdownFilterOptionText: {
    fontSize: 12, // Réduire la taille de police
    fontWeight: '500',
  },
  dropdownCustomInputs: {
    flexDirection: 'row',
    gap: 10, // Réduire l'espacement
    marginTop: 8, // Réduire la marge top
  },
  dropdownInputGroup: {
    flex: 1,
  },
  dropdownInputLabel: {
    fontSize: 12, // Réduire la taille de police
    fontWeight: '500',
    marginBottom: 4, // Réduire la marge
  },
  dropdownCustomInput: {
    borderWidth: 1,
    borderRadius: 6, // Réduire le radius
    paddingHorizontal: 10, // Réduire le padding
    paddingVertical: 8, // Réduire le padding
    fontSize: 12, // Réduire la taille de police
  },
  dropdownActions: {
    flexDirection: 'row',
    padding: 12, // Réduire le padding
    borderTopWidth: 1,
    gap: 10, // Réduire l'espacement
  },
  dropdownResetButton: {
    flex: 1,
    paddingVertical: 8, // Réduire le padding vertical
    borderRadius: 6, // Réduire le radius
    borderWidth: 1,
    alignItems: 'center',
  },
  dropdownResetButtonText: {
    fontSize: 14, // Réduire la taille de police
    fontWeight: '500',
  },
  dropdownApplyButton: {
    flex: 1,
    paddingVertical: 8, // Réduire le padding vertical
    borderRadius: 6, // Réduire le radius
    alignItems: 'center',
  },
  dropdownApplyButtonText: {
    fontSize: 14, // Réduire la taille de police
    fontWeight: '600',
    color: 'white',
  },
  dropdownSeparator: {
    height: 1,
    marginVertical: 8,
  },
  dropdownAdvancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownAdvancedText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  
  // Liste des transactions
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // Transaction gauche
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  transactionDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionDate: {
    fontSize: 11,
  },
  
  // Statut
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  
  // Transaction droite (montant)
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  transactionCurrency: {
    fontSize: 11,
    marginBottom: 2,
  },
  
  // État vide
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Modal de Filtres Avancés
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  customInputs: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  customInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});