// Point d'entrée principal de l'application YANKAP
// Affiche le splash screen puis navigue vers la présentation
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, Circle, Polygon, Text as SvgText } from 'react-native-svg';

// Configuration des polices pour l'app yankap
const FONTS = {
  primary: 'Inter',
  secondary: 'Poppins', 
  tertiary: 'Roboto',
};

// Styles de texte réutilisables pour toute l'app
export const TEXT_STYLES = {
  h1: { fontFamily: FONTS.primary, fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontFamily: FONTS.primary, fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontFamily: FONTS.primary, fontSize: 20, fontWeight: '600' as const },
  body: { fontFamily: FONTS.tertiary, fontSize: 16, fontWeight: 'normal' as const },
  bodySmall: { fontFamily: FONTS.tertiary, fontSize: 14, fontWeight: 'normal' as const },
  caption: { fontFamily: FONTS.tertiary, fontSize: 12, fontWeight: 'normal' as const },
  button: { fontFamily: FONTS.secondary, fontSize: 16, fontWeight: '600' as const },
  buttonSmall: { fontFamily: FONTS.secondary, fontSize: 14, fontWeight: '600' as const },
  label: { fontFamily: FONTS.primary, fontSize: 14, fontWeight: '500' as const },
  input: { fontFamily: FONTS.primary, fontSize: 16, fontWeight: 'normal' as const },
};

