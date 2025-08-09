import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, StatusBar, ScrollView, TouchableOpacity, Alert, Switch, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Thèmes YANKAP
const THEMES = {
  light: {
    background: '#F5F5F5',
    cardBackground: '#FFFFFF',
    textPrimary: '#1DBAA3',
    textSecondary: '#666',
    textTertiary: '#333',
    border: '#E0E0E0',
    danger: '#FF4444',
    success: '#4CAF50',
    statusBarStyle: 'dark-content' as const,
  },
  dark: {
    background: '#121212',
    cardBackground: '#1E1E1E',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    border: '#333',
    danger: '#FF6B6B',
    success: '#66BB6A',
    statusBarStyle: 'light-content' as const,
  },
};

export default function SecurityScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    biometricAuth: true,
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    Alert.alert(
      'Succès',
      'Votre mot de passe a été modifié avec succès',
      [
        {
          text: 'OK',
          onPress: () => {
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setIsChangingPassword(false);
          }
        }
      ]
    );
  };

  const handleSecuritySettingChange = (setting: keyof typeof securitySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: value }));
    Alert.alert('Paramètre mis à jour', `${setting} ${value ? 'activé' : 'désactivé'}`);
  };

  const handleViewLoginHistory = () => {
    Alert.alert('Historique des connexions', 'Fonctionnalité à venir');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès')
        }
      ]
    );
  };

  const SecuritySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    rightElement 
  }: { 
    icon: string; 
    title: string; 
    description?: string; 
    onPress?: () => void; 
    rightElement?: React.ReactNode 
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: theme.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={theme.textPrimary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.textTertiary }]}>{title}</Text>
          {description && (
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar 
        barStyle={theme.statusBarStyle} 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      <View style={[styles.container, { 
        backgroundColor: theme.background,
        paddingTop: insets.top
      }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textTertiary }]}>Sécurité</Text>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Section Mot de passe */}
          <SecuritySection title="Mot de passe">
            {!isChangingPassword ? (
              <SettingItem
                icon="lock-closed"
                title="Changer le mot de passe"
                description="Dernière modification il y a 30 jours"
                onPress={() => setIsChangingPassword(true)}
              />
            ) : (
              <View style={styles.passwordForm}>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.textTertiary
                  }]}
                  placeholder="Mot de passe actuel"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                />
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.textTertiary
                  }]}
                  placeholder="Nouveau mot de passe"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                />
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.textTertiary
                  }]}
                  placeholder="Confirmer le nouveau mot de passe"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                />
                <View style={styles.passwordActions}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
                    onPress={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton, { backgroundColor: theme.textPrimary }]}
                    onPress={handlePasswordChange}
                  >
                    <Text style={styles.saveButtonText}>Enregistrer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </SecuritySection>

          {/* Section Authentification */}
          <SecuritySection title="Authentification">
            <SettingItem
              icon="finger-print"
              title="Authentification biométrique"
              description="Utiliser votre empreinte ou Face ID"
              rightElement={
                <Switch
                  value={securitySettings.biometricAuth}
                  onValueChange={(value) => handleSecuritySettingChange('biometricAuth', value)}
                  trackColor={{ false: theme.border, true: theme.textPrimary }}
                  thumbColor={securitySettings.biometricAuth ? '#FFFFFF' : theme.textSecondary}
                />
              }
            />
            <SettingItem
              icon="shield-checkmark"
              title="Authentification à deux facteurs"
              description="Sécurité renforcée avec SMS ou app"
              rightElement={
                <Switch
                  value={securitySettings.twoFactorAuth}
                  onValueChange={(value) => handleSecuritySettingChange('twoFactorAuth', value)}
                  trackColor={{ false: theme.border, true: theme.textPrimary }}
                  thumbColor={securitySettings.twoFactorAuth ? '#FFFFFF' : theme.textSecondary}
                />
              }
            />
          </SecuritySection>

          {/* Section Notifications */}
          <SecuritySection title="Notifications de sécurité">
            <SettingItem
              icon="notifications"
              title="Alertes de connexion"
              description="Recevoir une alerte lors de nouvelles connexions"
              rightElement={
                <Switch
                  value={securitySettings.loginNotifications}
                  onValueChange={(value) => handleSecuritySettingChange('loginNotifications', value)}
                  trackColor={{ false: theme.border, true: theme.textPrimary }}
                  thumbColor={securitySettings.loginNotifications ? '#FFFFFF' : theme.textSecondary}
                />
              }
            />
          </SecuritySection>

          {/* Section Sessions */}
          <SecuritySection title="Gestion des sessions">
            <SettingItem
              icon="time"
              title="Délai d'expiration de session"
              description={`${securitySettings.sessionTimeout} minutes d'inactivité`}
              onPress={() => {
                Alert.alert(
                  'Délai d\'expiration',
                  'Choisir le délai d\'inactivité avant déconnexion automatique',
                  [
                    { text: '15 min', onPress: () => handleSecuritySettingChange('sessionTimeout', 15) },
                    { text: '30 min', onPress: () => handleSecuritySettingChange('sessionTimeout', 30) },
                    { text: '60 min', onPress: () => handleSecuritySettingChange('sessionTimeout', 60) },
                    { text: 'Annuler', style: 'cancel' }
                  ]
                );
              }}
            />
            <SettingItem
              icon="list"
              title="Historique des connexions"
              description="Voir vos dernières connexions"
              onPress={handleViewLoginHistory}
            />
          </SecuritySection>

          {/* Section Danger */}
          <SecuritySection title="Zone de danger">
            <SettingItem
              icon="trash"
              title="Supprimer le compte"
              description="Supprimer définitivement votre compte"
              onPress={handleDeleteAccount}
            />
          </SecuritySection>
        </ScrollView>
      </View>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  passwordForm: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});