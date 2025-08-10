import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

// Mock data - à remplacer par de vraies données
const mockTontineInfo = {
  id: '1',
  name: 'Tontine Famille Durand',
  participants: 8,
  amount: 50000,
  frequency: 'Mensuelle',
  admin: 'Marie Durand',
  image: 'https://via.placeholder.com/40',
  status: 'active'
};

const mockMessages = [
  {
    id: '1',
    type: 'system',
    content: 'La tontine "Famille Durand" a été créée',
    timestamp: '2025-01-08T10:00:00Z',
    systemType: 'tontine_created'
  },
  {
    id: '2',
    type: 'system',
    content: 'Jean Dubois a rejoint la tontine',
    timestamp: '2025-01-08T10:30:00Z',
    systemType: 'member_joined'
  },
  {
    id: '3',
    type: 'message',
    content: 'Bonjour tout le monde ! Hâte de commencer cette tontine 😊',
    timestamp: '2025-01-08T11:00:00Z',
    sender: {
      id: '2',
      name: 'Jean Dubois',
      avatar: 'https://via.placeholder.com/32'
    }
  },
  {
    id: '4',
    type: 'system',
    content: 'Marie Durand a cotisé 50,000 XAF',
    timestamp: '2025-01-08T14:00:00Z',
    systemType: 'contribution_made'
  },
  {
    id: '5',
    type: 'message',
    content: 'Parfait ! Qui sera le prochain à cotiser ?',
    timestamp: '2025-01-08T14:05:00Z',
    sender: {
      id: '1',
      name: 'Marie Durand',
      avatar: 'https://via.placeholder.com/32'
    }
  },
  {
    id: '6',
    type: 'system',
    content: 'Paul Martin a réclamé son tour de 400,000 XAF',
    timestamp: '2025-01-08T15:00:00Z',
    systemType: 'claim_made'
  }
];

const mockTransactions = [
  {
    id: '1',
    participant: 'Marie Durand',
    amount: 50000,
    status: 'completed',
    date: '2025-01-08T14:00:00Z',
    type: 'contribution'
  },
  {
    id: '2',
    participant: 'Jean Dubois',
    amount: 50000,
    status: 'completed',
    date: '2025-01-08T15:30:00Z',
    type: 'contribution'
  },
  {
    id: '3',
    participant: 'Paul Martin',
    amount: 50000,
    status: 'pending',
    date: '2025-01-08T16:00:00Z',
    type: 'contribution'
  },
  {
    id: '4',
    participant: 'Paul Martin',
    amount: 400000,
    status: 'completed',
    date: '2025-01-08T15:00:00Z',
    type: 'claim'
  }
];

// Couleurs du thème
const theme = {
  primary: '#1DBAA3',
  secondary: '#00B894',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#E74C3C',
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textTertiary: '#B2BEC3',
  background: '#FFFFFF',
  cardBackground: '#F8F9FA',
  borderColor: '#E8E8E8',
  messageBackground: '#F1F3F4',
  myMessageBackground: '#1DBAA3',
  systemMessageBackground: '#FFF3CD'
};

// Styles de texte
const TEXT_STYLES = {
  h1: { fontSize: 24, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '500' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const }
};

// Icônes SVG
const BackIcon = ({ color = '#000' }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ 
      width: 16, 
      height: 2, 
      backgroundColor: color, 
      position: 'absolute',
      transform: [{ rotate: '45deg' }],
      left: 6,
      top: 8
    }} />
    <View style={{ 
      width: 16, 
      height: 2, 
      backgroundColor: color, 
      position: 'absolute',
      transform: [{ rotate: '-45deg' }],
      left: 6,
      top: 14
    }} />
    <View style={{ 
      width: 12, 
      height: 2, 
      backgroundColor: color, 
      position: 'absolute',
      left: 4,
      top: 11
    }} />
  </View>
);

const SendIcon = ({ color = '#000' }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ 
      width: 0, 
      height: 0, 
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: color,
      transform: [{ rotate: '45deg' }]
    }} />
  </View>
);

const AttachIcon = ({ color = '#000' }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ 
      width: 16, 
      height: 16, 
      borderWidth: 2, 
      borderColor: color,
      borderRadius: 2,
      transform: [{ rotate: '45deg' }]
    }} />
    <View style={{ 
      width: 6, 
      height: 2, 
      backgroundColor: color, 
      position: 'absolute',
      top: 6,
      left: 9
    }} />
  </View>
);

