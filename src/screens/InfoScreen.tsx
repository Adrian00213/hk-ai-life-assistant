import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme/colors';
import { 
  HONG_KONG_WET_MARKETS, 
  DAILY_PRICES, 
  MARKET_EVENTS, 
  MARKET_TYPE_CONFIG,
  formatPrice,
  formatTrend,
  Market
} from '../services/marketApi';
import { fetchHKNews } from '../services/newsApi';

const TABS = [
  { key: 'markets', label: '街市', emoji: '🏪' },
  { key: 'prices', label: '行情', emoji: '💰' },
  { key: 'places', label: '地方', emoji: '📍' },
  { key: 'events', label: '活動', emoji: '🎪' },
  { key: 'news', label: '資訊', emoji: '📰' },
];

// Hidden places data
const HIDDEN_PLACES = [
  { id: '1', name: '科記咖啡茶廳', category: 'food', neighborhood: '旺角', rating: 4.8, tags: ['茶餐廳', '豬扒包'] },
  { id: '2', name: '西環泳棚', category: 'hidden', neighborhood: '西環', rating: 4.6, tags: ['打卡', '日落'] },
  { id: '3', name: '彩虹邨', category: 'hidden', neighborhood: '彩虹', rating: 4.5, tags: ['公屋', '打卡'] },
  { id: '4', name: '鶴藪水塘', category: 'nature', neighborhood: '西貢', rating: 4.7, tags: ['行山', '水塘'] },
];

