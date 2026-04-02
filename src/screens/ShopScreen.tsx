import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { 
  PRODUCTS, FLASH_DEALS, CATEGORIES, LIVE_STREAMERS, getStreamer,
  formatPrice, getTimeRemaining,
  Product
} from '../services/shoppingApi';

const TABS = [
  { key: 'live', label: '直播', emoji: '📺' },
  { key: 'flash', label: '閃購', emoji: '⚡' },
  { key: 'all', label: '全部', emoji: '🛍️' },
];

export const ShopScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [category, setCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const getProducts = () => {
    let products = PRODUCTS;
    if (activeTab === 'live') products = products.filter(p => p.isLive);
    else if (activeTab === 'flash') products = products.filter(p => p.isFlashDeal);
    if (category !== 'all') products = products.filter(p => p.category === category);
    return products;
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // Live Streamers Banner
  const renderLiveBanner = () => (
    <View style={styles.liveBanner}>
      <Text style={styles.liveBannerTitle}>📺 直播中</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {LIVE_STREAMERS.map(streamer => (
          <View key={streamer.id} style={styles.streamerCard}>
            <Text style={styles.streamerAvatar}>{streamer.avatar}</Text>
            <Text style={styles.streamerName}>{streamer.name}</Text>
            <Text style={styles.streamerFollowers}>{streamer.followers}</Text>
            <View style={styles.liveDot} />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Flash Deals Countdown
  const renderFlashDeals = () => (
    <View style={styles.flashSection}>
      <View style={styles.flashHeader}>
        <Text style={styles.flashTitle}>⚡ 限時閃購</Text>
        <TouchableOpacity style={styles.flashMore}>
          <Text style={styles.flashMoreText}>查看全部 ›</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {FLASH_DEALS.map(deal => {
          const time = getTimeRemaining(deal.endsAt);
          return (
            <View key={deal.id} style={styles.flashCard}>
              <View style={styles.flashBadge}>
                <Text style={styles.flashBadgeText}>-{deal.product.discount}%</Text>
              </View>
              <View style={styles.flashImagePlaceholder}>
                <Text style={styles.flashImageEmoji}>📦</Text>
              </View>
              <Text style={styles.flashName}>{deal.product.name}</Text>
              <Text style={styles.flashPrice}>{formatPrice(deal.product.currentPrice)}</Text>
              <Text style={styles.flashOriginal}>原價 {formatPrice(deal.product.originalPrice)}</Text>
              <View style={styles.countdown}>
                <Text style={styles.countdownText}>
                  {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${deal.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>已售 {deal.progress}%</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  // Product Card
  const renderProduct = (product: Product) => {
    const streamer = product.streamer ? getStreamer(product.streamer) : null;
    
    return (
      <View key={product.id} style={styles.productCard}>
        <View style={styles.productHeader}>
          <View style={styles.productImagePlaceholder}>
            <Text style={styles.productEmoji}>{product.category === '電子' ? '📱' : product.category === '美妝' ? '💄' : product.category === '運動' ? '🏃' : '📦'}</Text>
          </View>
          {product.isFlashDeal && (
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>-{product.discount}%</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productBody}>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          
          {streamer && (
            <View style={styles.streamerInfo}>
              <Text style={styles.streamerIcon}>{streamer.avatar}</Text>
              <Text style={styles.streamerLabel}>{streamer.name}</Text>
              {product.isLive && <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>● LIVE</Text></View>}
            </View>
          )}
          
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>⭐</Text>
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews})</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatPrice(product.currentPrice)}</Text>
            {product.discount > 0 && (
              <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
            )}
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={() => addToCart(product.id)}>
            <Text style={styles.addButtonText}>加入購物車</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>直播購物</Text>
          <Text style={styles.headerSubtitle}>精選直播特惠 · 限時閃購</Text>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && <View style={styles.cartBadge}><Text style={styles.cartCount}>{cartCount}</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Live Banner */}
        {renderLiveBanner()}

        {/* Flash Deals */}
        {renderFlashDeals()}

        {/* Tabs */}
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

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryChip, category === cat.key && styles.categoryChipActive]}
              onPress={() => setCategory(cat.key)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={[styles.categoryLabel, category === cat.key && styles.categoryLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {getProducts().map(renderProduct)}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '700' },
  headerSubtitle: { color: colors.textMuted, fontSize: 13 },
  cartButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  cartIcon: { fontSize: 22 },
  cartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: colors.error, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  cartCount: { color: '#fff', fontSize: 11, fontWeight: '700' },
  scrollView: { flex: 1 },
  // Live Banner
  liveBanner: { backgroundColor: colors.error + '15', paddingVertical: spacing.md, marginBottom: spacing.sm },
  liveBannerTitle: { color: colors.error, fontSize: 16, fontWeight: '700', paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  streamerCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', marginLeft: spacing.md, width: 80 },
  streamerAvatar: { fontSize: 32, marginBottom: 4 },
  streamerName: { color: colors.text, fontSize: 12, fontWeight: '600' },
  streamerFollowers: { color: colors.textMuted, fontSize: 10 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error, marginTop: 4 },
  // Flash Deals
  flashSection: { marginBottom: spacing.md },
  flashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  flashTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  flashMore: {},
  flashMoreText: { color: colors.primary, fontSize: 13 },
  flashCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginLeft: spacing.md, width: 140 },
  flashBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: colors.error, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  flashBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  flashImagePlaceholder: { height: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm, marginBottom: spacing.sm },
  flashImageEmoji: { fontSize: 32 },
  flashName: { color: colors.text, fontSize: 12, fontWeight: '500', marginBottom: 4 },
  flashPrice: { color: colors.error, fontSize: 15, fontWeight: '700' },
  flashOriginal: { color: colors.textMuted, fontSize: 11, textDecorationLine: 'line-through' },
  countdown: { backgroundColor: colors.secondary, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginVertical: 4 },
  countdownText: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  progressBar: { height: 4, backgroundColor: colors.surfaceLight, borderRadius: 2, marginTop: 8 },
  progressFill: { height: '100%', backgroundColor: colors.error, borderRadius: 2 },
  progressText: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  // Tabs
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm, borderRadius: borderRadius.sm, backgroundColor: colors.surface, marginHorizontal: 4 },
  tabActive: { backgroundColor: colors.primary },
  tabEmoji: { fontSize: 16, marginRight: 4 },
  tabLabel: { color: colors.textMuted, fontSize: 13 },
  tabLabelActive: { color: colors.text },
  // Category
  categoryScroll: { paddingHorizontal: spacing.md, marginBottom: spacing.md },
  categoryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.xl, marginRight: spacing.sm },
  categoryChipActive: { backgroundColor: colors.primary },
  categoryEmoji: { fontSize: 14, marginRight: 4 },
  categoryLabel: { color: colors.textMuted, fontSize: 12 },
  categoryLabelActive: { color: colors.text },
  // Products
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.sm },
  productCard: { width: '50%', paddingHorizontal: spacing.xs, marginBottom: spacing.md },
  productHeader: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.md, borderTopRightRadius: borderRadius.md, position: 'relative' },
  productImagePlaceholder: { height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceLight },
  productEmoji: { fontSize: 48 },
  dealBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: colors.error, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  dealBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  productBody: { backgroundColor: colors.surface, borderBottomLeftRadius: borderRadius.md, borderBottomRightRadius: borderRadius.md, padding: spacing.sm },
  productName: { color: colors.text, fontSize: 13, fontWeight: '500', marginBottom: 4, height: 36 },
  streamerInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  streamerIcon: { fontSize: 12, marginRight: 4 },
  streamerLabel: { color: colors.textMuted, fontSize: 11, flex: 1 },
  liveBadge: { backgroundColor: colors.error + '20', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  liveBadgeText: { color: colors.error, fontSize: 9, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  stars: { fontSize: 11 },
  rating: { color: colors.text, fontSize: 11, fontWeight: '600', marginLeft: 2 },
  reviews: { color: colors.textMuted, fontSize: 11, marginLeft: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  currentPrice: { color: colors.error, fontSize: 16, fontWeight: '700' },
  originalPrice: { color: colors.textMuted, fontSize: 11, textDecorationLine: 'line-through', marginLeft: 6 },
  addButton: { backgroundColor: colors.primary, borderRadius: borderRadius.sm, paddingVertical: 8, alignItems: 'center' },
  addButtonText: { color: colors.text, fontSize: 12, fontWeight: '600' },
});
