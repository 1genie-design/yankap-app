import React, { useRef } from 'react';
import { View, Text, StyleSheet, useColorScheme, Animated, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

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
    successColor: '#4CAF50',
    warningColor: '#FF9800',
    errorColor: '#F44336',
    infoColor: '#2196F3',
  },
  dark: {
    background: '#121212',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    statusBarStyle: 'light-content' as const,
    cardBackground: '#1F1F1F',
    cardBorder: '#333',
    successColor: '#4CAF50',
    warningColor: '#FF9800',
    errorColor: '#F44336',
    infoColor: '#2196F3',
  },
};

// Icônes SVG
const UserIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="5" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2"/>
  </Svg>
);

const SecurityIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SettingsIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2"/>
  </Svg>
);

const NotificationIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2"/>
  </Svg>
);

const HelpIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2"/>
    <Path d="M12 17h.01" stroke={color} strokeWidth="2"/>
  </Svg>
);

const LogoutIcon = ({ color = '#F44336' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2"/>
    <Path d="M16 17l5-5-5-5" stroke={color} strokeWidth="2"/>
    <Path d="M21 12H9" stroke={color} strokeWidth="2"/>
  </Svg>
);

const ChevronRightIcon = ({ color = '#666' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Données du profil
const PROFILE_DATA = {
  user: {
    name: 'Jean Dupont',
    email: 'jean.dupont@yankap.com',
    phone: '+237 6XX XXX XXX',
    avatar: 'JD',
    balance: 'XAF 127 500',
    memberSince: 'Membre depuis Mars 2023',
    profileCompletion: 95, // Niveau de completion du profil en %
    credibilityScore: 9 // Score de crédibilité sur 10
  }
};

// Sections du menu
const MENU_SECTIONS = [
  {
    title: 'Compte',
    items: [
      {
        id: 'credibility',
        title: 'Score de crédibilité',
        description: 'Basé sur vos transactions et activités',
        icon: null, // Sera géré spécialement
        color: '#1DBAA3',
        isCredibilityCard: true
      },
      {
        id: 'profile',
        title: 'Informations personnelles',
        description: 'Nom, email, téléphone',
        icon: UserIcon,
        color: '#2196F3'
      },
      {
        id: 'security',
        title: 'Sécurité',
        description: 'Mot de passe, authentification',
        icon: SecurityIcon,
        color: '#4CAF50'
      }
    ]
  },
  {
    title: 'Préférences',
    items: [
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Alertes et rappels',
        icon: NotificationIcon,
        color: '#FF9800'
      },
      {
        id: 'settings',
        title: 'Paramètres',
        description: 'Langue, thème, devises',
        icon: SettingsIcon,
        color: '#9C27B0'
      }
    ]
  },
  {
    title: 'Support',
    items: [
      {
        id: 'help',
        title: 'Aide & Support',
        description: 'FAQ, contact, assistance',
        icon: HelpIcon,
        color: '#607D8B'
      }
    ]
  }
];

export default function ProfilScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;

  // Fonctions pour le score de crédibilité (nouvelle logique à 5 couleurs)
  const getScoreColor = (score: number) => {
    if (score <= 2) return '#FF4444'; // 🔴 Rouge pour score 0-2
    if (score <= 4) return '#FF9800'; // ⚫ Noir pour score 3-4
    if (score <= 6) return '#FFCC00'; // � Vert citron pour score 5-6
    if (score <= 8) return '#4CAF50'; // � Vert pour score 7-8
    return '#FFD700';                 // 🔵 Bleu pour score 9-10
  };

  const getScoreEmoji = (score: number) => {
    if (score <= 2) return '💀';      // 💀 Tête de mort pour score 0-2 (rouge)
    if (score <= 4) return '🤏';      // 🤏 Faible quantité pour score 3-4 (noir)
    if (score <= 6) return '🤞';      // 🤞 Doigts croisés pour score 5-6
    if (score <= 8) return '👌';      // 👌 Parfait pour score 7-8
    return '👑';                      // 👑 Couronne pour score 9-10
  };

  // Fonction pour déterminer la couleur d'arrière-plan de l'icône
  const getIconBackgroundColor = (score: number) => {
    // Garder l'arrière-plan clair pour tous les scores
    return 'rgba(255, 255, 255, 0.2)';
  };

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

  const handleMenuPress = (item) => {
    switch (item.id) {
      case 'credibility':
        router.push('/credibility-score');
        break;
      case 'profile':
        router.push('/profile-info');
        break;
      case 'security':
        router.push('/security');
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'help':
        router.push('/help-support');
        break;
      default:
        console.log('Section sélectionnée:', item.title);
    }
  };

  const handleLogout = () => {
    // TODO: Logique de déconnexion
    console.log('Déconnexion');
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
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* En-tête du profil */}
          <View style={[styles.profileHeader, { backgroundColor: theme.cardBackground, borderBottomColor: theme.cardBorder }]}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.textPrimary }]}>
                  <Text style={styles.avatarText}>{PROFILE_DATA.user.avatar}</Text>
                </View>
                {/* Badge de completion du profil */}
                <View style={[styles.completionBadge, { 
                  backgroundColor: PROFILE_DATA.user.profileCompletion >= 90 ? '#4CAF50' : 
                                   PROFILE_DATA.user.profileCompletion >= 70 ? '#FF9800' : '#F44336'
                }]}>
                  <Text style={styles.completionText}>{PROFILE_DATA.user.profileCompletion}%</Text>
                </View>
              </View>
              
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: theme.textTertiary }]}>
                  {PROFILE_DATA.user.name}
                </Text>
                <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                  {PROFILE_DATA.user.email}
                </Text>
                <Text style={[styles.memberSince, { color: theme.textSecondary }]}>
                  {PROFILE_DATA.user.memberSince}
                </Text>
              </View>
            </View>
            
            {/* Solde avec boutons d'action */}
            <View style={[styles.balanceActionCard, { backgroundColor: `${theme.textPrimary}08`, borderColor: `${theme.textPrimary}20` }]}>
              <View style={styles.balanceInfo}>
                <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Solde</Text>
                <Text style={[styles.balanceAmount, { color: theme.textPrimary }]}>
                  <Text style={[styles.currencyText, { color: theme.textTertiary }]}>XAF </Text>
                  127 500
                </Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.successColor }]}
                  onPress={() => router.push('/recharge')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>+</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.errorColor }]}
                  onPress={() => router.push('/withdrawal')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sections du menu */}
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                {section.title}
              </Text>
              
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, { 
                    backgroundColor: item.isCredibilityCard ? getScoreColor(PROFILE_DATA.user.credibilityScore) : theme.cardBackground, 
                    borderColor: item.isCredibilityCard ? getScoreColor(PROFILE_DATA.user.credibilityScore) : theme.cardBorder 
                  }]}
                  onPress={() => handleMenuPress(item)}
                  activeOpacity={0.7}
                >
                  {item.isCredibilityCard ? (
                    // Carte spéciale pour le score de crédibilité
                    <>
                      <View style={[styles.menuIconContainer, { backgroundColor: getIconBackgroundColor(PROFILE_DATA.user.credibilityScore) }]}>
                        <View style={PROFILE_DATA.user.credibilityScore >= 9 ? styles.rotatedEmoji : null}>
                          <Text style={styles.credibilityLargeEmoji}>
                            {getScoreEmoji(PROFILE_DATA.user.credibilityScore)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.menuItemContent}>
                        <View style={styles.credibilityTitleRow}>
                          <Text style={[styles.menuItemTitle, { 
                            color: (PROFILE_DATA.user.credibilityScore >= 9 || (PROFILE_DATA.user.credibilityScore >= 5 && PROFILE_DATA.user.credibilityScore <= 6)) ? '#666' : 'white' 
                          }]}>
                            {item.title}
                          </Text>
                          <Text style={[styles.credibilityScore, { 
                            color: (PROFILE_DATA.user.credibilityScore >= 9 || (PROFILE_DATA.user.credibilityScore >= 5 && PROFILE_DATA.user.credibilityScore <= 6)) ? '#666' : 'white' 
                          }]}>
                            {PROFILE_DATA.user.credibilityScore}/10
                          </Text>
                        </View>
                        <Text style={[styles.menuItemDescription, { 
                          color: (PROFILE_DATA.user.credibilityScore >= 9 || (PROFILE_DATA.user.credibilityScore >= 5 && PROFILE_DATA.user.credibilityScore <= 6)) ? 'rgba(102, 102, 102, 0.8)' : 'rgba(255, 255, 255, 0.8)' 
                        }]}>
                          Basé sur vos transactions et activités
                        </Text>
                      </View>
                      
                      <ChevronRightIcon color={(PROFILE_DATA.user.credibilityScore >= 9 || (PROFILE_DATA.user.credibilityScore >= 5 && PROFILE_DATA.user.credibilityScore <= 6)) ? '#666' : 'white'} />
                    </>
                  ) : (
                    // Cartes normales du menu
                    <>
                      <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                        <item.icon color={item.color} />
                      </View>
                      
                      <View style={styles.menuItemContent}>
                        <Text style={[styles.menuItemTitle, { color: theme.textTertiary }]}>
                          {item.title}
                        </Text>
                        <Text style={[styles.menuItemDescription, { color: theme.textSecondary }]}>
                          {item.description}
                        </Text>
                      </View>
                      
                      <ChevronRightIcon color={theme.textSecondary} />
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Bouton de déconnexion */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.cardBackground, borderColor: theme.errorColor }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.logoutIconContainer, { backgroundColor: `${theme.errorColor}15` }]}>
              <LogoutIcon color={theme.errorColor} />
            </View>
            
            <Text style={[styles.logoutText, { color: theme.errorColor }]}>
              Se déconnecter
            </Text>
            
            <ChevronRightIcon color={theme.errorColor} />
          </TouchableOpacity>

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
    paddingBottom: 20,
  },
  
  // En-tête du profil
  profileHeader: {
    padding: 20,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  credibilityBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  credibilityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
  completionBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 32,
    height: 20,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  completionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 14,
  },
  
  // Carte du solde avec boutons d'action
  balanceActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Sections du menu
  menuSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingLeft: 4,
  },
  
  // Éléments du menu
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 14,
  },
  
  // Bouton de déconnexion
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Section de crédibilité
  credibilitySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  credibilityCard: {
    padding: 16,
    borderRadius: 12,
  },
  credibilityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  credibilityInfo: {
    flex: 1,
  },
  credibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  credibilityDescription: {
    fontSize: 14,
  },
  credibilityScoreContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  credibilityBadgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
  },
  credibilityBadgeEmoji: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  credibilityNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  credibilityLargeEmoji: {
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 30,
  },
  credibilityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    paddingRight: 8,
    maxWidth: '95%',
  },
  credibilityScore: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});