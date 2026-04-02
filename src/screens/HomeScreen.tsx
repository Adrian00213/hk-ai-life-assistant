import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WeatherCard } from '../components';
import { colors, spacing, borderRadius } from '../theme/colors';
import { useStore } from '../store';
import { fetchWeather, getAirQualityAdvice } from '../services/weatherApi';
import { fetchTyphoonInfo, fetchRainWarning, fetchHolidayForecasts, getDailyWeatherAlerts } from '../services/weatherAlertsApi';
import { fetchHKNews } from '../services/newsApi';
import { WeatherData } from '../types';

export const HomeScreen: React.FC = () => {
  const { weather, setWeather } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [typhoon, setTyphoon] = useState<any>(null);
  const [rainWarning, setRainWarning] = useState<any>(null);
  const [holidays, setHolidays] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch weather
      const weatherData = await fetchWeather();
      setWeather(weatherData);
      
      // Fetch weather alerts in parallel
      const [typhoonData, rainData, holidayData, newsData] = await Promise.all([
        fetchTyphoonInfo(),
        fetchRainWarning(),
        fetchHolidayForecasts(),
        fetchHKNews(),
      ]);
      
      setTyphoon(typhoonData);
      setRainWarning(rainData);
      setHolidays(holidayData);
      setNews(newsData.slice(0, 3)); // Top 3 news
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('無法載入部分數據');
    } finally {
      setLoading(false);
    }
  }, [setWeather]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

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
        {/* Emergency Alerts */}
        {(typhoon || rainWarning) && (
          <View style={styles.alertSection}>
            {typhoon && (
              <TouchableOpacity style={[styles.alertCard, styles.typhoonAlert]}>
                <Text style={styles.alertEmoji}>🌪</Text>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>颱風「{typhoon.name}」現正生效</Text>
                  <Text style={styles.alertDesc}>{typhoon.currentPosition?.description}</Text>
                </View>
              </TouchableOpacity>
            )}
            {rainWarning && (
              <TouchableOpacity style={[styles.alertCard, styles.rainAlert]}>
                <Text style={styles.alertEmoji}>🌧️</Text>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{rainWarning.type === 'AMBER' ? '黃色' : rainWarning.type === 'RED' ? '紅色' : '黑色'}暴雨警告生效</Text>
                  <Text style={styles.alertDesc}>發出時間：{rainWarning.issuedTime}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Quick Actions */}
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
              <Text style={styles.actionEmoji}>📰</Text>
              <Text style={styles.actionText}>資訊</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionEmoji}>💬</Text>
              <Text style={styles.actionText}>論壇</Text>
            </View>
          </View>
        </View>
        
        {/* Weather Card */}
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
        
        {/* Weather Alerts based on conditions */}
        {weather && (
          <View style={styles.alertsSection}>
            <Text style={styles.sectionTitle}>天氣提示</Text>
            {getDailyWeatherAlerts(weather).map((alert, index) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.alertText}>{alert}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Holiday Forecast */}
        <View style={styles.holidaySection}>
          <Text style={styles.sectionTitle}>假期天氣預測</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {holidays.map((holiday, index) => (
              <View key={index} style={styles.holidayCard}>
                <Text style={styles.holidayName}>{holiday.name}</Text>
                <Text style={styles.holidayDate}>{holiday.date}</Text>
                <Text style={styles.holidayWeather}>{holiday.weather}</Text>
                <Text style={styles.holidayTemp}>{holiday.tempRange.min}~{holiday.tempRange.max}°</Text>
                <Text style={styles.holidayRec}>{holiday.recommendation}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        
        {/* Latest News */}
        <View style={styles.newsSection}>
          <Text style={styles.sectionTitle}>最新資訊</Text>
          {news.map((item) => (
            <TouchableOpacity key={item.id} style={styles.newsCard}>
              <View style={styles.newsHeader}>
                <View style={[styles.newsBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                  <Text style={styles.newsBadgeText}>{getCategoryLabel(item.category)}</Text>
                </View>
                {item.isHot && <Text style={styles.hotBadge}>🔥</Text>}
              </View>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsSource}>{item.source} • {item.publishedAt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Weather Health Tips */}
        <View style={styles.hongKongTips}>
          <Text style={styles.sectionTitle}>健康提示</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>今日建議</Text>
              <Text style={styles.tipText}>
                {weather ? getAirQualityAdvice(weather.aqi) : '空氣質量一般'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
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
  };
  return labels[category] || category;
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
  alertSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  typhoonAlert: {
    backgroundColor: '#FF6B3510',
    borderWidth: 1,
    borderColor: '#FF6B3540',
  },
  rainAlert: {
    backgroundColor: '#6ABFE410',
    borderWidth: 1,
    borderColor: '#6ABFE440',
  },
  alertEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  alertDesc: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
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
  alertsSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  alertText: {
    color: colors.text,
    fontSize: 14,
  },
  holidaySection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  holidayCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginRight: spacing.sm,
    width: 160,
  },
  holidayName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  holidayDate: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  holidayWeather: {
    color: colors.primary,
    fontSize: 13,
    marginTop: spacing.sm,
  },
  holidayTemp: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  holidayRec: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  newsSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  newsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  newsBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newsBadgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  hotBadge: {
    marginLeft: spacing.xs,
  },
  newsTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  newsSource: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  hongKongTips: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
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
