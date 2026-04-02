import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { FOOD_APPS, TAXI_APPS, ServiceApp, openApp } from '../services/externalAppsApi';

const TABS = [
  { key: 'food', label: '外賣', emoji: '🍜' },
  { key: 'taxi', label: '叫車', emoji: '🚕' },
  { key: 'delivery', label: '送貨', emoji: '📦' },
];

export const ServicesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('food');

  const getApps = () => {
    switch (activeTab) {
      case 'food': return FOOD_APPS;
      case 'taxi': return TAXI_APPS.filter(a => a.category === 'taxi');
      case 'delivery': return TAXI_APPS.filter(a => a.category === 'delivery');
      default: return FOOD_APPS;
    }
  };

  const handleOpenApp = async (app: ServiceApp) => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isIOS || isAndroid) {
      const scheme = isIOS ? app.iosScheme : app.androidScheme;
      if (scheme) {
        // Try to open via URL scheme
        const opened = await openApp(app);
        if (!opened && app.webUrl) {
          // Fallback to web
          Linking.openURL(app.webUrl);
        }
      }
    } else {
      // Web - just open web URL
      if (app.webUrl) {
        Linking.openURL(app.webUrl);
      }
    }
  };

  const renderApp = (app: ServiceApp) => (
    <TouchableOpacity 
      key={app.id} 
      style={[styles.appCard, { borderLeftColor: app.color }]}
      onPress={() => handleOpenApp(app)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: app.color + '20' }]}>
        <Text style={styles.appIcon}>{app.icon}</Text>
      </View>
      <View style={styles.appInfo}>
        <Text style={styles.appName}>{app.nameCn}</Text>
        <Text style={styles.appDesc}>{app.description}</Text>
        <View style={styles.appMeta}>
          <Text style={[styles.appCategory, { color: app.color }]}>
            {app.category === 'food' ? '🍜 外賣' : app.category === 'taxi' ? '🚕 乘車' : '📦 送貨'}
          </Text>
        </View>
      </View>
      <View style={styles.openButton}>
        <Text style={styles.openButtonText}>開啟</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>生活服務</Text>
        <Text style={styles.headerSubtitle}>一鍵開啟常用App</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => Linking.openURL('tel:28888111')}
        >
          <Text style={styles.quickIcon}>📞</Text>
          <Text style={styles.quickLabel}>致電</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => Linking.openURL('https://maps.apple.com/?q=restaurant')}
        >
          <Text style={styles.quickIcon}>🗺️</Text>
          <Text style={styles.quickLabel}>地圖</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => Linking.openURL('https://www.google.com/maps')}
        >
          <Text style={styles.quickIcon}>🚇</Text>
          <Text style={styles.quickLabel}>交通</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => Linking.openURL('https://www.hko.gov.hk')}
        >
          <Text style={styles.quickIcon}>⛅</Text>
          <Text style={styles.quickLabel}>天氣</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Apps List */}
      <ScrollView style={styles.appsList} showsVerticalScrollIndicator={false}>
        {getApps().map(renderApp)}

        {activeTab === 'food' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍜 其他外賣</Text>
            <TouchableOpacity 
              style={styles.appCard}
              onPress={() => Linking.openURL('https://www.openrice.com/hongkong')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FF5722' + '20' }]}>
                <Text style={styles.appIcon}>🍽️</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>OpenRice</Text>
                <Text style={styles.appDesc}>香港餐廳指南，食評必睇</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'taxi' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚕 其他出行</Text>
            <TouchableOpacity 
              style={styles.appCard}
              onPress={() => Linking.openURL('https://www.mtr.com.hk')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#007A3D' + '20' }]}>
                <Text style={styles.appIcon}>🚇</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>港鐵 MTR</Text>
                <Text style={styles.appDesc}>即時列車到站時間</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.appCard}
              onPress={() => Linking.openURL('https://platform.yuu.com.hk')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FFD700' + '20' }]}>
                <Text style={styles.appIcon}>🚌</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>九巴 KMB</Text>
                <Text style={styles.appDesc}>巴士到站時間</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  headerTitle: { color: colors.text, fontSize: 24, fontWeight: '700' },
  headerSubtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  // Quick Actions
  quickActions: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  quickAction: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', marginHorizontal: 4 },
  quickIcon: { fontSize: 24, marginBottom: 4 },
  quickLabel: { color: colors.text, fontSize: 11 },
  // Tabs
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm, borderRadius: borderRadius.sm, backgroundColor: colors.surface, marginHorizontal: 4 },
  tabActive: { backgroundColor: colors.primary },
  tabEmoji: { fontSize: 16, marginRight: 4 },
  tabLabel: { color: colors.textMuted, fontSize: 13 },
  tabLabelActive: { color: colors.text },
  // Apps List
  appsList: { flex: 1, paddingHorizontal: spacing.md },
  appCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, borderLeftWidth: 4 },
  iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  appIcon: { fontSize: 26 },
  appInfo: { flex: 1 },
  appName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  appDesc: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  appMeta: { flexDirection: 'row', marginTop: 4 },
  appCategory: { fontSize: 11, fontWeight: '500' },
  openButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.sm },
  openButtonText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  section: { marginTop: spacing.md },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
});
