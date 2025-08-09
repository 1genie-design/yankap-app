import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, StatusBar, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

// Thèmes YANKAP
const THEMES = {
  light: {
    background: '#F5F5F5',
    textPrimary: '#1DBAA3',
    textSecondary: '#666',
    textTertiary: '#333',
    statusBarStyle: 'dark-content' as const,
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
  },
  dark: {
    background: '#121212',
    textPrimary: '#1DBAA3',
    textSecondary: '#B0B0B0',
    textTertiary: '#E0E0E0',
    statusBarStyle: 'light-content' as const,
    cardBackground: '#1E1E1E',
    cardBorder: '#333333',
  },
};

// Styles de texte
const TEXT_STYLES = {
  h1: { fontSize: 24, fontWeight: 700 as const },
  h2: { fontSize: 20, fontWeight: 600 as const },
  body: { fontSize: 16, fontWeight: 500 as const },
  caption: { fontSize: 14, fontWeight: 400 as const },
  small: { fontSize: 12, fontWeight: 400 as const },
};

export default function ComponentTestScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;
  
  // États pour les carousels
  const [carousel1Index, setCarousel1Index] = useState(0);
  const [carousel2Index, setCarousel2Index] = useState(0);
  const [carousel3Index, setCarousel3Index] = useState(0);
  
  // Références pour les ScrollViews
  const carousel1Ref = useRef(null);
  const carousel2Ref = useRef(null);
  const carousel3Ref = useRef(null);

  // Données pour les différents carousels
  const cardData = [
    { id: 1, title: 'Carte 1', amount: '500,000', color: '#1DBAA3' },
    { id: 2, title: 'Carte 2', amount: '750,000', color: '#E74C3C' },
    { id: 3, title: 'Carte 3', amount: '1,200,000', color: '#9B59B6' },
    { id: 4, title: 'Carte 4', amount: '300,000', color: '#F39C12' },
  ];

  const serviceData = [
    { id: 1, title: 'Transfert', icon: '💸', color: '#3498DB' },
    { id: 2, title: 'Recharge', icon: '🔋', color: '#2ECC71' },
    { id: 3, title: 'Paiement', icon: '💳', color: '#E67E22' },
    { id: 4, title: 'Épargne', icon: '💰', color: '#9B59B6' },
    { id: 5, title: 'Crédit', icon: '🏦', color: '#34495E' },
  ];

  const newsData = [
    { id: 1, title: 'Nouvelle fonctionnalité YANKAP', content: 'Découvrez nos dernières innovations', image: '📱' },
    { id: 2, title: 'Promotion spéciale', content: 'Profitez de nos offres exceptionnelles', image: '🎉' },
    { id: 3, title: 'Mise à jour sécurité', content: 'Votre sécurité est notre priorité', image: '🔒' },
  ];

  // Calculs de dimensions
  const { width: screenWidth } = Dimensions.get('window');
  const cardWidth = screenWidth * 0.8;
  const serviceCardWidth = 140;
  const newsCardWidth = screenWidth * 0.85;

  // Icônes SVG
  const ChevronLeftIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  const ChevronRightIcon = ({ color = theme.textSecondary }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );

  // 🎪 CAROUSEL 1 : Style Carte Bancaire
  const renderBankCardCarousel = () => (
    <View style={styles.carouselSection}>
      <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary, marginBottom: 16 }]}>
        🏦 Carousel Carte Bancaire
      </Text>
      
      <ScrollView
        ref={carousel1Ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={cardWidth + 20}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (cardWidth + 20));
          setCarousel1Index(index);
        }}
      >
        {cardData.map((item, index) => (
          <View key={item.id} style={[styles.bankCard, { backgroundColor: item.color, width: cardWidth }]}>
            {/* Pattern décoratif */}
            <View style={styles.bankCardPattern}>
              <View style={[styles.patternCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
              <View style={[styles.patternLines, { borderColor: 'rgba(255,255,255,0.1)' }]} />
            </View>
            
            {/* Header */}
            <View style={styles.bankCardHeader}>
              <Text style={styles.bankCardTitle}>YANKAP</Text>
              <Text style={styles.bankCardType}>{item.title}</Text>
            </View>
            
            {/* Chip */}
            <View style={styles.chipContainer}>
              <View style={styles.chip}>
                <View style={styles.chipInner} />
              </View>
            </View>
            
            {/* Montant */}
            <View style={styles.amountSection}>
              <Text style={styles.currency}>XAF</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
            
            {/* Numéro de carte */}
            <Text style={styles.cardNumber}>•••• •••• •••• {1234 + index}</Text>
            
            {/* Footer */}
            <View style={styles.bankCardFooter}>
              <Text style={styles.validThru}>VALID THRU 12/28</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Indicateurs */}
      <View style={styles.indicators}>
        {cardData.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.indicator, 
              { 
                backgroundColor: carousel1Index === index ? theme.textPrimary : theme.textSecondary + '40' 
              }
            ]} 
          />
        ))}
      </View>
    </View>
  );

  // 🎯 CAROUSEL 2 : Style Services Circulaires
  const renderServiceCarousel = () => (
    <View style={styles.carouselSection}>
      <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary, marginBottom: 16 }]}>
        🎯 Carousel Services
      </Text>
      
      <ScrollView
        ref={carousel2Ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={serviceCardWidth + 16}
        decelerationRate="fast"
        contentContainerStyle={[styles.carouselContainer, { paddingHorizontal: 20 }]}
      >
        {serviceData.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.serviceCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
            activeOpacity={0.7}
          >
            <View style={[styles.serviceIcon, { backgroundColor: item.color }]}>
              <Text style={styles.serviceIconText}>{item.icon}</Text>
            </View>
            <Text style={[styles.serviceTitle, { color: theme.textTertiary }]}>{item.title}</Text>
            <View style={[styles.serviceBadge, { backgroundColor: item.color + '20' }]}>
              <Text style={[styles.serviceBadgeText, { color: item.color }]}>Nouveau</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // 📰 CAROUSEL 3 : Style News/Articles
  const renderNewsCarousel = () => (
    <View style={styles.carouselSection}>
      <Text style={[TEXT_STYLES.h2, { color: theme.textTertiary, marginBottom: 16 }]}>
        📰 Carousel News
      </Text>
      
      <ScrollView
        ref={carousel3Ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={newsCardWidth + 20}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (newsCardWidth + 20));
          setCarousel3Index(index);
        }}
      >
        {newsData.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.newsCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder, width: newsCardWidth }]}
            activeOpacity={0.8}
          >
            <View style={styles.newsImageContainer}>
              <Text style={styles.newsImage}>{item.image}</Text>
              <View style={[styles.newsOverlay, { backgroundColor: theme.textPrimary }]}>
                <Text style={styles.newsDate}>Aujourd'hui</Text>
              </View>
            </View>
            
            <View style={styles.newsContent}>
              <Text style={[styles.newsTitle, { color: theme.textTertiary }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.newsDescription, { color: theme.textSecondary }]} numberOfLines={3}>
                {item.content}
              </Text>
              
              <View style={styles.newsFooter}>
                <Text style={[styles.newsReadMore, { color: theme.textPrimary }]}>Lire plus</Text>
                <ChevronRightIcon color={theme.textPrimary} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Indicateurs avec navigation */}
      <View style={styles.newsNavigation}>
        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
          onPress={() => {
            const newIndex = Math.max(0, carousel3Index - 1);
            carousel3Ref.current?.scrollTo({ x: newIndex * (newsCardWidth + 20), animated: true });
            setCarousel3Index(newIndex);
          }}
        >
          <ChevronLeftIcon color={theme.textSecondary} />
        </TouchableOpacity>
        
        <View style={styles.indicators}>
          {newsData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                carousel3Ref.current?.scrollTo({ x: index * (newsCardWidth + 20), animated: true });
                setCarousel3Index(index);
              }}
            >
              <View 
                style={[
                  styles.indicator, 
                  { 
                    backgroundColor: carousel3Index === index ? theme.textPrimary : theme.textSecondary + '40' 
                  }
                ]} 
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
          onPress={() => {
            const newIndex = Math.min(newsData.length - 1, carousel3Index + 1);
            carousel3Ref.current?.scrollTo({ x: newIndex * (newsCardWidth + 20), animated: true });
            setCarousel3Index(newIndex);
          }}
        >
          <ChevronRightIcon color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[TEXT_STYLES.h1, { color: theme.textTertiary }]}>
              🎪 Test des Carousels
            </Text>
            <Text style={[TEXT_STYLES.body, { color: theme.textSecondary }]}>
              Différents styles de carousel pour YANKAP
            </Text>
          </View>

          {/* Carousel 1 : Cartes bancaires */}
          {renderBankCardCarousel()}

          {/* Carousel 2 : Services */}
          {renderServiceCarousel()}

          {/* Carousel 3 : News */}
          {renderNewsCarousel()}

          {/* Espace en bas */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  
  // Styles généraux des carousels
  carouselSection: {
    marginBottom: 32,
  },
  carouselContainer: {
    paddingHorizontal: 20,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // 🏦 Styles Carousel Carte Bancaire
  bankCard: {
    height: 200,
    borderRadius: 16,
    marginRight: 20,
    padding: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  bankCardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -50,
    right: -30,
  },
  patternLines: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 60,
    height: 1,
    borderTopWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  bankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankCardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bankCardType: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  chipContainer: {
    marginBottom: 20,
  },
  chip: {
    width: 35,
    height: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: {
    width: 25,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  amountSection: {
    marginBottom: 16,
  },
  currency: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  amount: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  bankCardFooter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  validThru: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  // 🎯 Styles Carousel Services
  serviceCard: {
    width: 140,
    height: 160,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIconText: {
    fontSize: 28,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  serviceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  
  // 📰 Styles Carousel News
  newsCard: {
    borderRadius: 16,
    marginRight: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  newsImageContainer: {
    height: 120,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  newsImage: {
    fontSize: 40,
  },
  newsOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newsDate: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  newsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newsReadMore: {
    fontSize: 14,
    fontWeight: '600',
  },
  newsNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});