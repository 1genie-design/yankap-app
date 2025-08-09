import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  useColorScheme,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Share
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Thèmes
const THEMES = {
  light: {
    background: '#F5F5F5',
    textPrimary: '#1DBAA3',
    textSecondary: '#666',
    textTertiary: '#333',
    statusBarStyle: 'dark-content' as const,
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
    inputBackground: '#F8F9FA',
    inputBorder: '#E0E0E0',
    successColor: '#28A745',
    warningColor: '#FFC107',
    errorColor: '#DC3545',
    divider: '#E8E8E8',
  },
  dark: {
    background: '#121212',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    statusBarStyle: 'light-content' as const,
    cardBackground: '#1E1E1E',
    cardBorder: '#333333',
    inputBackground: '#2A2A2A',
    inputBorder: '#404040',
    successColor: '#28A745',
    warningColor: '#FFC107',
    errorColor: '#DC3545',
    divider: '#333333',
  },
};

// Styles de texte
const TEXT_STYLES = {
  h1: { fontSize: 28, fontWeight: 700 as const },
  h2: { fontSize: 24, fontWeight: 600 as const },
  h3: { fontSize: 20, fontWeight: 600 as const },
  body: { fontSize: 16, fontWeight: 500 as const },
  caption: { fontSize: 14, fontWeight: 400 as const },
  small: { fontSize: 12, fontWeight: 400 as const },
};

