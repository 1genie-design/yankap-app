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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { TEXT_STYLES } from '../index';

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

const AdministratifPage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState(0);
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

  // Icônes SVG pour les services administratifs
  const ArrowLeftIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const DocumentIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CertificateIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M12 2a15.3 15.3 0 004 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const IdCardIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <Circle cx="8" cy="10" r="2" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M14 14h4M14 10h4M6 16h2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const PassportIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <Circle cx="12" cy="8" r="2" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M8 14h8M8 17h8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const BankIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L2 7h20l-10-5zM2 17h20M6 7v10M10 7v10M14 7v10M18 7v10M2 21h20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const FormIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.5 0 4.74 1.02 6.364 2.636" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const DownloadIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const EyeIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2"/>
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  // Données des documents
  const documentsData = [
    {
      id: 1,
      title: 'Carte d\'identité nationale',
      description: 'Demande et renouvellement de CNI',
      icon: <IdCardIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: '5,000 FCFA',
      duration: '5-7 jours'
    },
    {
      id: 2,
      title: 'Passeport',
      description: 'Demande de passeport biométrique',
      icon: <PassportIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: '75,000 FCFA',
      duration: '15-20 jours'
    },
    {
      id: 3,
      title: 'Extrait de naissance',
      description: 'Copie certifiée conforme',
      icon: <CertificateIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: '1,000 FCFA',
      duration: '2-3 jours'
    },
    {
      id: 4,
      title: 'Casier judiciaire',
      description: 'Bulletin n°3 du casier judiciaire',
      icon: <DocumentIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: '2,000 FCFA',
      duration: '3-5 jours'
    },
    {
      id: 5,
      title: 'Certificat de résidence',
      description: 'Attestation de domicile',
      icon: <CertificateIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: '1,500 FCFA',
      duration: '1-2 jours'
    },
  ];

  // Données des services
  const servicesData = [
    {
      id: 1,
      title: 'Déclaration fiscale',
      description: 'Assistance pour vos déclarations d\'impôts',
      icon: <FormIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: 'À partir de 10,000 FCFA',
      category: 'Fiscal'
    },
    {
      id: 2,
      title: 'Création d\'entreprise',
      description: 'Accompagnement création SARL, SA, etc.',
      icon: <BankIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: 'À partir de 50,000 FCFA',
      category: 'Entreprise'
    },
    {
      id: 3,
      title: 'Légalisation de documents',
      description: 'Légalisation et apostille',
      icon: <CertificateIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: '5,000 FCFA/document',
      category: 'Légal'
    },
    {
      id: 4,
      title: 'Visa et immigration',
      description: 'Assistance demandes de visa',
      icon: <PassportIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: 'À partir de 25,000 FCFA',
      category: 'Immigration'
    },
    {
      id: 5,
      title: 'Traduction certifiée',
      description: 'Traduction assermentée de documents',
      icon: <DocumentIcon color={theme.textPrimary} />,
      status: 'Disponible',
      price: '3,000 FCFA/page',
      category: 'Traduction'
    },
  ];

  const handleDocumentRequest = (document) => {
    Alert.alert(
      'Demande de document',
      `Souhaitez-vous demander : ${document.title}?\n\nPrix: ${document.price}\nDélai: ${document.duration}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            Alert.alert('Succès', 'Votre demande a été enregistrée. Vous recevrez une notification de suivi.');
          }
        }
      ]
    );
  };

  const handleServiceRequest = (service) => {
    Alert.alert(
      'Demande de service',
      `Souhaitez-vous demander : ${service.title}?\n\nPrix: ${service.price}\nCatégorie: ${service.category}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            Alert.alert('Succès', 'Votre demande a été enregistrée. Un agent vous contactera sous peu.');
          }
        }
      ]
    );
  };

  // Rendu de la section Documents
  const renderDocuments = () => (
    <View style={styles.tabContent}>
      <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, marginBottom: 20, textAlign: 'center' }]}>
        Demandez vos documents administratifs en ligne et suivez l'avancement de vos démarches
      </Text>
      
      {documentsData.map((document) => (
        <View key={document.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              {document.icon}
            </View>
            <View style={styles.cardInfo}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{document.title}</Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>{document.description}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <EyeIcon color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.cardDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Prix</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>{document.price}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Délai</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary }]}>{document.duration}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.requestButton, { backgroundColor: theme.textPrimary }]}
            onPress={() => handleDocumentRequest(document)}
          >
            <Text style={[TEXT_STYLES.button, { color: 'white' }]}>Demander ce document</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  // Rendu de la section Services
  const renderServices = () => (
    <View style={styles.tabContent}>
      <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, marginBottom: 20, textAlign: 'center' }]}>
        Bénéficiez de l'accompagnement d'experts pour vos démarches administratives complexes
      </Text>
      
      {servicesData.map((service) => (
        <View key={service.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              {service.icon}
            </View>
            <View style={styles.cardInfo}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{service.title}</Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>{service.description}</Text>
            </View>
          </View>
          
          <View style={[styles.cardDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Catégorie</Text>
              <View style={[styles.categoryBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, fontWeight: '600' }]}>{service.category}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Prix</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textTertiary, fontWeight: '600' }]}>{service.price}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.requestButton, { backgroundColor: theme.textPrimary }]}
            onPress={() => handleServiceRequest(service)}
          >
            <Text style={[TEXT_STYLES.button, { color: 'white' }]}>Demander ce service</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const tabs = [
    { name: 'Documents', render: renderDocuments },
    { name: 'Services', render: renderServices },
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
            <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary }]}>Services Administratifs</Text>
          </View>

          {/* Info Banner */}
          <View style={[styles.infoBanner, { backgroundColor: theme.primaryLight }]}>
            <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, textAlign: 'center' }]}>
              📋 Simplifiez vos démarches administratives avec YANKAP
            </Text>
          </View>

          {/* Tab Navigation */}
          <View style={[styles.tabContainer, { backgroundColor: theme.cardBackground }]}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tab,
                  activeTab === index && { backgroundColor: theme.textPrimary }
                ]}
                onPress={() => setActiveTab(index)}
              >
                <Text style={[
                  TEXT_STYLES.body,
                  { 
                    color: activeTab === index ? 'white' : theme.textSecondary,
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
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  infoBanner: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
  },
  card: {
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardIcon: {
    marginRight: 16,
    padding: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  cardDetails: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  requestButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1DBAA3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default AdministratifPage;
