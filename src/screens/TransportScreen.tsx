import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransportCard } from '../components';
import { colors, spacing, borderRadius } from '../theme/colors';
import { TransportRoute } from '../types';
import { MTR_LINE_CODES, POPULAR_MTR_ROUTES, getDestName } from '../services/mtrApi';

// Mock data for bus routes (since bus API requires more complex setup)
const MOCK_BUS_ROUTES: TransportRoute[] = [
  {
    id: 'bus_1',
    name: '城巴 25A',
    line: 'bus',
    origin: '數碼港',
    destination: '中環',
    nextArrival: 5,
    secondArrival: 12,
    status: 'normal',
  },
  {
    id: 'bus_2',
    name: '九巴 270A',
    line: 'bus',
    origin: '上水',
    destination: '中環',
    nextArrival: 8,
    status: 'normal',
  },
];

// Default routes to show
const DEFAULT_ROUTES: TransportRoute[] = [
  {
    id: 'default_1',
    name: '荃灣線',
    line: 'mtr',
    lineName: '荃灣線',
    lineColor: '#BA0C2F',
    origin: '中環',
    destination: '荃灣',
    nextArrival: 0,
    secondArrival: 0,
    status: 'normal',
  },
  {
    id: 'default_2',
    name: '觀塘線',
    line: 'mtr',
    lineName: '觀塘線',
    lineColor: '#8E258D',
    origin: '旺角',
    destination: '觀塘',
    nextArrival: 0,
    secondArrival: 0,
    status: 'normal',
  },
  {
    id: 'default_3',
    name: '東涌線',
    line: 'mtr',
    lineName: '東涌線',
    lineColor: '#6ABFE4',
    origin: '香港',
    destination: '東涌',
    nextArrival: 0,
    secondArrival: 0,
    status: 'normal',
  },
];

export const TransportScreen: React.FC = () => {
  const [routes, setRoutes] = useState<TransportRoute[]>(DEFAULT_ROUTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real MTR data
  const fetchRealTimeData = useCallback(async () => {
    setError(null);
    const updatedRoutes: TransportRoute[] = [];

    for (const route of DEFAULT_ROUTES) {
      if (route.line === 'mtr') {
        // Find matching MTR route
        const mtrRoute = POPULAR_MTR_ROUTES.find(
          r => r.name === route.lineName && 
               (r.stationName === route.origin || r.stationName === route.destination)
        );

        if (mtrRoute) {
          try {
            const response = await fetch(
              `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${mtrRoute.line}&sta=${mtrRoute.station}`
            );
            
            if (response.ok) {
              const data = await response.json();
              const key = `${mtrRoute.line}-${mtrRoute.station}`;
              const stationData = data.data?.[key];
              
              if (stationData && stationData.UP) {
                const trains = stationData.UP.filter((t: any) => t.valid === 'Y');
                if (trains.length > 0) {
                  updatedRoutes.push({
                    ...route,
                    nextArrival: parseInt(trains[0].ttnt) || 0,
                    secondArrival: trains[1] ? parseInt(trains[1].ttnt) || 0 : 0,
                    status: parseInt(trains[0].ttnt) > 10 ? 'delayed' : 'normal',
                  });
                  continue;
                }
              }
            }
          } catch (err) {
            console.error('MTR API error:', err);
          }
        }
        updatedRoutes.push(route);
      } else {
        updatedRoutes.push(route);
      }
    }

    setRoutes(updatedRoutes);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRealTimeData();
  }, [fetchRealTimeData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchRealTimeData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRealTimeData();
    setRefreshing(false);
  }, [fetchRealTimeData]);

  const handleRouteSelect = (route: any) => {
    // Navigate to this route's detail
    console.log('Selected route:', route);
  };

  // Filter popular routes based on search
  const filteredPopularRoutes = POPULAR_MTR_ROUTES.filter(
    r => r.stationName.includes(searchQuery) || 
         r.name.includes(searchQuery)
  ).slice(0, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return colors.success;
      case 'delayed': return colors.warning;
      case 'severe': return colors.error;
      default: return colors.textMuted;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>交通</Text>
        <Text style={styles.subtitle}>港鐵即時到站</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索站點..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Line filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.lineFilter}
        contentContainerStyle={styles.lineFilterContent}
      >
        {Object.entries(MTR_LINE_CODES).slice(0, 8).map(([code, info]) => (
          <TouchableOpacity
            key={code}
            style={[styles.lineChip, { borderColor: info.color }]}
            onPress={() => console.log('Selected line:', code)}
          >
            <View style={[styles.lineDot, { backgroundColor: info.color }]} />
            <Text style={styles.lineChipText}>{info.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Routes */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>載入即時到站數據...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>😔</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchRealTimeData}>
              <Text style={styles.retryText}>重試</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* MTR Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🚇 港鐵</Text>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              {routes.map(route => (
                <TouchableOpacity 
                  key={route.id} 
                  onPress={() => handleRouteSelect(route)}
                  activeOpacity={0.7}
                >
                  <TransportCard route={route} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Bus Section (mock) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚌 巴士</Text>
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonText}>巴士到站數據整合中...</Text>
                <Text style={styles.comingSoonSubtext}>九巴、城巴、新巴</Text>
              </View>
            </View>

            {/* Popular Routes */}
            {searchQuery.length > 0 && filteredPopularRoutes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔎 搜索結果</Text>
                {filteredPopularRoutes.map((route, index) => (
                  <TouchableOpacity 
                    key={`search_${index}`} 
                    style={styles.searchResultItem}
                    onPress={() => console.log('Search result:', route)}
                  >
                    <View style={[styles.lineIndicator, { backgroundColor: MTR_LINE_CODES[route.line]?.color }]} />
                    <View style={styles.searchResultContent}>
                      <Text style={styles.searchResultLine}>{route.name}</Text>
                      <Text style={styles.searchResultStation}>{route.stationName}</Text>
                    </View>
                    <Text style={styles.searchResultArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
        
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
    marginBottom: spacing.sm,
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
  lineFilter: {
    maxHeight: 50,
    marginBottom: spacing.md,
  },
  lineFilterContent: {
    paddingHorizontal: spacing.md,
  },
  lineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
    borderWidth: 2,
  },
  lineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  lineChipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },
  liveText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
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
  comingSoonSubtext: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  searchResultItem: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultLine: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  searchResultStation: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  searchResultArrow: {
    color: colors.textMuted,
    fontSize: 20,
  },
});
