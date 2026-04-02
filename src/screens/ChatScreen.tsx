import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AIChatBubble, TypingBubble } from '../components';
import { colors, spacing, borderRadius } from '../theme/colors';
import { useStore } from '../store';
import { aiService } from '../services';
import { VoiceInputService } from '../services/voiceInputService';

const quickQuestions = [
  '今日天氣點呀？',
  '東涌站幾耐到？',
  '出面濕唔濕？',
  '附近有咩好嘢食？',
];

// Simple forum posts integrated
const FORUM_POSTS = [
  { id: 'f1', title: 'Tesla股價走勢分析～你點睇？', author: '金龍', avatar: '🐉', likes: 45, replies: 12, category: '投資' },
  { id: 'f2', title: '西環呢間茶檔算唔算係性價比之王？', author: '小美', avatar: '👩‍💼', likes: 32, replies: 8, category: '美食' },
  { id: 'f3', title: '長洲週末遊～性價比超高嘅小旅行', author: '肥B', avatar: '😎', likes: 28, replies: 5, category: '生活' },
];

export const ChatScreen: React.FC = () => {
  const { messages, addMessage } = useStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showForum, setShowForum] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const voiceServiceRef = useRef<VoiceInputService | null>(null);

  useEffect(() => {
    voiceServiceRef.current = new VoiceInputService({ lang: 'zh-HK', continuous: false, interimResults: true });
    voiceServiceRef.current.onStart(() => setIsListening(true));
    voiceServiceRef.current.onEnd(() => { setIsListening(false); setInterimTranscript(''); });
    voiceServiceRef.current.onResult((transcript, isFinal) => {
      if (isFinal) { setInputText(transcript); setInterimTranscript(''); }
      else { setInterimTranscript(transcript); }
    });
    return () => { voiceServiceRef.current?.stop(); };
  }, []);

  const handleSend = useCallback(async () => {
    const textToSend = inputText.trim() || interimTranscript.trim();
    if (!textToSend) return;
    
    addMessage({ id: Date.now().toString(), role: 'user', content: textToSend, timestamp: new Date() });
    setInputText('');
    setInterimTranscript('');
    setIsTyping(true);
    
    try {
      const response = await aiService.sendMessage(textToSend);
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() });
    } catch (error) {
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: '抱歉，目前無法處理你的請求。😅', timestamp: new Date() });
    } finally {
      setIsTyping(false);
    }
  }, [inputText, interimTranscript, addMessage]);

  const handleVoiceInput = () => {
    if (!voiceServiceRef.current?.isAvailable()) {
      alert('你的瀏覽器不支援語音輸入');
      return;
    }
    voiceServiceRef.current.toggle();
  };

  const displayText = inputText || interimTranscript;

  // Forum view
  if (showForum) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowForum(false)}>
            <Text style={styles.backButton}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>討論區</Text>
          <View style={{ width: 50 }} />
        </View>
        <FlatList
          data={FORUM_POSTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.forumCard}>
              <View style={styles.forumHeader}>
                <Text style={styles.forumAvatar}>{item.avatar}</Text>
                <View style={styles.forumMeta}>
                  <Text style={styles.forumAuthor}>{item.author}</Text>
                  <View style={styles.forumBadge}><Text style={styles.forumBadgeText}>{item.category}</Text></View>
                </View>
              </View>
              <Text style={styles.forumTitle}>{item.title}</Text>
              <View style={styles.forumStats}>
                <Text style={styles.forumStat}>❤️ {item.likes}</Text>
                <Text style={styles.forumStat}>💬 {item.replies}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.forumList}
        />
      </SafeAreaView>
    );
  }

  // Chat view
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.avatar}>🐉</Text>
          <View>
            <Text style={styles.headerTitle}>金龍</Text>
            <Text style={styles.status}>在線</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.forumButton} onPress={() => setShowForum(true)}>
          <Text style={styles.forumButtonText}>💬</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AIChatBubble message={item} />}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListFooterComponent={<TypingBubble isTyping={isTyping} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👋</Text>
            <Text style={styles.emptyTitle}>你問我答</Text>
            <Text style={styles.emptyText}>問我關於香港的一切！天氣、交通、搵地方...</Text>
            <View style={styles.quickQuestions}>
              {quickQuestions.map((q, i) => (
                <TouchableOpacity key={i} style={styles.quickQuestion} onPress={() => setInputText(q)}>
                  <Text style={styles.quickQuestionText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={[styles.micButton, isListening && styles.micButtonActive]} onPress={handleVoiceInput}>
            <Text style={styles.micIcon}>{isListening ? '🔴' : '🎤'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="問我任何關於香港嘅嘢..."
            placeholderTextColor={colors.textMuted}
            value={displayText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={[styles.sendButton, !displayText.trim() && styles.sendButtonDisabled]} onPress={handleSend} disabled={!displayText.trim()}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
        {isListening && <View style={styles.listeningIndicator}><Text style={styles.listeningText}>🎤 緊聽緊... 請說話</Text></View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.surface },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { fontSize: 32, marginRight: spacing.md },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  status: { color: colors.success, fontSize: 12 },
  backButton: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  forumButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  forumButtonText: { fontSize: 18 },
  messagesList: { paddingVertical: spacing.md, flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: 100 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '600', marginBottom: spacing.sm },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginBottom: spacing.lg },
  quickQuestions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  quickQuestion: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.xl, margin: 4 },
  quickQuestionText: { color: colors.text, fontSize: 13 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.surface, marginHorizontal: spacing.md, marginBottom: spacing.md, borderRadius: borderRadius.xl, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
  micButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: spacing.xs },
  micButtonActive: { backgroundColor: colors.error + '40' },
  micIcon: { fontSize: 18 },
  input: { flex: 1, color: colors.text, fontSize: 16, maxHeight: 100, paddingVertical: spacing.sm },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: spacing.xs },
  sendButtonDisabled: { backgroundColor: colors.surfaceLight },
  sendIcon: { color: colors.text, fontSize: 18 },
  listeningIndicator: { backgroundColor: colors.error + '20', marginHorizontal: spacing.md, marginBottom: spacing.sm, padding: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center' },
  listeningText: { color: colors.error, fontSize: 13, fontWeight: '500' },
  // Forum styles
  forumList: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  forumCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  forumHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  forumAvatar: { fontSize: 28, marginRight: spacing.sm },
  forumMeta: { flex: 1 },
  forumAuthor: { color: colors.text, fontSize: 13, fontWeight: '600' },
  forumBadge: { backgroundColor: colors.primary + '20', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 2 },
  forumBadgeText: { color: colors.primary, fontSize: 10, fontWeight: '600' },
  forumTitle: { color: colors.text, fontSize: 14, fontWeight: '500', marginBottom: spacing.sm },
  forumStats: { flexDirection: 'row' },
  forumStat: { color: colors.textMuted, fontSize: 12, marginRight: spacing.md },
});
