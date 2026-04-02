import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, TextInput } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { MOCK_USERS, MATCH_SUGGESTIONS, INTEREST_TAGS, getMutualInterests, UserProfile, ChatMessage } from '../services/datingApi';

const { width } = Dimensions.get('window');

const TABS = [
  { key: 'discover', label: '發現', emoji: '👀' },
  { key: 'matches', label: '配對', emoji: '💕' },
  { key: 'messages', label: '訊息', emoji: '💬' },
];

export const DatingScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [chats, setChats] = useState<{ [key: string]: ChatMessage[] }>({});
  const [newMessage, setNewMessage] = useState('');

  const currentUser = MOCK_USERS[0]; // Simulated current user

  const handleLike = () => {
    const newMatches = [...matches, MOCK_USERS[currentIndex].id];
    setMatches(newMatches);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1);
  };

  // Discover Card
  const renderDiscoverCard = () => {
    if (currentIndex >= MOCK_USERS.length) {
      return (
        <View style={styles.noMore}>
          <Text style={styles.noMoreEmoji}>🔍</Text>
          <Text style={styles.noMoreText}>暫時冇更多推薦</Text>
          <Text style={styles.noMoreSubtext}>稍後再睇啦</Text>
        </View>
      );
    }

    const user = MOCK_USERS[currentIndex];
    const mutualInterests = getMutualInterests(currentUser.interests, user.interests);

    return (
      <View style={styles.cardContainer}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{user.avatar}</Text>
            {user.online && <View style={styles.onlineDot} />}
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}, {user.age}</Text>
              {user.verified && <Text style={styles.verified}>✓</Text>}
            </View>
            <Text style={styles.location}>📍 {user.location} · {user.distance}</Text>
            
            <Text style={styles.bio}>{user.bio}</Text>
            
            <View style={styles.interestsContainer}>
              {user.interests.slice(0, 4).map((interest, i) => (
                <View key={i} style={[styles.interestTag, mutualInterests.includes(interest) && styles.interestTagMutual]}>
                  <Text style={[styles.interestText, mutualInterests.includes(interest) && styles.interestTextMutual]}>
                    {interest}
                  </Text>
                </View>
              ))}
            </View>

            {mutualInterests.length > 0 && (
              <View style={styles.matchBanner}>
                <Text style={styles.matchBannerText}>💕 你哋有 {mutualInterests.length} 個共同興趣</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handlePass}>
            <Text style={styles.actionIcon}>👎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]}>
            <Text style={styles.actionIcon}>⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike}>
            <Text style={styles.actionIcon}>❤️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Matches List
  const renderMatches = () => {
    const matchedUsers = MOCK_USERS.filter(u => matches.includes(u.id));

    if (matchedUsers.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💕</Text>
          <Text style={styles.emptyText}>未有任何配對</Text>
          <Text style={styles.emptySubtext}>繼續發掘，機會嚟啦！</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={matchedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.matchCard} onPress={() => setSelectedUser(item)}>
            <View style={styles.matchAvatar}>
              <Text style={styles.matchAvatarText}>{item.avatar}</Text>
              {item.online && <View style={styles.matchOnlineDot} />}
            </View>
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>{item.name}, {item.age}</Text>
              <Text style={styles.matchLocation}>📍 {item.location}</Text>
            </View>
            <Text style={styles.matchChat}>💬</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.matchesList}
      />
    );
  };

  // Messages
  const renderMessages = () => {
    const chatUsers = MOCK_USERS.filter(u => chats[u.id]?.length > 0);

    if (chatUsers.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyText}>暫時冇訊息</Text>
          <Text style={styles.emptySubtext}>開始配對啦！</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={chatUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatPreview} onPress={() => setSelectedUser(item)}>
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>{item.avatar}</Text>
              {item.online && <View style={styles.chatOnlineDot} />}
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>10:33</Text>
              </View>
              <Text style={styles.chatLastMessage} numberOfLines={1}>
                {item.id === 'u1' ? '我鐘意西貢！風景好正...' : '開始聊天吧...'}
              </Text>
            </View>
            {!chats[item.id]?.length && <View style={styles.unreadBadge}><Text style={styles.unreadCount}>新</Text></View>}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.messagesList}
      />
    );
  };

  // Chat View
  if (selectedUser) {
    const userMessages = chats[selectedUser.id] || [];

    return (
      <View style={styles.container}>
        <View style={styles.chatHeaderBar}>
          <TouchableOpacity onPress={() => setSelectedUser(null)}>
            <Text style={styles.backButton}>← 返回</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderAvatar}>{selectedUser.avatar}</Text>
            <Text style={styles.chatHeaderName}>{selectedUser.name}</Text>
          </View>
          <View style={{ width: 50 }} />
        </View>

        <FlatList
          data={userMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.senderId === 'me' ? styles.myMessage : styles.theirMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
          ListEmptyComponent={
            <View style={styles.chatEmpty}>
              <Text style={styles.chatEmptyText}>💬 開始你哋嘅對話啦！</Text>
            </View>
          }
        />

        <View style={styles.messageInput}>
          <TouchableOpacity style={styles.moreButton}><Text>📷</Text></TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}><Text>🎤</Text></TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput} 
              placeholder="寫訊息..."
              placeholderTextColor={colors.textMuted}
              value={newMessage}
              onChangeText={setNewMessage}
            />
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>遇見你</Text>
        <Text style={styles.headerSubtitle}>香港真實相遇</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'discover' && renderDiscoverCard()}
      {activeTab === 'matches' && renderMatches()}
      {activeTab === 'messages' && renderMessages()}

      {/* Interest filter */}
      <View style={styles.interestFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {INTEREST_TAGS.slice(0, 8).map((tag, i) => (
            <TouchableOpacity key={i} style={styles.filterChip}>
              <Text style={styles.filterChipText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '700' },
  headerSubtitle: { color: colors.textMuted, fontSize: 13 },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: borderRadius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabEmoji: { fontSize: 18, marginBottom: 2 },
  tabLabel: { color: colors.textMuted, fontSize: 11 },
  tabLabelActive: { color: colors.text },
  // Discover Card
  cardContainer: { paddingHorizontal: spacing.md, flex: 1 },
  profileCard: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: 'hidden' },
  avatarContainer: { height: 200, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatar: { fontSize: 80 },
  onlineDot: { position: 'absolute', bottom: 16, right: 16, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.success, borderWidth: 3, borderColor: colors.surface },
  profileInfo: { padding: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: colors.text, fontSize: 22, fontWeight: '700' },
  verified: { color: colors.primary, fontSize: 16, marginLeft: 4 },
  location: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  bio: { color: colors.text, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  interestsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  interestTag: { backgroundColor: colors.surfaceLight, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm, marginRight: 4, marginBottom: 4 },
  interestTagMutual: { backgroundColor: colors.primary + '30' },
  interestText: { color: colors.textMuted, fontSize: 12 },
  interestTextMutual: { color: colors.primary, fontWeight: '600' },
  matchBanner: { backgroundColor: colors.primary + '20', padding: spacing.sm, borderRadius: borderRadius.sm, marginTop: spacing.sm },
  matchBannerText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.md },
  actionButton: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  passButton: { backgroundColor: colors.surface },
  superLikeButton: { backgroundColor: colors.surface, transform: [{ scale: 0.9 }] },
  likeButton: { backgroundColor: colors.surface },
  actionIcon: { fontSize: 28 },
  noMore: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noMoreEmoji: { fontSize: 64, marginBottom: spacing.md },
  noMoreText: { color: colors.text, fontSize: 18, fontWeight: '600' },
  noMoreSubtext: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  // Matches
  matchesList: { paddingHorizontal: spacing.md },
  matchCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  matchAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  matchAvatarText: { fontSize: 24 },
  matchOnlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.surface },
  matchInfo: { flex: 1, marginLeft: spacing.md },
  matchName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  matchLocation: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  matchChat: { fontSize: 20 },
  // Messages
  messagesList: { paddingHorizontal: spacing.md },
  chatPreview: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  chatAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  chatAvatarText: { fontSize: 24 },
  chatOnlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.surface },
  chatInfo: { flex: 1, marginLeft: spacing.md },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  chatHeaderBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.surface },
  chatName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  chatTime: { color: colors.textMuted, fontSize: 11 },
  chatLastMessage: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  unreadBadge: { backgroundColor: colors.error, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  unreadCount: { color: '#fff', fontSize: 10, fontWeight: '700' },
  // Empty states
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.md },
  emptyText: { color: colors.text, fontSize: 18, fontWeight: '600' },
  emptySubtext: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  // Interest Filter
  interestFilter: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.surface },
  filterChip: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.xl, marginRight: spacing.sm },
  filterChipText: { color: colors.textMuted, fontSize: 12 },
  backButton: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  chatHeaderInfo: { flexDirection: 'row', alignItems: 'center' },
  chatHeaderAvatar: { fontSize: 28, marginRight: spacing.sm },
  chatHeaderName: { color: colors.text, fontSize: 16, fontWeight: '600' },
  messagesContainer: { padding: spacing.md, flexGrow: 1 },
  messageBubble: { maxWidth: '75%', padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  myMessage: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: colors.surface },
  messageText: { color: colors.text, fontSize: 14 },
  chatEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  chatEmptyText: { color: colors.textMuted, fontSize: 14 },
  messageInput: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.surface },
  moreButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  inputContainer: { flex: 1, backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: spacing.md, marginHorizontal: spacing.sm },
  textInput: { color: colors.text, fontSize: 14, paddingVertical: spacing.sm },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: colors.text, fontSize: 18 },
});
