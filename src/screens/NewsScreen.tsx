import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme/colors';
import { fetchHKNews, fetchPropertyTransactions, fetchUpcomingIPOs, formatHKPrice, formatSize } from '../services/newsApi';

const TABS = [
  { key: 'news', label: '香港頭條', emoji: '📰' },
  { key: 'property', label: '樓市成交', emoji: '🏠' },
  { key: 'ipo', label: '新股IPO', emoji: '📈' },
];

export const NewsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [ipos, setipos] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [newsData, propertyData, ipoData] = await Promise.all([
        fetchHKNews(),
        fetchPropertyTransactions(),
        fetchUpcomingIPOs(),
      ]);
      setNews(newsData);
      setProperties(propertyData);
      setipos(ipoData);
    } catch (error) {
      console.error('Failed to load news data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderNews = () => (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.newsCard}>
          <View style={styles.newsHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
              <Text style={styles.categoryText}>{getCategoryLabel(item.category)}</Text>
            </View>
            {item.isHot && <Text style={styles.hotBadge}>🔥</Text>}
            <Text style={styles.newsTime}>{item.publishedAt}</Text>
          </View>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsSummary}>{item.summary}</Text>
          <Text style={styles.newsSource}>{item.source}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListEmptyComponent={
        loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>載入中...</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>暫時冇資訊</Text>
          </View>
        )
      }
    />
  );

  const renderProperties = () => (
    <FlatList
      data={properties}
      keyExtractor={(item, index) => `${item.address}_${index}`}
      renderItem={({ item }) => (
        <View style={styles.propertyCard}>
          <View style={styles.propertyHeader}>
            <Text style={styles.propertyDistrict}>{item.district}</Text>
            <Text style={styles.propertyDate}>{item.date}</Text>
          </View>
          <Text style={styles.propertyAddress}>{item.address}</Text>
          <View style={styles.propertyDetails}>
            <View style={styles.propertyPrice}>
              <Text style={styles.priceLabel}>成交價</Text>
              <Text style={styles.priceValue}>{formatHKPrice(item.price)}</Text>
            </View>
            <View style={styles.propertySize}>
              <Text style={styles.sizeLabel}>面積</Text>
              <Text style={styles.sizeValue}>{formatSize(item.size)}</Text>
            </View>
            <View style={styles.propertyUnit}>
              <Text style={styles.unitLabel}>呎價</Text>
              <Text style={styles.unitValue}>${item.pricePerSqft.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏠</Text>
          <Text style={styles.emptyText}>暫時冇成交記錄</Text>
        </View>
      }
    />
  );

  const renderIPOs = () => (
    <FlatList
      data={ipos}
      keyExtractor={(item) => item.code}
      renderItem={({ item }) => (
        <View style={styles.ipoCard}>
          <View style={styles.ipoHeader}>
            <View>
              <Text style={styles.ipoName}>{item.name}</Text>
              <Text style={styles.ipoCode}>股份代號：{item.code}</Text>
            </View>
            <View style={[styles.ipoStatus, { backgroundColor: getIPOStatusColor(item.status) }]}>
              <Text style={styles.ipoStatusText}>{getIPOStatusLabel(item.status)}</Text>
            </View>
          </View>
          <View style={styles.ipoDetails}>
            <View style={styles.ipoDetail}>
              <Text style={styles.ipoDetailLabel}>上市日期</Text>
              <Text style={styles.ipoDetailValue}>{item.listingDate}</Text>
            </View>
            <View style={styles.ipoDetail}>
              <Text style={styles.ipoDetailLabel}>招股價</Text>
              <Text style={styles.ipoDetailValue}>{item.priceRange}</Text>
            </View>
            <View style={styles.ipoDetail}>
              <Text style={styles.ipoDetailLabel}>一手入場</Text>
              <Text style={styles.ipoDetailValue}>{item.minLot}股</Text>
            </View>
          </View>
          <View style={styles.ipoHighlight}>
            <Text style={styles.highlightLabel}>亮點</Text>
            <Text style={styles.highlightText}>{item.highlight}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📈</Text>
          <Text style={styles.emptyText}>暫時冇新股資訊</Text>
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>資訊中心</Text>
        <Text style={styles.headerSubtitle}>香港最新資訊一手掌握</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'news' && renderNews()}
        {activeTab === 'property' && renderProperties()}
        {activeTab === 'ipo' && renderIPOs()}
      </View>
    </SafeAreaView>
  );
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    local: '#FF6B35',
    finance: '#FFD93D',
    property: '#4ADE80',
    ipo: '#6ABFE4',
    lifestyle: '#A0A0B0',
    international: '#8E258D',
  };
  return colors[category] || '#A0A0B0';
};

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    local: '本地',
    finance: '財經',
    property: '樓市',
    ipo: 'IPO',
    lifestyle: '生活',
    international: '國際',
  };
  return labels[category] || category;
};

const getIPOStatusColor = (status: string): string => {
  switch (status) {
    case 'Open': return colors.success + '30';
    case 'Upcoming': return colors.warning + '30';
    case 'Closed': return colors.textMuted + '30';
    case 'Listed': return colors.primary + '30';
    default: return colors.surface;
  }
};

const getIPOStatusLabel = (status: string): string => {
  switch (status) {
    case 'Open': return '認購中';
    case 'Upcoming': return '待上市';
    case 'Closed': return '認購截止';
    case 'Listed': return '已上市';
    default: return status;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  tabLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  newsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  hotBadge: {
    marginLeft: spacing.xs,
  },
  newsTime: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: 'auto',
  },
  newsTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  newsSummary: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  newsSource: {
    color: colors.textMuted,
    fontSize: 12,
  },
  propertyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  propertyDistrict: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  propertyDate: {
    color: colors.textMuted,
    fontSize: 12,
  },
  propertyAddress: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  propertyDetails: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  propertyPrice: {
    flex: 1,
    alignItems: 'center',
  },
  propertySize: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.surface,
  },
  propertyUnit: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.surface,
  },
  priceLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  priceValue: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
  sizeLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  sizeValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  unitLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  unitValue: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  ipoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  ipoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  ipoName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  ipoCode: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  ipoStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  ipoStatusText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  ipoDetails: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  ipoDetail: {
    flex: 1,
    alignItems: 'center',
  },
  ipoDetailLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  ipoDetailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  ipoHighlight: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  highlightLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  highlightText: {
    color: colors.text,
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
