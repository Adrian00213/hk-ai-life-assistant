import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme/colors';

export const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [cantoneseOnly, setCantoneseOnly] = React.useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>設定</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View>
                <Text style={styles.settingLabel}>天氣通知</Text>
                <Text style={styles.settingDesc}>每日天氣提示</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={notifications ? colors.primary : colors.textMuted}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🚨</Text>
              <View>
                <Text style={styles.settingLabel}>交通提醒</Text>
                <Text style={styles.settingDesc}>延誤同服務中斷通知</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={notifications ? colors.primary : colors.textMuted}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>權限</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>📍</Text>
              <View>
                <Text style={styles.settingLabel}>位置存取</Text>
                <Text style={styles.settingDesc}>取得附近資訊</Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={locationEnabled ? colors.primary : colors.textMuted}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>語言</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🗣️</Text>
              <View>
                <Text style={styles.settingLabel}>純廣東話模式</Text>
                <Text style={styles.settingDesc}>AI 只用廣東話回覆</Text>
              </View>
            </View>
            <Switch
              value={cantoneseOnly}
              onValueChange={setCantoneseOnly}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={cantoneseOnly ? colors.primary : colors.textMuted}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>關於</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>🐛 報告問題</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>⭐ 評價 App</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>📝 使用條款</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>🔒 隱私政策</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.version}>
          <Text style={styles.versionText}>香港日常 v0.1.0 Beta</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ in Hong Kong</Text>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    textTransform: 'uppercase',
  },
  settingItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  settingLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  settingDesc: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  menuItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  menuLabel: {
    color: colors.text,
    fontSize: 15,
  },
  menuArrow: {
    color: colors.textMuted,
    fontSize: 20,
  },
  version: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  versionSubtext: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});
