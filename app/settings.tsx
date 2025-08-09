import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
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

// Icônes
const BackIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ThemeIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LanguageIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2"/>
  </Svg>
);

const SecurityIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const NotificationIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PrivacyIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke={color} strokeWidth="2"/>
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SupportIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const InfoIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <Path d="M12 16v-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LogoutIcon = ({ color = '#F44336' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 17l5-5-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChevronRightIcon = ({ color = '#666' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Données des paramètres
const SETTINGS_SECTIONS = [
  {
    id: 'appearance',
    title: 'Apparence',
    items: [
      {
        id: 'theme',
        title: 'Thème sombre',
        description: 'Activer le mode sombre',
        icon: ThemeIcon,
        type: 'switch',
        value: false
      },
      {
        id: 'language',
        title: 'Langue',
        description: 'Français',
        icon: LanguageIcon,
        type: 'navigation',
        value: 'fr'
      }
    ]
  },
  {
    id: 'security',
    title: 'Sécurité',
    items: [
      {
        id: 'biometric',
        title: 'Authentification biométrique',
        description: 'Utiliser empreinte/Face ID',
        icon: SecurityIcon,
        type: 'switch',
        value: true
      },
      {
        id: 'pin_security',
        title: 'Code PIN de sécurité',
        description: 'Configurer un code PIN',
        icon: SecurityIcon,
        type: 'navigation'
      },
      {
        id: 'auto_lock',
        title: 'Verrouillage automatique',
        description: '5 minutes d\'inactivité',
        icon: PrivacyIcon,
        type: 'navigation'
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    items: [
      {
        id: 'push_notifications',
        title: 'Notifications push',
        description: 'Recevoir les alertes',
        icon: NotificationIcon,
        type: 'switch',
        value: true
      },
      {
        id: 'transaction_alerts',
        title: 'Alertes de transaction',
        description: 'Notifier chaque transaction',
        icon: NotificationIcon,
        type: 'switch',
        value: true
      },
      {
        id: 'security_alerts',
        title: 'Alertes de sécurité',
        description: 'Connexions et activités suspectes',
        icon: SecurityIcon,
        type: 'switch',
        value: true
      }
    ]
  },
  {
    id: 'account',
    title: 'Compte et confidentialité',
    items: [
      {
        id: 'personal_data',
        title: 'Données personnelles',
        description: 'Gérer vos informations',
        icon: PrivacyIcon,
        type: 'navigation'
      },
      {
        id: 'privacy_settings',
        title: 'Paramètres de confidentialité',
        description: 'Contrôler le partage de données',
        icon: PrivacyIcon,
        type: 'navigation'
      },
      {
        id: 'backup',
        title: 'Sauvegarde et synchronisation',
        description: 'Synchroniser avec le cloud',
        icon: InfoIcon,
        type: 'switch',
        value: false
      }
    ]
  },
  {
    id: 'support',
    title: 'Aide et support',
    items: [
      {
        id: 'help_center',
        title: 'Centre d\'aide',
        description: 'FAQ et guides',
        icon: SupportIcon,
        type: 'navigation'
      },
      {
        id: 'contact_support',
        title: 'Contacter le support',
        description: 'Chat, email, téléphone',
        icon: SupportIcon,
        type: 'navigation'
      },
      {
        id: 'about',
        title: 'À propos de YANKAP',
        description: 'Version 2.1.0',
        icon: InfoIcon,
        type: 'navigation'
      }
    ]
  }
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  // États
  const [settings, setSettings] = useState(() => {
    const initialSettings = {};
    SETTINGS_SECTIONS.forEach(section => {
      section.items.forEach(item => {
        if (item.type === 'switch') {
          initialSettings[item.id] = item.value;
        }
      });
    });
    return initialSettings;
  });

  useFocusEffect(
    React.useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(-50);
      
      const timer = setTimeout(() => {
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
      };
    }, [fadeAnim, slideAnim])
  );

  const handleSwitchChange = (itemId: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [itemId]: value }));
    
    // Actions spécifiques selon le paramètre
    switch (itemId) {
      case 'theme':
        Alert.alert('Thème', value ? 'Mode sombre activé' : 'Mode clair activé');
        break;
      case 'biometric':
        Alert.alert('Biométrie', value ? 'Authentification biométrique activée' : 'Authentification biométrique désactivée');
        break;
      case 'push_notifications':
        Alert.alert('Notifications', value ? 'Notifications push activées' : 'Notifications push désactivées');
        break;
      case 'transaction_alerts':
        Alert.alert('Alertes', value ? 'Alertes de transaction activées' : 'Alertes de transaction désactivées');
        break;
      case 'security_alerts':
        Alert.alert('Sécurité', value ? 'Alertes de sécurité activées' : 'Alertes de sécurité désactivées');
        break;
      case 'backup':
        Alert.alert('Sauvegarde', value ? 'Sauvegarde cloud activée' : 'Sauvegarde cloud désactivée');
        break;
    }
  };

  const handleNavigationItem = (itemId: string) => {
    switch (itemId) {
      case 'language':
        Alert.alert('Langue', 'Sélection de langue à venir');
        break;
      case 'pin_security':
        Alert.alert('Code PIN', 'Configuration du code PIN à venir');
        break;
      case 'auto_lock':
        Alert.alert('Verrouillage automatique', 'Configuration du délai de verrouillage à venir');
        break;
      case 'personal_data':
        router.push('/profile-info');
        break;
      case 'privacy_settings':
        Alert.alert('Confidentialité', 'Paramètres de confidentialité à venir');
        break;
      case 'help_center':
        router.push('/help-support');
        break;
      case 'contact_support':
        router.push('/help-support');
        break;
      case 'about':
        Alert.alert('À propos de YANKAP', 'YANKAP v2.1.0\nApplication de services financiers\n© 2024 YANKAP. Tous droits réservés.');
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Déconnecté', 'Vous avez été déconnecté avec succès');
            // Ici vous pourriez rediriger vers la page de connexion
          }
        }
      ]
    );
  };

  const renderSettingItem = (item: any) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { borderBottomColor: theme.cardBorder }]}
        onPress={() => item.type === 'navigation' ? handleNavigationItem(item.id) : null}
        activeOpacity={item.type === 'navigation' ? 0.7 : 1}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: `${theme.textPrimary}15` }]}>
            <IconComponent color={theme.textPrimary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.textTertiary }]}>
              {item.title}
            </Text>
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              {item.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'switch' ? (
            <Switch
              value={settings[item.id]}
              onValueChange={(value) => handleSwitchChange(item.id, value)}
              trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
              thumbColor={settings[item.id] ? '#FFFFFF' : theme.textSecondary}
            />
          ) : (
            <ChevronRightIcon color={theme.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section: any) => (
    <View key={section.id} style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
      <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
        {section.title}
      </Text>
      {section.items.map(renderSettingItem)}
    </View>
  );

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
        transform: [{ translateY: slideAnim }],
        paddingTop: insets.top
      }]}>
        
        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <BackIcon color={theme.textTertiary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textTertiary }]}>
            Paramètres
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {SETTINGS_SECTIONS.map(renderSection)}
          
          {/* Bouton de déconnexion */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: `${theme.errorColor}15` }]}>
                <LogoutIcon color={theme.errorColor} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.errorColor }]}>
                  Se déconnecter
                </Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                  Fermer votre session YANKAP
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          
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
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Sections
  section: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },

  // Items de paramètre
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bouton déconnexion
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
});