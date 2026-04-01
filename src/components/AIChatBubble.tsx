import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { ChatMessage } from '../types';

interface AIChatBubbleProps {
  message: ChatMessage;
}

export const AIChatBubble: React.FC<AIChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🐉</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.content, isUser && styles.userContent]}>{message.content}</Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

interface TypingBubbleProps {
  isTyping: boolean;
}

export const TypingBubble: React.FC<TypingBubbleProps> = ({ isTyping }) => {
  if (!isTyping) return null;
  
  return (
    <View style={[styles.container, styles.assistantContainer]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>🐉</Text>
      </View>
      <View style={[styles.bubble, styles.assistantBubble]}>
        <View style={styles.typingIndicator}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  content: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  userContent: {
    // Same as content for user
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});
