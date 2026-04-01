import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { ExplorePlace } from '../types';

interface ExploreCardProps {
  place: ExplorePlace;
  isSaved: boolean;
  onToggleSave: () => void;
  onPress?: () => void;
}

const categoryConfig = {
  food: { emoji: '🍜', label: '隱世食肆', color: '#FF6B35' },
  history: { emoji: '🏛', label: '社區故事', color: '#8E258D' },
  nature: { emoji: '🌳', label: '秘密花園', color: '#4ADE80' },
  hidden: { emoji: '🔮', label: '隱世之地', color: '#FFD93D' },
};

const categoryBgColors = {
  food: '#2A1A0A',
  history: '#1A0A2A',
  nature: '#0A2A1A',
  hidden: '#2A2A0A',
};

const neighborhoodLabels: Record<string, string> = {
  'central': '中上環',
  'sham shui po': '深水埗',
  'mongkok': '旺角',
  'causeway bay': '銅鑼灣',
  'sai ying pun': '西營盤',
  'tai hang': '大坑',
  'cheung chau': '長洲',
  'sai kung': '西貢',
};

export const ExploreCard: React.FC<ExploreCardProps> = ({ 
  place, 
  isSaved, 
  onToggleSave,
  onPress 
}) => {
  const category = categoryConfig[place.category];
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.imagePlaceholder, { backgroundColor: categoryBgColors[place.category] }]}>
        <Text style={styles.imageEmoji}>{category.emoji}</Text>
        <Text style={styles.imageLabel}>{category.label}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: category.color + '30' }]}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={[styles.categoryLabel, { color: category.color }]}>{category.label}</Text>
          </View>
          <TouchableOpacity onPress={onToggleSave} style={styles.saveButton}>
            <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{place.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.location}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {neighborhoodLabels[place.neighborhood] || place.neighborhood}
            </Text>
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.tags}>
          {place.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  imageLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  categoryEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    padding: spacing.xs,
  },
  saveIcon: {
    fontSize: 20,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  ratingText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
