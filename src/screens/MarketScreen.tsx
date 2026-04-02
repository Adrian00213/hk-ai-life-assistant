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

const TABS = [
  { key: 'prices', label: '今日行情', emoji: '💰' },
  { key: 'markets', label: '街市資訊', emoji: '🏪' },
  { key: 'events', label: '墟市活動', emoji: '🎪' },
];

export const MarketScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('prices');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const districts = ['中西區', '東區', '南區', '九龍城區', '觀塘區', '深水埗區', '大埔區', '元朗區', '屯門區', '沙田區', '北區', '西貢區'];

  const filteredMarkets = selectedDistrict 
    ? HONG_KONG_WET_MARKETS.filter(m => m.district === selectedDistrict)
    : HONG_KONG_WET_MARKETS;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Prices Tab
  const renderPrices = () => (
    <FlatList
      data={DAILY_PRICES}
      keyExtractor={(item) => item.item}
      renderItem={({ item }) => (
        <View style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <Text style={styles.priceItem}>{item.item}</Text>
            <View style={[styles.trendBadge, { 
              backgroundColor: item.trend === 'up' ? colors.error + '20' : 
                              item.trend === 'down' ? colors.success + '20' : 
                              colors.textMuted + '20' 
            }]}>
              <Text style={[styles.trendText, { 
                color: item.trend === 'up' ? colors.error : 
                        item.trend === 'down' ? colors.success : 
                        colors.textMuted 
              }]}>
                {formatTrend(item.trend, item.trendPercent)}
              </Text>
            </View>
          </View>
          <View style={styles.priceDetails}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>平均價</Text>
              <Text style={styles.priceValue}>{formatPrice(item.avgPrice)}/{item.unit}</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>最低</Text>
              <Text style={styles.priceMin}>{formatPrice(item.minPrice)}</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>最高</Text>
              <Text style={styles.priceMax}>{formatPrice(item.maxPrice)}</Text>
            </View>
          </View>
          <View style={styles.priceFooter}>
            <Text style={styles.bestMarket}>🏆 最平：{item.bestMarket}</Text>
            <Text style={styles.updateTime}>更新：{item.lastUpdated}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListHeaderComponent={
        <View style={styles.priceInfoBanner}>
          <Text style={styles.bannerTitle}>📊 街市參考價</Text>
          <Text style={styles.bannerSubtitle}>每日更新 · 最新：{DAILY_PRICES[0]?.lastUpdated}</Text>
        </View>
      }
    />
  );

  // Markets Tab
  const renderMarkets = () => (
    <FlatList
      data={filteredMarkets}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.marketCard}>
          <View style={styles.marketHeader}>
            <View style={[styles.typeBadge, { backgroundColor: MARKET_TYPE_CONFIG[item.type]?.color + '20' }]}>
              <Text style={styles.typeIcon}>{MARKET_TYPE_CONFIG[item.type]?.icon}</Text>
              <Text style={[styles.typeLabel, { color: MARKET_TYPE_CONFIG[item.type]?.color }]}>
                {MARKET_TYPE_CONFIG[item.type]?.label}
              </Text>
            </View>
            <View style={styles.districtBadge}>
              <Text style={styles.districtText}>{item.district}</Text>
            </View>
          </View>
          <Text style={styles.marketName}>{item.name}</Text>
          <Text style={styles.marketDesc}>{item.description}</Text>
          <View style={styles.marketDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>{item.address}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🕐</Text>
              <Text style={styles.detailText}>{item.openingHours}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🏷️</Text>
              <Text style={styles.detailText}>{item.features.join(' · ')}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListHeaderComponent={
        <>
          <View style={styles.districtFilter}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.districtChip, !selectedDistrict && styles.districtChipActive]}
                onPress={() => setSelectedDistrict(null)}
              >
                <Text style={[styles.districtChipText, !selectedDistrict && styles.districtChipTextActive]}>
                  全部
                </Text>
              </TouchableOpacity>
              {districts.map((district) => (
                <TouchableOpacity
                  key={district}
                  style={[styles.districtChip, selectedDistrict === district && styles.districtChipActive]}
                  onPress={() => setSelectedDistrict(district)}
                >
                  <Text style={[styles.districtChipText, selectedDistrict === district && styles.districtChipTextActive]}>
                    {district}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.marketInfoBanner}>
            <Text style={styles.bannerTitle}>🏪 街市資訊</Text>
            <Text style={styles.bannerSubtitle}>共 {filteredMarkets.length} 個街市</Text>
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏪</Text>
          <Text style={styles.emptyText}>呢個區域暫時冇資料</Text>
        </View>
      }
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
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{item.name}</Text>
                {daysUntil <= 7 && daysUntil >= 0 && (
                  <View style={styles.soonBadge}>
                    <Text style={styles.soonText}>
                      {daysUntil === 0 ? '今日' : `${daysUntil}日後`}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.eventLocation}>
                <Text style={styles.eventLocationIcon}>📍</Text>
                <Text style={styles.eventLocationText}>{item.location} · {item.district}</Text>
              </View>
              <Text style={styles.eventDesc}>{item.description}</Text>
              <View style={styles.eventHighlight}>
                <Text style={styles.highlightText}>{item.highlight}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListHeaderComponent={
        <View style={styles.eventInfoBanner}>
          <Text style={styles.bannerTitle}>🎪 墟市活動</Text>
          <Text style={styles.bannerSubtitle}>傳統節慶 · 假日市集 · 特色墟市</Text>
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>街市雷達</Text>
        <Text style={styles.headerSubtitle}>香港街市行情 · 墟市活動</Text>
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
        {activeTab === 'prices' && renderPrices()}
        {activeTab === 'markets' && renderMarkets()}
        {activeTab === 'events' && renderEvents()}
      </View>
    </SafeAreaView>
  );
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
  // Banner styles
  priceInfoBanner: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  marketInfoBanner: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  eventInfoBanner: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  // District filter
  districtFilter: {
    marginBottom: spacing.sm,
  },
  districtChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
  },
  districtChipActive: {
    backgroundColor: colors.primary,
  },
  districtChipText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  districtChipTextActive: {
    color: colors.text,
  },
  // Price card
  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priceItem: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  trendBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceDetails: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  priceInfo: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  priceValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  priceMin: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
  priceMax: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  priceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bestMarket: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  updateTime: {
    color: colors.textMuted,
    fontSize: 11,
  },
  // Market card
  marketCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  typeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  districtBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  districtText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  marketName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  marketDesc: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  marketDetails: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  detailText: {
    color: colors.text,
    fontSize: 12,
  },
  // Event card
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
  },
  eventDate: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    alignItems: 'center',
    marginRight: spacing.md,
    minWidth: 50,
  },
  eventMonth: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  eventDay: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  soonBadge: {
    backgroundColor: colors.warning + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  soonText: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '600',
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLocationIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  eventLocationText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  eventDesc: {
    color: colors.text,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  eventHighlight: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
  },
  highlightText: {
    color: colors.primary,
    fontSize: 12,
  },
  // Empty state
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