export const InfoScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetchHKNews().then(setNews);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Markets Tab
  const renderMarkets = () => (
    <FlatList
      data={HONG_KONG_WET_MARKETS.slice(0, 10)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.typeBadge, { backgroundColor: MARKET_TYPE_CONFIG[item.type]?.color + '20' }]}>
              <Text style={styles.typeIcon}>{MARKET_TYPE_CONFIG[item.type]?.icon}</Text>
            </View>
            <Text style={styles.district}>{item.district}</Text>
          </View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.hours}>🕐 {item.openingHours}</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    />
  );

  // Prices Tab
  const renderPrices = () => (
    <FlatList
      data={DAILY_PRICES}
      keyExtractor={(item) => item.item}
      renderItem={({ item }) => (
        <View style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <Text style={styles.priceItem}>{item.item}</Text>
            <View style={[styles.trendBadge, { backgroundColor: item.trend === 'up' ? colors.error + '20' : item.trend === 'down' ? colors.success + '20' : colors.textMuted + '20' }]}>
              <Text style={[styles.trendText, { color: item.trend === 'up' ? colors.error : item.trend === 'down' ? colors.success : colors.textMuted }]}>
                {formatTrend(item.trend, item.trendPercent)}
              </Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>平均</Text>
              <Text style={styles.priceAvg}>{formatPrice(item.avgPrice)}</Text>
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>最平</Text>
              <Text style={styles.priceBest}>{formatPrice(item.minPrice)}</Text>
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>最貴</Text>
              <Text style={styles.priceHigh}>{formatPrice(item.maxPrice)}</Text>
            </View>
          </View>
          <Text style={styles.bestMarket}>🏆 {item.bestMarket}</Text>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    />
  );

  // Places Tab (Hidden places)
  const renderPlaces = () => (
    <FlatList
      data={HIDDEN_PLACES}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryEmoji}>
                {item.category === 'food' ? '🍜' : item.category === 'nature' ? '🌳' : '🔮'}
              </Text>
            </View>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.tags}>
            {item.tags.map((tag, i) => (
              <View key={i} style={styles.tag}><Text style={styles.tagText}>#{tag}</Text></View>
            ))}
          </View>
          <Text style={styles.location}>📍 {item.neighborhood}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    />
  );

  // Events Tab
  const renderEvents = () => (
    <FlatList
      data={MARKET_EVENTS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const eventDate = new Date(item.date);
        const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return (
          <TouchableOpacity style={styles.eventCard}>
            <View style={styles.eventDate}>
              <Text style={styles.eventMonth}>{eventDate.getMonth() + 1}月</Text>
              <Text style={styles.eventDay}>{eventDate.getDate()}</Text>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventLocation}>📍 {item.location} · {item.district}</Text>
              <Text style={styles.eventHighlight}>{item.highlight}</Text>
              {daysUntil <= 7 && daysUntil >= 0 && (
                <View style={styles.soonBadge}>
                  <Text style={styles.soonText}>{daysUntil === 0 ? '今日' : `${daysUntil}日後`}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    />
  );

  // News Tab
  const renderNews = () => (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.newsCard}>
          <View style={styles.newsHeader}>
            <View style={styles.newsBadge}>
              <Text style={styles.newsBadgeText}>{item.category === 'local' ? '本地' : item.category === 'finance' ? '財經' : '其他'}</Text>
            </View>
            {item.isHot && <Text style={styles.hotBadge}>🔥</Text>}
            <Text style={styles.newsTime}>{item.publishedAt}</Text>
          </View>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsSource}>{item.source}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>資訊總覽</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
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

      <View style={styles.content}>
        {activeTab === 'markets' && renderMarkets()}
        {activeTab === 'prices' && renderPrices()}
        {activeTab === 'places' && renderPlaces()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'news' && renderNews()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '700' },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.sm, marginBottom: spacing.sm },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: borderRadius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabEmoji: { fontSize: 18, marginBottom: 2 },
  tabLabel: { color: colors.textMuted, fontSize: 11 },
  tabLabelActive: { color: colors.text },
  content: { flex: 1 },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: 100 },
  // Card styles
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  typeBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  typeIcon: { fontSize: 14 },
  district: { color: colors.textMuted, fontSize: 12 },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  cardDesc: { color: colors.textMuted, fontSize: 12, marginBottom: spacing.xs },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  hours: { color: colors.textMuted, fontSize: 11 },
  rating: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  categoryBadge: { backgroundColor: colors.surfaceLight, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  categoryEmoji: { fontSize: 16 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.xs },
  tag: { backgroundColor: colors.surfaceLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 4, marginRight: 4 },
  tagText: { color: colors.textMuted, fontSize: 10 },
  location: { color: colors.textMuted, fontSize: 12 },
  // Price styles
  priceCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  priceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  priceItem: { color: colors.text, fontSize: 15, fontWeight: '600' },
  trendBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  trendText: { fontSize: 12, fontWeight: '600' },
  priceRow: { flexDirection: 'row', backgroundColor: colors.surfaceLight, borderRadius: borderRadius.sm, padding: spacing.sm, marginBottom: spacing.xs },
  priceCol: { flex: 1, alignItems: 'center' },
  priceLabel: { color: colors.textMuted, fontSize: 11 },
  priceAvg: { color: colors.accent, fontSize: 18, fontWeight: '700' },
  priceBest: { color: colors.success, fontSize: 16, fontWeight: '600' },
  priceHigh: { color: colors.error, fontSize: 16, fontWeight: '600' },
  bestMarket: { color: colors.primary, fontSize: 12 },
  // Event styles
  eventCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row' },
  eventDate: { backgroundColor: colors.primary + '20', borderRadius: borderRadius.sm, padding: spacing.sm, alignItems: 'center', marginRight: spacing.md, minWidth: 50 },
  eventMonth: { color: colors.primary, fontSize: 11, fontWeight: '600' },
  eventDay: { color: colors.primary, fontSize: 22, fontWeight: '700' },
  eventContent: { flex: 1 },
  eventName: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  eventLocation: { color: colors.textMuted, fontSize: 11, marginBottom: 4 },
  eventHighlight: { color: colors.primary, fontSize: 12 },
  soonBadge: { backgroundColor: colors.warning + '30', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  soonText: { color: colors.warning, fontSize: 11, fontWeight: '600' },
  // News styles
  newsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  newsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  newsBadge: { backgroundColor: colors.primary + '30', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 4 },
  newsBadgeText: { color: colors.primary, fontSize: 10, fontWeight: '600' },
  hotBadge: { marginLeft: 4 },
  newsTime: { color: colors.textMuted, fontSize: 11, marginLeft: 'auto' },
  newsTitle: { color: colors.text, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  newsSource: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
});
