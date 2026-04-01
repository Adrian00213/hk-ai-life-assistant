import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { TransportRoute } from '../types';

interface TransportCardProps {
  route: TransportRoute;
  onPress?: () => void;
}

const statusConfig = {
  normal: { color: colors.success, label: '正常', dot: '🟢' },
  delayed: { color: colors.warning, label: '稍延', dot: '🟡' },
  severe: { color: colors.error, label: '受阻', dot: '🔴' },
};

export const TransportCard: React.FC<TransportCardProps> = ({ route, onPress }) => {
  const status = statusConfig[route.status];
  const isMTR = route.line === 'mtr';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {isMTR && (
        <View style={[styles.lineIndicator, { backgroundColor: route.lineColor || colors.primary }]} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.routeName}>
            <Text style={styles.lineName}>{route.lineName || route.name}</Text>
            <Text style={styles.routePath}>{route.origin} → {route.destination}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '30' }]}>
            <Text style={styles.statusDot}>{status.dot}</Text>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        
        <View style={styles.arrivalInfo}>
          <View style={styles.arrivalMain}>
            <Text style={styles.arrivalLabel}>下一班</Text>
            <Text style={styles.arrivalTime}>{route.nextArrival}分鐘</Text>
          </View>
          {route.secondArrival && (
            <View style={styles.arrivalSecond}>
              <Text style={styles.arrivalLabel}>兩班後</Text>
              <Text style={styles.arrivalTimeSmall}>{route.secondArrival}分鐘</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  lineIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  routeName: {
    flex: 1,
  },
  lineName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  routePath: {
    color: colors.textMuted,
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusDot: {
    fontSize: 10,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrivalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  arrivalMain: {
    flex: 1,
  },
  arrivalSecond: {
    borderLeftWidth: 1,
    borderLeftColor: colors.surface,
    paddingLeft: spacing.md,
    marginLeft: spacing.md,
  },
  arrivalLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  arrivalTime: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '700',
  },
  arrivalTimeSmall: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});
