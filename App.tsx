import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen, TransportScreen, InfoScreen, ChatScreen, SettingsScreen, SuperAppScreen } from './src/screens';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
    <Text style={styles.tabIcon}>{emoji}</Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarLabelStyle: styles.tabLabel,
          }}
        >
          <Tab.Screen
            name="SuperApp"
            component={SuperAppScreen}
            options={{
              tabBarLabel: '首頁',
              tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Transport"
            component={TransportScreen}
            options={{
              tabBarLabel: '交通',
              tabBarIcon: ({ focused }) => <TabIcon emoji="🚌" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Info"
            component={InfoScreen}
            options={{
              tabBarLabel: '資訊',
              tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              tabBarLabel: '金龍',
              tabBarIcon: ({ focused }) => <TabIcon emoji="🐉" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: '設定',
              tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.secondary,
    borderTopWidth: 0,
    height: 85,
    paddingTop: 8,
    paddingBottom: 25,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabIconContainer: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  tabIconFocused: {
    backgroundColor: colors.accent + '30',
  },
  tabIcon: {
    fontSize: 22,
  },
});