const PhoneIcon = ({ color = '#000' }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ 
      width: 12, 
      height: 16, 
      borderWidth: 2, 
      borderColor: color,
      borderRadius: 3
    }} />
  </View>
);

const VideoIcon = ({ color = '#000' }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ 
      width: 16, 
      height: 12, 
      borderWidth: 2, 
      borderColor: color,
      borderRadius: 2
    }} />
    <View style={{ 
      width: 4, 
      height: 6, 
      backgroundColor: color, 
      position: 'absolute',
      right: 2,
      borderRadius: 1
    }} />
  </View>
);

const MoreIcon = ({ color = '#000' }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1.5, marginBottom: 2 }} />
    <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1.5, marginBottom: 2 }} />
    <View style={{ width: 3, height: 3, backgroundColor: color, borderRadius: 1.5 }} />
  </View>
);

export default function TontineChat() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'messages' | 'activity'>('messages');
  const [messageText, setMessageText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' XAF';
  };

  const getSystemMessageStyle = (systemType: string) => {
    switch (systemType) {
      case 'contribution_made':
      case 'tontine_created':
        return { backgroundColor: '#E8F5E8', borderColor: theme.success };
      case 'claim_made':
        return { backgroundColor: '#FFF3E0', borderColor: theme.warning };
      case 'member_joined':
        return { backgroundColor: '#E3F2FD', borderColor: theme.primary };
      case 'member_left':
        return { backgroundColor: '#FFEBEE', borderColor: theme.danger };
      default:
        return { backgroundColor: theme.systemMessageBackground, borderColor: theme.warning };
    }
  };

  const getSystemMessageIcon = (systemType: string) => {
    switch (systemType) {
      case 'contribution_made':
        return '💰';
      case 'claim_made':
        return '🎯';
      case 'member_joined':
        return '👋';
      case 'member_left':
        return '👋';
      case 'tontine_created':
        return '🎉';
      default:
        return 'ℹ️';
    }
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      // Ici, vous ajouteriez la logique pour envoyer le message
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const renderMessage = (message: any) => {
    if (message.type === 'system') {
      const systemStyle = getSystemMessageStyle(message.systemType);
      return (
        <View key={message.id} style={[styles.systemMessage, systemStyle]}>
          <Text style={styles.systemMessageIcon}>
            {getSystemMessageIcon(message.systemType)}
          </Text>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary, flex: 1 }]}>
            {message.content}
          </Text>
          <Text style={[TEXT_STYLES.small, { color: theme.textTertiary }]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      );
    }

    const isMyMessage = message.sender?.id === '1'; // ID de l'utilisateur actuel

    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        {!isMyMessage && (
          <Image 
            source={{ uri: message.sender.avatar }} 
            style={styles.messageAvatar}
          />
        )}
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          {!isMyMessage && (
            <Text style={[TEXT_STYLES.small, { color: theme.primary, marginBottom: 2 }]}>
              {message.sender.name}
            </Text>
          )}
          <Text style={[
            TEXT_STYLES.body,
            { color: isMyMessage ? 'white' : theme.textPrimary }
          ]}>
            {message.content}
          </Text>
          <Text style={[
            TEXT_STYLES.small,
            { 
              color: isMyMessage ? 'rgba(255,255,255,0.8)' : theme.textTertiary,
              marginTop: 4,
              alignSelf: 'flex-end'
            }
          ]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderTransaction = (transaction: any) => {
    const isContribution = transaction.type === 'contribution';
    const statusColor = transaction.status === 'completed' ? theme.success : theme.warning;
    
    return (
      <View key={transaction.id} style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Text style={{ fontSize: 20 }}>
            {isContribution ? '💰' : '🎯'}
          </Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={[TEXT_STYLES.body, { color: theme.textPrimary }]}>
            {transaction.participant}
          </Text>
          <Text style={[TEXT_STYLES.caption, { color: theme.textSecondary }]}>
            {isContribution ? 'Cotisation' : 'Réclamation'} • {formatDate(transaction.date)}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[
            TEXT_STYLES.body, 
            { 
              color: isContribution ? theme.success : theme.primary,
              fontWeight: '600'
            }
          ]}>
            {isContribution ? '+' : '-'}{formatAmount(transaction.amount)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={[TEXT_STYLES.small, { color: 'white' }]}>
              {transaction.status === 'completed' ? 'Validé' : 'En attente'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerInfo} onPress={() => router.push('/tontine-detail')}>
          <Image 
            source={{ uri: mockTontineInfo.image }} 
            style={styles.headerAvatar}
          />
          <View style={styles.headerText}>
            <Text style={[TEXT_STYLES.body, { color: 'white', fontWeight: '600' }]}>
              {mockTontineInfo.name}
            </Text>
            <Text style={[TEXT_STYLES.caption, { color: 'rgba(255,255,255,0.8)' }]}>
              {mockTontineInfo.participants} participants • {mockTontineInfo.frequency}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <VideoIcon color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <PhoneIcon color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <MoreIcon color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[
            TEXT_STYLES.body,
            {
              color: activeTab === 'messages' ? theme.primary : theme.textSecondary,
              fontWeight: activeTab === 'messages' ? '600' : '400'
            }
          ]}>
            Messagerie
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[
            TEXT_STYLES.body,
            {
              color: activeTab === 'activity' ? theme.primary : theme.textSecondary,
              fontWeight: activeTab === 'activity' ? '600' : '400'
            }
          ]}>
            Activité
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'messages' ? (
          <>
            {/* Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {mockMessages.map(renderMessage)}
            </ScrollView>

            {/* Message Input */}
            <View style={styles.inputContainer}>
              <TouchableOpacity 
                style={styles.attachButton}
                onPress={() => setShowAttachMenu(true)}
              >
                <AttachIcon color={theme.textSecondary} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.messageInput}
                placeholder="Tapez votre message..."
                placeholderTextColor={theme.textTertiary}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={1000}
              />
              
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: theme.primary }]}
                onPress={sendMessage}
                disabled={!messageText.trim()}
              >
                <SendIcon color="white" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Activity Tab */}
            <ScrollView style={styles.activityContainer} showsVerticalScrollIndicator={false}>
              <Text style={[TEXT_STYLES.h3, { color: theme.textPrimary, margin: 16 }]}>
                Historique des transactions
              </Text>
              
              {mockTransactions.map(renderTransaction)}
              
              {mockTransactions.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={[TEXT_STYLES.body, { color: theme.textSecondary, textAlign: 'center' }]}>
                    Aucune transaction pour le moment
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>

      {/* Attach Menu Modal */}
      <Modal
        visible={showAttachMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAttachMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowAttachMenu(false)}
        >
          <View style={[styles.attachMenu, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity style={styles.attachOption}>
              <View style={[styles.attachIcon, { backgroundColor: '#E91E63' }]}>
                <Text style={{ color: 'white', fontSize: 18 }}>📷</Text>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>Caméra</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachOption}>
              <View style={[styles.attachIcon, { backgroundColor: '#9C27B0' }]}>
                <Text style={{ color: 'white', fontSize: 18 }}>🖼️</Text>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>Galerie</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachOption}>
              <View style={[styles.attachIcon, { backgroundColor: '#FF9800' }]}>
                <Text style={{ color: 'white', fontSize: 18 }}>📄</Text>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>Document</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachOption}>
              <View style={[styles.attachIcon, { backgroundColor: '#4CAF50' }]}>
                <Text style={{ color: 'white', fontSize: 18 }}>📍</Text>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>Position</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachOption}>
              <View style={[styles.attachIcon, { backgroundColor: '#2196F3' }]}>
                <Text style={{ color: 'white', fontSize: 18 }}>👤</Text>
              </View>
              <Text style={[TEXT_STYLES.caption, { color: theme.textPrimary }]}>Contact</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginLeft: 16,
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.primary,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  systemMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  systemMessageIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  myMessageBubble: {
    backgroundColor: theme.myMessageBackground,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: theme.messageBackground,
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: theme.background,
    borderTopWidth: 1,
    borderTopColor: theme.borderColor,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: theme.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  activityContainer: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  attachMenu: {
    flexDirection: 'row',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  attachOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  attachIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
