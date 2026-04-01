import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

const weatherIcons: Record<string, string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  partlyCloudy: '⛅',
};

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const getClothingAdvice = () => {
    if (weather.temperature < 15) return '🧥 大褸/羽絨';
    if (weather.temperature < 20) return '👕 長袖外套';
    if (weather.temperature < 25) return '👕 短袖OK';
    return '🩱 背心短褲出動';
  };

  const getHKOilAdvice = () => {
    if (weather.humidity > 85) return '💨 回南天！唔好晾衫';
    if (weather.humidity > 70) return '🌤️ 可以晾，但要睇天';
    return '✅ 適合晾衫';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.location}>📍 香港</Text>
        <Text style={styles.updateTime}>剛更新</Text>
      </View>
      
      <View style={styles.mainInfo}>
        <Text style={styles.icon}>{weatherIcons[weather.condition]}</Text>
        <View style={styles.tempContainer}>
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <Text style={styles.feelsLike}>體感 {weather.feelsLike}°</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{weather.description}</Text>
      
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>💧 濕度</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>☀️ 紫外線</Text>
          <Text style={styles.detailValue}>{weather.uvIndex}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>🌬️ 空氣質素</Text>
          <Text style={[styles.detailValue, { color: weather.aqi < 50 ? colors.success : colors.warning }]}>
            {weather.aqi} {weather.aqi < 50 ? '良' : '一般'}
          </Text>
        </View>
      </View>
      
      <View style={styles.adviceContainer}>
        <View style={styles.adviceItem}>
          <Text style={styles.adviceLabel}>今日著咩？</Text>
          <Text style={styles.adviceValue}>{getClothingAdvice()}</Text>
        </View>
        <View style={styles.adviceItem}>
          <Text style={styles.adviceLabel}>晾衫指數</Text>
          <Text style={styles.adviceValue}>{getHKOilAdvice()}</Text>
        </View>
      </View>
      
      <View style={styles.hourlyForecast}>
        <Text style={styles.hourlyTitle}>逐小時預報</Text>
        <View style={styles.hourlyList}>
          {weather.hourlyForecast.slice(0, 6).map((hour, index) => (
            <View key={index} style={styles.hourlyItem}>
              <Text style={styles.hourlyTime}>{hour.hour}</Text>
              <Text style={styles.hourlyIcon}>{weatherIcons[hour.condition as keyof typeof weatherIcons] || '☀️'}</Text>
              <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  location: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  updateTime: {
    color: colors.textMuted,
    fontSize: 12,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 64,
    marginRight: spacing.lg,
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    color: colors.text,
    fontSize: 56,
    fontWeight: '700',
  },
  feelsLike: {
    color: colors.textMuted,
    fontSize: 16,
  },
  description: {
    color: colors.textMuted,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  adviceContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  adviceItem: {
    flex: 1,
    alignItems: 'center',
  },
  adviceLabel: {
    color: colors.primary,
    fontSize: 12,
    marginBottom: 4,
  },
  adviceValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  hourlyForecast: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceLight,
    paddingTop: spacing.md,
  },
  hourlyTitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  hourlyList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourlyItem: {
    alignItems: 'center',
  },
  hourlyTime: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  hourlyIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  hourlyTemp: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});
