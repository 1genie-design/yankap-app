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
  Animated,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
import Svg, { Path, Circle, Bell, Clock, CheckCircle, AlertCircle, DollarSign } from 'react-native-svg';

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
    unreadBackground: '#F0F9FF',
    unreadBorder: '#1DBAA3',
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
    unreadBackground: '#1A2B32',
    unreadBorder: '#1DBAA3',
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

const TransactionIcon = ({ color = '#1DBAA3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 1v22m5-18H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SecurityIcon = ({ color = '#F44336' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TontineIcon = ({ color = '#FF9800' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <Path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2"/>
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2"/>
    <Path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke={color} strokeWidth="2"/>
  </Svg>
);

const SystemIcon = ({ color = '#2196F3' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <Path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke={color} strokeWidth="2"/>
  </Svg>
);

const SettingsIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <Path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke={color} strokeWidth="2"/>
  </Svg>
);

const FilterIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MarkAllReadIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Types de notifications et données
const NOTIFICATION_TYPES = {
  TRANSACTION: 'transaction',
  SECURITY: 'security', 
  TONTINE: 'tontine',
  SYSTEM: 'system'
};

const NOTIFICATIONS_DATA = [
  {
    id: '1',
    type: NOTIFICATION_TYPES.TRANSACTION,
    title: 'Transfert reçu',
    message: 'Vous avez reçu 50,000 FCFA de Jean Dupont',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    icon: TransactionIcon,
    color: '#4CAF50'
  },
  {
    id: '2',
    type: NOTIFICATION_TYPES.SECURITY,
    title: 'Nouvelle connexion',
    message: 'Connexion depuis un nouvel appareil détectée',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    icon: SecurityIcon,
    color: '#F44336'
  },
  {
    id: '3',
    type: NOTIFICATION_TYPES.TONTINE,
    title: 'Tontine "Famille" - Cotisation',
    message: 'Votre cotisation de 25,000 FCFA est due dans 2 jours',
    timestamp: '2024-01-14T16:45:00Z',
    read: true,
    icon: TontineIcon,
    color: '#FF9800'
  },
  {
    id: '4',
    type: NOTIFICATION_TYPES.TRANSACTION,
    title: 'Paiement effectué',
    message: 'Facture ENEO payée avec succès - 15,750 FCFA',
    timestamp: '2024-01-14T14:20:00Z',
    read: true,
    icon: TransactionIcon,
    color: '#1DBAA3'
  },
  {
    id: '5',
    type: NOTIFICATION_TYPES.SYSTEM,
    title: 'Mise à jour disponible',
    message: 'Une nouvelle version de YANKAP est disponible',
    timestamp: '2024-01-13T12:00:00Z',
    read: true,
    icon: SystemIcon,
    color: '#2196F3'
  },
  {
    id: '6',
    type: NOTIFICATION_TYPES.TONTINE,
    title: 'Tontine "Business" - Nouveau membre',
    message: 'Marie Kone a rejoint votre tontine',
    timestamp: '2024-01-12T18:30:00Z',
    read: true,
    icon: TontineIcon,
    color: '#FF9800'
  },
  {
    id: '7',
    type: NOTIFICATION_TYPES.TRANSACTION,
    title: 'Crédit approuvé',
    message: 'Votre demande de microcrédit de 100,000 FCFA a été approuvée',
    timestamp: '2024-01-12T11:15:00Z',
    read: true,
    icon: TransactionIcon,
    color: '#4CAF50'
  }
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'Tout', count: 0 },
  { id: NOTIFICATION_TYPES.TRANSACTION, label: 'Transactions', count: 0 },
  { id: NOTIFICATION_TYPES.SECURITY, label: 'Sécurité', count: 0 },
  { id: NOTIFICATION_TYPES.TONTINE, label: 'Tontines', count: 0 },
  { id: NOTIFICATION_TYPES.SYSTEM, label: 'Système', count: 0 }
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  // États
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: true,
    transactionAlerts: true,
    securityAlerts: true,
    tontineAlerts: true,
    systemAlerts: false
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

  const getFilteredNotifications = () => {
    if (activeFilter === 'all') {
      return notifications;
    }
    return notifications.filter(notif => notif.type === activeFilter);
  };

  const getFilterCounts = () => {
    const counts = {
      all: notifications.length,
      [NOTIFICATION_TYPES.TRANSACTION]: 0,
      [NOTIFICATION_TYPES.SECURITY]: 0,
      [NOTIFICATION_TYPES.TONTINE]: 0,
      [NOTIFICATION_TYPES.SYSTEM]: 0
    };

    notifications.forEach(notif => {
      counts[notif.type]++;
    });

    return counts;
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    Alert.alert('Succès', 'Toutes les notifications ont été marquées comme lues');
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'Supprimer la notification',
      'Êtes-vous sûr de vouloir supprimer cette notification ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
          }
        }
      ]
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifDate = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return notifDate.toLocaleDateString('fr-FR');
  };

  const handleSettingChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderFilters = () => {
    const counts = getFilterCounts();
    
    return (
      <ScrollView 
        horizontal 
        style={styles.filtersContainer}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTER_OPTIONS.map((filter) => {
          const count = counts[filter.id] || 0;
          const isActive = activeFilter === filter.id;
          
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isActive && { backgroundColor: theme.textPrimary },
                { borderColor: theme.cardBorder }
              ]}
              onPress={() => setActiveFilter(filter.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterButtonText,
                isActive && { color: 'white' },
                !isActive && { color: theme.textTertiary }
              ]}>
                {filter.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderNotificationItem = (notification: any) => {
    const IconComponent = notification.icon;
    
    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationItem,
          { 
            backgroundColor: notification.read ? theme.cardBackground : theme.unreadBackground,
            borderColor: notification.read ? theme.cardBorder : theme.unreadBorder
          }
        ]}
        onPress={() => !notification.read && markAsRead(notification.id)}
        onLongPress={() => deleteNotification(notification.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.notificationIcon, { backgroundColor: `${notification.color}15` }]}>
          <IconComponent color={notification.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, { color: theme.textTertiary }]}>
              {notification.title}
            </Text>
            <Text style={[styles.notificationTime, { color: theme.textSecondary }]}>
              {formatTimeAgo(notification.timestamp)}
            </Text>
          </View>
          <Text style={[styles.notificationMessage, { color: theme.textSecondary }]}>
            {notification.message}
          </Text>
        </View>
        
        {!notification.read && (
          <View style={[styles.unreadIndicator, { backgroundColor: theme.textPrimary }]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <Text style={[styles.settingsTitle, { color: theme.textTertiary }]}>
        Paramètres de notification
      </Text>
      
      <View style={[styles.settingsSection, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[styles.settingsSectionTitle, { color: theme.textTertiary }]}>
          Moyens de notification
        </Text>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.textTertiary }]}>Notifications push</Text>
          <Switch
            value={notificationSettings.pushEnabled}
            onValueChange={() => handleSettingChange('pushEnabled')}
            trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
            thumbColor={notificationSettings.pushEnabled ? '#FFFFFF' : theme.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.textTertiary }]}>Notifications email</Text>
          <Switch
            value={notificationSettings.emailEnabled}
            onValueChange={() => handleSettingChange('emailEnabled')}
            trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
            thumbColor={notificationSettings.emailEnabled ? '#FFFFFF' : theme.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.textTertiary }]}>Notifications SMS</Text>
          <Switch
            value={notificationSettings.smsEnabled}
            onValueChange={() => handleSettingChange('smsEnabled')}
            trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
            thumbColor={notificationSettings.smsEnabled ? '#FFFFFF' : theme.textSecondary}
          />
        </View>
      </View>
      
      <View style={[styles.settingsSection, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Text style={[styles.settingsSectionTitle, { color: theme.textTertiary }]}>
          Types de notifications
        </Text>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.textTertiary }]}>Alertes transactions</Text>
          <Switch
            value={notificationSettings.transactionAlerts}
            onValueChange={() => handleSettingChange('transactionAlerts')}
            trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
            thumbColor={notificationSettings.transactionAlerts ? '#FFFFFF' : theme.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.textTertiary }]}>Alertes sécurité</Text>
          <Switch
            value={notificationSettings.securityAlerts}
            onValueChange={() => handleSettingChange('securityAlerts')}
            trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
            thumbColor={notificationSettings.securityAlerts ? '#FFFFFF' : theme.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.textTertiary }]}>Alertes tontines</Text>
          <Switch
            value={notificationSettings.tontineAlerts}
            onValueChange={() => handleSettingChange('tontineAlerts')}
            trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
            thumbColor={notificationSettings.tontineAlerts ? '#FFFFFF' : theme.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.textTertiary }]}>Alertes système</Text>
          <Switch
            value={notificationSettings.systemAlerts}
            onValueChange={() => handleSettingChange('systemAlerts')}
            trackColor={{ false: theme.cardBorder, true: theme.textPrimary }}
            thumbColor={notificationSettings.systemAlerts ? '#FFFFFF' : theme.textSecondary}
          />
        </View>
      </View>
    </View>
  );

  const renderNotificationsList = () => {
    const filteredNotifications = getFilteredNotifications();
    
    if (filteredNotifications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: `${theme.textPrimary}15` }]}>
            <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={theme.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={theme.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
          <Text style={[styles.emptyTitle, { color: theme.textTertiary }]}>
            Aucune notification
          </Text>
          <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
            {activeFilter === 'all' 
              ? 'Vous n\'avez aucune notification pour le moment'
              : `Aucune notification ${FILTER_OPTIONS.find(f => f.id === activeFilter)?.label.toLowerCase()}`
            }
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.notificationsList}>
        {filteredNotifications.map(renderNotificationItem)}
      </View>
    );
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
        transform: [{ translateY: slideAnim }],
        paddingTop: insets.top
      }]}>
        
        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => showSettings ? setShowSettings(false) : router.back()}
          >
            <BackIcon color={theme.textTertiary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textTertiary }]}>
            {showSettings ? 'Paramètres' : 'Notifications'}
            {!showSettings && getUnreadCount() > 0 && (
              <Text style={[styles.unreadBadge, { color: theme.textPrimary }]}>
                {' '}({getUnreadCount()})
              </Text>
            )}
          </Text>
          <View style={styles.headerActions}>
            {!showSettings && (
              <>
                <TouchableOpacity 
                  style={styles.headerAction}
                  onPress={markAllAsRead}
                  disabled={getUnreadCount() === 0}
                >
                  <MarkAllReadIcon color={getUnreadCount() > 0 ? theme.textPrimary : theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerAction}
                  onPress={() => setShowSettings(true)}
                >
                  <SettingsIcon color={theme.textTertiary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {showSettings ? renderSettings() : (
            <>
              {renderFilters()}
              {renderNotificationsList()}
            </>
          )}
          
          <View style={{ height: 50 }} />
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  unreadBadge: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    padding: 8,
  },
  
  content: {
    flex: 1,
  },

  // Filtres
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersContent: {
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Notifications
  notificationsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  notificationTime: {
    fontSize: 12,
    flexShrink: 0,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // État vide
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Paramètres
  settingsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settingsSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
});