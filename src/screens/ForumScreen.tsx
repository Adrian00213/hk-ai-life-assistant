import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme/colors';
import { ForumPost, ForumComment } from '../types';
import { forumService } from '../services';

const CATEGORIES = [
  { key: 'all', label: '全部', emoji: '✨' },
  { key: 'investment', label: '投資', emoji: '📈' },
  { key: 'food', label: '美食', emoji: '🍜' },
  { key: 'transport', label: '交通', emoji: '🚌' },
  { key: 'lifestyle', label: '生活', emoji: '🌴' },
  { key: 'general', label: '吹水', emoji: '💬' },
];

const MOCK_USER = {
  id: 'user_001',
  name: 'Adrian',
  avatar: '😎',
};

export const ForumScreen: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<ForumPost['category']>('general');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Load AI-generated initial posts
    const initialPosts = forumService.generateAIPosts();
    setPosts(initialPosts);
  }, []);

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: `user_post_${Date.now()}`,
      authorId: MOCK_USER.id,
      authorName: MOCK_USER.name,
      authorAvatar: MOCK_USER.avatar,
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      createdAt: new Date(),
      likes: 0,
      comments: [],
      isPinned: false,
      isAI: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPost(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const comment: ForumComment = {
      id: `comment_${Date.now()}`,
      authorId: MOCK_USER.id,
      authorName: MOCK_USER.name,
      content: newComment,
      createdAt: new Date(),
      likes: 0,
    };

    const updatedPosts = posts.map(p => {
      if (p.id === selectedPost.id) {
        return { ...p, comments: [...p.comments, comment] };
      }
      return p;
    });

    setPosts(updatedPosts);
    setSelectedPost({ ...selectedPost, comments: [...selectedPost.comments, comment] });
    setNewComment('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return '剛剛';
    if (hours < 24) return `${hours}小時前`;
    return `${days}日前`;
  };

  const renderPost = ({ item }: { item: ForumPost }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => setSelectedPost(item)}
      activeOpacity={0.8}
    >
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorAvatar}>{item.authorAvatar}</Text>
          <View>
            <View style={styles.authorRow}>
              <Text style={styles.authorName}>{item.authorName}</Text>
              {item.isAI && <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>}
            </View>
            <Text style={styles.postTime}>{formatTime(item.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '30' }]}>
          <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
            {CATEGORIES.find(c => c.key === item.category)?.emoji}
          </Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>{item.content}</Text>

      <View style={styles.postFooter}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statText}>{item.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💬</Text>
          <Text style={styles.statText}>{item.comments.length}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPostDetail = () => {
    if (!selectedPost) return null;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedPost(null)}>
            <Text style={styles.backButton}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>帖子</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.detailCard}>
            <View style={styles.postHeader}>
              <View style={styles.authorInfo}>
                <Text style={styles.authorAvatar}>{selectedPost.authorAvatar}</Text>
                <View>
                  <View style={styles.authorRow}>
                    <Text style={styles.authorName}>{selectedPost.authorName}</Text>
                    {selectedPost.isAI && <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>}
                  </View>
                  <Text style={styles.postTime}>{formatTime(selectedPost.createdAt)}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.detailTitle}>{selectedPost.title}</Text>
            <Text style={styles.detailContent}>{selectedPost.content}</Text>

            <View style={styles.detailFooter}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>❤️</Text>
                <Text style={styles.actionText}>{selectedPost.likes}</Text>
              </TouchableOpacity>
              <View style={styles.actionButton}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>{selectedPost.comments.length}</Text>
              </View>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>留言 ({selectedPost.comments.length})</Text>

            {selectedPost.comments.map(comment => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAvatar}>
                    {comment.authorId.startsWith('bot_') ? '🤖' : MOCK_USER.avatar}
                  </Text>
                  <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                  <Text style={styles.commentTime}>{formatTime(comment.createdAt)}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
                <TouchableOpacity style={styles.likeButton}>
                  <Text style={styles.likeIcon}>👍</Text>
                  <Text style={styles.likeCount}>{comment.likes}</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addComment}>
              <TextInput
                style={styles.commentInput}
                placeholder="寫下你的想法..."
                placeholderTextColor={colors.textMuted}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  if (selectedPost) {
    return renderPostDetail();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>討論區</Text>
        <TouchableOpacity style={styles.newPostButton} onPress={() => setShowNewPost(true)}>
          <Text style={styles.newPostIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {showNewPost && (
        <View style={styles.newPostForm}>
          <TextInput
            style={styles.titleInput}
            placeholder="標題"
            placeholderTextColor={colors.textMuted}
            value={newPostTitle}
            onChangeText={setNewPostTitle}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="分享你嘅想法..."
            placeholderTextColor={colors.textMuted}
            value={newPostContent}
            onChangeText={setNewPostContent}
            multiline
          />
          <View style={styles.categorySelector}>
            {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryChip,
                  newPostCategory === cat.key && styles.categoryChipActive
                ]}
                onPress={() => setNewPostCategory(cat.key as ForumPost['category'])}
              >
                <Text style={styles.categoryChipText}>{cat.emoji} {cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowNewPost(false)}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleCreatePost}>
              <Text style={styles.submitText}>發佈</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.categories}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.catChip,
                selectedCategory === cat.key && styles.catChipActive
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text style={styles.catChipText}>{cat.emoji} {cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.postList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    investment: '#FFD93D',
    food: '#FF6B35',
    transport: '#6ABFE4',
    lifestyle: '#4ADE80',
    general: '#A0A0B0',
  };
  return colors[category] || '#A0A0B0';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  backButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  newPostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPostIcon: {
    fontSize: 18,
  },
  categories: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  catChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
  },
  catChipActive: {
    backgroundColor: colors.primary,
  },
  catChipText: {
    color: colors.text,
    fontSize: 14,
  },
  postList: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  aiBadge: {
    backgroundColor: colors.primary + '40',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  aiBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  postTime: {
    color: colors.textMuted,
    fontSize: 12,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: 16,
  },
  postTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  postContent: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    paddingTop: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  newPostForm: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  titleInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  contentInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: 14,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: spacing.sm,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  categoryChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    color: colors.text,
    fontSize: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  cancelText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  submitText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  detailContent: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  detailFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    paddingTop: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  actionText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  commentsSection: {
    paddingHorizontal: spacing.md,
  },
  commentsTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  commentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  commentAvatar: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  commentAuthor: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  commentTime: {
    color: colors.textMuted,
    fontSize: 11,
  },
  commentContent: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  likeIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  likeCount: {
    color: colors.textMuted,
    fontSize: 12,
  },
  addComment: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    color: colors.text,
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendIcon: {
    color: colors.text,
    fontSize: 16,
  },
});
