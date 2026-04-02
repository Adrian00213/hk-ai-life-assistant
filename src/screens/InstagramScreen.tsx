import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { GIRLFRIEND, generatePosts, getDailyQuote, formatTimeAgo, InstagramPost } from '../services/girlfriendApi';

export const InstagramScreen: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  useEffect(() => {
    setPosts(generatePosts(12));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(generatePosts(12));
      setRefreshing(false);
    }, 1000);
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}萬`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Profile Header
  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileMain}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{GIRLFRIEND.avatar}</Text>
          <View style={styles.ringIcon}>💕</View>
        </View>
        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>帖子</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2.8萬</Text>
            <Text style={styles.statLabel}>粉絲</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>386</Text>
            <Text style={styles.statLabel}>追蹤中</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{GIRLFRIEND.nameCn}</Text>
        <Text style={styles.profileBio}>{GIRLFRIEND.bio}</Text>
        <View style={styles.profileMeta}>
          <Text style={styles.metaText}>🎂 {GIRLFRIEND.birthday}</Text>
          <Text style={styles.metaText}>📍 香港</Text>
          <Text style={styles.metaText}>♌ {GIRLFRIEND.zodiac}</Text>
        </View>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteIcon}>✨</Text>
          <Text style={styles.quoteText}>{getDailyQuote()}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>追蹤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>發訊息</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartButton}>
          <Text style={styles.heartIcon}>💕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Story Highlight
  const Stories = () => (
    <View style={styles.storiesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.storyItem}>
          <View style={styles.storyRing}>
            <View style={styles.storyAvatar}>
              <Text style={styles.storyEmoji}>🌟</Text>
            </View>
          </View>
          <Text style={styles.storyLabel}>精選</Text>
        </View>
        <View style={styles.storyItem}>
          <View style={[styles.storyRing, styles.storyRingActive]}>
            <View style={styles.storyAvatar}>
              <Text style={styles.storyEmoji}>🍜</Text>
            </View>
          </View>
          <Text style={styles.storyLabel}>美食</Text>
        </View>
        <View style={styles.storyItem}>
          <View style={[styles.storyRing, styles.storyRingActive]}>
            <View style={styles.storyAvatar}>
              <Text style={styles.storyEmoji}>✈️</Text>
            </View>
          </View>
          <Text style={styles.storyLabel}>旅行</Text>
        </View>
        <View style={styles.storyItem}>
          <View style={[styles.storyRing, styles.storyRingActive]}>
            <View style={styles.storyAvatar}>
              <Text style={styles.storyEmoji}>☕</Text>
            </View>
          </View>
          <Text style={styles.storyLabel}>Café</Text>
        </View>
        <View style={styles.storyItem}>
          <View style={[styles.storyRing, styles.storyRingActive]}>
            <View style={styles.storyAvatar}>
              <Text style={styles.storyEmoji}>🧘‍♀️</Text>
            </View>
          </View>
          <Text style={styles.storyLabel}>Yoga</Text>
        </View>
      </ScrollView>
    </View>
  );

  // Post Item
  const PostItem = ({ post }: { post: InstagramPost }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <View style={styles.postAvatar}>
            <Text style={styles.postAvatarText}>{GIRLFRIEND.avatar}</Text>
          </View>
          <View>
            <Text style={styles.postUsername}>{GIRLFRIEND.nameCn}</Text>
            <Text style={styles.postLocation}>{post.location}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.postMore}>⋮</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.postImage} onPress={() => setSelectedPost(post)}>
        <View style={styles.postImagePlaceholder}>
          <Text style={styles.postImageEmoji}>{post.imageUrl}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>✈️</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.actionEmoji}>🔖</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postLikes}>
        <Text style={styles.likesCount}>❤️ {formatNumber(post.likes)} 個讚好</Text>
      </View>

      <View style={styles.postCaption}>
        <Text style={styles.captionUsername}>{GIRLFRIEND.nameCn}</Text>
        <Text style={styles.captionText}> {post.caption}</Text>
      </View>
      
      <View style={styles.postHashtags}>
        {post.hashtags.map((tag, i) => (
          <Text key={i} style={styles.hashtag}>{tag}</Text>
        ))}
      </View>

      <Text style={styles.postTime}>{formatTimeAgo(post.postedAt)}</Text>
    </View>
  );

  // Bottom Nav
  const BottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>🏠</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>🔍</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>➕</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>💬</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>👤</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerIcon}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{GIRLFRIEND.nameCn} 💕</Text>
        <TouchableOpacity>
          <Text style={styles.headerIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <ProfileHeader />
            <Stories />
          </>
        }
        renderItem={({ item }) => <PostItem post={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.feed}
        ListFooterComponent={<View style={{ height: 80 }} />}
      />

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  headerIcon: { color: colors.text, fontSize: 24 },
  feed: { paddingBottom: spacing.lg },
  // Profile Header
  profileHeader: { padding: spacing.md },
  profileMain: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatarContainer: { position: 'relative' },
  avatar: { fontSize: 80 },
  ringIcon: { position: 'absolute', bottom: 0, right: -5, fontSize: 20 },
  profileStats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginLeft: spacing.lg },
  statItem: { alignItems: 'center' },
  statNumber: { color: colors.text, fontSize: 18, fontWeight: '700' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  profileInfo: { marginBottom: spacing.md },
  profileName: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  profileBio: { color: colors.text, fontSize: 13, lineHeight: 18, whiteSpace: 'pre-line' },
  profileMeta: { flexDirection: 'row', marginTop: spacing.sm },
  metaText: { color: '#8a8a8a', fontSize: 12, marginRight: spacing.md },
  quoteBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: spacing.sm, borderRadius: borderRadius.sm, marginTop: spacing.sm },
  quoteIcon: { fontSize: 14, marginRight: spacing.xs },
  quoteText: { color: colors.text, fontSize: 13, fontStyle: 'italic' },
  actionButtons: { flexDirection: 'row', marginTop: spacing.md },
  followButton: { flex: 1, backgroundColor: '#3897f0', paddingVertical: spacing.sm, borderRadius: borderRadius.sm, alignItems: 'center', marginRight: spacing.xs },
  followButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  messageButton: { flex: 1, backgroundColor: '#333', paddingVertical: spacing.sm, borderRadius: borderRadius.sm, alignItems: 'center', marginRight: spacing.xs },
  messageButtonText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  heartButton: { width: 44, backgroundColor: '#333', borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  heartIcon: { fontSize: 18 },
  // Stories
  storiesContainer: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#333' },
  storyItem: { alignItems: 'center', marginHorizontal: spacing.sm },
  storyRing: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#333', padding: 2, marginBottom: 4 },
  storyRingActive: { borderColor: '#3897f0' },
  storyAvatar: { width: '100%', height: '100%', borderRadius: 30, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  storyEmoji: { fontSize: 28 },
  storyLabel: { color: colors.text, fontSize: 11 },
  // Post
  post: { backgroundColor: '#000', marginBottom: spacing.md },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm },
  postHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  postAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  postAvatarText: { fontSize: 20 },
  postUsername: { color: colors.text, fontSize: 14, fontWeight: '600' },
  postLocation: { color: colors.textMuted, fontSize: 12 },
  postMore: { color: colors.text, fontSize: 20 },
  postImage: {},
  postImagePlaceholder: { height: 300, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  postImageEmoji: { fontSize: 80 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm },
  postActionsLeft: { flexDirection: 'row' },
  actionIcon: { marginRight: spacing.md },
  actionEmoji: { fontSize: 24 },
  postLikes: { paddingHorizontal: spacing.sm },
  likesCount: { color: colors.text, fontSize: 14, fontWeight: '600' },
  postCaption: { flexDirection: 'row', paddingHorizontal: spacing.sm, marginTop: spacing.xs },
  captionUsername: { color: colors.text, fontSize: 14, fontWeight: '600' },
  captionText: { color: colors.text, fontSize: 14 },
  postHashtags: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.sm, marginTop: spacing.xs },
  hashtag: { color: '#3897f0', fontSize: 13, marginRight: spacing.xs },
  postTime: { color: '#8a8a8a', fontSize: 11, paddingHorizontal: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.sm },
  // Bottom Nav
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: '#333', position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000' },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 24 },
});
