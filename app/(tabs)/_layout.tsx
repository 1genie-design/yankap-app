import React, { useState, useRef, useEffect } from 'react';
import { Tabs, useSegments, usePathname, router } from 'expo-router';
import { useColorScheme, TouchableOpacity, Text, View, Modal, Animated, Dimensions, ScrollView } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Configuration des thèmes pour les tabs
const THEMES = {
  light: {
    tabBarBackground: '#FFFFFF',
    activeColor: '#1DBAA3',
    inactiveColor: '#9CA3AF',
    borderColor: '#E5E7EB',
    textColor: '#333333',  // Couleur du texte normal
  },
  dark: {
    tabBarBackground: '#1F1F1F',
    activeColor: '#1DBAA3',
    inactiveColor: '#6B7280',
    borderColor: '#374151',
    textColor: '#E5E5E5',  // Couleur du texte normal en mode sombre
  },
};

// Icône de menu (hamburger)
const MenuIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 12h18M3 6h18M3 18h18" 
      stroke={color} 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icône de notification
const NotificationIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" 
      fill={color}
    />
    <Path 
      d="M13.73 21a2 2 0 0 1-3.46 0" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icônes pour la navbar avec animation (même style que FloatingNavbar)
const HomeIcon = ({ color, focused }: { color: string; focused?: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <Path 
          d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
          fill={color}
        />
        <Path 
          d="M9 22V12h6v10" 
          fill="white"
        />
      </Svg>
    </Animated.View>
  );
};

