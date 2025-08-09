import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Thèmes YANKAP
const THEMES = {
  light: {
    background: '#F5F5F5',
    textPrimary: '#1DBAA3',
    textSecondary: '#666',
    textTertiary: '#333',
    cardBackground: '#FFFFFF',
    border: '#E0E0E0',
    inputBackground: '#FFFFFF',
    inputBorder: '#E0E0E0',
    statusBarStyle: 'dark-content' as const,
  },
  dark: {
    background: '#121212',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    cardBackground: '#1E1E1E',
    border: '#333333',
    inputBackground: '#2A2A2A',
    inputBorder: '#444444',
    statusBarStyle: 'light-content' as const,
  },
};

export default function ProfileInfoScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+237 6XX XX XX XX',
    dateOfBirth: '01/01/1990',
    address: 'Douala, Cameroun',
    profession: 'Développeur',
    emergencyContact: '+237 6XX XX XX XX',
  });

  const [editedData, setEditedData] = useState(profileData);

  const handleEdit = () => {
    setEditedData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    Alert.alert('Succès', 'Informations mises à jour avec succès');
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Changer la photo',
      'Choisissez une option',
      [
        { text: 'Prendre une photo', onPress: () => console.log('Camera') },
        { text: 'Galerie', onPress: () => console.log('Gallery') },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const renderField = (label: string, value: string, key: keyof typeof profileData, placeholder?: string) => (
    <View style={[styles.fieldContainer, { borderBottomColor: theme.border }]}>
      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.textTertiary,
            },
          ]}
          value={editedData[key]}
          onChangeText={(text) => setEditedData({ ...editedData, [key]: text })}
          placeholder={placeholder || label}
          placeholderTextColor={theme.textSecondary}
        />
      ) : (
        <Text style={[styles.fieldValue, { color: theme.textTertiary }]}>{value}</Text>
      )}
    </View>
  );

  return (
    <>
      <StatusBar 
        barStyle={theme.statusBarStyle} 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textTertiary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textTertiary }]}>
            Informations personnelles
          </Text>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={isEditing ? handleCancel : handleEdit}
          >
            <Text style={[styles.editButtonText, { color: theme.textPrimary }]}>
              {isEditing ? 'Annuler' : 'Modifier'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={[styles.avatarSection, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity onPress={handleChangeAvatar} disabled={!isEditing}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/120x120/1DBAA3/FFFFFF?text=JD' }}
                  style={styles.avatar}
                />
                {isEditing && (
                  <View style={[styles.avatarEditOverlay, { backgroundColor: theme.textPrimary }]}>
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <Text style={[styles.userName, { color: theme.textTertiary }]}>
              {profileData.firstName} {profileData.lastName}
            </Text>
          </View>

          {/* Form Fields */}
          <View style={[styles.formSection, { backgroundColor: theme.cardBackground }]}>
            {renderField('Prénom', profileData.firstName, 'firstName')}
            {renderField('Nom', profileData.lastName, 'lastName')}
            {renderField('Email', profileData.email, 'email')}
            {renderField('Téléphone', profileData.phone, 'phone')}
            {renderField('Date de naissance', profileData.dateOfBirth, 'dateOfBirth')}
            {renderField('Adresse', profileData.address, 'address')}
            {renderField('Profession', profileData.profession, 'profession')}
            {renderField('Contact d\'urgence', profileData.emergencyContact, 'emergencyContact')}
          </View>

          {/* Save Button */}
          {isEditing && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.textPrimary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  editButton: {
    padding: 5,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 15,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formSection: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fieldContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
  },
  saveButton: {
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});