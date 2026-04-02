import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme/colors';
import { 
  loadNotificationPreferences, 
  saveNotificationPreferences,
  requestNotificationPermission,
  getNotificationPermissionStatus 
} from '../services/notificationService';

export const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState({
    enabled: true,
    dailyWeather: true,
    dailyWeatherTime: '08:00',
    typhoonAlerts: true,
    rainAlerts: true,
    lastTrainReminder: false,
    lastTrainTime: '23:30',
  });
  
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [voiceInputAvailable, setVoiceInputAvailable] = useState(false);
  const [selectedTime, setSelectedTime] = useState('dailyWeatherTime');

  useEffect(() => {
    // Load saved preferences
    const prefs = loadNotificationPreferences();
    setNotifications(prefs);
    
    // Check notification permission
    const status = getNotificationPermissionStatus();
    setNotificationPermission(status);
    
    // Check voice input availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceInputAvailable(!!SpeechRecognition);
  }, []);

  const handleToggle = (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    saveNotificationPreferences(updated);
  };

  const handleTimeChange = (key: string, time: string) => {
    const updated = { ...notifications, [key]: time };
    setNotifications(updated);
    saveNotificationPreferences(updated);
  };

  const requestNotificationAccess = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>設定</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notification Permission */}
        {notificationPermission !== 'granted' && (
          <View style={styles.permissionBanner}>
            <Text style={styles.permissionText}>
              {notificationPermission === 'denied' 
                ? '通知權限已被拒絕，請在瀏覽器設定中允許通知'
                : '開啟通知以接收天氣預報和緊急警報'}
            </Text>
            {notificationPermission !== 'denied' && (
              <TouchableOpacity style={styles.permissionButton} onPress={requestNotificationAccess}>
                <Text style={styles.permissionButtonText}>允許通知</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 通知設定</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View>
                <Text style={styles.settingLabel}>開啟通知</Text>
                <Text style={styles.settingDesc}>接收所有通知</Text>
              </View>
            </View>
            <Switch
              value={notifications.enabled}
              onValueChange={(v) => handleToggle('enabled', v)}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={notifications.enabled ? colors.primary : colors.textMuted}
            />
          </View>

          <View style={[styles.settingItem, !notifications.enabled && styles.disabled]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌤</Text>
              <View>
                <Text style={styles.settingLabel}>每日天氣預報</Text>
                <Text style={styles.settingDesc}>每天早上接收天氣提示</Text>
              </View>
            </View>
            <Switch
              value={notifications.dailyWeather}
              onValueChange={(v) => handleToggle('dailyWeather', v)}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={notifications.dailyWeather ? colors.primary : colors.textMuted}
              disabled={!notifications.enabled}
            />
          </View>

          {notifications.dailyWeather && notifications.enabled && (
            <View style={[styles.timeSelector, !notifications.enabled && styles.disabled]}>
              <Text style={styles.timeLabel}>推送時間</Text>
              <View style={styles.timeOptions}>
                {['07:00', '07:30', '08:00', '08:30', '09:00'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeChip,
                      notifications.dailyWeatherTime === time && styles.timeChipActive
                    ]}
                    onPress={() => handleTimeChange('dailyWeatherTime', time)}
                    disabled={!notifications.enabled}
                  >
                    <Text style={[
                      styles.timeChipText,
                      notifications.dailyWeatherTime === time && styles.timeChipTextActive
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={[styles.settingItem, !notifications.enabled && styles.disabled]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌪</Text>
              <View>
                <Text style={styles.settingLabel}>颱風警報</Text>
                <Text style={styles.settingDesc}>颱風來襲時即時通知</Text>
              </View>
            </View>
            <Switch
              value={notifications.typhoonAlerts}
              onValueChange={(v) => handleToggle('typhoonAlerts', v)}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={notifications.typhoonAlerts ? colors.primary : colors.textMuted}
              disabled={!notifications.enabled}
            />
          </View>

          <View style={[styles.settingItem, !notifications.enabled && styles.disabled]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌧️</Text>
              <View>
                <Text style={styles.settingLabel}>暴雨警告</Text>
                <Text style={styles.settingDesc}>紅雨/黑雨時通知你</Text>
              </View>
            </View>
            <Switch
              value={notifications.rainAlerts}
              onValueChange={(v) => handleToggle('rainAlerts', v)}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={notifications.rainAlerts ? colors.primary : colors.textMuted}
              disabled={!notifications.enabled}
            />
          </View>

          <View style={[styles.settingItem, !notifications.enabled && styles.disabled]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🚇</Text>
              <View>
                <Text style={styles.settingLabel}>尾班車提醒</Text>
                <Text style={styles.settingDesc}>港鐵尾班車前提醒你</Text>
              </View>
            </View>
            <Switch
              value={notifications.lastTrainReminder}
              onValueChange={(v) => handleToggle('lastTrainReminder', v)}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={notifications.lastTrainReminder ? colors.primary : colors.textMuted}
              disabled={!notifications.enabled}
            />
          </View>
        </View>

        {/* Voice Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎤 語音設定</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🎤</Text>
              <View>
                <Text style={styles.settingLabel}>語音輸入</Text>
                <Text style={styles.settingDesc}>
                  {voiceInputAvailable 
                    ? '已支援語音輸入' 
                    : '你的瀏覽器不支援語音輸入'}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: voiceInputAvailable ? colors.success + '30' : colors.error + '30' }]}>
              <Text style={[styles.statusText, { color: voiceInputAvailable ? colors.success : colors.error }]}>
                {voiceInputAvailable ? '✓ 支援' : '✗ 不支援'}
              </Text>
            </View>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗣️ 語言設定</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🗣️</Text>
              <View>
                <Text style={styles.settingLabel}>純廣東話模式</Text>
                <Text style={styles.settingDesc}>AI 只用廣東話回覆</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
              thumbColor={colors.primary}
            />
          </View>
        </View>

        {/* About Section */}
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
          <Text style={styles.versionText}>香港日常 v1.0.0</Text>
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
  permissionBanner: {
    backgroundColor: colors.primary + '20',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  permissionText: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
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
  disabled: {
    opacity: 0.5,
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
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeSelector: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    marginLeft: spacing.xl + spacing.md,
  },
  timeLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeChip: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
  },
  timeChipText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  timeChipTextActive: {
    color: colors.text,
    fontWeight: '600',
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
