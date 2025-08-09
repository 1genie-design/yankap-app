/**
 * ÉCRAN D'ACCUEIL - YANKAP APP
 * 
 * Cet écran constitue la page principale de l'application YANKAP.
 * Il affiche :
 * - Une salutation personnalisée selon l'heure
 * - Le score de crédibilité de l'utilisateur avec emoji dynamique
 * - Un carousel des soldes (Tontine, Courant, Épargne)
 * - La liste des tontines avec système de réorganisation
 * 
 * Fonctionnalités principales :
 * - Animations d'entrée/sortie fluides
 * - Mode sombre/clair adaptatif
 * - Système de tri et réorganisation manuelle des tontines
 * - Boutons coins avec logique métier stricte
 * - Interface cohérente avec le design system YANKAP
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, useColorScheme, ScrollView, Animated, Modal, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';

// Constantes
const YANKAP_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

/**
 * CONFIGURATION DES THÈMES
 * 
 * Définit les couleurs et styles pour les modes clair et sombre.
 * Utilisé pour maintenir la cohérence visuelle à travers l'app.
 */
const THEMES = {
  light: {
    background: '#F5F5F5',           // Fond général gris clair
    textPrimary: '#1DBAA3',          // Couleur principale YANKAP (turquoise)
    textSecondary: '#666',           // Texte secondaire gris moyen
    textTertiary: '#333',            // Texte principal sombre
    statusBarStyle: 'dark-content' as const,
    cardBackground: 'white',         // Fond des cartes blanc
    cardBorder: '#E0E0E0',          // Bordures grises claires
  },
  dark: {
    background: '#121212',           // Fond général noir
    textPrimary: '#1DBAA3',          // Couleur principale YANKAP (inchangée)
    textSecondary: '#B0B0B0',        // Texte secondaire gris clair
    textTertiary: '#E0E0E0',         // Texte principal clair
    statusBarStyle: 'light-content' as const,
    cardBackground: '#1F1F1F',       // Fond des cartes sombre
    cardBorder: '#333',              // Bordures grises sombres
  },
};

/**
 * ICÔNES SVG PERSONNALISÉES
 * 
 * Collection d'icônes vectorielles utilisées dans l'interface.
 * Toutes les icônes sont créées avec react-native-svg pour :
 * - Une qualité parfaite à toutes les résolutions
 * - Un contrôle total sur les couleurs et animations
 * - Une cohérence avec le design system
 */

