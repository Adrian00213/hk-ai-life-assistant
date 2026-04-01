import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WeatherCard } from '../components';
import { colors, spacing } from '../theme/colors';
import { useStore } from '../store';
import { fetchWeather, getAirQualityAdvice } from '../services';

export const HomeScreen: React.FC = () => {
  const { weather, setWeather } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchWeather();
      setWeather(data);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError('無法載入天氣數據');
    } finally {
      setLoading(false);
    }
  }, [setWeather]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWeather();
    setRefreshing(false);
  }, [loadWeather]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return '夜深了';
    if (hour < 12) return '早晨';
    if (hour < 18) return '下午好';
    if (hour < 22) return '夜晚好';
    return '夜深了';
  };

  const formatDate = () => {
    const now = new Date();
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];
    return `${year}年${month}月${date}日 ${day}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.date}>{formatDate()}</Text>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>快捷功能</Text>
          <View style={styles.actionGrid}>
            <View style={styles.actionItem}>
              <Text style={styles.actionEmoji}>🚌</Text>
              <Text style={styles.actionText}>交通</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionEmoji}>🍜</Text>
              <Text style={styles.actionText}>搵食</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionEmoji}>🌳</Text>
              <Text style={styles.actionText}>行山</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionEmoji}>☂️</Text>
              <Text style={styles.actionText}>帶遮</Text>
            </View>
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>正在載入天氣數據...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorEmoji}>😔</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : weather ? (
          <WeatherCard weather={weather} />
        ) : null}
        
        <View style={styles.hongKongTips}>
          <Text style={styles.sectionTitle}>香港日常</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>健康提示</Text>
              <Text style={styles.tipText}>
                {weather ? getAirQualityAdvice(weather.aqi) : '空氣質量一般'}
              </Text>
            </View>
          </View>
          
          {weather && weather.humidity > 80 && (
            <View style={[styles.tipCard, styles.warningCard]}>
              <Text style={styles.tipEmoji}>💨</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>回南天警告</Text>
                <Text style={styles.tipText}>濕度偏高，建議關閉窗戶，使用抽濕機防潮。</Text>
              </View>
            </View>
          )}
          
          {weather && weather.uvIndex > 6 && (
            <View style={[styles.tipCard, styles.warningCard]}>
              <Text style={styles.tipEmoji}>☀️</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>紫外線注意</Text>
                <Text style={styles.tipText}>紫外線指數偏高，外出記得塗防曬！</Text>
              </View>
            </View>
          )}
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
  greeting: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  date: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  quickActions: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  actionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: colors.error + '20',
    borderRadius: 16,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  hongKongTips: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  warningCard: {
    backgroundColor: colors.warning + '20',
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
