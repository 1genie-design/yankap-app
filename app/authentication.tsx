// Imports React et React Native pour l'interface d'authentification
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, useColorScheme, TextInput, Animated, Modal, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router'; // Navigation et paramètres d'URL
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Gestion des zones sécurisées
import Svg, { Path } from 'react-native-svg'; // Composants SVG pour les icônes

// Configuration des polices utilisées dans l'application YANKAP
const FONTS = {
  primary: 'Inter',    // Police principale pour les titres et labels
  secondary: 'Poppins', // Police secondaire pour les boutons
  tertiary: 'Roboto',   // Police pour le texte courant
};

// Styles de texte standardisés pour l'application
const TEXT_STYLES = {
  h1: { fontFamily: FONTS.primary, fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontFamily: FONTS.primary, fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontFamily: FONTS.primary, fontSize: 20, fontWeight: '600' as const },
  body: { fontFamily: FONTS.tertiary, fontSize: 16, fontWeight: 'normal' as const },
  bodySmall: { fontFamily: FONTS.tertiary, fontSize: 14, fontWeight: 'normal' as const },
  button: { fontFamily: FONTS.secondary, fontSize: 16, fontWeight: '600' as const },
  label: { fontFamily: FONTS.primary, fontSize: 14, fontWeight: '500' as const },
  input: { fontFamily: FONTS.primary, fontSize: 16, fontWeight: 'normal' as const },
};

// Liste des pays africains et territoires français supportés par Orange Money
// Chaque entrée contient le code téléphonique international, le nom du pays et son drapeau
const ORANGE_MONEY_COUNTRIES = [
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+224', country: 'Guinée', flag: '🇬🇳' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+230', country: 'Maurice', flag: '🇲🇺' },
  { code: '+261', country: 'Madagascar', flag: '🇲🇬' },
  { code: '+262', country: 'La Réunion', flag: '🇷🇪' },
  { code: '+596', country: 'Martinique', flag: '🇲🇶' },
  { code: '+590', country: 'Guadeloupe', flag: '🇬🇵' },
];

// Configuration des thèmes clair et sombre pour l'application
const THEMES = {
  light: {
    background: '#F5F5F5',           // Arrière-plan gris clair
    textPrimary: '#1DBAA3',          // Couleur principale YANKAP (vert turquoise)
    textSecondary: '#666',           // Texte secondaire gris
    textTertiary: '#333',            // Texte tertiaire gris foncé
    statusBarStyle: 'dark-content' as const, // Contenu sombre de la barre de statut
    inputBackground: 'white',        // Arrière-plan des champs de saisie
    inputBorder: '#E0E0E0',         // Bordure des champs de saisie
    buttonShadow: '#1DBAA3',         // Couleur de l'ombre des boutons
  },
  dark: {
    background: '#121212',           // Arrière-plan sombre
    textPrimary: '#1DBAA3',          // Couleur principale YANKAP conservée
    textSecondary: '#B0B0B0',        // Texte secondaire gris clair
    textTertiary: '#FFFFFF',         // Texte tertiaire blanc
    statusBarStyle: 'light-content' as const, // Contenu clair de la barre de statut
    inputBackground: '#2A2A2A',      // Arrière-plan sombre des champs de saisie
    inputBorder: '#404040',          // Bordure sombre des champs de saisie
    buttonShadow: '#1DBAA3',         // Couleur de l'ombre des boutons
  },
};

// Composant d'icône flèche de retour pour la navigation
const ChevronLeftIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M15 18l-6-6 6-6" 
      fill="none" 
      stroke="#1DBAA3" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Composant d'icône de flèche animée pour les boutons d'action