export default function CreerTontineScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;
  
  // États du formulaire
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo: null,
    typeTontine: 'groupe', // 'personnel' ou 'groupe'
    montant: '',
    modeContribution: 'classique', // 'classique' ou 'garantie'
    methodeContinue: '', // 'gerant-garant' ou 'bouclier-anti-retard'
    intervalleCotisation: '', // '1sem', '1mois', 'personnalise', etc.
    intervallePersonnalise: '', // Si personnalisé
    jourIntervalle: '', // String pour sélection unique: 'dimanche' ou '15'
    typeJour: '', // 'semaine' ou 'mois'
    penaliteRetard: '', // Pourcentage de pénalité de 5% à 10%
    nombreParticipants: '', // Nombre de participants souhaités
    modeTirage: '', // Mode d'ordre de passage
    duree: '',
    frequence: 'mensuelle',
    typeDistribution: 'rotation',
    membres: [],
    dateDebut: '',
    reglesTontine: '',
  });
  
  // États UI
  const [showFrequenceModal, setShowFrequenceModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTypesTontineModal, setShowTypesTontineModal] = useState(false);
  const [showIntervalleDropdown, setShowIntervalleDropdown] = useState(false);
  const [showJourDropdown, setShowJourDropdown] = useState(false);
  const [showUniteDropdown, setShowUniteDropdown] = useState(false);
  const [showPenaliteDropdown, setShowPenaliteDropdown] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
  }, []);

  // Icônes
  const ArrowLeftIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const CheckIcon = ({ color = theme.successColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const UsersIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CalendarIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2"/>
      <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const MoneyIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CreditCardIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke={color} strokeWidth="2"/>
      <Path d="M1 10L23 10" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const CameraIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const GroupIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const UserIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const ShieldIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ClockIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const RadioIcon = ({ selected = false, color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      {selected && <Circle cx="12" cy="12" r="4" fill={color}/>}
    </Svg>
  );

  const PlusIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const RepeatIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const XIcon = ({ color = theme.errorColor }) => (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const HelpIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ShuffleIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ListIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const AuctionIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M3 12v7c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const StarIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ChevronDownIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ShareIcon = ({ color = theme.textPrimary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M4 12V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M16 6L12 2L8 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 2V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  // Données de configuration
  const intervalleOptions = [
    { id: 'personnalise', label: 'Intervalle personnalisé', typeJour: 'custom' },
    { id: '1mois', label: 'Tous les mois', typeJour: 'mois' },
    { id: '2sem', label: 'Toutes les 2 semaines', typeJour: 'semaine' },
    { id: '1sem', label: 'Toutes les semaines', typeJour: 'semaine' },
    { id: '1jour', label: 'Tous les jours', typeJour: 'none' },
  ];

  const joursSemaine = [
    { id: 'lundi', label: 'Lundi' },
    { id: 'mardi', label: 'Mardi' },
    { id: 'mercredi', label: 'Mercredi' },
    { id: 'jeudi', label: 'Jeudi' },
    { id: 'vendredi', label: 'Vendredi' },
    { id: 'samedi', label: 'Samedi' },
    { id: 'dimanche', label: 'Dimanche' },
  ];

  const joursMois = Array.from({ length: 31 }, (_, i) => ({
    id: (i + 1).toString(),
    label: `${i + 1} du mois`
  }));

  const uniteTempsOptions = [
    { id: 'jour', label: 'Jours', plural: 'jours' },
    { id: 'semaine', label: 'Semaines', plural: 'semaines' },
    { id: 'mois', label: 'Mois', plural: 'mois' },
    { id: 'annee', label: 'Années', plural: 'années' }
  ];

  const penaliteOptions = [
    { id: '5', label: '5% de la recette', description: 'Pénalité modérée' },
    { id: '6', label: '6% de la recette', description: 'Pénalité standard' },
    { id: '7', label: '7% de la recette', description: 'Pénalité élevée' },
    { id: '8', label: '8% de la recette', description: 'Pénalité très élevée' },
    { id: '9', label: '9% de la recette', description: 'Pénalité sévère' },
    { id: '10', label: '10% de la recette', description: 'Pénalité maximale' },
  ];

  const tirageOptions = [
    { 
      id: 'aleatoire', 
      label: 'Tirage Aléatoire', 
      description: 'L\'application détermine automatiquement l\'ordre',
      icon: ShuffleIcon,
    },
    { 
      id: 'rapidite', 
      label: 'Premier Arrivé', 
      description: 'Chacun choisit son numéro, le plus rapide gagne',
      icon: ListIcon,
    },
    { 
      id: 'encheres', 
      label: 'Au Plus Offrant', 
      description: 'Qui offre le plus passe en premier',
      icon: AuctionIcon,
    },
    { 
      id: 'credibilite', 
      label: 'Par Crédibilité', 
      description: 'Basé sur le taux de crédibilité',
      icon: StarIcon,
    },
  ];

  const modeContributionOptions = [
    { 
      id: 'classique', 
      label: 'Mode Classique', 
      description: 'Cotisation traditionnelle',
      icon: ClockIcon,
      details: 'Chaque membre cotise selon le planning défini'
    },
    { 
      id: 'garantie', 
      label: 'Mode Garantie', 
      description: 'Cotisation ininterrompue avec protection',
      icon: ShieldIcon,
      details: 'Yankap cotise en cas de retard sous certaines conditions'
    },
  ];

  const typesTontineOptions = [
    { 
      id: 'groupe', 
      label: 'Tontine de groupe', 
      description: 'Plusieurs membres participent ensemble',
      icon: GroupIcon
    },
    { 
      id: 'personnel', 
      label: 'Tontine personnelle', 
      description: 'Épargne individuelle avec objectif',
      icon: UserIcon
    },
  ];

  const frequenceOptions = [
    { id: 'hebdomadaire', label: 'Hebdomadaire', description: 'Chaque semaine' },
    { id: 'mensuelle', label: 'Mensuelle', description: 'Chaque mois' },
    { id: 'trimestrielle', label: 'Trimestrielle', description: 'Tous les 3 mois' },
  ];

  const typeOptions = [
    { id: 'rotation', label: 'Par rotation', description: 'Chacun son tour selon l\'ordre' },
    { id: 'tirage', label: 'Par tirage', description: 'Sélection aléatoire à chaque tour' },
    { id: 'encheres', label: 'Par enchères', description: 'Le plus offrant reçoit en premier' },
  ];

  // Fonctions
  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Créer la tontine
      setShowSuccessModal(true);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleShare = async () => {
    try {
      const tontineInfo = `🎯 Rejoignez ma tontine "${formData.name}" !

💰 Montant: ${parseInt(formData.montant).toLocaleString()} XAF
👥 Participants: ${formData.nombreParticipants} personnes
📅 Fréquence: ${frequenceOptions.find(f => f.id === formData.frequence)?.label}
🎲 Mode: ${tirageOptions.find(t => t.id === formData.modeTirage)?.label}

Rejoignez-nous pour une tontine sécurisée et bien organisée !

📱 Téléchargez Yankap: https://yankap.com/app`;

      await Share.share({
        message: tontineInfo,
        title: `Tontine ${formData.name}`,
      });
    } catch (error) {
      console.log('Erreur lors du partage:', error);
    }
  };

  const updateFormData = (key: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const closeAllDropdowns = () => {
    setShowIntervalleDropdown(false);
    setShowJourDropdown(false);
    setShowUniteDropdown(false);
    setShowPenaliteDropdown(false);
  };

  const getJourOptions = () => {
    const selectedInterval = intervalleOptions.find(i => i.id === formData.intervalleCotisation);
    if (!selectedInterval) return [];
    
    if (selectedInterval.typeJour === 'none') {
      return []; // Pas de choix de jour pour "chaque jour"
    } else if (selectedInterval.typeJour === 'semaine') {
      return joursSemaine;
    } else if (selectedInterval.typeJour === 'mois') {
      return joursMois;
    } else {
      // Personnalisé - on doit d'abord savoir le type
      if (formData.typeJour === 'jour') {
        return []; // Pas de choix de jour pour les intervalles en jours
      } else if (formData.typeJour === 'semaine') {
        return joursSemaine;
      } else if (formData.typeJour === 'mois' || formData.typeJour === 'annee') {
        return joursMois;
      }
      return [];
    }
  };

  const formatIntervalle = () => {
    if (!formData.intervalleCotisation) return '';
    
    const interval = intervalleOptions.find(i => i.id === formData.intervalleCotisation);
    
    let intervalleText = '';
    if (formData.intervalleCotisation === '1jour') {
      intervalleText = 'Tous les jours';
    } else if (!formData.jourIntervalle) {
      return '';
    } else {
      const jour = getJourOptions().find(j => j.id === formData.jourIntervalle);
      
      if (formData.intervalleCotisation === 'personnalise') {
        const unite = uniteTempsOptions.find(u => u.id === formData.typeJour);
        intervalleText = `Tous les ${formData.intervallePersonnalise} ${unite?.plural || formData.typeJour} : le ${jour?.label}`;
      } else {
        intervalleText = `${interval?.label} : le ${jour?.label}`;
      }
    }
    
    // Ajouter la pénalité si elle est définie
    if (formData.penaliteRetard) {
      const penalite = penaliteOptions.find(p => p.id === formData.penaliteRetard);
      intervalleText += ` • Pénalité : ${penalite?.label}`;
    }
    
    return intervalleText;
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.description.trim() !== '' && formData.typeTontine !== '';
      case 2:
        return formData.montant !== '' && formData.modeContribution !== '' && 
               (formData.modeContribution === 'classique' || formData.methodeContinue !== '');
      case 3:
        // Validation de base pour l'intervalle et le jour
        let intervalValid = false;
        if (formData.intervalleCotisation === 'personnalise') {
          const hasBasicData = formData.intervallePersonnalise !== '' && formData.typeJour !== '';
          if (formData.typeJour === 'jour') {
            intervalValid = hasBasicData;
          } else {
            intervalValid = hasBasicData && formData.jourIntervalle !== '';
          }
        } else if (formData.intervalleCotisation === '1jour') {
          intervalValid = true;
        } else {
          intervalValid = formData.intervalleCotisation !== '' && formData.jourIntervalle !== '';
        }
        
        // Validation de la pénalité (obligatoire)
        const penaliteValid = formData.penaliteRetard !== '';
        
        return intervalValid && penaliteValid;
      case 4:
        return formData.nombreParticipants !== '' && formData.modeTirage !== '';
      case 5:
        return true; // Validation finale
      default:
        return false;
    }
  };

  // Rendu des étapes
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <UsersIcon color={theme.textPrimary} />
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 12, flex: 1 }]}>
          Configuration de base
        </Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <HelpIcon color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Photo de profil */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 12 }]}>
          Photo de profil de la tontine
        </Text>
        <TouchableOpacity 
          style={[styles.photoUpload, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}
        >
          <CameraIcon color={theme.textSecondary} />
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 8 }]}>
            Ajouter une photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nom de la tontine */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
          Nom de la tontine *
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textTertiary }]}
          placeholder="Ex: Épargne Famille"
          placeholderTextColor={theme.textSecondary}
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
        />
      </View>

      {/* Type de tontine */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 12 }]}>
          Type de tontine *
        </Text>
        <View style={styles.typeOptionContainer}>
          {typesTontineOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = formData.typeTontine === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.typeOption,
                  {
                    backgroundColor: isSelected ? theme.textPrimary + '10' : theme.inputBackground,
                    borderColor: isSelected ? theme.textPrimary : theme.inputBorder,
                  }
                ]}
                onPress={() => updateFormData('typeTontine', option.id)}
              >
                <IconComponent color={isSelected ? theme.textPrimary : theme.textSecondary} />
                <Text style={[TEXT_STYLES.body, { 
                  color: isSelected ? theme.textPrimary : theme.textTertiary,
                  marginTop: 8,
                  textAlign: 'center'
                }]}>
                  {option.label}
                </Text>
                <Text style={[TEXT_STYLES.small, { 
                  color: theme.textSecondary,
                  textAlign: 'center',
                  marginTop: 4
                }]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Description/But */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
          Quel est le but de cette tontine ? *
        </Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textTertiary }]}
          placeholder="Ex: Épargner pour acheter un terrain, financer un projet, préparer les fêtes..."
          placeholderTextColor={theme.textSecondary}
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <MoneyIcon color={theme.textPrimary} />
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 12, flex: 1 }]}>
          Configuration financière
        </Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <HelpIcon color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Montant par cotisation */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
          Montant par cotisation (XAF) *
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textTertiary }]}
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          value={formData.montant}
          onChangeText={(text) => updateFormData('montant', text)}
          keyboardType="numeric"
        />
      </View>

      {/* Mode de contribution */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 12 }]}>
          Mode de contribution *
        </Text>
        <View style={styles.typeOptionContainer}>
          {modeContributionOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = formData.modeContribution === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.typeOption,
                  {
                    backgroundColor: isSelected ? theme.textPrimary + '10' : theme.inputBackground,
                    borderColor: isSelected ? theme.textPrimary : theme.inputBorder,
                  }
                ]}
                onPress={() => updateFormData('modeContribution', option.id)}
              >
                <IconComponent color={isSelected ? theme.textPrimary : theme.textSecondary} />
                <Text style={[TEXT_STYLES.body, { 
                  color: isSelected ? theme.textPrimary : theme.textTertiary,
                  marginTop: 8,
                  textAlign: 'center'
                }]}>
                  {option.label}
                </Text>
                <Text style={[TEXT_STYLES.small, { 
                  color: theme.textSecondary,
                  textAlign: 'center',
                  marginTop: 4
                }]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Conditions du mode garantie */}
      {formData.modeContribution === 'garantie' && (
        <View style={[styles.infoCard, { backgroundColor: theme.textPrimary + '05', borderColor: theme.textPrimary + '20' }]}>
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, marginBottom: 16, fontWeight: '600' }]}>
            Choisissez une méthode de protection :
          </Text>
          
          {/* Gérant-Garant */}
          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => updateFormData('methodeContinue', 'gerant-garant')}
          >
            <View style={styles.radioHeader}>
              <RadioIcon 
                selected={formData.methodeContinue === 'gerant-garant'} 
                color={theme.textPrimary} 
              />
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, fontWeight: '600', marginLeft: 12 }]}>
                🛡️ Gérant-Garant
              </Text>
            </View>
            <Text style={[TEXT_STYLES.small, { color: theme.textSecondary, marginTop: 8, marginLeft: 32 }]}>
              Le gérant est garant de tous les membres de la cotisation et doit boucler le dernier lors des écarts. Il subit les conséquences en cas de défaillance.
            </Text>
          </TouchableOpacity>

          {/* Bouclier Anti-Retard */}
          <TouchableOpacity 
            style={[styles.radioOption, { marginTop: 16 }]}
            onPress={() => updateFormData('methodeContinue', 'bouclier-anti-retard')}
          >
            <View style={styles.radioHeader}>
              <RadioIcon 
                selected={formData.methodeContinue === 'bouclier-anti-retard'} 
                color={theme.textPrimary} 
              />
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, fontWeight: '600', marginLeft: 12 }]}>
                🛡️ Bouclier Anti-Retard
              </Text>
            </View>
            <Text style={[TEXT_STYLES.small, { color: theme.textSecondary, marginTop: 8, marginLeft: 32 }]}>
              Une somme de 2% de la recette totale sera prélevée sur les recettes. Cette somme est totalement remboursable à la fin de la cotisation si aucun écart n'est constaté.
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <RepeatIcon color={theme.textPrimary} />
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 12, flex: 1 }]}>
          Fréquence des cotisations
        </Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <HelpIcon color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Choix de l'intervalle */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
          À quelle fréquence les membres cotiseront-ils ? *
        </Text>
        <TouchableOpacity
          style={[styles.dropdown, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}
          onPress={() => {
            closeAllDropdowns();
            setShowIntervalleDropdown(!showIntervalleDropdown);
          }}
        >
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
            {intervalleOptions.find(i => i.id === formData.intervalleCotisation)?.label || 'Sélectionner un intervalle'}
          </Text>
          <View style={{ transform: [{ rotate: showIntervalleDropdown ? '180deg' : '0deg' }] }}>
            <ChevronDownIcon color={theme.textSecondary} />
          </View>
        </TouchableOpacity>
        
        {/* Dropdown des intervalles */}
        {showIntervalleDropdown && (
          <View style={[styles.dropdownOptions, { backgroundColor: theme.cardBackground, borderColor: theme.inputBorder }]}>
            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
              {intervalleOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.dropdownOption, { borderBottomColor: theme.divider }]}
                  onPress={() => {
                    updateFormData('intervalleCotisation', option.id);
                    if (option.typeJour !== 'custom') {
                      updateFormData('typeJour', option.typeJour);
                    }
                    // Réinitialiser la sélection de jour si on change d'intervalle
                    if (option.id === '1jour') {
                      updateFormData('jourIntervalle', '');
                    }
                    setShowIntervalleDropdown(false);
                  }}
                >
                  <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                    {option.label}
                  </Text>
                  {formData.intervalleCotisation === option.id && <CheckIcon />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Configuration personnalisée - Deux dropdowns côte à côte */}
      {formData.intervalleCotisation === 'personnalise' && (
        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Intervalle personnalisé *
          </Text>
          <View style={styles.doubleDropdownContainer}>
            {/* Dropdown pour la valeur */}
            <View style={styles.halfDropdown}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textTertiary }]}
                placeholder="Ex: 3"
                placeholderTextColor={theme.textSecondary}
                value={formData.intervallePersonnalise}
                onChangeText={(text) => updateFormData('intervallePersonnalise', text)}
                keyboardType="numeric"
              />
            </View>
            
            {/* Dropdown pour l'unité */}
            <View style={styles.halfDropdown}>
              <TouchableOpacity
                style={[styles.dropdown, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}
                onPress={() => {
                  closeAllDropdowns();
                  setShowUniteDropdown(!showUniteDropdown);
                }}
              >
                <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                  {uniteTempsOptions.find(u => u.id === formData.typeJour)?.label || 'Unité'}
                </Text>
                <View style={{ transform: [{ rotate: showUniteDropdown ? '180deg' : '0deg' }] }}>
                  <ChevronDownIcon color={theme.textSecondary} />
                </View>
              </TouchableOpacity>
              
              {/* Dropdown des unités */}
              {showUniteDropdown && (
                <View style={[styles.dropdownOptions, { backgroundColor: theme.cardBackground, borderColor: theme.inputBorder, position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1001 }]}>
                  <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
                    {uniteTempsOptions.map((unite) => (
                      <TouchableOpacity
                        key={unite.id}
                        style={[styles.dropdownOption, { borderBottomColor: theme.divider }]}
                        onPress={() => {
                          updateFormData('typeJour', unite.id);
                          setShowUniteDropdown(false);
                        }}
                      >
                        <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                          {unite.label}
                        </Text>
                        {formData.typeJour === unite.id && <CheckIcon />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Choix du jour spécifique */}
      {formData.intervalleCotisation && formData.intervalleCotisation !== '1jour' && 
       (formData.intervalleCotisation !== 'personnalise' || (formData.typeJour && formData.typeJour !== 'jour')) && 
       getJourOptions().length > 0 && (
        <View style={styles.inputGroup}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
            Délai *
          </Text>
          <TouchableOpacity
            style={[styles.dropdown, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}
            onPress={() => {
              closeAllDropdowns();
              setShowJourDropdown(!showJourDropdown);
            }}
          >
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, flex: 1 }]}>
              {getJourOptions().find(j => j.id === formData.jourIntervalle)?.label || 'Choisir un jour'}
            </Text>
            <View style={{ transform: [{ rotate: showJourDropdown ? '180deg' : '0deg' }] }}>
              <ChevronDownIcon color={theme.textSecondary} />
            </View>
          </TouchableOpacity>
          
          {/* Dropdown des jours - Sélection unique */}
          {showJourDropdown && (
            <View style={[styles.dropdownOptions, { backgroundColor: theme.cardBackground, borderColor: theme.inputBorder }]}>
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                {getJourOptions().map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.dropdownOption, { borderBottomColor: theme.divider }]}
                    onPress={() => {
                      updateFormData('jourIntervalle', option.id);
                      setShowJourDropdown(false);
                    }}
                  >
                    <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                      {option.label}
                    </Text>
                    {formData.jourIntervalle === option.id && <CheckIcon />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Dropdown des pénalités */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
          Pénalité en cas de retard *
        </Text>
        <TouchableOpacity
          style={[styles.dropdown, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}
          onPress={() => {
            closeAllDropdowns();
            setShowPenaliteDropdown(!showPenaliteDropdown);
          }}
        >
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, flex: 1 }]}>
            {penaliteOptions.find(p => p.id === formData.penaliteRetard)?.label || 'Choisir une pénalité'}
          </Text>
          <View style={{ transform: [{ rotate: showPenaliteDropdown ? '180deg' : '0deg' }] }}>
            <ChevronDownIcon color={theme.textSecondary} />
          </View>
        </TouchableOpacity>
        
        {/* Dropdown des pénalités */}
        {showPenaliteDropdown && (
          <View style={[styles.dropdownOptions, { backgroundColor: theme.cardBackground, borderColor: theme.inputBorder }]}>
            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
              {penaliteOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.dropdownOption, { borderBottomColor: theme.divider }]}
                  onPress={() => {
                    updateFormData('penaliteRetard', option.id);
                    setShowPenaliteDropdown(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                      {option.label}
                    </Text>
                    <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 2 }]}>
                      {option.description}
                    </Text>
                  </View>
                  {formData.penaliteRetard === option.id && <CheckIcon />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Configuration compacte */}
      {formData.intervalleCotisation && (formData.intervalleCotisation === '1jour' || formData.jourIntervalle) && formData.penaliteRetard && (
        <View style={[styles.configCompact, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 6 }]}>
            Configuration
          </Text>
          <Text style={[TEXT_STYLES.small, { color: theme.textTertiary, lineHeight: 18 }]}>
            {(() => {
              const interval = intervalleOptions.find(i => i.id === formData.intervalleCotisation);
              let config = '';
              
              if (formData.intervalleCotisation === '1jour') {
                config = 'Tous les jours';
              } else if (formData.intervalleCotisation === 'personnalise') {
                const unite = uniteTempsOptions.find(u => u.id === formData.typeJour);
                config = `Tous les ${formData.intervallePersonnalise} ${unite?.plural || formData.typeJour}`;
              } else {
                config = interval?.label || '';
              }
              
              // Ajouter le jour si applicable
              if (formData.intervalleCotisation !== '1jour' && formData.jourIntervalle) {
                const jour = getJourOptions().find(j => j.id === formData.jourIntervalle)?.label || '';
                config += ` • ${jour}`;
              }
              
              // Ajouter la pénalité
              const penalite = penaliteOptions.find(p => p.id === formData.penaliteRetard)?.label || '';
              config += ` • Pénalité ${penalite}`;
              
              return config;
            })()}
          </Text>
        </View>
      )}

      {/* Zone d'aide supprimée */}
      {false && (
        <View style={[styles.infoCard, { backgroundColor: theme.textPrimary + '05', borderColor: theme.textPrimary + '20' }]}>
          <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>
            💡 Choisissez la fréquence à laquelle les membres devront cotiser et le jour précis dans cet intervalle.
          </Text>
        </View>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <UsersIcon color={theme.textPrimary} />
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 12, flex: 1 }]}>
          Participants et planning
        </Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <HelpIcon color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Nombre de participants */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 8 }]}>
          Combien de participants souhaitez-vous ? *
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.textTertiary }]}
          placeholder="Ex: 5, 10, 15..."
          placeholderTextColor={theme.textSecondary}
          value={formData.nombreParticipants}
          onChangeText={(text) => updateFormData('nombreParticipants', text)}
          keyboardType="numeric"
        />
        <Text style={[TEXT_STYLES.small, { color: theme.textSecondary, marginTop: 4 }]}>
          Incluant vous-même en tant qu'organisateur
        </Text>
      </View>

      {/* Mode de tirage/ordre de passage */}
      <View style={styles.inputGroup}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginBottom: 12 }]}>
          Mode d'ordre de passage *
        </Text>
        <View style={styles.tirageOptionContainer}>
          {tirageOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = formData.modeTirage === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.tirageOption,
                  {
                    backgroundColor: isSelected ? theme.textPrimary + '10' : theme.inputBackground,
                    borderColor: isSelected ? theme.textPrimary : theme.inputBorder,
                  }
                ]}
                onPress={() => updateFormData('modeTirage', option.id)}
              >
                <IconComponent color={isSelected ? theme.textPrimary : theme.textSecondary} />
                <Text style={[TEXT_STYLES.body, { 
                  color: isSelected ? theme.textPrimary : theme.textTertiary,
                  marginTop: 8,
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: '600'
                }]}>
                  {option.label}
                </Text>
                <Text style={[TEXT_STYLES.small, { 
                  color: theme.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                  fontSize: 11
                }]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <CheckIcon color={theme.textPrimary} />
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginLeft: 12, flex: 1 }]}>
          Récapitulatif final
        </Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <HelpIcon color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Récapitulatif détaillé */}
      <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 20, textAlign: 'center' }]}>
          Récapitulatif de votre tontine
        </Text>
        
        <View style={styles.summaryRow}>
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Nom de la tontine:</Text>
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
            {formData.name}
          </Text>
        </View>
        
        {formData.description && (
          <View style={styles.summaryRow}>
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Description:</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
              {formData.description}
            </Text>
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Montant par participant:</Text>
          <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '700', fontSize: 16 }]}>
            {parseInt(formData.montant).toLocaleString()} XAF
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Mode de contribution:</Text>
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
            {modeContributionOptions.find(m => m.id === formData.modeContribution)?.label}
          </Text>
        </View>
        
        {formData.modeContribution === 'garantie' && formData.methodeContinue && (
          <View style={styles.summaryRow}>
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Méthode de garantie:</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.successColor, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
              {formData.methodeContinue === 'gerant-garant' ? 'Gérant Garant' : 'Bouclier Anti-Retard'}
            </Text>
          </View>
        )}
        
        {formData.duree && (
          <View style={styles.summaryRow}>
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Durée de la tontine:</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
              {formData.duree} tours
            </Text>
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Fréquence des cotisations:</Text>
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
            {frequenceOptions.find(f => f.id === formData.frequence)?.label}
          </Text>
        </View>
        
        {formData.frequence === 'custom' && (
          <View style={styles.summaryRow}>
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Intervalle personnalisé:</Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
              Tous les {formData.intervallePersonnalise} jours
            </Text>
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Pénalité de retard:</Text>
          <Text style={[TEXT_STYLES.body, { color: theme.warningColor, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
            {penaliteOptions.find(p => p.id === formData.penaliteRetard)?.label}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Nombre de participants:</Text>
          <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
            {formData.nombreParticipants || 'Non défini'} personnes
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Mode de tirage:</Text>
          <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '700', flex: 1, textAlign: 'right' }]}>
            {tirageOptions.find(t => t.id === formData.modeTirage)?.label || 'Non défini'}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Fonds total collecté par tour:</Text>
          <Text style={[TEXT_STYLES.body, { color: theme.successColor, fontWeight: '700', fontSize: 16 }]}>
            {(parseInt(formData.montant) * parseInt(formData.nombreParticipants || '0')).toLocaleString()} XAF
          </Text>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.textPrimary + '10', borderColor: theme.textPrimary + '20' }]}>
        <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, textAlign: 'center', lineHeight: 20 }]}>
          Prêt à créer votre tontine ! Vous pourrez inviter des membres et gérer les cotisations.
        </Text>
      </View>
    </View>
  );

  // Modales
  const FrequenceModal = () => (
    <Modal visible={showFrequenceModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 20 }]}>
            Fréquence des contributions
          </Text>
          
          {frequenceOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.modalOption, { borderColor: theme.divider }]}
              onPress={() => {
                updateFormData('frequence', option.id);
                setShowFrequenceModal(false);
              }}
            >
              <View>
                <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                  {option.label}
                </Text>
                <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
              {formData.frequence === option.id && <CheckIcon />}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.modalCloseButton, { backgroundColor: theme.textSecondary + '20' }]}
            onPress={() => setShowFrequenceModal(false)}
          >
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const TypeModal = () => (
    <Modal visible={showTypeModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
          <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 20 }]}>
            Type de distribution
          </Text>
          
          {typeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.modalOption, { borderColor: theme.divider }]}
              onPress={() => {
                updateFormData('typeDistribution', option.id);
                setShowTypeModal(false);
              }}
            >
              <View>
                <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>
                  {option.label}
                </Text>
                <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
              {formData.typeDistribution === option.id && <CheckIcon />}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.modalCloseButton, { backgroundColor: theme.textSecondary + '20' }]}
            onPress={() => setShowTypeModal(false)}
          >
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const SuccessModal = () => (
    <Modal visible={showSuccessModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.successModalContent, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.successIcon, { backgroundColor: theme.successColor }]}>
            <CheckIcon color="#FFFFFF" />
          </View>
          
          <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary, marginBottom: 12, textAlign: 'center' }]}>
            Tontine créée !
          </Text>
          
          <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, textAlign: 'center', marginBottom: 24 }]}>
            Votre tontine "{formData.name}" a été créée avec succès. Vous pouvez maintenant inviter des membres.
          </Text>
          
          <View style={styles.successButtonsContainer}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: theme.textPrimary + '15', borderColor: theme.textPrimary }]}
              onPress={handleShare}
            >
              <ShareIcon color={theme.textPrimary} />
              <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, marginLeft: 8, fontWeight: '600' }]}>
                Partager
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.successButton, { backgroundColor: theme.textPrimary }]}
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
            >
              <Text style={[TEXT_STYLES.body, { color: '#FFFFFF', fontWeight: '600' }]}>Voir la tontine</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const HelpModal = () => (
    <Modal visible={showHelpModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.helpModalContent, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.helpModalHeader}>
            <View style={[styles.helpIconContainer, { backgroundColor: theme.textPrimary }]}>
              <HelpIcon color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>
                Guide - Étape {step}
              </Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                {step === 1 && "Informations générales"}
                {step === 2 && "Configuration financière"}
                {step === 3 && "Fréquence et pénalités"}
                {step === 4 && "Participants et tirage"}
                {step === 5 && "Récapitulatif final"}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowHelpModal(false)}
            >
              <XIcon color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.helpContent} showsVerticalScrollIndicator={false}>
            {step === 1 && (
              <>
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    📝 Nom de votre tontine
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Choisissez un nom mémorable et descriptif pour votre tontine. 
                    Ce nom sera visible par tous les participants.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    🎯 Objectif et description
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Décrivez clairement le but de votre tontine (épargne, projet, événement...). 
                    Cela aide les membres à comprendre l'objectif commun.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    👥 Type de tontine
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    <Text style={{ fontWeight: '600' }}>Groupe :</Text> Plusieurs participants partagent les cotisations{'\n'}
                    <Text style={{ fontWeight: '600' }}>Personnel :</Text> Vous cotisez seul pour votre épargne
                  </Text>
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    💰 Montant des cotisations
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Définissez le montant que chaque participant devra verser à chaque tour. 
                    Assurez-vous que ce montant soit accessible à tous.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    🔄 Mode de contribution
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    <Text style={{ fontWeight: '600' }}>Classique :</Text> Mode traditionnel, simple et direct{'\n'}
                    <Text style={{ fontWeight: '600' }}>Garantie :</Text> Protection supplémentaire contre les défauts de paiement
                  </Text>
                </View>
              </>
            )}

            {step === 3 && (
              <>
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    📅 Fréquence des cotisations
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Choisissez la régularité des contributions : quotidienne, hebdomadaire, mensuelle 
                    ou définissez un intervalle personnalisé selon vos besoins.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    ⚠️ Pénalités de retard
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Fixez le pourcentage de pénalité (5% à 10%) appliqué en cas de retard de cotisation. 
                    Cela encourage la ponctualité des participants.
                  </Text>
                </View>
              </>
            )}

            {step === 4 && (
              <>
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    👥 Nombre de participants
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Définissez combien de personnes participeront à votre tontine, vous y compris. 
                    Ce nombre déterminera la durée totale de votre tontine.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    🎲 Mode d'ordre de passage
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    <Text style={{ fontWeight: '600' }}>Tirage Aléatoire :</Text> L'application détermine automatiquement l'ordre dès le début de la tontine{'\n'}
                    <Text style={{ fontWeight: '600' }}>Premier Arrivé :</Text> L'application lance les numéros disponibles à une date précise. Chaque participant doit être prêt à cliquer rapidement sur un numéro. Le plus rapide gagne ce numéro.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    🚀 Invitation et lancement
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Après création, vous pourrez inviter des membres via un lien de partage. 
                    En tant que gérant, vous contrôlez quand démarrer les cotisations.
                  </Text>
                </View>
              </>
            )}

            {step === 5 && (
              <>
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    ✅ Vérification finale
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Relisez attentivement tous les paramètres de votre tontine. 
                    Une fois créée, certains éléments ne pourront plus être modifiés.
                  </Text>
                </View>
                
                <View style={styles.helpSection}>
                  <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary, marginBottom: 8 }]}>
                    🎯 Après la création
                  </Text>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, lineHeight: 22 }]}>
                    Votre tontine sera créée et vous pourrez immédiatement commencer à inviter des membres. 
                    Vous gardez le contrôle total en tant que gérant.
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
          
          <View style={styles.helpModalFooter}>
            <TouchableOpacity
              style={[styles.helpModalButton, { backgroundColor: theme.textPrimary }]}
              onPress={() => setShowHelpModal(false)}
            >
              <Text style={[TEXT_STYLES.body, { color: '#FFFFFF', fontWeight: '600' }]}>
                J'ai compris
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <StatusBar 
        barStyle={theme.statusBarStyle} 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeftIcon color={theme.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>
                Créer une tontine
              </Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
                Étape {step} sur 5
              </Text>
            </View>
          </View>

          {/* Progress circles */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <View 
                  style={[
                    styles.progressCircle,
                    {
                      backgroundColor: step >= stepNumber ? theme.textPrimary : theme.inputBackground,
                      borderColor: step >= stepNumber ? theme.textPrimary : theme.inputBorder,
                    }
                  ]}
                >
                  <Text 
                    style={[
                      styles.progressNumber,
                      { color: step >= stepNumber ? '#FFFFFF' : theme.textSecondary }
                    ]}
                  >
                    {stepNumber}
                  </Text>
                </View>
                {stepNumber < 5 && (
                  <View 
                    style={[
                      styles.progressLine,
                      { backgroundColor: step > stepNumber ? theme.textPrimary : theme.inputBorder }
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </ScrollView>

          {/* Navigation buttons */}
          <View style={styles.navigation}>
            {step > 1 && (
              <TouchableOpacity 
                style={[styles.navButton, styles.prevButton, { borderColor: theme.cardBorder }]}
                onPress={handlePrevious}
              >
                <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>Précédent</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.navButton, 
                styles.nextButton, 
                { 
                  backgroundColor: canProceed() ? theme.textPrimary : theme.textSecondary + '40',
                  flex: step === 1 ? 1 : 0.6
                }
              ]}
              onPress={handleNext}
              disabled={!canProceed()}
            >
              <Text style={[TEXT_STYLES.body, { color: '#FFFFFF' }]}>
                {step === 5 ? 'Créer la tontine' : 'Suivant'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Modales */}
        <FrequenceModal />
        <TypeModal />
        <SuccessModal />
        <HelpModal />
      </KeyboardAvoidingView>
    </>
  );
}

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
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  photoUpload: {
    height: 120,
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeOptionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
  },
  tirageOptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  tirageOption: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summarySection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  calculSection: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  compactSummary: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalCard: {
    borderRadius: 8,
    padding: 12,
  },
  summaryGroup: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  calculCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  calculRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  conditionItem: {
    marginBottom: 8,
  },
  radioOption: {
    paddingVertical: 8,
  },
  radioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  datesContainer: {
    marginTop: 16,
  },
  datesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  removeDateButton: {
    marginLeft: 8,
    padding: 2,
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  navButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    flex: 0.4,
    borderWidth: 1,
  },
  nextButton: {
    flex: 0.6,
  },
  
  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  successModalContent: {
    margin: 20,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  successButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },
  shareButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  
  // Dropdowns intégrés
  dropdownOptions: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
    position: 'relative',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    minHeight: 50,
  },
  doubleDropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    position: 'relative',
    zIndex: 1,
  },
  halfDropdown: {
    flex: 1,
    position: 'relative',
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
  },
  
  // Sélection multiple
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  
  // Configuration compacte et discrète
  configCompact: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginVertical: 12,
  },

  // Design de la configuration finale sur 3 lignes
  configurationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  configIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  configDetails: {
    gap: 12,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  // Ancien design pour la zone de configuration
  configurationSummary: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  helpCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 12,
  },
  helpIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  
  // Grille des jours
  joursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  jourButton: {
    width: '15%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  
  // Styles pour le bouton d'aide et la modal
  helpButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpSection: {
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  // Nouveaux styles pour la modal d'aide embellie
  helpModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  helpModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  helpIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  helpContent: {
    padding: 20,
    paddingTop: 0,
  },
  helpModalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  helpModalButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
});
