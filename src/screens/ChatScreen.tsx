import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AIChatBubble, TypingBubble } from '../components';
import { colors, spacing, borderRadius } from '../theme/colors';
import { useStore } from '../store';
import { aiService } from '../services';
import { VoiceInputService, voiceInputService } from '../services/voiceInputService';

const quickQuestions = [
  '今日天氣點呀？',
  '東涌站幾耐到？',
  '附近有咩好嘢食？',
  '出面濕唔濕？',
];

export const ChatScreen: React.FC = () => {
  const { messages, addMessage } = useStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const voiceServiceRef = useRef<VoiceInputService | null>(null);

  useEffect(() => {
    // Initialize voice input service
    voiceServiceRef.current = new VoiceInputService({
      lang: 'zh-HK',
      continuous: false,
      interimResults: true,
    });

    voiceServiceRef.current.onStart(() => {
      setIsListening(true);
    });

    voiceServiceRef.current.onEnd(() => {
      setIsListening(false);
      setInterimTranscript('');
    });

    voiceServiceRef.current.onResult((transcript, isFinal) => {
      if (isFinal) {
        setInputText(transcript);
        setInterimTranscript('');
      } else {
        setInterimTranscript(transcript);
      }
    });

    voiceServiceRef.current.onError((error) => {
      console.error('Voice input error:', error);
      setIsListening(false);
      setInterimTranscript('');
    });

    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stop();
      }
    };
  }, []);

  const handleSend = useCallback(async () => {
    const textToSend = inputText.trim() || interimTranscript.trim();
    if (!textToSend) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: textToSend,
      timestamp: new Date(),
    };
    
    addMessage(userMessage);
    setInputText('');
    setInterimTranscript('');
    setIsTyping(true);
    
    try {
      const response = await aiService.sendMessage(textToSend);
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date(),
      };
      addMessage(aiResponse);
    } catch (error) {
      console.error('AI error:', error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: '抱歉，目前無法處理你的請求。請稍後再試。😅',
        timestamp: new Date(),
      };
      addMessage(errorResponse);
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

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const displayText = inputText || interimTranscript;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.avatar}>🐉</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>金龍</Text>
          <Text style={styles.status}>在線</Text>
        </View>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AIChatBubble message={item} />}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
        ListFooterComponent={<TypingBubble isTyping={isTyping} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👋</Text>
            <Text style={styles.emptyTitle}>你問我答</Text>
            <Text style={styles.emptyText}>
              你可以問我關於香港嘅一切！天氣、交通、搵地方...
            </Text>
            <View style={styles.quickQuestions}>
              {quickQuestions.map((q, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.quickQuestion}
                  onPress={() => handleQuickQuestion(q)}
                >
                  <Text style={styles.quickQuestionText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={[styles.micButton, isListening && styles.micButtonActive]}
            onPress={handleVoiceInput}
          >
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
          <TouchableOpacity
            style={[styles.sendButton, !displayText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!displayText.trim()}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
        {isListening && (
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>🎤 緊聽緊... 請說話</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  avatar: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  status: {
    color: colors.success,
    fontSize: 12,
  },
  messagesList: {
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  quickQuestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickQuestion: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    margin: 4,
  },
  quickQuestionText: {
    color: colors.text,
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  micButtonActive: {
    backgroundColor: colors.error + '40',
  },
  micIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceLight,
  },
  sendIcon: {
    color: colors.text,
    fontSize: 18,
  },
  listeningIndicator: {
    backgroundColor: colors.error + '20',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  listeningText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
});