// Icône Plus - Utilisée pour les boutons d'ajout/recharge
const PlusIcon = ({ color = 'white' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 5v14M5 12h14" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icône Moins - Utilisée pour les boutons de retrait
const MinusIcon = ({ color = 'white' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M5 12h14" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icône Pièces (Coins) - Bouton principal des cartes tontine
// Design sophistiqué avec effet de profondeur et symbole dollar
const CoinsIcon = ({ color = '#FFF' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    {/* Pièce principale avec opacité pour l'effet */}
    <Path 
      d="M12 2C17.523 2 22 6.477 22 12s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" 
      fill={color}
      opacity="0.9"
    />
    {/* Symbole dollar intérieur - couleur adaptative */}
    <Path 
      d="M12 6v2m0 8v2m-1-9h2a2 2 0 0 1 0 4h-2m0-4v4m0 0h2a2 2 0 0 1 0 4h-2" 
      stroke={color === '#FFF' ? '#1DBAA3' : '#FFF'} 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    {/* Pièce arrière pour effet de profondeur */}
    <Path 
      d="M6 8c0-2.761 2.239-5 5-5s5 2.239 5 5" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
  </Svg>
);

// Icône de Tri/Reclassement - Design avec lignes et points de contrôle
const SortIcon = ({ color = '#666' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    {/* Lignes horizontales représentant les éléments à trier */}
    <Path 
      d="M3 6h18M3 12h18M3 18h18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Points de contrôle pour indiquer la possibilité de réorganisation */}
    <Circle cx="18" cy="6" r="2" fill={color} />
    <Circle cx="6" cy="12" r="2" fill={color} />
    <Circle cx="12" cy="18" r="2" fill={color} />
  </Svg>
);

// Icône Flèche Haut - Navigation vers le haut dans la liste
const MoveUpIcon = ({ color = '#666' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M7 14l5-5 5 5" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icône Flèche Bas - Navigation vers le bas dans la liste
const MoveDownIcon = ({ color = '#666' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M7 10l5 5 5-5" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icône Fermeture - Quitter le mode réorganisation
const CloseIcon = ({ color = '#666' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M18 6L6 18M6 6l12 12" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * COMPOSANT PRINCIPAL - ÉCRAN D'ACCUEIL
 * 
 * Ce composant gère l'état et la logique de la page d'accueil.
 * Il utilise plusieurs hooks React pour :
 * - La gestion du thème (clair/sombre)
 * - Les animations d'entrée/sortie
 * - La réorganisation des tontines
 * - La sauvegarde de l'état utilisateur
 */
export default function AccueilScreen() {
  // 🎨 CONFIGURATION DU THÈME
  const colorScheme = useColorScheme(); // Détecte le thème système
  const insets = useSafeAreaInsets();   // Gère les zones sécurisées (notch, etc.)
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;
  
  // 🔄 ÉTAT DE RÉORGANISATION
  // Contrôle l'affichage des boutons de déplacement sur les cartes
  const [isReorganizing, setIsReorganizing] = useState(false);
  
  // 🎨 ÉTATS DES MODALES PERSONNALISÉES
  const [showSortModal, setShowSortModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCoinsModal, setShowCoinsModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [selectedTontine, setSelectedTontine] = useState(null);
  const [selectedCarouselItem, setSelectedCarouselItem] = useState(null);
  
  // 🎯 ÉTATS POUR LES MESSAGES DE SUCCÈS
  const [successMessage, setSuccessMessage] = useState({ title: '', description: '' });
  
  // ✨ ANIMATIONS D'ENTRÉE/SORTIE
  // Crée des transitions fluides lors du changement d'onglet
  const fadeAnim = useRef(new Animated.Value(0)).current;    // Opacité (commence invisible)
  const slideAnim = useRef(new Animated.Value(30)).current;  // Translation verticale (commence légèrement en bas)

  // 🔄 ÉTATS POUR CAROUSEL INFINI
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = Math.min(320, Dimensions.get('window').width - 40) + 16;

  /**
   * 📊 DONNÉES DES TONTINES
   * 
   * Structure de données complète pour chaque tontine avec :
   * - Informations de base (nom, avatar, couleurs)
   * - État actuel (statut, membres, messages non lus)
   * - Logique métier (bénéficiaire, planning, retards)
   * - Interface utilisateur (couleurs, emojis)
   * 
   * Cette structure permet un affichage dynamique et une logique
   * métier stricte selon les règles business YANKAP.
   */
  const [tontines, setTontines] = useState([
    {
      // 🆔 Identifiants et affichage
      id: 1,
      name: 'Tontine Yamoussoukro',
      avatar: 'TY',                        // Initiales pour l'avatar
      backgroundColor: '#1DBAA3',          // Couleur de l'avatar
      
      // 📈 État et progression
      status: 'Actif',                     // Statut principal
      statusColor: '#28A745',              // Couleur du statut (vert)
      members: '7/12 OK',                  // Progression des membres
      unreadCount: 3,                      // Messages non lus
      
      // 👤 Position utilisateur
      userStatus: '-3 tours',              // Position dans la rotation
      amount: '50 000',                    // Montant de la tontine
      
      // 🎯 Bénéficiaire actuel
      beneficiary: 'Marie',                // Qui reçoit cette fois
      beneficiaryProgress: '8/12',         // Progression du paiement
      
      // 📅 Planning et délais
      schedule: { previous: 'Dim', current: 'Mer' }, // Jours de cotisation
      delay: '⚠️ +2 Jours',               // Indicateur de retard
      delayColor: '#FF3B30'               // Rouge pour retard
    },
    {
      id: 2,
      name: 'Tontine Abidjan',
      avatar: 'TA',
      backgroundColor: '#FF6B6B',
      status: 'Terminé',
      statusColor: '#6C757D',             // Gris pour terminé
      members: '8/8 OK',
      unreadCount: 7,
      userStatus: '✅',                   // Checkmark = participation complète
      amount: '75 000',
      beneficiary: 'Fini',                // Indicateur de fin
      beneficiaryProgress: '8/8',
      schedule: 'Dimanche',
      delay: 'À jour',
      delayColor: '#28A745'               // Vert pour "à jour"
    },
    {
      id: 3,
      name: 'Tontine Bouaké',
      avatar: 'TB',
      backgroundColor: '#FF8C00',         // Orange pour "en attente"
      status: 'En attente',
      statusColor: '#FF8C00',
      members: '0/6 OK',
      unreadCount: 1,
      userStatus: '--',                   // Tirets = pas encore commencé
      amount: '25 000',
      beneficiary: 'En attente',          // Pas de bénéficiaire défini
      beneficiaryProgress: '0/6',
      schedule: '[2.Sem]',                // Format intervalle
      delay: '--',                        // Pas de délai applicable
      delayColor: null                    // Pas de couleur spéciale
    },
    {
      id: 4,
      name: 'Tontine Daloa',
      avatar: 'TD',
      backgroundColor: '#DC3545',         // Rouge pour "bloqué"
      status: 'Bloqué',
      statusColor: '#DC3545',
      members: '4/10 OK',
      unreadCount: 12,                    // Beaucoup de messages (problème)
      userStatus: '⬇️',                   // Flèche = c'est votre tour
      amount: '100 000',
      beneficiary: 'Vous',                // L'utilisateur est bénéficiaire
      beneficiaryProgress: '7/10',        // 7 personnes ont payé sur 10
      schedule: '[7.Jrs]',                // Intervalle en jours
      delay: 'Suspendu',                  // État de suspension
      delayColor: '#DC3545'               // Rouge pour problème
    },
    {
      id: 5,
      name: 'Tontine Korhogo',
      avatar: 'TK',
      backgroundColor: '#9E9E9E',         // Gris pour inactif
      status: 'Inactif',
      statusColor: '#9E9E9E',
      members: null,                      // Pas de membres actifs
      unreadCount: 0,                     // Pas de messages
      userStatus: '--',                   // Aucun statut
      amount: '--',                       // Aucun montant
      beneficiary: '--',                  // Aucun bénéficiaire
      beneficiaryProgress: '--',
      schedule: '--',
      delay: '--',
      delayColor: null
    },
    {
      id: 6,
      name: 'Tontine San-Pédro',
      avatar: 'TS',
      backgroundColor: '#6B73FF',         // Bleu pour distinction
      status: 'Actif',
      statusColor: '#28A745',
      members: '4/6 OK',
      unreadCount: 2,
      userStatus: '-2 tours',             // 2 tours avant votre bénéfice
      amount: '40 000',
      beneficiary: 'Paul',
      beneficiaryProgress: '4/6',
      schedule: 'Ven 15',                 // Format date spécifique
      delay: '-8 Jour',                   // Format négatif = en avance
      delayColor: null                    // Pas de couleur (normal)
    }
  ]);

  /**
   * 🎬 GESTION DES ANIMATIONS D'ENTRÉE/SORTIE
   * 
   * Animation en 3 phases lors du changement d'onglet :
   * 1️⃣ DISPARITION : Instantanée (sans fade)
   * 2️⃣ DÉLAI : Pause pour permettre le changement de contenu
   * 3️⃣ APPARITION : Slide du bas vers position normale
   * 
   * Cette animation s'applique à tous les onglets de la navbar
   */
  useFocusEffect(
    React.useCallback(() => {
      // ⏳ DÉLAI AVANT APPARITION (la page est déjà invisible)
      const delayBeforeAppear = 150;  // 150ms de délai
      
      // 🎬 ANIMATION D'APPARITION DEPUIS LE BAS
      const animationTimer = setTimeout(() => {
        Animated.parallel([
          // 👁️ Apparition instantanée (pas de fade progressif)
          Animated.timing(fadeAnim, {
            toValue: 1,                 // Devient visible instantanément
            duration: 0,                // Pas de transition de fade
            useNativeDriver: true,
          }),
          // ⬆️ Slide depuis le bas vers position normale
          Animated.timing(slideAnim, {
            toValue: 0,                 // Position finale normale
            duration: 150,              // Animation plus rapide du slide
            useNativeDriver: true,
          }),
        ]).start();
      }, delayBeforeAppear);

      // 🔚 NETTOYAGE AU CHANGEMENT D'ONGLET
      return () => {
        clearTimeout(animationTimer);
        // Réinitialisation pour le prochain focus
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
      };
    }, [fadeAnim, slideAnim])  // Dépendances pour éviter les re-créations
  );

  /**
   * 🌅 SYSTÈME DE SALUTATION CONTEXTUELLE
   * 
   * Génère une salutation personnalisée basée sur l'heure du jour.
   * Améliore l'expérience utilisateur avec un message adapté et un emoji.
   * 
   * Tranches horaires :
   * - 00h → 12h : Bonjour 🌅
   * - 12h → 17h : Bon après-midi ☀️  
   * - 17h → 24h : Bonsoir 🌙
   */
  const getSalutation = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { text: 'Bonjour', emoji: '🌅' };
    } else if (hour < 17) {
      return { text: 'Bon après-midi', emoji: '☀️' };
    } else {
      return { text: 'Bonsoir', emoji: '🌙' };
    }
  };

  // 📊 DONNÉES UTILISATEUR SIMULÉES
  const salutation = getSalutation();
  const userName = 'Paul';           // 🔄 TODO: Récupérer depuis l'API/store
  const userScore: number = 10;      // 🔄 TODO: Score de crédibilité réel

  /**
   * 🎯 GESTIONNAIRE D'INTERACTIONS - CARTES TONTINE
   * 
   * Fonction appelée lors du clic sur une carte tontine.
   * En mode normal : ouvre le chat de la tontine (groupe avec super-pouvoirs)
   * En mode réorganisation : interaction désactivée
   */
  const handleCardPress = (tontine: any) => {
    setSelectedTontine(tontine);
    // Navigation vers l'écran de chat de la tontine (groupe avec super-pouvoirs financiers)
    console.log('Navigation vers chat de:', tontine.name);
    router.push({
      pathname: '/tontine-chat',
      params: { 
        tontineId: tontine.id,
        tontineName: tontine.name 
      }
    });
  };

  /**
   * 💰 LOGIQUE MÉTIER - BOUTON COINS
   * 
   * Détermine si le bouton "coins" doit être activé selon les règles business :
   * 
   * RÈGLE : Le bouton est ACTIF seulement si :
   * ✅ La tontine a le statut "Actif"
   * ET
   * ✅ L'utilisateur n'est pas encore à jour (userStatus ≠ "✅")
   * 
   * Dans tous les autres cas, le bouton est désactivé (grisé).
   * Cette logique stricte évite les erreurs de manipulation.
   */
  const shouldDisableCoinsButton = (status: string, userStatus: string) => {
    // Retourne true si le bouton doit être DÉSACTIVÉ
    return !(status === 'Actif' && userStatus !== '✅');
  };

  /**
   * 🔄 SYSTÈME DE TRI ET RÉORGANISATION
   * 
   * Gestionnaire principal du bouton de tri/réorganisation.
   * Gère deux modes :
   * 
   * 1️⃣ MODE NORMAL → Affiche le menu de tri
   * 2️⃣ MODE RÉORGANISATION → Quitte le mode et sauvegarde
   * 
   * Le mode réorganisation permet de déplacer manuellement les cartes
   * avec les boutons ↑↓ pour personnaliser l'ordre selon les priorités.
   */
  const handleSortTontines = () => {
    if (isReorganizing) {
      // 🔚 SORTIE DU MODE RÉORGANISATION
      setIsReorganizing(false);
      setSuccessMessage({
        title: '✅ Configuration sauvegardée',
        description: 'Votre organisation personnalisée a été appliquée avec succès.'
      });
      setShowSuccessModal(true);
      // 🔄 TODO: Sauvegarder l'ordre dans le store/API
    } else {
      // 📋 OUVERTURE DE LA MODALE DE TRI
      setShowSortModal(true);
    }
  };

  /**
   * 📊 ALGORITHMES DE TRI AUTOMATIQUE
   * 
   * Implémente différentes stratégies de tri pour les tontines :
   * 
   * 🏆 PRIORITÉ : Logique métier intelligente
   *    1. Actif en retard (urgent)
   *    2. Actif normal
   *    3. Bloqué (problème à résoudre)
   *    4. En attente
   *    5. Terminé
   *    6. Inactif
   * 
   * 📈 STATUT : Ordre logique des états
   * 💰 MONTANT : Décroissant (plus gros montants d'abord)
   * 🔢 ORIGINAL : Retour à l'ordre initial par ID
   */
  const sortTontines = (sortType: string) => {
    let sortedTontines = [...tontines];
    
    switch (sortType) {
      case 'status':
        // 📈 TRI PAR STATUT - Ordre logique des phases de vie
        const statusOrder = { 
          'Actif': 1, 
          'En attente': 2, 
          'Bloqué': 3, 
          'Terminé': 4, 
          'Inactif': 5 
        };
        sortedTontines.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
        
      case 'amount':
        // 💰 TRI PAR MONTANT - Décroissant, ignore les "--"
        sortedTontines.sort((a, b) => {
          const amountA = a.amount === '--' ? 0 : parseInt(a.amount.replace(/\s/g, ''));
          const amountB = b.amount === '--' ? 0 : parseInt(b.amount.replace(/\s/g, ''));
          return amountB - amountA;
        });
        break;
        
      case 'priority':
        // 🏆 TRI PAR PRIORITÉ MÉTIER - Le plus intelligent
        sortedTontines.sort((a, b) => {
          const getPriority = (tontine) => {
            // 🚨 URGENT : Actif avec retard
            if (tontine.status === 'Actif' && tontine.delayColor === '#FF3B30') return 1;
            // ✅ NORMAL : Actif sans problème
            if (tontine.status === 'Actif') return 2;
            // ⚠️ PROBLÈME : Bloqué nécessite attention
            if (tontine.status === 'Bloqué') return 3;
            // ⏳ PRÉPARATION : En attente de démarrage
            if (tontine.status === 'En attente') return 4;
            // ✔️ ARCHIVÉ : Terminé, moins prioritaire
            if (tontine.status === 'Terminé') return 5;
            // 💤 DORMANT : Inactif, dernière priorité
            if (tontine.status === 'Inactif') return 6;
            return 7; // Fallback
          };
          return getPriority(a) - getPriority(b);
        });
        break;
    }
    
    // 💾 Mise à jour de l'état avec le nouveau tri
    setTontines(sortedTontines);
    setShowSortModal(false); // Ferme la modale
    
    // 📢 Confirmation utilisateur avec toast style
    const sortNames = {
      'priority': '🏆 priorité métier',
      'status': '📊 statut actuel', 
      'amount': '💰 montant décroissant'
    };
    
    setSuccessMessage({
      title: '✅ Tri appliqué avec succès',
      description: `Vos tontines sont maintenant organisées par ${sortNames[sortType]}.`
    });
    setShowSuccessModal(true);
  };

  /**
   * ↕️ SYSTÈME DE RÉORGANISATION MANUELLE
   * 
   * Permet de déplacer une tontine vers le haut ou vers le bas
   * dans la liste pour personnaliser l'ordre d'affichage.
   * 
   * ⬆️ moveTontineUp : Échange avec l'élément précédent
   * ⬇️ moveTontineDown : Échange avec l'élément suivant
   * 
   * 🔄 Logique d'échange : Swap des positions dans le tableau
   * 💾 Persiste l'ordre personnalisé dans l'état local
   */
  
  // ⬆️ DÉPLACER VERS LE HAUT - Remonte la tontine d'une position
  const moveTontineUp = (index: number) => {
    if (index > 0) {
      const newTontines = [...tontines];
      // 🔄 Échange avec l'élément précédent
      [newTontines[index], newTontines[index - 1]] = [newTontines[index - 1], newTontines[index]];
      setTontines(newTontines);
    }
  };

  // ⬇️ DÉPLACER VERS LE BAS - Descend la tontine d'une position
  const moveTontineDown = (index: number) => {
    if (index < tontines.length - 1) {
      const newTontines = [...tontines];
      // 🔄 Échange avec l'élément suivant
      [newTontines[index], newTontines[index + 1]] = [newTontines[index + 1], newTontines[index]];
      setTontines(newTontines);
    }
  };

  /**
   * 🎨 FONCTIONS D'AIDE UI/UX
   * 
   * Ensemble de petites fonctions utilitaires pour améliorer
   * l'expérience utilisateur et l'apparence visuelle.
   * 
   * 📊 getScoreColor : Couleur progressive selon le score
   * 😀 getScoreEmoji : Emoji approprié selon la performance  
   * 💰 shouldDisableCoinsButton : Logique métier pour les coins
   */
  
  // 📊 COULEUR PROGRESSIVE DU SCORE - Noir → Rouge → Orange → Turquoise → Doré
  const getScoreColor = (score: number) => {
    if (score <= 0) return '#000000'; // ⚫ Noir pour score nul ou négatif
    if (score <= 3) return '#FF4444'; // 🔴 Rouge pour score faible (1-3)
    if (score <= 6) return '#FFA500'; // 🟠 Orange pour score moyen (4-6)
    if (score <= 9) return '#1DBAA3'; // 🔵 Vert turquoise YANKAP pour bon score (7-9)
    return '#FFD700';                 // 🥇 Doré pour score parfait (10)
  };

  // 😀 EMOJI DE PERFORMANCE - Expression selon le niveau
  const getScoreEmoji = (score: number) => {
    if (score <= 0) return '💀';      // 💀 Tête de mort pour score nul ou négatif
    if (score <= 3) return '🤏';      // 🤏 Faible quantité pour score faible
    if (score <= 6) return '🤞';      // 🤞 Doigts croisés pour score moyen
    if (score <= 9) return '👌';      // 👌 Parfait pour très bon score
    return '👑';                      // 👑 Couronne dorée pour score parfait (10)
  };





  /**
   * 🎨 COMPOSANTS DE MODALES ÉLÉGANTES
   * 
   * Système de modales personnalisées avec animations et design moderne
   * pour remplacer les Alert.alert basiques par une UX plus riche.
   */

  // 🔄 MODALE DE TRI/RÉORGANISATION - Design moderne avec icônes
  const SortModal = () => (
    <Modal
      visible={showSortModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
          {/* En-tête de la modale */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textTertiary }]}>
              🔄 Organiser vos Tontines
            </Text>
            <TouchableOpacity 
              onPress={() => setShowSortModal(false)}
              style={styles.modalCloseButton}
            >
              <CloseIcon color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Sous-titre explicatif */}
          <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
            Comment souhaitez-vous réorganiser l'affichage de vos tontines ?
          </Text>

          {/* Options de tri */}
          <View style={styles.modalOptions}>
            <TouchableOpacity 
              style={[styles.modalOption, { borderColor: theme.cardBorder }]}
              onPress={() => {
                setShowSortModal(false);
                setShowManualModal(true);
              }}
            >
              <Text style={styles.modalOptionIcon}>✋</Text>
              <View style={styles.modalOptionText}>
                <Text style={[styles.modalOptionTitle, { color: theme.textTertiary }]}>
                  Organisation Manuelle
                </Text>
                <Text style={[styles.modalOptionDesc, { color: theme.textSecondary }]}>
                  Déplacez les cartes avec les boutons ↑↓
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, { borderColor: theme.cardBorder }]}
              onPress={() => sortTontines('priority')}
            >
              <Text style={styles.modalOptionIcon}>🏆</Text>
              <View style={styles.modalOptionText}>
                <Text style={[styles.modalOptionTitle, { color: theme.textTertiary }]}>
                  Tri par Priorité
                </Text>
                <Text style={[styles.modalOptionDesc, { color: theme.textSecondary }]}>
                  Logique métier intelligente (urgences d'abord)
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, { borderColor: theme.cardBorder }]}
              onPress={() => sortTontines('status')}
            >
              <Text style={styles.modalOptionIcon}>📊</Text>
              <View style={styles.modalOptionText}>
                <Text style={[styles.modalOptionTitle, { color: theme.textTertiary }]}>
                  Tri par Statut
                </Text>
                <Text style={[styles.modalOptionDesc, { color: theme.textSecondary }]}>
                  Actif → En attente → Bloqué → Terminé
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, { borderColor: theme.cardBorder }]}
              onPress={() => sortTontines('amount')}
            >
              <Text style={styles.modalOptionIcon}>💰</Text>
              <View style={styles.modalOptionText}>
                <Text style={[styles.modalOptionTitle, { color: theme.textTertiary }]}>
                  Tri par Montant
                </Text>
                <Text style={[styles.modalOptionDesc, { color: theme.textSecondary }]}>
                  Plus gros montants en premier
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ✋ MODALE D'ORGANISATION MANUELLE - Guide d'utilisation élégant
  const ManualOrganizationModal = () => (
    <Modal
      visible={showManualModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowManualModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
          {/* En-tête avec icône de déplacement */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textTertiary }]}>
              ✋ Organisation Manuelle
            </Text>
            <TouchableOpacity 
              onPress={() => setShowManualModal(false)}
              style={styles.modalCloseButton}
            >
              <CloseIcon color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Illustration visuelle des contrôles */}
          <View style={styles.manualGuideContainer}>
            <View style={[styles.guideCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
              <View style={styles.guideCardHeader}>
                <View style={[styles.miniAvatar, { backgroundColor: '#1DBAA3' }]}>
                  <Text style={styles.miniAvatarText}>TY</Text>
                </View>
                <Text style={[styles.guideCardTitle, { color: theme.textTertiary }]}>
                  Tontine Exemple
                </Text>
                <View style={styles.guideMoveButtons}>
                  <View style={[styles.guideMoveButton, { borderColor: theme.cardBorder }]}>
                    <MoveUpIcon color={theme.textPrimary} />
                  </View>
                  <View style={[styles.guideMoveButton, { borderColor: theme.cardBorder }]}>
                    <MoveDownIcon color={theme.textPrimary} />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Instructions étape par étape */}
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🔸</Text>
              <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
                Utilisez les boutons ⬆️ ⬇️ sur chaque carte
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🔸</Text>
              <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
                Placez les tontines importantes en premier
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🔸</Text>
              <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
                Appuyez sur ❌ dans le coin pour terminer
              </Text>
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.actionButtonSecondary, { borderColor: theme.cardBorder }]}
              onPress={() => setShowManualModal(false)}
            >
              <Text style={[styles.actionButtonSecondaryText, { color: theme.textSecondary }]}>
                Annuler
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButtonPrimary, { backgroundColor: theme.textPrimary }]}
              onPress={() => {
                setShowManualModal(false);
                setIsReorganizing(true);
              }}
            >
              <Text style={styles.actionButtonPrimaryText}>
                Commencer ✋
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ✅ MODALE DE SUCCÈS - Confirmations élégantes pour toutes les actions
  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
          {/* En-tête avec animation subtile */}
          <View style={styles.successModalHeader}>
            <View style={[styles.successIcon, { backgroundColor: `${theme.textPrimary}20` }]}>
              <Text style={[styles.successIconText, { color: theme.textPrimary }]}>
                ✓
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowSuccessModal(false)}
              style={styles.modalCloseButton}
            >
              <CloseIcon color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Titre de succès */}
          <Text style={[styles.successTitle, { color: theme.textTertiary }]}>
            {successMessage.title}
          </Text>

          {/* Description détaillée */}
          <Text style={[styles.successDescription, { color: theme.textSecondary }]}>
            {successMessage.description}
          </Text>

          {/* Bouton de confirmation stylé */}
          <TouchableOpacity 
            style={[styles.successButton, { backgroundColor: theme.textPrimary }]}
            onPress={() => setShowSuccessModal(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.successButtonText}>
              Parfait ! 🎉
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // 🪙 MODALE COINS - Gestion des pièces avec design premium
  const CoinsModal = () => (
    <Modal
      visible={showCoinsModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCoinsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textTertiary }]}>
              🪙 Gestion des Coins
            </Text>
            <TouchableOpacity 
              onPress={() => setShowCoinsModal(false)}
              style={styles.modalCloseButton}
            >
              <CloseIcon color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {selectedTontine && (
            <>
              <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                Gérer vos pièces pour "{selectedTontine.name}"
              </Text>

              <View style={styles.modalOptions}>
                <TouchableOpacity 
                  style={[styles.modalOption, { borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setShowCoinsModal(false);
                    console.log('Ajouter coins');
                  }}
                >
                  <Text style={styles.modalOptionIcon}>💰</Text>
                  <View style={styles.modalOptionText}>
                    <Text style={[styles.modalOptionTitle, { color: theme.textTertiary }]}>
                      Ajouter des Coins
                    </Text>
                    <Text style={[styles.modalOptionDesc, { color: theme.textSecondary }]}>
                      Acheter des pièces pour cette tontine
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, { borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setShowCoinsModal(false);
                    console.log('Historique');
                  }}
                >
                  <Text style={styles.modalOptionIcon}>📊</Text>
                  <View style={styles.modalOptionText}>
                    <Text style={[styles.modalOptionTitle, { color: theme.textTertiary }]}>
                      Voir l'Historique
                    </Text>
                    <Text style={[styles.modalOptionDesc, { color: theme.textSecondary }]}>
                      Consulter vos transactions de coins
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // 💳 MODALE CAROUSEL - Actions financières avec design premium
  const CarouselModal = () => (
    <Modal
      visible={showCarouselModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCarouselModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textTertiary }]}>
              💳 {selectedCarouselItem?.title}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowCarouselModal(false)}
              style={styles.modalCloseButton}
            >
              <CloseIcon color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {selectedCarouselItem && (
            <>
              <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                Choisissez une action pour votre {selectedCarouselItem.title.toLowerCase()}
              </Text>

              <View style={styles.modalOptions}>
                <TouchableOpacity 
                  style={[styles.modalOption, { borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setShowCarouselModal(false);
                    console.log('Virement bancaire');
                  }}
                >
                  <Text style={styles.modalOptionIcon}>🏦</Text>
                  <View style={styles.modalOptionText}>
                    <Text style={[styles.modalOptionTitle, { color: theme.textTertiary }]}>
                      Virement Bancaire
                    </Text>
                    <Text style={[styles.modalOptionDesc, { color: theme.textSecondary }]}>
                      Recharger via votre banque
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, { borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setShowCarouselModal(false);
                    console.log('Mobile Money');
                  }}
                >
                  <Text style={styles.modalOptionIcon}>📱</Text>
                  <View style={styles.modalOptionText}>
                    <Text style={[styles.modalOptionTitle, { color: theme.textTertiary }]}>
                      Mobile Money
                    </Text>
                    <Text style={[styles.modalOptionDesc, { color: theme.textSecondary }]}>
                      Orange Money, MTN Money, etc.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  /**
   * 📊 DONNÉES DU CAROUSEL PRINCIPAL
   * 
   * Informations financières affichées en haut de l'écran
   * dans un format carousel interactif.
   * 
   * 💰 Solde Tontine : Montant total disponible
   * 📈 Transactions : Nombre d'opérations
   * 🎯 Objectifs : Cibles financières
   * 
   * 🎨 Chaque slide a sa propre couleur et animation
   */
  const carouselData = [
    {
      id: 1,
      title: 'Solde Courant',
      amount: '250,000',
      currency: 'XAF',
      backgroundColor: '#1DBAA3', // Couleur YANKAP (turquoise)
    },
    {
      id: 2,
      title: 'Solde Tontine',
      amount: '1,000,000,000,000',
      currency: 'XAF',
      backgroundColor: '#2C3E50', // Noir métallique
    },
    {
      id: 3,
      title: 'Solde Épargne',
      amount: '1,500,000',
      currency: 'XAF',
      backgroundColor: '#27AE60', // Vert moderne
    },
  ];

  // Données dupliquées pour le carousel infini
  const infiniteCarouselData = [
    ...carouselData,
    ...carouselData,
    ...carouselData,
  ];

  // Fonction pour gérer le défilement infini
  const handleCarouselScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / cardWidth);
    
    // Repositionner au milieu si on arrive aux extrémités
    if (index <= 0) {
      scrollViewRef.current?.scrollTo({
        x: carouselData.length * cardWidth,
        animated: false,
      });
    } else if (index >= infiniteCarouselData.length - carouselData.length) {
      scrollViewRef.current?.scrollTo({
        x: carouselData.length * cardWidth,
        animated: false,
      });
    }
    
    setCurrentIndex(index % carouselData.length);
  };

  // Initialiser la position au centre lors du montage
  useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: carouselData.length * cardWidth,
          animated: false,
        });
      }
    }, 100);
  }, []);



  /**
   * 🏗️ RENDU PRINCIPAL DE L'ÉCRAN ACCUEIL
   * 
   * Structure hiérarchique :
   * 1. 📱 StatusBar (barre système)
   * 2. 🎨 Container animé (fade + slide)
   * 3. 📜 ScrollView principal
   * 4. 📋 Sections de contenu
   * 
   * 🌊 Animations : Entrée fluide avec fade + slide
   * 📱 Responsive : Adaptation mobile + tablet
   */
  return (
    <>
      {/* 📱 BARRE DE STATUT SYSTÈME */}
      <StatusBar 
        barStyle={theme.statusBarStyle}    // Adapte selon le thème
        backgroundColor="transparent"      // Transparent pour immersion
        translucent={true}                 // Contenu sous la statusbar
      />
      
      {/* 🎨 CONTAINER PRINCIPAL ANIMÉ */}
      <Animated.View style={[styles.container, { 
        backgroundColor: theme.background,  // Couleur thématique
        opacity: fadeAnim,                  // Animation fade-in
        transform: [{ translateY: slideAnim }] // Animation slide-up
      }]}>
        
        {/* 📜 ZONE DE CONTENU DÉFILANT */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}           // Masque la scrollbar
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]} // Espace pour navbar
        >
          
          {/* 👋 SECTION SALUTATION + SCORE DE CRÉDIBILITÉ */}
          <View style={styles.greetingAndScoreSection}>
            {/* 🌅 Salutation personnalisée */}
            <View style={styles.greetingContainer}>
              <Text style={[styles.greetingText, { color: theme.textTertiary, fontWeight: 'bold' }]}>
                {salutation.text}, {userName} {salutation.emoji}
              </Text>
            </View>
            
            {/* 📊 Badge de crédibilité utilisateur */}
            <View style={styles.scoreContainer}>
              <View style={styles.credibilityBadge}>
                {/* 😊 Emoji rotatif pour score parfait */}
                <View style={userScore === 10 ? styles.rotatedEmoji : null}>
                  <Text style={styles.badgeEmoji}>{getScoreEmoji(userScore)}</Text>
                </View>
              </View>
              {/* 🔢 Score numérique coloré */}
              <View style={styles.credibilitySquare}>
                <Text style={[styles.credibilityNumber, { color: getScoreColor(userScore) }]}>{userScore}</Text>
              </View>
            </View>
          </View>

          {/* Carousel des soldes */}
          <View style={styles.carouselSection}>
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={cardWidth}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContainer}
              onMomentumScrollEnd={handleCarouselScroll}
            >
              {infiniteCarouselData.map((item, index) => (
                <View key={`${item.id}-${index}`} style={[styles.carouselCard, { backgroundColor: item.backgroundColor }]}>
                  {/* Card background pattern */}
                  <View style={styles.cardBackgroundPattern}>
                    <View style={[styles.patternCircle1, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                    <View style={[styles.patternCircle2, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
                    <View style={[styles.patternLines, { borderColor: 'rgba(255,255,255,0.1)' }]} />
                  </View>
                  
                  {/* Title */}
                  <View style={styles.simplifiedHeader}>
                    <Text style={styles.simplifiedTitle}>{item.title}</Text>
                  </View>

                  {/* Balance only */}
                  <View style={styles.simplifiedBalance}>
                    <Text style={styles.simplifiedCurrency}>{item.currency}</Text>
                    <Text style={styles.simplifiedAmount}>{item.amount}</Text>
                  </View>

                  {/* Action buttons positioned bottom right */}
                  <View style={styles.cardActionsBottomRight}>
                    <TouchableOpacity 
                      style={styles.miniActionButton}
                      onPress={() => {
                        setSelectedCarouselItem(item);
                        setShowCarouselModal(true);
                      }}
                    >
                      <Text style={styles.miniActionIcon}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.miniActionButton}
                      onPress={() => {
                        setSelectedCarouselItem(item);
                        setShowCarouselModal(true);
                      }}
                    >
                      <Text style={styles.miniActionIcon}>−</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Section Cartes Tontines */}
          <View style={styles.tontineSection}>
            <View style={styles.tontineSectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
                Mes Tontines
              </Text>
              <TouchableOpacity 
                style={[
                  styles.sortButton, 
                  { 
                    borderColor: isReorganizing ? theme.textPrimary : theme.cardBorder,
                    backgroundColor: isReorganizing ? `${theme.textPrimary}15` : 'transparent'
                  }
                ]}
                onPress={handleSortTontines}
                activeOpacity={0.7}
              >
                {isReorganizing ? (
                  <CloseIcon color={theme.textPrimary} />
                ) : (
                  <SortIcon color={theme.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            
            {/* Liste des cartes tontines */}
            {tontines.map((tontine, index) => (
              <TouchableOpacity 
                key={tontine.id}
                style={[styles.tontineCard, { 
                  backgroundColor: theme.cardBackground, 
                  borderColor: theme.cardBorder 
                }]}
                onPress={() => !isReorganizing && handleCardPress(tontine)}
                activeOpacity={isReorganizing ? 1 : 0.8}
              >
                {/* Boutons de déplacement en mode réorganisation */}
                {isReorganizing && (
                  <View style={styles.moveButtonsContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.moveButton,
                        { 
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.cardBorder,
                          opacity: index === 0 ? 0.3 : 1
                        }
                      ]}
                      onPress={() => moveTontineUp(index)}
                      disabled={index === 0}
                      activeOpacity={0.7}
                    >
                      <MoveUpIcon color={index === 0 ? theme.textSecondary : theme.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.moveButton,
                        { 
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.cardBorder,
                          opacity: index === tontines.length - 1 ? 0.3 : 1
                        }
                      ]}
                      onPress={() => moveTontineDown(index)}
                      disabled={index === tontines.length - 1}
                      activeOpacity={0.7}
                    >
                      <MoveDownIcon color={index === tontines.length - 1 ? theme.textSecondary : theme.textPrimary} />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Header de la tontine */}
                <View style={styles.tontineHeader}>
                  <View style={styles.tontineAvatarContainer}>
                    <View style={[styles.tontineAvatar, { backgroundColor: tontine.backgroundColor }]}>
                      <Text style={styles.tontineAvatarText}>{tontine.avatar}</Text>
                    </View>
                    {/* Badge de messages non lus */}
                    {tontine.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{tontine.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.tontineInfo}>
                    <Text style={[styles.tontineName, { color: theme.textTertiary }]}>
                      {tontine.name}
                    </Text>
                    <Text style={[styles.tontineMembers, { color: theme.textSecondary }]}>
                      <Text style={{ textDecorationLine: 'underline', color: tontine.statusColor }}>{tontine.status}</Text>
                      {tontine.members && (
                        <>
                          <Text style={{ fontWeight: 'bold', color: theme.textTertiary }}> - {tontine.members}</Text>
                        </>
                      )}
                    </Text>
                  </View>
                  
                  {/* Bouton coins */}
                  <TouchableOpacity 
                    style={[
                      styles.coinsButton,
                      shouldDisableCoinsButton(tontine.status, tontine.userStatus) && styles.coinsButtonDisabled
                    ]}
                    onPress={() => {
                      setSelectedTontine(tontine);
                      setShowCoinsModal(true);
                    }}
                    activeOpacity={shouldDisableCoinsButton(tontine.status, tontine.userStatus) ? 1 : 0.7}
                    disabled={shouldDisableCoinsButton(tontine.status, tontine.userStatus)}
                  >
                    <CoinsIcon color={shouldDisableCoinsButton(tontine.status, tontine.userStatus) ? '#B0B0B0' : "#FFF"} />
                  </TouchableOpacity>
                </View>

                {/* Contenu de la tontine */}
                <View style={[styles.tontineBody, { 
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: '#d9d9d9'
                }]}>
                  {/* Première ligne - 2 colonnes */}
                  <View style={styles.tontineRow}>
                    {/* Séparateur vertical allongé */}
                    <View style={[styles.tontineRowSeparator, { 
                      backgroundColor: '#d9d9d9' 
                    }]} />
                    <View style={styles.tontineInfoItem}>
                      <Text style={[styles.tontineInfoLabel, { color: theme.textSecondary }]}>
                        <Text style={{ fontWeight: 'bold' }}>▶</Text>
                        <Text> Vous</Text>
                      </Text>
                      <Text style={[styles.tontineInfoValue, { color: theme.textTertiary }]}>
                        {tontine.userStatus}
                      </Text>
                    </View>
                    <View style={styles.tontineInfoItem}>
                      <Text style={[styles.tontineInfoLabel, { color: theme.textSecondary }]}>
                        {tontine.amount === '--' ? (
                          <Text>--</Text>
                        ) : (
                          <Text>FCFA</Text>
                        )}
                      </Text>
                      <Text style={[styles.tontineInfoValue, { color: theme.textTertiary }]}>
                        {tontine.amount}
                      </Text>
                    </View>
                  </View>

                  {/* Deuxième ligne - 2 colonnes */}
                  <View style={styles.tontineRow}>
                    <View style={styles.tontineInfoItem}>
                      <Text style={[styles.tontineInfoLabel, { color: theme.textSecondary }]}>
                        {tontine.beneficiary === 'Vous' ? (
                          <>
                            <Text style={{ fontWeight: 'bold' }}>🔄</Text>
                            <Text> {tontine.beneficiary}</Text>
                          </>
                        ) : tontine.beneficiary === '--' ? (
                          <Text>--</Text>
                        ) : (
                          tontine.beneficiary === 'En attente' ? (
                            <Text>En attente</Text>
                          ) : tontine.beneficiary === 'Fini' ? (
                            <Text>Fini</Text>
                          ) : (
                            <>
                              <Text style={{ fontWeight: 'bold' }}>🔄</Text>
                              <Text> {tontine.beneficiary}</Text>
                            </>
                          )
                        )}
                      </Text>
                      <Text style={[styles.tontineInfoValue, { color: theme.textTertiary }]}>
                        {tontine.beneficiaryProgress}
                      </Text>
                    </View>
                    <View style={styles.tontineInfoItem}>
                      <Text style={[styles.tontineInfoLabel, { color: theme.textSecondary }]}>
                        {typeof tontine.schedule === 'object' ? (
                          <>
                            <Text style={{ opacity: 0.6 }}>{tontine.schedule.previous}, </Text>
                            <Text style={{ fontWeight: 'bold', color: theme.textTertiary, textDecorationLine: 'underline' }}>{tontine.schedule.current}</Text>
                          </>
                        ) : (
                          <Text>{tontine.schedule}</Text>
                        )}
                      </Text>
                      <Text style={[styles.tontineInfoValue, { color: tontine.delayColor || theme.textTertiary }]}>
                        {tontine.delay}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
        </ScrollView>

      </Animated.View>

      {/* 🎨 MODALES PERSONNALISÉES */}
      <SortModal />
      <ManualOrganizationModal />
      <SuccessModal />
      <CoinsModal />
      <CarouselModal />
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
  scrollContent: {
    paddingVertical: YANKAP_SPACING.lg,
    paddingHorizontal: 20,
  },
  greetingAndScoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: YANKAP_SPACING.lg,
    gap: YANKAP_SPACING.md,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  scoreContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  credibilityBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
  },
  badgeEmoji: {
    fontSize: 20,
  },
  rotatedEmoji: {
    transform: [{ rotate: '45deg' }],
    position: 'relative',
    top: -5,
    right: -5,
  },
  credibilitySquare: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  credibilityNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carouselSection: {
    marginBottom: YANKAP_SPACING.xl,
  },
  carouselContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  carouselCard: {
    width: Math.min(320, Dimensions.get('window').width - 40),
    height: 200,
    borderRadius: 16,
    marginRight: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  cardBackgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -100,
    right: -50,
  },
  patternCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: -75,
    left: -30,
  },
  patternLines: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 80,
    height: 1,
    borderTopWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  bankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bankLogo: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bankLogoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardMenuButton: {
    padding: 8,
  },
  cardMenuIcon: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chipContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  chip: {
    width: 40,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: {
    width: 28,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  accountSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flex: 1,
    justifyContent: 'center',
  },
  accountType: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardNumberSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  bankCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
  },
  cardHolder: {
    flex: 1,
  },
  cardHolderLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardHolderValue: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  cardActionsBottomRight: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  miniActionButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  miniActionIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  // Styles pour les cartes simplifiées
  simplifiedHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  simplifiedTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  simplifiedBalance: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  simplifiedCurrency: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  simplifiedAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  placeholder: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: YANKAP_SPACING.xl,
    fontStyle: 'italic',
  },
  
  // Section styles
  tontineSection: {
    marginTop: YANKAP_SPACING.xl,
  },
  tontineSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: YANKAP_SPACING.md,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Styles pour les cartes Tontine
  tontineCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: YANKAP_SPACING.md,
  },
  tontineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: YANKAP_SPACING.sm,
  },
  tontineAvatarContainer: {
    position: 'relative',
    marginRight: YANKAP_SPACING.sm,
  },
  tontineAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12, // Carré avec bords arrondis
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tontineAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tontineInfo: {
    flex: 1,
  },
  tontineName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  tontineMembers: {
    fontSize: 12,
  },
  tontineBody: {
    marginBottom: YANKAP_SPACING.sm,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: -4,
    borderWidth: 1,
  },
  tontineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: YANKAP_SPACING.xs,
    position: 'relative',
  },
  tontineRowSeparator: {
    position: 'absolute',
    left: '50%',
    top: 3,
    bottom: -18,
    width: 1,
    marginLeft: -0.5,
    height: '200%',
    zIndex: 1,
  },
  tontineInfoItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginHorizontal: 2,
  },
  tontineInfoLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tontineInfoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Style pour le bouton coins
  coinsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1DBAA3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  coinsButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  
  // Styles pour les boutons de déplacement
  moveButtonsContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
    gap: 4,
    zIndex: 10,
  },
  moveButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // 🎨 STYLES DES MODALES ÉLÉGANTES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  modalOptions: {
    gap: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  modalOptionIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalOptionDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  
  // 🎨 STYLES SPÉCIFIQUES À LA MODALE D'ORGANISATION MANUELLE
  manualGuideContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  guideCard: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guideCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  miniAvatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  guideCardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  guideMoveButtons: {
    flexDirection: 'column',
    gap: 4,
  },
  guideMoveButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  instructionsList: {
    gap: 12,
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  instructionIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  actionButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#1DBAA3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // 🎨 STYLES SPÉCIFIQUES À LA MODALE DE SUCCÈS
  successModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1DBAA3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  successIconText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  successDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  successButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1DBAA3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});