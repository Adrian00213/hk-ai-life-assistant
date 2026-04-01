import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransportCard } from '../components';
import { colors, spacing, borderRadius } from '../theme/colors';
import { TransportRoute } from '../types';

const mockRoutes: TransportRoute[] = [
  {
    id: '1',
    name: '荃灣線',
    line: 'mtr',
    lineName: '荃灣線',
    lineColor: '#BA0C2F',
    origin: '中環',
    destination: '荃灣',
    nextArrival: 2,
    secondArrival: 7,
    status: 'normal',
  },
  {
    id: '2',
    name: '觀塘線',
    line: 'mtr',
    lineName: '觀塘線',
    lineColor: '#8E258D',
    origin: '調景嶺',
    destination: '黃埔',
    nextArrival: 4,
    secondArrival: 9,
    status: 'normal',
  },
  {
    id: '3',
    name: '東涌線',
    line: 'mtr',
    lineName: '東涌線',
    lineColor: '#6ABFE4',
    origin: '香港',
    destination: '東涌',
    nextArrival: 6,
    status: 'delayed',
  },
  {
    id: '4',
    name: '城巴25A',
    line: 'bus',
    origin: '數碼港',
    destination: '中環',
    nextArrival: 3,
    secondArrival: 15,
    status: 'normal',
  },
];

const popularRoutes: { from: string; to: string }[] = [
  { from: '中環', to: '尖沙咀' },
  { from: '旺角', to: '中環' },
  { from: '觀塘', to: '香港' },
  { from: '將軍澳', to: '油塘' },
  { from: '沙田', to: '中環' },
];

export const TransportScreen: React.FC = () => {
  const [routes] = useState<TransportRoute[]>(mockRoutes);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>交通</Text>
        <Text style={styles.subtitle}>即時到站</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索站點或路線..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.popularRoutes}>
        <Text style={styles.sectionLabel}>熱門路線</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularRoutes.map((route, index) => (
            <TouchableOpacity key={index} style={styles.routeChip}>
              <Text style={styles.routeChipText}>{route.from} → {route.to}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚇 港鐵</Text>
          {routes.filter(r => r.line === 'mtr').map(route => (
            <TransportCard key={route.id} route={route} />
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚌 巴士</Text>
          {routes.filter(r => r.line === 'bus').map(route => (
            <TransportCard key={route.id} route={route} />
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚐 小巴 (即將支援)</Text>
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonText}>MTR Open API 申請中...</Text>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
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
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: spacing.md,
  },
  popularRoutes: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  routeChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
  },
  routeChipText: {
    color: colors.text,
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  comingSoon: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  comingSoonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
