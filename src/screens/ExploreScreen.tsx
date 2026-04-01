import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExploreCard } from '../components';
import { colors, spacing, borderRadius } from '../theme/colors';
import { useStore } from '../store';
import { ExplorePlace } from '../types';

const mockPlaces: ExplorePlace[] = [
  {
    id: '1',
    name: '科記咖啡茶廳',
    category: 'food',
    description: '旺角巷仔茶檔，豬扒包係必食。街坊話性價比超高，奶茶好正',
    neighborhood: 'mongkok',
    rating: 4.8,
    imageUrl: '',
    tags: ['茶餐廳', '豬扒包', '奶茶', '旺角'],
  },
  {
    id: '2',
    name: '西環泳棚',
    category: 'hidden',
    description: '70年代港人游水嘅地方，依家變咗打卡熱點。懸崖靚景，適合睇日落',
    neighborhood: 'sai ying pun',
    rating: 4.6,
    imageUrl: '',
    tags: ['打卡', '日落', '泳棚', '西環'],
  },
  {
    id: '3',
    name: '彩虹邨',
    category: 'hidden',
    description: '香港最色彩繽紛屋邨，公屋生活嘅標誌。打卡呃like一流',
    neighborhood: 'sham shui po',
    rating: 4.5,
    imageUrl: '',
    tags: ['公屋', '彩虹', '打卡', '公屋美學'],
  },
  {
    id: '4',
    name: '大坑舞火龍',
    category: 'history',
    description: '百年傳統，中秋節先有！用稻草紮成火龍，全程300人舞動',
    neighborhood: 'tai hang',
    rating: 4.9,
    imageUrl: '',
    tags: ['傳統', '中秋', '非遺', '大坑'],
  },
  {
    id: '5',
    name: '鶴藪水塘',
    category: 'nature',
    description: '新手行山路線，風景優美，水塘倒影好靚。春天有櫻花睇',
    neighborhood: 'sai kung',
    rating: 4.7,
    imageUrl: '',
    tags: ['行山', '水塘', '新手', '西貢'],
  },
  {
    id: '6',
    name: '長洲太平清醮',
    category: 'history',
    description: '傳統節慶，搶包山係高潮。舍人奉請天后娘娘，全島齋戒',
    neighborhood: 'cheung chau',
    rating: 4.8,
    imageUrl: '',
    tags: ['傳統', '節慶', '長洲', '搶包山'],
  },
];

const categories = [
  { key: 'all', emoji: '✨', label: '全部' },
  { key: 'food', emoji: '🍜', label: '搵食' },
  { key: 'history', emoji: '🏛', label: '故事' },
  { key: 'nature', emoji: '🌳', label: '自然' },
  { key: 'hidden', emoji: '🔮', label: '隱世' },
];

export const ExploreScreen: React.FC = () => {
  const { savedPlaces, toggleSavePlace } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [places] = useState<ExplorePlace[]>(mockPlaces);

  const filteredPlaces = selectedCategory === 'all'
    ? places
    : places.filter(p => p.category === selectedCategory);

  const isPlaceSaved = (placeId: string) => {
    return savedPlaces.some(p => p.id === placeId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>探索</Text>
        <Text style={styles.subtitle}>香港人先知嘅地方</Text>
      </View>
      
      <View style={styles.categories}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryChip,
                selectedCategory === cat.key && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === cat.key && styles.categoryLabelActive
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            呢啲係香港人真正會去嘅地方，唔係遊客嗰啲
          </Text>
        </View>
        
        {filteredPlaces.map(place => (
          <ExploreCard
            key={place.id}
            place={place}
            isSaved={isPlaceSaved(place.id)}
            onToggleSave={() => toggleSavePlace(place)}
          />
        ))}
        
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
  categories: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  infoText: {
    color: colors.primary,
    fontSize: 13,
    flex: 1,
  },
});