const ArrowIcon = () => {
  // Références pour les animations de translation et d'opacité
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fonction d'animation de la flèche (mouvement de droite avec fondu)
    const animateArrow = () => {
      Animated.sequence([
        // Phase 1: Flèche se déplace vers la droite et s'estompe
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 4,           // Déplacement de 4 pixels vers la droite
            duration: 800,        // Durée de l'animation en millisecondes
            useNativeDriver: false, // Utilisation du driver JS pour la compatibilité
          }),
          Animated.timing(opacity, {
            toValue: 0.3,         // Opacité réduite à 30%
            duration: 800,
            useNativeDriver: false,
          }),
        ]),
        // Phase 2: Retour à la position et opacité initiales
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,           // Retour à la position originale
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 1,           // Opacité complète
            duration: 600,
            useNativeDriver: false,
          }),
        ]),
        // Phase 3: Pause avant la répétition de l'animation
        Animated.delay(1500),     // Attente de 1.5 seconde
      ]).start(() => animateArrow()); // Répétition infinie de l'animation
    };

    animateArrow(); // Démarrage de l'animation
  }, []);

  return (
    <View style={styles.arrowCircle}>
      <Animated.View style={{ transform: [{ translateX }], opacity }}>
        <Svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <Path 
            d="M8 1L12 5L8 9M11.5 5L1 5" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

// Composant principal de l'écran d'authentification YANKAP
export default function AuthScreen() {
  // Récupération des paramètres d'URL (mode d'authentification)
  const params = useLocalSearchParams();
  
  // Détection automatique du mode sombre/clair du système
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  
  // États de l'interface utilisateur
  const [isLogin, setIsLogin] = useState(true); // Mode connexion vs inscription
  const [authMode, setAuthMode] = useState<'otp' | 'password'>((params.mode as 'otp' | 'password') || 'otp');
  const [step, setStep] = useState<'phone' | 'otp'>('phone'); // Étape du processus OTP
  const [isLoading, setIsLoading] = useState(false); // État de chargement
  const [showCountryPicker, setShowCountryPicker] = useState(false); // Affichage du sélecteur de pays
  
  // États des formulaires
  const [selectedCountry, setSelectedCountry] = useState(ORANGE_MONEY_COUNTRIES[0]); // Pays sélectionné par défaut
  const [phoneNumber, setPhoneNumber] = useState(''); // Numéro de téléphone
  const [name, setName] = useState(''); // Nom complet pour l'inscription
  const [email, setEmail] = useState(''); // Email ou numéro pour l'auth par mot de passe
  const [password, setPassword] = useState(''); // Mot de passe
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']); // 6 champs OTP séparés
  
  // Gestion des zones sécurisées pour les appareils avec encoche
  const insets = useSafeAreaInsets();

  // Sélection du thème approprié selon le mode
  const theme = isDark ? THEMES.dark : THEMES.light;

  // Effet pour synchroniser le thème avec les changements système
  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  // Gestionnaire d'envoi du code OTP par SMS
  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) return; // Validation du numéro requis
    
    setIsLoading(true);
    try {
      // TODO: Implémenter la logique d'envoi d'OTP via API
      console.log('Envoi OTP vers:', `${selectedCountry.code}${phoneNumber}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation d'appel API
      setStep('otp'); // Passage à l'étape de vérification
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'OTP:', error);
      // TODO: Afficher un message d'erreur à l'utilisateur
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire de vérification du code OTP saisi
  const handleVerifyOTP = async () => {
    const otpCode = otpValues.join(''); // Assemblage des 6 chiffres
    if (otpCode.length !== 6) return; // Validation du code complet
    
    setIsLoading(true);
    try {
      // TODO: Implémenter la logique de vérification OTP via API
      console.log('Vérification OTP:', { 
        phoneNumber: `${selectedCountry.code}${phoneNumber}`, 
        otp: otpCode, 
        isLogin, 
        name 
      });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation d'appel API
      
      // TODO: Navigation vers le dashboard après vérification réussie
      // router.push('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'OTP:', error);
      // TODO: Afficher un message d'erreur et permettre une nouvelle tentative
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire d'authentification par email/mot de passe
  const handlePasswordAuth = async () => {
    if (authMode === 'password') {
      // Validation des champs requis
      if (!email.trim() || !password.trim()) return;
      if (!isLogin && !name.trim()) return; // Nom requis pour l'inscription
      
      setIsLoading(true);
      try {
        // TODO: Implémenter la logique d'authentification par mot de passe via API
        console.log('Authentification par mot de passe:', { 
          email: email.trim(), 
          password, 
          isLogin, 
          name: name.trim() 
        });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation d'appel API
        
        // TODO: Navigation vers le dashboard après authentification réussie
        // router.push('/dashboard');
      } catch (error) {
        console.error('Erreur lors de l\'authentification par mot de passe:', error);
        // TODO: Afficher un message d'erreur approprié
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Gestionnaire de modification d'un champ OTP individuel
  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) return; // Limitation à un seul caractère par champ
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // TODO: Focus automatique sur le champ suivant si une valeur est saisie
  };

  // Gestionnaire de renvoi du code OTP
  const handleResendOTP = () => {
    console.log('Demande de renvoi du code OTP');
    setOtpValues(['', '', '', '', '', '']); // Réinitialisation des champs
    handleSendOTP(); // Nouveau envoi du code
  };

  // Gestionnaire de retour à l'étape de saisie du numéro
  const handleBackToPhone = () => {
    setStep('phone');
    setOtpValues(['', '', '', '', '', '']); // Réinitialisation des champs OTP
  };

  return (
    <>
      {/* Configuration de la barre de statut avec transparence */}
      <StatusBar 
        barStyle={theme.statusBarStyle} 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      {/* Container principal de l'écran d'authentification */}
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* En-tête personnalisé avec navigation et logo YANKAP */}
        <View style={[styles.customHeader, { 
          paddingTop: insets.top, 
          backgroundColor: 'white',
          borderBottomColor: isDark ? '#2A2A2A' : '#E5E5E5'
        }]}>
          {/* Bouton de retour */}
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon />
          </TouchableOpacity>
          
          {/* Titre yankap au centre */}
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>yankap</Text>
          
          {/* Espace pour équilibrer le layout */}
          <View style={styles.headerButton} />
        </View>

        {/* Section de contenu principal avec défilement */}
        <View style={styles.content}>
          
          {/* Section titre et sous-titre dynamiques */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.textTertiary }]}>
              {step === 'phone' 
                ? (isLogin ? 'Bon retour !' : 'Rejoignez-nous') // Titre selon le mode connexion/inscription
                : 'Vérification' // Titre pour l'étape OTP
              }
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {step === 'phone' 
                ? (isLogin 
                    ? `Connectez-vous ${authMode === 'otp' ? 'avec votre numéro' : 'à votre compte'}` 
                    : `Créez votre compte ${authMode === 'otp' ? 'avec votre numéro' : 'YANKAP'}`
                  )
                : `Code envoyé au ${selectedCountry.code} ${phoneNumber}` // Confirmation du numéro pour OTP
              }
            </Text>
          </View>

          {/* Section formulaire adaptée selon l'étape et le mode */}
          <View style={styles.formSection}>
            {step === 'phone' ? (
              <>
                {/* Champ nom complet - uniquement pour l'inscription */}
                {!isLogin && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textTertiary }]}>Nom complet</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.inputBorder,
                        color: theme.textTertiary
                      }]}
                      value={name}
                      onChangeText={setName}
                      placeholder="Votre nom complet"
                      placeholderTextColor={theme.textSecondary}
                      autoCapitalize="words" // Majuscule automatique pour les noms
                    />
                  </View>
                )}
                
                {/* Formulaire d'authentification par OTP */}
                {authMode === 'otp' ? (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textTertiary }]}>Numéro de téléphone</Text>
                    <View style={[styles.phoneInputContainer, { 
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.inputBorder 
                    }]}>
                      {/* Sélecteur de pays avec drapeau et code */}
                      <TouchableOpacity 
                        style={styles.countrySelector}
                        onPress={() => setShowCountryPicker(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                        <Text style={[styles.countryCode, { color: theme.textTertiary }]}>
                          {selectedCountry.code}
                        </Text>
                        <Text style={[styles.dropdownIcon, { color: theme.textSecondary }]}>▼</Text>
                      </TouchableOpacity>
                      
                      {/* Champ de saisie du numéro de téléphone */}
                      <TextInput
                        style={[styles.phoneInput, { color: theme.textTertiary }]}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="6 XX XX XX XX"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="phone-pad"
                        maxLength={15} // Limitation de la longueur
                      />
                    </View>
                  </View>
                ) : (
                  /* Formulaire d'authentification par email/mot de passe */
                  <>
                    {/* Champ email ou numéro de téléphone */}
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: theme.textTertiary }]}>Email ou numéro de téléphone</Text>
                      <TextInput
                        style={[styles.input, { 
                          backgroundColor: theme.inputBackground,
                          borderColor: theme.inputBorder,
                          color: theme.textTertiary
                        }]}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="votre@email.com ou 6 XX XX XX XX"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="email-address" // Clavier adapté pour email
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    
                    {/* Champ mot de passe */}
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: theme.textTertiary }]}>Mot de passe</Text>
                      <TextInput
                        style={[styles.input, { 
                          backgroundColor: theme.inputBackground,
                          borderColor: theme.inputBorder,
                          color: theme.textTertiary
                        }]}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        placeholderTextColor={theme.textSecondary}
                        secureTextEntry={true} // Masquage du mot de passe
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    
                    {/* Lien "Mot de passe oublié" - uniquement en mode connexion */}
                    {isLogin && (
                      <TouchableOpacity 
                        style={styles.forgotPassword}
                        onPress={() => {
                          // TODO: Implémenter la réinitialisation du mot de passe
                          console.log('Réinitialisation du mot de passe demandée');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.forgotPasswordText, { color: theme.textPrimary }]}>
                          Mot de passe oublié ?
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </>
            ) : (
              /* Formulaire de vérification OTP - 6 champs séparés */
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.textTertiary }]}>Code de vérification</Text>
                  <View style={styles.otpContainer}>
                    {/* Génération des 6 champs OTP */}
                    {otpValues.map((value, index) => (
                      <TextInput
                        key={index}
                        style={[styles.otpField, { 
                          backgroundColor: theme.inputBackground,
                          borderColor: value ? theme.textPrimary : theme.inputBorder, // Bordure accentée si rempli
                          color: theme.textTertiary
                        }]}
                        value={value}
                        onChangeText={(text) => handleOTPChange(text, index)}
                        placeholder="0"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="number-pad"
                        maxLength={1} // Un seul chiffre par champ
                        textAlign="center"
                        selectTextOnFocus={true} // Sélection automatique du texte
                      />
                    ))}
                  </View>
                </View>
                
                {/* Actions pour l'étape OTP */}
                <View style={styles.otpActions}>
                  <TouchableOpacity 
                    onPress={handleBackToPhone}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                      Modifier le numéro
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={handleResendOTP}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.linkText, { color: theme.textPrimary }]}>
                      Renvoyer le code
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

        </View>

        {/* Toggle connexion/inscription - seulement à l'étape phone */}
        {step === 'phone' && (
          <View style={styles.toggleSection}>
            <Text style={[styles.toggleText, { color: theme.textSecondary }]}>
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={[styles.toggleLink, { color: theme.textPrimary }]}>
                {isLogin ? "S'inscrire" : "Se connecter"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bouton principal - toujours en bas */}
        <View style={[styles.buttonSection, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity 
            style={[
              styles.mainButton, 
              { 
                shadowColor: theme.buttonShadow,
                opacity: isLoading ? 0.7 : 1 
              }
            ]} 
            onPress={
              step === 'phone' 
                ? (authMode === 'otp' ? handleSendOTP : handlePasswordAuth)
                : handleVerifyOTP
            }
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {isLoading 
                  ? (step === 'phone' 
                      ? (authMode === 'otp' ? 'envoi...' : 'connexion...')
                      : 'vérification...'
                    )
                  : (step === 'phone' 
                      ? (authMode === 'otp' 
                          ? 'envoyer le code' 
                          : (isLogin ? 'se connecter' : 's\'inscrire')
                        )
                      : 'vérifier'
                    )
                }
              </Text>
              {!isLoading && (
                <View style={styles.arrowContainer}>
                  <ArrowIcon />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Modal de sélection de pays */}
        <Modal
          visible={showCountryPicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCountryPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.inputBackground }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textTertiary }]}>
                  Sélectionner un pays
                </Text>
                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                  <Text style={[styles.modalClose, { color: theme.textPrimary }]}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={ORANGE_MONEY_COUNTRIES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.countryOption, {
                      backgroundColor: selectedCountry.code === item.code ? theme.textPrimary + '20' : 'transparent'
                    }]}
                    onPress={() => {
                      setSelectedCountry(item);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text style={styles.flagText}>{item.flag}</Text>
                    <Text style={[styles.countryName, { color: theme.textTertiary }]}>
                      {item.country}
                    </Text>
                    <Text style={[styles.countryCodeOption, { color: theme.textSecondary }]}>
                      {item.code}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.countryList}
              />
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    minHeight: 60,
    marginHorizontal: 0,
    paddingHorizontal: 20,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    ...TEXT_STYLES.h2,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    ...TEXT_STYLES.h2,
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    ...TEXT_STYLES.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  authModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  authModeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  authModeButtonActive: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authModeText: {
    ...TEXT_STYLES.button,
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    flex: 1,
    marginBottom: 30,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  flagText: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCode: {
    ...TEXT_STYLES.input,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  dropdownIcon: {
    fontSize: 10,
    opacity: 0.6,
  },
  phoneInput: {
    ...TEXT_STYLES.input,
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    borderWidth: 0,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    ...TEXT_STYLES.label,
    marginBottom: 8,
  },
  input: {
    ...TEXT_STYLES.input,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpField: {
    ...TEXT_STYLES.input,
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgotPasswordText: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '500',
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '500',
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  mainButton: {
    backgroundColor: '#1DBAA3',
    borderRadius: 12.5,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  arrowContainer: {
    position: 'absolute',
    right: 8,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...TEXT_STYLES.button,
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    textTransform: 'lowercase',
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  toggleText: {
    ...TEXT_STYLES.bodySmall,
  },
  toggleLink: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    ...TEXT_STYLES.h3,
    fontSize: 18,
  },
  modalClose: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  countryList: {
    paddingHorizontal: 20,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  countryName: {
    ...TEXT_STYLES.body,
    flex: 1,
    marginLeft: 12,
  },
  countryCodeOption: {
    ...TEXT_STYLES.bodySmall,
    fontWeight: '600',
  },
});