const TransactionsIcon = ({ color, focused }: { color: string; focused?: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <Path 
          d="M17 1l4 4-4 4" 
          stroke={color} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Path 
          d="M3 11V9a4 4 0 0 1 4-4h14" 
          stroke={color} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Path 
          d="M7 23l-4-4 4-4" 
          stroke={color} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Path 
          d="M21 13v2a4 4 0 0 1-4 4H3" 
          stroke={color} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
};

const ServicesIcon = ({ color, focused }: { color: string; focused?: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <Path 
          d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" 
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
};

const ProfileIcon = ({ color, focused }: { color: string; focused?: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Svg width="21" height="21" viewBox="0 0 24 24" fill="none">
        <Path 
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2h16z" 
          fill={color}
        />
        <Circle 
          cx="12" 
          cy="7" 
          r="4" 
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
};

// Icône Plus (logo YANKAP)
const PlusIcon = ({ color = '#FFFFFF' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 5v14M5 12h14" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icônes pour les actions rapides
const TransferIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M21 14H3m0 0l3-3m-3 3l3 3m15-6l-3-3m3 3l-3 3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ShoppingIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H3m4 7v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const WithdrawIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M5 12h14" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const RechargeIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle 
      cx="12" 
      cy="12" 
      r="9" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M12 7v10m5-5H7" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M16 3.5c.5.5 1 1.2 1.5 2M8 3.5c-.5.5-1 1.2-1.5 2M16 20.5c.5-.5 1-1.2 1.5-2M8 20.5c-.5-.5-1-1.2-1.5-2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const PaymentIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M2 10h20" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const VirtualCardIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect 
      x="2" 
      y="4" 
      width="20" 
      height="14" 
      rx="3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M2 10h20" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Circle 
      cx="7" 
      cy="14" 
      r="1" 
      fill={color}
    />
    <Circle 
      cx="11" 
      cy="14" 
      r="1" 
      fill={color}
    />
    <Path 
      d="M15 14h2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M19 6l-2 2 2 2" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const QRCodeIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect 
      x="3" 
      y="3" 
      width="7" 
      height="7" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Rect 
      x="5" 
      y="5" 
      width="3" 
      height="3" 
      fill={color}
    />
    <Rect 
      x="14" 
      y="3" 
      width="7" 
      height="7" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Rect 
      x="16" 
      y="5" 
      width="3" 
      height="3" 
      fill={color}
    />
    <Rect 
      x="3" 
      y="14" 
      width="7" 
      height="7" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Rect 
      x="5" 
      y="16" 
      width="3" 
      height="3" 
      fill={color}
    />
    <Rect x="14" y="14" width="2" height="2" fill={color} />
    <Rect x="18" y="14" width="2" height="2" fill={color} />
    <Rect x="16" y="16" width="2" height="2" fill={color} />
    <Rect x="14" y="18" width="2" height="2" fill={color} />
    <Rect x="18" y="18" width="2" height="2" fill={color} />
  </Svg>
);

const RequestIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ScanIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 7V5a2 2 0 0 1 2-2h2m0 16H5a2 2 0 0 1-2-2v-2m16 2v2a2 2 0 0 1-2 2h-2m0-16h2a2 2 0 0 1 2 2v2M12 3v18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icônes pour les actions de transaction
const SendIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ReceiveIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ScanQRIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 7V5a2 2 0 0 1 2-2h2m0 16H5a2 2 0 0 1-2-2v-2m16 2v2a2 2 0 0 1-2 2h-2m0-16h2a2 2 0 0 1 2 2v2" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Rect 
      x="8" 
      y="8" 
      width="8" 
      height="8" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M10 10h4v4h-4z" 
      fill={color}
    />
  </Svg>
);

const GenerateQRIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect 
      x="3" 
      y="3" 
      width="6" 
      height="6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Rect 
      x="5" 
      y="5" 
      width="2" 
      height="2" 
      fill={color}
    />
    <Rect 
      x="15" 
      y="3" 
      width="6" 
      height="6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Rect 
      x="17" 
      y="5" 
      width="2" 
      height="2" 
      fill={color}
    />
    <Rect 
      x="3" 
      y="15" 
      width="6" 
      height="6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Rect 
      x="5" 
      y="17" 
      width="2" 
      height="2" 
      fill={color}
    />
    <Path 
      d="M18 12v3m1.5-1.5h-3M15 15h2v2h-2v-2zM15 19h2v2h-2v-2zM19 15h2v2h-2v-2zM19 19h2v2h-2v-2z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icônes pour les options de retrait
const MobileOperatorIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect 
      x="5" 
      y="2" 
      width="14" 
      height="20" 
      rx="2" 
      ry="2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M12 18h.01" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const BankAccountIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 21h18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M5 21V7l8-4v18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M19 21V11l-6-4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M9 9v.01M9 12v.01M9 15v.01M13 15v.01" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

// Icônes pour les boutons spécialisés
const MeetingIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Rect 
      x="8" 
      y="2" 
      width="8" 
      height="4" 
      rx="1" 
      ry="1" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M12 11v6M9 14h6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ExpenseIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M12 6v2M12 16v2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const CreditIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect 
      x="5" 
      y="2" 
      width="14" 
      height="20" 
      rx="2" 
      ry="2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M12 6v4l2 1" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Circle 
      cx="12" 
      cy="10" 
      r="3" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M8 16h8M8 18h4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const InviteIcon = ({ color = '#666' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path 
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Circle 
      cx="9" 
      cy="7" 
      r="4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M19 14l2 2-2 2M17 16h4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? THEMES.dark : THEMES.light;
  const pathname = usePathname();
  
  // Déterminer l'onglet actif à partir du pathname
  const getActiveTab = (): 'accueil' | 'transactions' | 'services' | 'profil' => {
    if (pathname.includes('/transactions')) return 'transactions';
    if (pathname.includes('/services')) return 'services';
    if (pathname.includes('/profil')) return 'profil';
    return 'accueil';
  };
  
  const activeTab = getActiveTab();
  
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(true);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [isRechargeModalVisible, setIsRechargeModalVisible] = useState(false);
  const [isVirtualCardModalVisible, setIsVirtualCardModalVisible] = useState(false);
  const [isCardDetailModalVisible, setIsCardDetailModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isScanQRModalVisible, setIsScanQRModalVisible] = useState(false);
  const [isGenerateQRModalVisible, setIsGenerateQRModalVisible] = useState(false);
  const [isWithdrawMobileModalVisible, setIsWithdrawMobileModalVisible] = useState(false);
  const [isWithdrawBankModalVisible, setIsWithdrawBankModalVisible] = useState(false);
  const [isRechargeMobileModalVisible, setIsRechargeMobileModalVisible] = useState(false);
  const [isRechargeBankModalVisible, setIsRechargeBankModalVisible] = useState(false);
  const [isMenuPagerVisible, setIsMenuPagerVisible] = useState(false);
  const [isNotificationPagerVisible, setIsNotificationPagerVisible] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all'); // 'all', 'transactions', 'tontines'
  const [selectedCard, setSelectedCard] = useState(null);

  const openBottomSheet = () => {
    setIsBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  const openTransactionModal = () => {
    setIsTransactionModalVisible(true);
    closeBottomSheet();
  };

  const closeTransactionModal = () => {
    setIsTransactionModalVisible(false);
  };

  const openWithdrawModal = () => {
    setIsWithdrawModalVisible(true);
    closeBottomSheet();
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalVisible(false);
  };

  const openRechargeModal = () => {
    setIsRechargeModalVisible(true);
    closeBottomSheet();
  };

  const closeRechargeModal = () => {
    setIsRechargeModalVisible(false);
  };

  const openVirtualCardModal = () => {
    setIsVirtualCardModalVisible(true);
    closeBottomSheet();
  };

  const closeVirtualCardModal = () => {
    setIsVirtualCardModalVisible(false);
  };

  const openCardDetailModal = (card) => {
    setSelectedCard(card);
    setIsCardDetailModalVisible(true);
    closeVirtualCardModal();
  };

  const closeCardDetailModal = () => {
    setIsCardDetailModalVisible(false);
    setSelectedCard(null);
  };

  const openTransferModal = () => {
    setIsTransferModalVisible(true);
    closeTransactionModal();
  };

  const closeTransferModal = () => {
    setIsTransferModalVisible(false);
  };

  const openScanQRModal = () => {
    setIsScanQRModalVisible(true);
    closeTransactionModal();
  };

  const closeScanQRModal = () => {
    setIsScanQRModalVisible(false);
  };

  const openGenerateQRModal = () => {
    setIsGenerateQRModalVisible(true);
    closeTransactionModal();
  };

  const closeGenerateQRModal = () => {
    setIsGenerateQRModalVisible(false);
  };

  const openWithdrawMobileModal = () => {
    setIsWithdrawMobileModalVisible(true);
    closeWithdrawModal();
  };

  const closeWithdrawMobileModal = () => {
    setIsWithdrawMobileModalVisible(false);
  };

  const openWithdrawBankModal = () => {
    setIsWithdrawBankModalVisible(true);
    closeWithdrawModal();
  };

  const closeWithdrawBankModal = () => {
    setIsWithdrawBankModalVisible(false);
  };

  const openRechargeMobileModal = () => {
    setIsRechargeMobileModalVisible(true);
    closeRechargeModal();
  };

  const closeRechargeMobileModal = () => {
    setIsRechargeMobileModalVisible(false);
  };

  const openRechargeBankModal = () => {
    setIsRechargeBankModalVisible(true);
    closeRechargeModal();
  };

  const closeRechargeBankModal = () => {
    setIsRechargeBankModalVisible(false);
  };

  const openMenuPager = () => {
    setIsMenuPagerVisible(true);
  };

  const closeMenuPager = () => {
    setIsMenuPagerVisible(false);
  };

  const openNotificationPager = () => {
    router.push('/notifications');
  };

  const closeNotificationPager = () => {
    setIsNotificationPagerVisible(false);
  };

  // Fonction pour obtenir les données du bouton spécialisé selon l'onglet
  const getSpecializedButton = () => {
    switch (activeTab) {
      case 'accueil':
        return {
          label: 'Créer une nouvelle tontine',
          icon: MeetingIcon,
          color: '#1DBAA3',
          action: () => {
            closeBottomSheet();
            router.push('/creer-tontine');
          }
        };
      case 'transactions':
        return {
          label: 'Gérer ses dépenses',
          icon: ExpenseIcon,
          color: '#1DBAA3',
          action: () => {
            console.log('Gérer ses dépenses');
            closeBottomSheet();
          }
        };
      case 'services':
        return {
          label: 'Acheter du crédit',
          icon: CreditIcon,
          color: '#1DBAA3',
          action: () => {
            console.log('Acheter du crédit téléphone');
            closeBottomSheet();
          }
        };
      case 'profil':
        return {
          label: 'Inviter des amis',
          icon: InviteIcon,
          color: '#1DBAA3',
          action: () => {
            console.log('Inviter des amis');
            closeBottomSheet();
          }
        };
      default:
        return null;
    }
  };

  const specializedButton = getSpecializedButton();

  // Données complètes des notifications
  const allNotifications = [
    {
      id: 1,
      type: 'transaction',
      category: 'received',
      title: '💰 Transfert reçu',
      message: 'Vous avez reçu 25,000 FCFA de Marie Dupont',
      amount: '+25,000 FCFA',
      time: 'Il y a 5 min',
      color: '#1DBAA3',
      unread: true,
      action: 'view'
    },
    {
      id: 2,
      type: 'tontine',
      category: 'invitation',
      title: '🤝 Nouvelle tontine',
      message: '"Épargne Famille" - Vous êtes invité à rejoindre cette tontine',
      time: 'Il y a 1h',
      color: '#6B73FF',
      unread: true,
      action: 'accept_decline'
    },
    {
      id: 3,
      type: 'tontine',
      category: 'reminder',
      title: '⏰ Échéance proche',
      message: 'Votre contribution à "Tontine Bureau" est due dans 2 jours',
      amount: '10,000 FCFA',
      time: 'Il y a 3h',
      color: '#FFB800',
      unread: true,
      action: 'pay'
    },
    {
      id: 4,
      type: 'security',
      category: 'login',
      title: '🔒 Nouvelle connexion',
      message: 'Connexion détectée depuis un nouvel appareil iPhone 15',
      time: 'Il y a 6h',
      color: '#FF6B6B',
      unread: false,
      action: 'verify'
    },
    {
      id: 5,
      type: 'transaction',
      category: 'card_payment',
      title: '💳 Paiement par carte',
      message: 'Achat de 15,500 FCFA chez Supermarché Auchan',
      amount: '-15,500 FCFA',
      time: 'Il y a 1j',
      color: '#9C27B0',
      unread: false,
      action: 'view'
    },
    {
      id: 6,
      type: 'promotion',
      category: 'offer',
      title: '🎉 Offre spéciale',
      message: '0% de frais sur vos transferts ce week-end !',
      time: 'Il y a 2j',
      color: '#4CAF50',
      unread: false,
      action: 'use'
    },
    {
      id: 7,
      type: 'tontine',
      category: 'turn',
      title: '🎯 Votre tour arrive',
      message: 'Vous recevrez la cagnotte "Tontine Amis" dans 3 jours',
      amount: '150,000 FCFA',
      time: 'Il y a 2j',
      color: '#6B73FF',
      unread: false,
      action: 'view'
    },
    {
      id: 8,
      type: 'transaction',
      category: 'mobile_money',
      title: '📱 Recharge MTN',
      message: 'Votre compte a été rechargé avec succès',
      amount: '+50,000 FCFA',
      time: 'Il y a 3j',
      color: '#1DBAA3',
      unread: false,
      action: 'view'
    },
    {
      id: 9,
      type: 'security',
      category: 'password',
      title: '🔐 Mot de passe modifié',
      message: 'Votre mot de passe a été changé avec succès',
      time: 'Il y a 4j',
      color: '#FF6B6B',
      unread: false,
      action: 'view'
    },
    {
      id: 10,
      type: 'tontine',
      category: 'contribution',
      title: '✅ Contribution validée',
      message: 'Votre versement pour "Tontine Travail" a été confirmé',
      amount: '-20,000 FCFA',
      time: 'Il y a 5j',
      color: '#6B73FF',
      unread: false,
      action: 'view'
    },
    {
      id: 11,
      type: 'system',
      category: 'update',
      title: '📱 Mise à jour disponible',
      message: 'yankap v2.2 avec scan de factures et nouveau design',
      time: 'Il y a 1 sem',
      color: '#607D8B',
      unread: false,
      action: 'update'
    },
    {
      id: 12,
      type: 'transaction',
      category: 'fees',
      title: '💰 Frais remboursés',
      message: 'Remboursement de 500 FCFA suite à une erreur système',
      amount: '+500 FCFA',
      time: 'Il y a 1 sem',
      color: '#1DBAA3',
      unread: false,
      action: 'view'
    },
    {
      id: 13,
      type: 'promotion',
      category: 'cashback',
      title: '🎁 Cashback gagné',
      message: 'Félicitations ! Vous avez gagné 2% de cashback',
      amount: '+1,200 FCFA',
      time: 'Il y a 1 sem',
      color: '#4CAF50',
      unread: false,
      action: 'view'
    },
    {
      id: 14,
      type: 'tontine',
      category: 'new_member',
      title: '👥 Nouveau membre',
      message: 'Paul Mbema a rejoint votre tontine "Épargne Famille"',
      time: 'Il y a 2 sem',
      color: '#6B73FF',
      unread: false,
      action: 'view'
    },
    {
      id: 15,
      type: 'security',
      category: 'suspicious',
      title: '⚠️ Activité suspecte',
      message: 'Tentative de connexion bloquée depuis Lagos, Nigeria',
      time: 'Il y a 2 sem',
      color: '#FF6B6B',
      unread: false,
      action: 'verify'
    }
  ];

  // Filtrer les notifications selon le filtre actif
  const getFilteredNotifications = () => {
    switch (notificationFilter) {
      case 'transactions':
        return allNotifications.filter(n => n.type === 'transaction');
      case 'tontines':
        return allNotifications.filter(n => n.type === 'tontine');
      default:
        return allNotifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  // Fonction pour gérer les actions des notifications
  const handleNotificationAction = (notification, actionType) => {
    switch (actionType) {
      case 'accept':
        console.log('Accepter invitation tontine:', notification.id);
        break;
      case 'decline':
        console.log('Refuser invitation tontine:', notification.id);
        break;
      case 'pay':
        console.log('Payer contribution:', notification.id);
        break;
      case 'verify':
        console.log('Vérifier sécurité:', notification.id);
        break;
      case 'use':
        console.log('Utiliser offre:', notification.id);
        break;
      case 'update':
        console.log('Mettre à jour app:', notification.id);
        break;
      case 'view':
      default:
        console.log('Voir détails:', notification.id);
        break;
    }
  };

  const markAllAsRead = () => {
    console.log('Marquer toutes les notifications comme lues');
  };

  // Données des cartes virtuelles
  const virtualCards = [
    {
      id: 1,
      name: "Carte Principale",
      number: "**** **** **** 1234",
      fullNumber: "4532 1234 5678 1234",
      expiry: "12/26",
      cvv: "123",
      balance: "125,000 FCFA",
      type: "Visa",
      color: "#1DBAA3",
      holder: "JEAN PAUL YANKAP",
      address: "123 Rue de la Liberté",
      city: "Douala",
      postalCode: "BP 1234",
      country: "Cameroun",
      phone: "+237 6XX XXX XXX",
      email: "jean.yankap@example.com",
      status: "Actif",
      createdDate: "15/01/2024"
    },
    {
      id: 2,
      name: "Carte Shopping",
      number: "**** **** **** 5678",
      fullNumber: "5432 9876 5432 5678",
      expiry: "08/27",
      cvv: "456",
      balance: "50,000 FCFA",
      type: "Mastercard",
      color: "#6B73FF",
      holder: "JEAN PAUL YANKAP",
      address: "456 Avenue Kennedy",
      city: "Yaoundé",
      postalCode: "BP 5678",
      country: "Cameroun",
      phone: "+237 6XX XXX XXX",
      email: "jean.yankap@example.com",
      status: "Actif",
      createdDate: "22/03/2024"
    },
    {
      id: 3,
      name: "Carte Épargne",
      number: "**** **** **** 9012",
      fullNumber: "4111 1111 1111 9012",
      expiry: "03/28",
      cvv: "789",
      balance: "200,000 FCFA",
      type: "Visa",
      color: "#FFB800",
      holder: "JEAN PAUL YANKAP",
      address: "789 Boulevard du 20 Mai",
      city: "Bafoussam",
      postalCode: "BP 9012",
      country: "Cameroun",
      phone: "+237 6XX XXX XXX",
      email: "jean.yankap@example.com",
      status: "Actif",
      createdDate: "10/06/2024"
    }
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.tabBarBackground,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
            height: 110,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          },
          headerTitle: 'yankap',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            letterSpacing: -0.5,
            color: theme.activeColor,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity 
              style={{ padding: 8, borderRadius: 8, marginLeft: 15 }}
              onPress={openMenuPager}
              activeOpacity={0.7}
            >
              <MenuIcon color={theme.textColor} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={{ padding: 8, borderRadius: 8, marginRight: 15 }}
              onPress={openNotificationPager}
              activeOpacity={0.7}
            >
              <NotificationIcon color={theme.textColor} />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: '#d9d9d9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
            paddingBottom: 8,
            paddingTop: 8,
            paddingHorizontal: 0,
            marginHorizontal: 20,
          },
          tabBarActiveTintColor: theme.activeColor,
          tabBarInactiveTintColor: theme.inactiveColor,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: -2,
            marginBottom: 2,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
        }}
      >
        <Tabs.Screen
          name="accueil"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, focused }) => (
              <HomeIcon color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            tabBarIcon: ({ color, focused }) => (
              <TransactionsIcon color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: 'Services',
            tabBarIcon: ({ color, focused }) => (
              <ServicesIcon color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, focused }) => (
              <ProfileIcon color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>

      {/* Bouton flottant Plus */}
      <View style={{
        position: 'absolute',
        bottom: 95,
        right: 30,
        width: 48,
        height: 48,
        backgroundColor: theme.activeColor,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 12,
        zIndex: 1000,
      }}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
          }}
          onPress={openBottomSheet}
          activeOpacity={0.8}
        >
          <PlusIcon />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <Modal
        visible={isBottomSheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeBottomSheet}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={closeBottomSheet}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 24,
            minHeight: 180,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10,
          }}>
            {/* Indicateur de glissement */}
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: theme.inactiveColor,
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 20,
            }} />
            
            {/* Bouton spécialisé selon l'onglet */}
            {specializedButton && (
              <View style={{ marginBottom: 24 }}>
                <TouchableOpacity 
                  style={{
                    width: '100%',
                    height: 56,
                    backgroundColor: specializedButton.color,
                    borderRadius: 16,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  onPress={specializedButton.action}
                  activeOpacity={0.8}
                >
                  <specializedButton.icon color="#FFFFFF" />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginLeft: 12,
                  }}>
                    {specializedButton.label}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Titre du bottom sheet */}
            <TouchableOpacity 
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
                paddingVertical: 8,
              }}
              onPress={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: theme.textColor,
                marginRight: 8,
              }}>
                Actions rapides
              </Text>
              <Animated.View style={{
                transform: [{
                  rotate: isQuickActionsExpanded ? '180deg' : '0deg'
                }]
              }}>
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path 
                    d="M6 9l6 6 6-6" 
                    stroke={theme.textColor} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </Svg>
              </Animated.View>
            </TouchableOpacity>
            
            {/* Ligne d'actions rapides - 4 boutons avec labels */}
            {isQuickActionsExpanded && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
              {/* Retrait */}
              <View style={{ alignItems: 'center', width: '20%' }}>
                <TouchableOpacity 
                  style={{
                    width: '100%',
                    aspectRatio: 1,
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E9ECEF',
                    borderWidth: 1,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    console.log('Retrait d\'argent');
                    openWithdrawModal();
                  }}
                  activeOpacity={0.7}
                >
                  <WithdrawIcon color="#1DBAA3" />
                </TouchableOpacity>
                <Text style={{
                  fontSize: 12,
                  color: theme.textColor,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                  Retrait
                </Text>
              </View>

              {/* Recharge */}
              <View style={{ alignItems: 'center', width: '20%' }}>
                <TouchableOpacity 
                  style={{
                    width: '100%',
                    aspectRatio: 1,
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E9ECEF',
                    borderWidth: 1,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    console.log('Recharge');
                    openRechargeModal();
                  }}
                  activeOpacity={0.7}
                >
                  <RechargeIcon color="#1DBAA3" />
                </TouchableOpacity>
                <Text style={{
                  fontSize: 12,
                  color: theme.textColor,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                  Recharge
                </Text>
              </View>

              {/* Carte virtuelle */}
              <View style={{ alignItems: 'center', width: '20%' }}>
                <TouchableOpacity 
                  style={{
                    width: '100%',
                    aspectRatio: 1,
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E9ECEF',
                    borderWidth: 1,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    console.log('Carte virtuelle');
                    openVirtualCardModal();
                  }}
                  activeOpacity={0.7}
                >
                  <VirtualCardIcon color="#1DBAA3" />
                </TouchableOpacity>
                <Text style={{
                  fontSize: 12,
                  color: theme.textColor,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                  Carte virtuelle
                </Text>
              </View>

              {/* Transaction (anciennement Code QR) */}
              <View style={{ alignItems: 'center', width: '20%' }}>
                <TouchableOpacity 
                  style={{
                    width: '100%',
                    aspectRatio: 1,
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E9ECEF',
                    borderWidth: 1,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    console.log('Transaction');
                    openTransactionModal();
                  }}
                  activeOpacity={0.7}
                >
                  <QRCodeIcon color="#1DBAA3" />
                </TouchableOpacity>
                <Text style={{
                  fontSize: 12,
                  color: theme.textColor,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                  Transaction
                </Text>
              </View>
            </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modale Transaction */}
      <Modal
        visible={isTransactionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeTransactionModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeTransactionModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 320,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeTransactionModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Transactions
            </Text>
            
            {/* Actions de transaction en ligne */}
            <View style={{
              flexDirection: 'column',
              gap: 16,
            }}>
              {/* Transférer */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Transférer');
                  openTransferModal();
                }}
                activeOpacity={0.8}
              >
                <SendIcon color="#FFFFFF" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 12,
                }}>
                  Transférer
                </Text>
              </TouchableOpacity>

              {/* Scanner un code */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Scanner un code');
                  openScanQRModal();
                }}
                activeOpacity={0.8}
              >
                <ScanQRIcon color="#FFFFFF" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 12,
                }}>
                  Scanner un code
                </Text>
              </TouchableOpacity>

              {/* Générer un code */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Générer un code');
                  openGenerateQRModal();
                }}
                activeOpacity={0.8}
              >
                <GenerateQRIcon color="#FFFFFF" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 12,
                }}>
                  Générer un code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Retrait */}
      <Modal
        visible={isWithdrawModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeWithdrawModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeWithdrawModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 320,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeWithdrawModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Retrait d'argent
            </Text>
            
            {/* Options de retrait en ligne */}
            <View style={{
              flexDirection: 'column',
              gap: 16,
            }}>
              {/* Opérateur mobile */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Retrait via Opérateur mobile');
                  openWithdrawMobileModal();
                }}
                activeOpacity={0.8}
              >
                <MobileOperatorIcon color="#FFFFFF" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 12,
                }}>
                  Opérateur mobile
                </Text>
              </TouchableOpacity>

              {/* Compte bancaire */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Retrait via Compte bancaire');
                  openWithdrawBankModal();
                }}
                activeOpacity={0.8}
              >
                <BankAccountIcon color="#FFFFFF" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 12,
                }}>
                  Compte bancaire
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Recharge */}
      <Modal
        visible={isRechargeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRechargeModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeRechargeModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 320,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeRechargeModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Recharge de compte
            </Text>
            
            {/* Options de recharge en ligne */}
            <View style={{
              flexDirection: 'column',
              gap: 16,
            }}>
              {/* Opérateur mobile */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Recharge via Opérateur mobile');
                  openRechargeMobileModal();
                }}
                activeOpacity={0.8}
              >
                <MobileOperatorIcon color="#FFFFFF" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 12,
                }}>
                  Opérateur mobile
                </Text>
              </TouchableOpacity>

              {/* Compte bancaire */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Recharge via Compte bancaire');
                  openRechargeBankModal();
                }}
                activeOpacity={0.8}
              >
                <BankAccountIcon color="#FFFFFF" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 12,
                }}>
                  Compte bancaire
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Cartes Virtuelles */}
      <Modal
        visible={isVirtualCardModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeVirtualCardModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeVirtualCardModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 350,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeVirtualCardModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Mes Cartes Virtuelles
            </Text>
            
            {/* Liste des cartes */}
            <View style={{
              flexDirection: 'column',
              gap: 16,
            }}>
              {virtualCards.map((card) => (
                <TouchableOpacity 
                  key={card.id}
                  style={{
                    width: '100%',
                    height: 120,
                    backgroundColor: card.color,
                    borderRadius: 16,
                    padding: 20,
                    justifyContent: 'space-between',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  onPress={() => openCardDetailModal(card)}
                  activeOpacity={0.8}
                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                    }}>
                      {card.name}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#FFFFFF',
                      opacity: 0.8,
                    }}>
                      {card.type}
                    </Text>
                  </View>
                  
                  <View>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      letterSpacing: 2,
                      marginBottom: 8,
                    }}>
                      {card.number}
                    </Text>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#FFFFFF',
                      }}>
                        {card.balance}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#FFFFFF',
                        opacity: 0.8,
                      }}>
                        Exp: {card.expiry}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {/* Bouton Ajouter une carte */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: 'transparent',
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: theme.activeColor,
                  borderStyle: 'dashed',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  console.log('Ajouter une nouvelle carte');
                  closeVirtualCardModal();
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: theme.activeColor,
                  marginRight: 8,
                }}>
                  +
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.activeColor,
                }}>
                  Ajouter une carte
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Détails de la Carte */}
      <Modal
        visible={isCardDetailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCardDetailModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeCardDetailModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 350,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeCardDetailModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {selectedCard && (
              <>
                {/* Carte visuelle */}
                <View style={{
                  width: '100%',
                  height: 100,
                  backgroundColor: selectedCard.color,
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: 10,
                  justifyContent: 'space-between',
                  marginBottom: 24,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                    }}>
                      {selectedCard.name}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#FFFFFF',
                      opacity: 0.8,
                    }}>
                      {selectedCard.type}
                    </Text>
                  </View>
                  
                  <View style={{
                    width: '100%',
                  }}>
                    <View style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                      }}>
                        Solde
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                      }}>
                        {selectedCard.balance}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Informations détaillées */}
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: theme.textColor,
                    marginBottom: 16,
                  }}>
                    Informations de la carte
                  </Text>
                  
                  <View style={{ gap: 12 }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Numéro complet:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.fullNumber}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        CVV:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.cvv}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Date d'expiration:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.expiry}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Titulaire:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.holder}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Statut:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#1DBAA3',
                      }}>
                        {selectedCard.status}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Adresse:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                        textAlign: 'right',
                        flex: 1,
                        marginLeft: 10,
                      }}>
                        {selectedCard.address}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Ville:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.city}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Boîte Postale:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.postalCode}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Pays:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.country}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Téléphone:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.phone}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Email:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                        textAlign: 'right',
                        flex: 1,
                        marginLeft: 10,
                      }}>
                        {selectedCard.email}
                      </Text>
                    </View>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: theme.textColor,
                        opacity: 0.7,
                      }}>
                        Date de création:
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.textColor,
                      }}>
                        {selectedCard.createdDate}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                }}>
                  <TouchableOpacity 
                    style={{
                      flex: 1,
                      height: 48,
                      backgroundColor: theme.activeColor,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      console.log('Bloquer la carte');
                      closeCardDetailModal();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}>
                      Bloquer
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={{
                      flex: 1,
                      height: 48,
                      backgroundColor: '#FF6B6B',
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      console.log('Supprimer la carte');
                      closeCardDetailModal();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}>
                      Supprimer
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modale Transférer */}
      <Modal
        visible={isTransferModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeTransferModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeTransferModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 350,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeTransferModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Transférer de l'argent
            </Text>
            
            {/* Formulaire de transfert */}
            <View style={{ gap: 20 }}>
              {/* Montant */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Montant (FCFA)
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Entrez le montant
                  </Text>
                </View>
              </View>

              {/* Nom du bénéficiaire */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Nom du bénéficiaire
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Nom complet du bénéficiaire
                  </Text>
                </View>
              </View>

              {/* Code du bénéficiaire */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Code du bénéficiaire
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Code ou numéro du bénéficiaire
                  </Text>
                </View>
              </View>

              {/* Motif */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Motif (optionnel)
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                  minHeight: 80,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Motif du transfert
                  </Text>
                </View>
              </View>

              {/* Bouton de validation */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Confirmer le transfert');
                  closeTransferModal();
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                }}>
                  Confirmer le transfert
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Scanner QR */}
      <Modal
        visible={isScanQRModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeScanQRModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeScanQRModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 350,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeScanQRModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Scanner un code QR
            </Text>
            
            {/* Zone de scan */}
            <View style={{
              width: '100%',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <View style={{
                width: 220,
                height: 220,
                backgroundColor: '#000000',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Cadre de scan */}
                <View style={{
                  width: 180,
                  height: 180,
                  borderWidth: 3,
                  borderColor: theme.activeColor,
                  borderRadius: 12,
                  position: 'relative',
                }}>
                  {/* Coins du cadre */}
                  <View style={{
                    position: 'absolute',
                    top: -3,
                    left: -3,
                    width: 30,
                    height: 30,
                    borderTopWidth: 6,
                    borderLeftWidth: 6,
                    borderColor: theme.activeColor,
                    borderTopLeftRadius: 12,
                  }} />
                  <View style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    width: 30,
                    height: 30,
                    borderTopWidth: 6,
                    borderRightWidth: 6,
                    borderColor: theme.activeColor,
                    borderTopRightRadius: 12,
                  }} />
                  <View style={{
                    position: 'absolute',
                    bottom: -3,
                    left: -3,
                    width: 30,
                    height: 30,
                    borderBottomWidth: 6,
                    borderLeftWidth: 6,
                    borderColor: theme.activeColor,
                    borderBottomLeftRadius: 12,
                  }} />
                  <View style={{
                    position: 'absolute',
                    bottom: -3,
                    right: -3,
                    width: 30,
                    height: 30,
                    borderBottomWidth: 6,
                    borderRightWidth: 6,
                    borderColor: theme.activeColor,
                    borderBottomRightRadius: 12,
                  }} />
                  
                  {/* Ligne de scan animée */}
                  <View style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: theme.activeColor,
                    opacity: 0.8,
                  }} />
                </View>

                {/* Icône de caméra au centre */}
                <View style={{
                  position: 'absolute',
                  width: 60,
                  height: 60,
                  backgroundColor: 'rgba(29, 186, 163, 0.2)',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <ScanQRIcon color={theme.activeColor} />
                </View>
              </View>
            </View>

            {/* Instructions */}
            <Text style={{
              fontSize: 16,
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 24,
            }}>
              Placez le code QR dans le cadre pour scanner
            </Text>

            {/* Boutons d'action */}
            <View style={{
              flexDirection: 'row',
              gap: 12,
            }}>
              <TouchableOpacity 
                style={{
                  flex: 1,
                  height: 48,
                  backgroundColor: theme.borderColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  console.log('Activer le flash');
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                }}>
                  Flash
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{
                  flex: 1,
                  height: 48,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  console.log('Ouvrir la galerie');
                  closeScanQRModal();
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}>
                  Galerie
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Générer QR */}
      <Modal
        visible={isGenerateQRModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeGenerateQRModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeGenerateQRModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 320,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeGenerateQRModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Votre Code QR
            </Text>

            {/* Code QR */}
            <View style={{
              width: '100%',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <View style={{
                width: 200,
                height: 200,
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 6,
                marginBottom: 20,
              }}>
                {/* Code QR simulé */}
                <View style={{
                  width: 160,
                  height: 160,
                  backgroundColor: '#000000',
                }}>
                  {/* Pattern QR Code simulé */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {Array.from({ length: 256 }, (_, i) => (
                      <View
                        key={i}
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: Math.random() > 0.5 ? '#000' : '#fff',
                        }}
                      />
                    ))}
                  </View>
                </View>
              </View>

              {/* Logo YANKAP au centre */}
              <View style={{
                position: 'absolute',
                top: 75,
                width: 50,
                height: 50,
                backgroundColor: theme.activeColor,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderColor: '#FFFFFF',
              }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                }}>
                  Y
                </Text>
              </View>
            </View>

            {/* Champ Code */}
            <View style={{
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: theme.textColor,
                marginBottom: 8,
              }}>
                Votre code
              </Text>
              <View style={{
                backgroundColor: theme.borderColor,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: theme.inactiveColor,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.textColor,
                  textAlign: 'center',
                  letterSpacing: 2,
                }}>
                  YKP-2024-789456
                </Text>
              </View>
            </View>

            {/* Bouton Partager */}
            <TouchableOpacity 
              style={{
                width: '100%',
                height: 48,
                backgroundColor: theme.activeColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 6,
              }}
              onPress={() => {
                console.log('Partager le code QR');
                closeGenerateQRModal();
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}>
                Partager
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modale Retrait Opérateur Mobile */}
      <Modal
        visible={isWithdrawMobileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeWithdrawMobileModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeWithdrawMobileModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 350,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeWithdrawMobileModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Retrait via Mobile Money
            </Text>

            {/* Formulaire de retrait mobile */}
            <View style={{ gap: 20 }}>
              {/* Montant */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Montant à retirer (FCFA)
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Entrez le montant
                  </Text>
                </View>
              </View>

              {/* Numéro de téléphone */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Numéro de téléphone
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    +237 6XX XXX XXX
                  </Text>
                </View>
              </View>

              {/* Opérateur */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Opérateur
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Sélectionner l'opérateur
                  </Text>
                </View>
              </View>

              {/* Bouton de validation */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Confirmer le retrait mobile');
                  closeWithdrawMobileModal();
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                }}>
                  Confirmer le retrait
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Retrait Compte Bancaire */}
      <Modal
        visible={isWithdrawBankModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeWithdrawBankModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeWithdrawBankModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 350,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeWithdrawBankModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Retrait vers Compte Bancaire
            </Text>

            {/* Formulaire de retrait bancaire */}
            <View style={{ gap: 20 }}>
              {/* Montant */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Montant à retirer (FCFA)
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Entrez le montant
                  </Text>
                </View>
              </View>

              {/* Nom de la banque */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Banque
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Sélectionner votre banque
                  </Text>
                </View>
              </View>

              {/* Numéro de compte */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Numéro de compte
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Votre numéro de compte
                  </Text>
                </View>
              </View>

              {/* Bouton de validation */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Confirmer le retrait bancaire');
                  closeWithdrawBankModal();
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                }}>
                  Confirmer le retrait
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Recharge Opérateur Mobile */}
      <Modal
        visible={isRechargeMobileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRechargeMobileModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeRechargeMobileModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 350,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeRechargeMobileModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Recharge via Mobile Money
            </Text>

            {/* Formulaire de recharge mobile */}
            <View style={{ gap: 20 }}>
              {/* Montant */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Montant à recharger (FCFA)
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Entrez le montant
                  </Text>
                </View>
              </View>

              {/* Numéro de téléphone */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Numéro de téléphone
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    +237 6XX XXX XXX
                  </Text>
                </View>
              </View>

              {/* Opérateur */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Opérateur
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Sélectionner l'opérateur
                  </Text>
                </View>
              </View>

              {/* Bouton de validation */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Confirmer la recharge mobile');
                  closeRechargeMobileModal();
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                }}>
                  Confirmer la recharge
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale Recharge Compte Bancaire */}
      <Modal
        visible={isRechargeBankModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRechargeBankModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeRechargeBankModal}
            activeOpacity={1}
          />
          <View style={{
            backgroundColor: theme.tabBarBackground,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 32,
            width: '100%',
            maxWidth: 350,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
          }}>
            {/* Bouton X de fermeture */}
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                backgroundColor: theme.inactiveColor,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
              onPress={closeRechargeBankModal}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                ×
              </Text>
            </TouchableOpacity>

            {/* Titre de la modale */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: theme.textColor,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Recharge depuis Compte Bancaire
            </Text>

            {/* Formulaire de recharge bancaire */}
            <View style={{ gap: 20 }}>
              {/* Montant */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Montant à recharger (FCFA)
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Entrez le montant
                  </Text>
                </View>
              </View>

              {/* Nom de la banque */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Banque
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Sélectionner votre banque
                  </Text>
                </View>
              </View>

              {/* Numéro de compte */}
              <View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 8,
                }}>
                  Numéro de compte
                </Text>
                <View style={{
                  backgroundColor: theme.borderColor,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: theme.inactiveColor,
                  }}>
                    Votre numéro de compte
                  </Text>
                </View>
              </View>

              {/* Bouton de validation */}
              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 56,
                  backgroundColor: theme.activeColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => {
                  console.log('Confirmer la recharge bancaire');
                  closeRechargeBankModal();
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                }}>
                  Confirmer la recharge
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pager Menu (vient de la gauche) */}
      <Modal
        visible={isMenuPagerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenuPager}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          flexDirection: 'row',
        }}>
          <View style={{
            width: '80%',
            backgroundColor: theme.tabBarBackground,
            height: '100%',
            paddingTop: 60,
            paddingHorizontal: 20,
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 15,
          }}>
            {/* En-tête avec titre et bouton de fermeture */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 40,
              marginTop: 0,
            }}>
              <TouchableOpacity 
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.inactiveColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={closeMenuPager}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}>
                  ×
                </Text>
              </TouchableOpacity>

              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.textColor,
                flex: 1,
                textAlign: 'center',
                marginRight: 32, // Pour compenser la largeur du bouton X et centrer le titre
              }}>
                Menu
              </Text>
            </View>
            
            {/* Contenu du menu */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {/* Section Profil Utilisateur */}
              <View style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
                backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F8F9FA',
                marginBottom: 10,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 15,
                }}>
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: '#1DBAA3',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Text style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                      JD
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: theme.textColor,
                      marginBottom: 2,
                    }}>
                      John Doe
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: theme.inactiveColor,
                      marginBottom: 5,
                    }}>
                      john.doe@email.com
                    </Text>
                    <View style={{
                      backgroundColor: '#E8F5F3',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 10,
                      alignSelf: 'flex-start',
                    }}>
                      <Text style={{
                        fontSize: 12,
                        color: '#1DBAA3',
                        fontWeight: '500',
                      }}>
                        Membre Premium
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Section Navigation Principale */}
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 15,
                  opacity: 0.8,
                }}>
                  Navigation
                </Text>

                {/* Accueil */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 5,
                  backgroundColor: 'transparent',
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#1DBAA3',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="white"/>
                      <Path d="M9 22V12h6v10" stroke="#1DBAA3" strokeWidth="2"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Accueil
                  </Text>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>

                {/* Transactions */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 5,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#FF6B6B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Path d="M17 1l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Path d="M7 23l-4-4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Path d="M21 5H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Path d="M3 19h12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Transactions
                  </Text>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>

                {/* Services */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 5,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#4ECDC4',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Rect x="3" y="3" width="7" height="7" fill="white"/>
                      <Rect x="14" y="3" width="7" height="7" fill="white"/>
                      <Rect x="14" y="14" width="7" height="7" fill="white"/>
                      <Rect x="3" y="14" width="7" height="7" fill="white"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Services
                  </Text>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>

                {/* Profil */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 20,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#45B7D1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Mon Profil
                  </Text>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>
              </View>

              {/* Section Outils */}
              <View style={{ 
                paddingHorizontal: 20, 
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: theme.borderColor,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 15,
                  opacity: 0.8,
                }}>
                  Outils
                </Text>

                {/* Historique */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 5,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#96CEB4',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Historique
                  </Text>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>

                {/* Notifications */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 5,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#FECA57',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="white"/>
                      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Notifications
                  </Text>
                  <View style={{
                    backgroundColor: '#FF6B6B',
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>3</Text>
                  </View>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>

                {/* Paramètres */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 20,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#6C5CE7',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Paramètres
                  </Text>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>
              </View>

              {/* Section Support */}
              <View style={{ 
                paddingHorizontal: 20, 
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: theme.borderColor,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 15,
                  opacity: 0.8,
                }}>
                  Support
                </Text>

                {/* Aide */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 5,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#FF9F43',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Path d="M12 17h.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Centre d'aide
                  </Text>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>

                {/* Contact */}
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  marginBottom: 30,
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#2ED573',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <Path d="M22 6l-10 7L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: theme.textColor,
                    flex: 1,
                  }}>
                    Nous contacter
                  </Text>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <Path d="M9 18l6-6-6-6" stroke={theme.inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </TouchableOpacity>
              </View>

              {/* Bouton Déconnexion */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor: '#FF6B6B',
                  shadowColor: '#FF6B6B',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: 10 }}>
                    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <Path d="M16 17l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <Path d="M21 12H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'white',
                  }}>
                    Se déconnecter
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          
          {/* Zone transparente pour fermer */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={closeMenuPager}
            activeOpacity={1}
          />
        </View>
      </Modal>

      {/* Pager Notifications (vient de la droite) */}
      <Modal
        visible={isNotificationPagerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeNotificationPager}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          flexDirection: 'row',
        }}>
          {/* Zone transparente pour fermer */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={closeNotificationPager}
            activeOpacity={1}
          />
          
          <View style={{
            width: '80%',
            backgroundColor: theme.tabBarBackground,
            height: '100%',
            paddingTop: 60,
            paddingHorizontal: 20,
            shadowColor: '#000',
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 15,
          }}>
            {/* En-tête avec titre et bouton de fermeture */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: 0,
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.textColor,
                flex: 1,
                textAlign: 'center',
                marginLeft: 32, // Pour compenser la largeur du bouton X et centrer le titre
              }}>
                Notifications ({filteredNotifications.filter(n => n.unread).length})
              </Text>

              <TouchableOpacity 
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.inactiveColor,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={closeNotificationPager}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>

            {/* Onglets de filtrage */}
            <View style={{
              flexDirection: 'row',
              marginBottom: 20,
              backgroundColor: theme.borderColor,
              borderRadius: 12,
              padding: 4,
            }}>
              <TouchableOpacity 
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  backgroundColor: notificationFilter === 'all' ? theme.activeColor : 'transparent',
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => setNotificationFilter('all')}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: notificationFilter === 'all' ? '#FFFFFF' : theme.textColor,
                  opacity: notificationFilter === 'all' ? 1 : 0.7,
                }}>
                  Toutes ({allNotifications.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  backgroundColor: notificationFilter === 'transactions' ? theme.activeColor : 'transparent',
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => setNotificationFilter('transactions')}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: notificationFilter === 'transactions' ? '#FFFFFF' : theme.textColor,
                  opacity: notificationFilter === 'transactions' ? 1 : 0.7,
                }}>
                  Transactions ({allNotifications.filter(n => n.type === 'transaction').length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  backgroundColor: notificationFilter === 'tontines' ? theme.activeColor : 'transparent',
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => setNotificationFilter('tontines')}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: notificationFilter === 'tontines' ? '#FFFFFF' : theme.textColor,
                  opacity: notificationFilter === 'tontines' ? 1 : 0.7,
                }}>
                  Tontines ({allNotifications.filter(n => n.type === 'tontine').length})
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Liste scrollable des notifications */}
            <View style={{ flex: 1 }}>
              <ScrollView 
                showsVerticalScrollIndicator={true}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 80 }}
              >
                {filteredNotifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={{
                      backgroundColor: theme.borderColor,
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: notification.color,
                      opacity: notification.unread ? 1 : 0.85,
                    }}
                    onPress={() => handleNotificationAction(notification, 'view')}
                    activeOpacity={0.7}
                  >
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: notification.action === 'accept_decline' ? 12 : 8,
                    }}>
                      <View style={{ flex: 1 }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}>
                          <Text style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: theme.textColor,
                          }}>
                            {notification.title}
                          </Text>
                          {notification.unread && (
                            <View style={{
                              width: 8,
                              height: 8,
                              backgroundColor: notification.color,
                              borderRadius: 4,
                              marginLeft: 8,
                            }} />
                          )}
                        </View>
                        <Text style={{
                          fontSize: 13,
                          color: theme.textColor,
                          opacity: 0.8,
                          lineHeight: 18,
                        }}>
                          {notification.message}
                        </Text>
                      </View>
                      <Text style={{
                        fontSize: 11,
                        color: theme.textColor,
                        opacity: 0.6,
                        marginLeft: 12,
                      }}>
                        {notification.time}
                      </Text>
                    </View>

                    {/* Montant si présent */}
                    {notification.amount && (
                      <View style={{
                        backgroundColor: notification.color,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                        alignSelf: 'flex-start',
                        marginBottom: notification.action === 'accept_decline' ? 8 : 0,
                      }}>
                        <Text style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: '#FFFFFF',
                        }}>
                          {notification.amount}
                        </Text>
                      </View>
                    )}

                    {/* Boutons d'action selon le type */}
                    {notification.action === 'accept_decline' && (
                      <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        marginTop: 8,
                      }}>
                        <TouchableOpacity 
                          style={{
                            backgroundColor: notification.color,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 8,
                            flex: 1,
                          }}
                          onPress={() => handleNotificationAction(notification, 'accept')}
                          activeOpacity={0.8}
                        >
                          <Text style={{
                            fontSize: 12,
                            fontWeight: '600',
                            color: '#FFFFFF',
                            textAlign: 'center',
                          }}>
                            Accepter
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={{
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: theme.inactiveColor,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 8,
                            flex: 1,
                          }}
                          onPress={() => handleNotificationAction(notification, 'decline')}
                          activeOpacity={0.8}
                        >
                          <Text style={{
                            fontSize: 12,
                            fontWeight: '600',
                            color: theme.textColor,
                            opacity: 0.7,
                            textAlign: 'center',
                          }}>
                            Refuser
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {notification.action === 'pay' && (
                      <TouchableOpacity 
                        style={{
                          backgroundColor: notification.color,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          alignSelf: 'flex-start',
                          marginTop: 8,
                        }}
                        onPress={() => handleNotificationAction(notification, 'pay')}
                        activeOpacity={0.8}
                      >
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: '#FFFFFF',
                        }}>
                          Payer maintenant
                        </Text>
                      </TouchableOpacity>
                    )}

                    {notification.action === 'verify' && (
                      <TouchableOpacity 
                        style={{
                          backgroundColor: notification.color,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          alignSelf: 'flex-start',
                          marginTop: 8,
                        }}
                        onPress={() => handleNotificationAction(notification, 'verify')}
                        activeOpacity={0.8}
                      >
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: '#FFFFFF',
                        }}>
                          Vérifier
                        </Text>
                      </TouchableOpacity>
                    )}

                    {notification.action === 'use' && (
                      <TouchableOpacity 
                        style={{
                          backgroundColor: notification.color,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          alignSelf: 'flex-start',
                          marginTop: 8,
                        }}
                        onPress={() => handleNotificationAction(notification, 'use')}
                        activeOpacity={0.8}
                      >
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: '#FFFFFF',
                        }}>
                          Profiter
                        </Text>
                      </TouchableOpacity>
                    )}

                    {notification.action === 'update' && (
                      <TouchableOpacity 
                        style={{
                          backgroundColor: notification.color,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                          alignSelf: 'flex-start',
                          marginTop: 8,
                        }}
                        onPress={() => handleNotificationAction(notification, 'update')}
                        activeOpacity={0.8}
                      >
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: '#FFFFFF',
                        }}>
                          Mettre à jour
                        </Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}
                
                {/* Message si aucune notification */}
                {filteredNotifications.length === 0 && (
                  <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 40,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: theme.textColor,
                      opacity: 0.6,
                      textAlign: 'center',
                    }}>
                      Aucune notification{'\n'}dans cette catégorie
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Boutons d'action en bas */}
            <View style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 20,
              marginBottom: 20,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: theme.inactiveColor,
            }}>
              <TouchableOpacity 
                style={{
                  flex: 1,
                  backgroundColor: theme.activeColor,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                onPress={markAllAsRead}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}>
                  Tout marquer comme lu
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: theme.inactiveColor,
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                }}
                onPress={() => console.log('Paramètres notifications')}
                activeOpacity={0.8}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.textColor,
                  opacity: 0.7,
                }}>
                  ⚙️
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}