const WalletIcon = ({ textAnim }) => {
  const translateY1 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;
  const translateY3 = useRef(new Animated.Value(0)).current;
  const translateY4 = useRef(new Animated.Value(0)).current;
  const translateY5 = useRef(new Animated.Value(0)).current;
  const translateX1 = useRef(new Animated.Value(0)).current;
  const translateX2 = useRef(new Animated.Value(0)).current;
  const translateX3 = useRef(new Animated.Value(0)).current;
  const translateX4 = useRef(new Animated.Value(0)).current;
  const translateX5 = useRef(new Animated.Value(0)).current;
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;
  const opacity4 = useRef(new Animated.Value(0)).current;
  const opacity5 = useRef(new Animated.Value(0)).current;
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;
  const scale4 = useRef(new Animated.Value(1)).current;
  const scale5 = useRef(new Animated.Value(1)).current;

  // Interpolation pour l'icône wallet : blanc vers vert yankap
  const walletIconInterpolation = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#1DBAA3'], // Blanc vers vert yankap
  });

  useEffect(() => {
    const createCascadeAnimation = (translateY: Animated.Value, translateX: Animated.Value, opacity: Animated.Value, scale: Animated.Value, delay: number) => {
      const randomX1 = (Math.random() - 0.5) * 20;
      const randomX2 = (Math.random() - 0.5) * 30;
      const randomX3 = (Math.random() - 0.5) * 25;
      
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -10,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(translateX, {
              toValue: randomX1,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(scale, {
              toValue: 2.5,
              duration: 1000,
              useNativeDriver: false,
            }),
          ]),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -20,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(translateX, {
              toValue: randomX2,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.sequence([
              Animated.timing(scale, {
                toValue: 1.5,
                duration: 500,
                useNativeDriver: false,
              }),
              Animated.timing(scale, {
                toValue: 3,
                duration: 500,
                useNativeDriver: false,
              }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -35,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(translateX, {
              toValue: randomX3,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
          ]),
          Animated.delay(300),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 0,
              useNativeDriver: false,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 0,
              useNativeDriver: false,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 0,
              useNativeDriver: false,
            }),
          ]),
          Animated.delay(700),
        ])
      );
    };

    const animation1 = createCascadeAnimation(translateY1, translateX1, opacity1, scale1, 0);
    const animation2 = createCascadeAnimation(translateY2, translateX2, opacity2, scale2, 400);
    const animation3 = createCascadeAnimation(translateY3, translateX3, opacity3, scale3, 800);
    const animation4 = createCascadeAnimation(translateY4, translateX4, opacity4, scale4, 1200);
    const animation5 = createCascadeAnimation(translateY5, translateX5, opacity5, scale5, 1600);

    animation1.start();
    animation2.start();
    animation3.start();
    animation4.start();
    animation5.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
      animation4.stop();
      animation5.stop();
    };
  }, []);

  return (
    <View>
      {/* Icône blanche (état initial) */}
      <Animated.View style={{ opacity: textAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
        <Svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <Rect x="4" y="12" width="68" height="44" rx="4" fill="none" stroke="white" strokeWidth="6"/>
          <Rect x="60" y="31" width="12" height="6" fill="white"/>
          <Rect x="50" y="28" width="12" height="12" rx="6" fill="white"/>
        </Svg>
      </Animated.View>
      
      {/* Icône verte (état final) */}
      <Animated.View style={{ 
        opacity: textAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
        position: 'absolute',
        top: 0,
        left: 0
      }}>
        <Svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <Rect x="4" y="12" width="68" height="44" rx="4" fill="none" stroke="#1DBAA3" strokeWidth="6"/>
          <Rect x="60" y="31" width="12" height="6" fill="#1DBAA3"/>
          <Rect x="50" y="28" width="12" height="12" rx="6" fill="#1DBAA3"/>
        </Svg>
      </Animated.View>
      
      <Animated.View style={[
        styles.square, 
        { 
          opacity: opacity1, 
          left: 68, 
          transform: [{ translateY: translateY1 }, { translateX: translateX1 }, { scale: scale1 }],
          top: 12,
          backgroundColor: walletIconInterpolation
        }
      ]} />
      <Animated.View style={[
        styles.square, 
        { 
          opacity: opacity2, 
          left: 68, 
          transform: [{ translateY: translateY2 }, { translateX: translateX2 }, { scale: scale2 }],
          top: 12,
          backgroundColor: walletIconInterpolation
        }
      ]} />
      <Animated.View style={[
        styles.square, 
        { 
          opacity: opacity3, 
          left: 68, 
          transform: [{ translateY: translateY3 }, { translateX: translateX3 }, { scale: scale3 }],
          top: 12,
          backgroundColor: walletIconInterpolation
        }
      ]} />
      <Animated.View style={[
        styles.square, 
        { 
          opacity: opacity4, 
          left: 68, 
          transform: [{ translateY: translateY4 }, { translateX: translateX4 }, { scale: scale4 }],
          top: 12,
          backgroundColor: walletIconInterpolation
        }
      ]} />
      <Animated.View style={[
        styles.square, 
        { 
          opacity: opacity5, 
          left: 68, 
          transform: [{ translateY: translateY5 }, { translateX: translateX5 }, { scale: scale5 }],
          top: 12,
          backgroundColor: walletIconInterpolation
        }
      ]} />
    </View>
  );
};

export default function Index() {
  const backgroundAnim = useRef(new Animated.Value(0)).current; // 0 = turquoise, 1 = gris
  const textAnim = useRef(new Animated.Value(0)).current; // 0 = blanc, 1 = gris sombre
  const [isDarkMode, setIsDarkMode] = useState(false); // État pour la StatusBar

  useEffect(() => {
    // Timer de 5 secondes puis navigation vers l'écran de présentation
    const navigationTimer = setTimeout(() => {
      router.push('/presentation');
    }, 5000); // Navigation à 5 secondes

    // Timer de 2 secondes pour changer l'arrière-plan en gris et les textes
    const transitionTimer = setTimeout(() => {
      setIsDarkMode(true); // Changer la StatusBar en mode sombre
      Animated.parallel([
        // Animation de l'arrière-plan vers le gris
        Animated.timing(backgroundAnim, {
          toValue: 1, // Transition vers le gris
          duration: 500, // Transition fluide de 500ms
          useNativeDriver: false, // backgroundColor ne supporte pas useNativeDriver
        }),
        // Animation des textes vers gris sombre
        Animated.timing(textAnim, {
          toValue: 1, // Transition vers gris sombre
          duration: 500, // Transition fluide de 500ms
          useNativeDriver: false, // color ne supporte pas useNativeDriver
        }),
      ]).start();
    }, 2000); // Changement de thème à 2 secondes

    return () => {
      clearTimeout(navigationTimer);
      clearTimeout(transitionTimer);
    };
  }, [backgroundAnim, textAnim]);

  // Interpolation de couleur : turquoise vers gris yankap
  const backgroundInterpolation = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1DBAA3', '#F5F5F5'], // Turquoise vers gris de l'arrière-plan yankap
  });

  // Interpolation pour le titre yankap : blanc vers vert yankap
  const yankapTitleInterpolation = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#1DBAA3'], // Blanc vers vert yankap
  });

  // Interpolation pour le sous-titre : blanc vers gris sombre
  const subtitleInterpolation = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#666666'], // Blanc vers gris sombre (couleur texte yankap)
  });

  // Interpolation pour l'icône wallet : blanc vers gris sombre
  const walletIconInterpolation = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#666666'], // Blanc vers gris sombre
  });

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? "dark-content" : "light-content"} 
        backgroundColor="transparent" 
        translucent={true}
      />
      <Animated.View style={[styles.container, { backgroundColor: backgroundInterpolation }]}>
        {/* Motif de fond animé - visible seulement en mode gris */}
        <Animated.View style={[
          styles.backgroundPattern,
          {
            opacity: backgroundAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5], // Invisible au début, plus visible à la fin
            })
          }
        ]}>
          <Svg width="100%" height="100%" viewBox="0 0 300 500" preserveAspectRatio="xMidYMid slice">
            <Defs>
              {/* Dégradé principal */}
              <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#1DBAA3" stopOpacity="0.25" />
                <Stop offset="50%" stopColor="#66BB6A" stopOpacity="0.2" />
                <Stop offset="100%" stopColor="#FF7043" stopOpacity="0.15" />
              </LinearGradient>
              
              {/* Dégradé pour les formes */}
              <LinearGradient id="shapeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#1DBAA3" stopOpacity="0.4" />
                <Stop offset="100%" stopColor="#1DBAA3" stopOpacity="0.2" />
              </LinearGradient>
            </Defs>
            
            {/* Fond dégradé subtil */}
            <Rect width="100%" height="100%" fill="url(#backgroundGradient)" />
            
            {/* Billets de banque subtils - partie haute */}
            <Rect x="25" y="45" width="80" height="40" rx="6" fill="url(#shapeGradient)" opacity="0.4" transform="rotate(-8 65 65)" />
            <Rect x="185" y="75" width="70" height="35" rx="5" fill="url(#shapeGradient)" opacity="0.35" transform="rotate(12 220 92)" />
            <Rect x="55" y="125" width="75" height="38" rx="5" fill="url(#shapeGradient)" opacity="0.4" transform="rotate(-5 93 144)" />
            
            {/* Billets de banque subtils - partie milieu */}
            <Rect x="205" y="185" width="85" height="42" rx="6" fill="url(#shapeGradient)" opacity="0.38" transform="rotate(15 248 206)" />
            <Rect x="75" y="235" width="65" height="32" rx="4" fill="url(#shapeGradient)" opacity="0.35" transform="rotate(-10 108 251)" />
            <Rect x="165" y="265" width="78" height="39" rx="5" fill="url(#shapeGradient)" opacity="0.4" transform="rotate(7 204 285)" />
            
            {/* Billets de banque subtils - partie basse */}
            <Rect x="35" y="345" width="82" height="41" rx="6" fill="url(#shapeGradient)" opacity="0.38" transform="rotate(-12 76 366)" />
            <Rect x="195" y="375" width="72" height="36" rx="5" fill="url(#shapeGradient)" opacity="0.35" transform="rotate(9 231 393)" />
            <Rect x="115" y="415" width="68" height="34" rx="4" fill="url(#shapeGradient)" opacity="0.38" transform="rotate(-6 149 432)" />
            
            {/* Symboles monétaires sur les billets - 5 devises OHADA puis occidentales */}
            <SvgText x="65" y="70" fontSize="10" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(-8 65 70)">XAF</SvgText>
            <SvgText x="220" y="97" fontSize="9" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(12 220 97)">GMF</SvgText>
            <SvgText x="93" y="149" fontSize="10" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(-5 93 149)">XOF</SvgText>
            <SvgText x="248" y="211" fontSize="10" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(15 248 211)">KMF</SvgText>
            <SvgText x="108" y="256" fontSize="8" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(-10 108 256)">CFA</SvgText>
            <SvgText x="204" y="285" fontSize="9" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(7 204 285)">€</SvgText>
            <SvgText x="76" y="371" fontSize="10" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(-12 76 371)">$</SvgText>
            <SvgText x="231" y="398" fontSize="9" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(9 231 398)">£</SvgText>
            <SvgText x="149" y="437" fontSize="8" fill="#1DBAA3" opacity="0.5" fontFamily="Arial" fontWeight="bold" transform="rotate(-6 149 437)">¥</SvgText>
            
            {/* Lignes courbes subtiles - plus nombreuses */}
            <Path 
              d="M0,120 Q200,80 400,120 T400,200" 
              stroke="#1DBAA3" 
              strokeOpacity="0.2" 
              strokeWidth="3" 
              fill="none" 
            />
            <Path 
              d="M0,280 Q200,240 400,280 T400,360" 
              stroke="#66BB6A" 
              strokeOpacity="0.15" 
              strokeWidth="3" 
              fill="none" 
            />
            <Path 
              d="M0,440 Q200,400 400,440 T400,520" 
              stroke="#FF7043" 
              strokeOpacity="0.1" 
              strokeWidth="3" 
              fill="none" 
            />
            <Path 
              d="M0,560 Q200,520 400,560 T400,600" 
              stroke="#1DBAA3" 
              strokeOpacity="0.12" 
              strokeWidth="3" 
              fill="none" 
            />
          </Svg>
        </Animated.View>

        <View style={styles.content}>
          <WalletIcon textAnim={textAnim} />
          <Animated.Text style={[styles.title, { color: yankapTitleInterpolation }]}>
            yankap
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { color: subtitleInterpolation }]}>
            your <Text style={{ fontWeight: 'bold' }}>MONEY</Text> under <Text style={{ fontWeight: 'bold' }}>CONTROL</Text>
          </Animated.Text>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1DBAA3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TEXT_STYLES.h1,
    color: 'white',
    marginTop: 30,
    letterSpacing: 2,
  },
  subtitle: {
    ...TEXT_STYLES.bodySmall,
    color: 'white',
    marginTop: 8,
    letterSpacing: 1,
    opacity: 0.9,
  },
  square: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 1,
  },
});