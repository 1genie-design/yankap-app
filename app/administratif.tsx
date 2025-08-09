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
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, G, Line, Polygon } from 'react-native-svg';
import { TEXT_STYLES } from './index';

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
  const [searchQuery, setSearchQuery] = useState('');
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

  // Icônes SVG simplifiées
  const ArrowLeftIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const DocumentIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" fill="none"/>
      <Polygon points="14,2 14,8 20,8" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2"/>
      <Line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const IdCardIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <Circle cx="8" cy="10" r="2" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="14" y1="8" x2="18" y2="8" stroke={color} strokeWidth="2"/>
      <Line x1="14" y1="12" x2="18" y2="12" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const CertificateIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const BankIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L2 7h20l-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Line x1="2" y1="17" x2="22" y2="17" stroke={color} strokeWidth="2"/>
      <Line x1="6" y1="7" x2="6" y2="17" stroke={color} strokeWidth="2"/>
      <Line x1="18" y1="7" x2="18" y2="17" stroke={color} strokeWidth="2"/>
    </Svg>
  );

  const UserIcon = ({ color = theme.textPrimary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2"/>
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
    </Svg>
  );

  const ClockIcon = ({ color = theme.textSecondary }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const CheckIcon = ({ color = theme.successColor }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  // Données des documents officiels
  const documentsData = [
    {
      id: 1,
      title: 'Carte d\'identité nationale',
      description: 'Demande et renouvellement de CNI',
      icon: <IdCardIcon color={theme.textPrimary} />,
      price: '5,000 FCFA',
      duration: '5-7 jours',
      status: 'Disponible'
    },
    {
      id: 2,
      title: 'Passeport biométrique',
      description: 'Demande de passeport international',
      icon: <DocumentIcon color={theme.textPrimary} />,
      price: '75,000 FCFA',
      duration: '15-20 jours',
      status: 'Disponible'
    },
    {
      id: 3,
      title: 'Extrait de naissance',
      description: 'Copie certifiée conforme',
      icon: <CertificateIcon color={theme.textPrimary} />,
      price: '1,000 FCFA',
      duration: '2-3 jours',
      status: 'Disponible'
    },
    {
      id: 4,
      title: 'Casier judiciaire',
      description: 'Bulletin n°3 du casier judiciaire',
      icon: <DocumentIcon color={theme.textPrimary} />,
      price: '2,000 FCFA',
      duration: '3-5 jours',
      status: 'Disponible'
    },
    {
      id: 5,
      title: 'Certificat de résidence',
      description: 'Attestation de domicile officielle',
      icon: <CertificateIcon color={theme.textPrimary} />,
      price: '1,500 FCFA',
      duration: '1-2 jours',
      status: 'Disponible'
    }
  ];

  // Données des services d'accompagnement
  const servicesData = [
    {
      id: 1,
      title: 'Déclaration fiscale',
      description: 'Assistance pour vos déclarations d\'impôts',
      icon: <DocumentIcon color={theme.textPrimary} />,
      price: 'À partir de 10,000 FCFA',
      category: 'Fiscal',
      badge: 'Expert'
    },
    {
      id: 2,
      title: 'Création d\'entreprise',
      description: 'Accompagnement création SARL, SA, etc.',
      icon: <BankIcon color={theme.textPrimary} />,
      price: 'À partir de 50,000 FCFA',
      category: 'Entreprise',
      badge: 'Populaire'
    },
    {
      id: 3,
      title: 'Légalisation de documents',
      description: 'Légalisation et apostille',
      icon: <CertificateIcon color={theme.textPrimary} />,
      price: '5,000 FCFA/document',
      category: 'Légal',
      badge: 'Rapide'
    },
    {
      id: 4,
      title: 'Visa et immigration',
      description: 'Assistance demandes de visa',
      icon: <UserIcon color={theme.textPrimary} />,
      price: 'À partir de 25,000 FCFA',
      category: 'Immigration',
      badge: 'Spécialisé'
    },
    {
      id: 5,
      title: 'Traduction certifiée',
      description: 'Traduction assermentée de documents',
      icon: <DocumentIcon color={theme.textPrimary} />,
      price: '3,000 FCFA/page',
      category: 'Traduction',
      badge: 'Certifié'
    }
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
            Alert.alert('Succès', 'Votre demande a été enregistrée. Un expert vous contactera sous peu.');
          }
        }
      ]
    );
  };

  const renderDocuments = () => (
    <View style={styles.tabContent}>
      <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, marginBottom: 20, textAlign: 'center' }]}>
        Demandez vos documents officiels en ligne et suivez l'avancement
      </Text>
      
      {documentsData.map((document) => (
        <View key={document.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              {document.icon}
            </View>
            <View style={styles.cardInfo}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{document.title}</Text>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 4 }]}>{document.description}</Text>
            </View>
          </View>
          
          <View style={[styles.cardDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Prix</Text>
              <Text style={[TEXT_STYLES.body, { color: theme.textPrimary, fontWeight: '600' }]}>{document.price}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Délai</Text>
              <View style={styles.durationContainer}>
                <ClockIcon color={theme.textSecondary} />
                <Text style={[TEXT_STYLES.caption, { color: theme.textTertiary, marginLeft: 4 }]}>{document.duration}</Text>
              </View>
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

  const renderServices = () => (
    <View style={styles.tabContent}>
      <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, marginBottom: 20, textAlign: 'center' }]}>
        Bénéficiez de l'accompagnement d'experts pour vos démarches complexes
      </Text>
      
      {servicesData.map((service) => (
        <View key={service.id} style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              {service.icon}
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.serviceTitleRow}>
                <Text style={[TEXT_STYLES.h3, { color: theme.textTertiary }]}>{service.title}</Text>
                <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary, fontWeight: '600' }]}>{service.badge}</Text>
                </View>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, marginTop: 4 }]}>{service.description}</Text>
            </View>
          </View>
          
          <View style={[styles.cardDetails, { borderTopColor: theme.divider }]}>
            <View style={styles.detailRow}>
              <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>Catégorie</Text>
              <View style={[styles.categoryBadge, { borderColor: theme.textPrimary }]}>
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



          {/* Tab Navigation */}
          <View style={[styles.tabContainer, { borderBottomColor: theme.cardBorder }]}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tab,
                  activeTab === index && { borderBottomColor: theme.textPrimary }
                ]}
                onPress={() => setActiveTab(index)}
              >
                <Text style={[
                  TEXT_STYLES.caption,
                  { 
                    color: activeTab === index ? theme.textPrimary : theme.textSecondary,
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
    borderBottomWidth: 0.5,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 12,
    padding: 8,
  },
  cardInfo: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardDetails: {
    borderTopWidth: 0.5,
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  requestButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default AdministratifPage;
