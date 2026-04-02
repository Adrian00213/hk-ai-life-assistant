// Notification Service for daily alerts and reminders
import { useStore } from '../store';
import { fetchWeather } from './weatherApi';
import { fetchRainWarning } from './weatherAlertsApi';

export interface NotificationPreferences {
  enabled: boolean;
  dailyWeather: boolean;
  dailyWeatherTime: string; // "08:00"
  typhoonAlerts: boolean;
  rainAlerts: boolean;
  lastTrainReminder: boolean;
  lastTrainTime: string;
}

export interface NotificationItem {
  id: string;
  type: 'weather' | 'typhoon' | 'rain' | 'transport' | 'news' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  dailyWeather: true,
  dailyWeatherTime: '08:00',
  typhoonAlerts: true,
  rainAlerts: true,
  lastTrainReminder: false,
  lastTrainTime: '23:30',
};

// Store notification preferences
export const saveNotificationPreferences = (prefs: NotificationPreferences): void => {
  try {
    localStorage.setItem('notification_prefs', JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save notification preferences:', error);
  }
};

// Load notification preferences
export const loadNotificationPreferences = (): NotificationPreferences => {
  try {
    const stored = localStorage.getItem('notification_prefs');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load notification preferences:', error);
  }
  return DEFAULT_PREFERENCES;
};

// Check if it's time for daily weather notification
export const shouldSendDailyWeatherNotification = (prefs: NotificationPreferences): boolean => {
  if (!prefs.enabled || !prefs.dailyWeather) return false;
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // Check if current time is within 5 minutes of scheduled time
  const scheduledMinutes = parseInt(prefs.dailyWeatherTime.split(':')[0]) * 60 + parseInt(prefs.dailyWeatherTime.split(':')[1]);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  return Math.abs(scheduledMinutes - currentMinutes) <= 5;
};

// Generate daily weather notification content
export const generateDailyWeatherNotification = async (): Promise<NotificationItem | null> => {
  try {
    const weather = await fetchWeather();
    const rainWarning = await fetchRainWarning();
    
    let message = `今日香港${weather.description}，氣溫${weather.temperature}°，濕度${weather.humidity}%`;
    
    if (rainWarning) {
      message += `\n⚠️ ${rainWarning.type === 'AMBER' ? '黃色' : rainWarning.type === 'RED' ? '紅色' : '黑色'}暴雨警告生效！`;
    }
    
    if (weather.humidity > 80) {
      message += '\n💨 回南天注意';
    }
    
    return {
      id: `weather_${Date.now()}`,
      type: 'weather',
      title: '🌤 今日天氣預報',
      message,
      timestamp: new Date(),
      read: false,
    };
  } catch (error) {
    console.error('Failed to generate weather notification:', error);
    return null;
  }
};

// Generate typhoon alert notification
export const generateTyphoonAlert = (typhoon: any): NotificationItem => {
  return {
    id: `typhoon_${Date.now()}`,
    type: 'typhoon',
    title: '🌪 颱風警報',
    message: `${typhoon.name}現時為${typhoon.currentPosition?.description || '強度未知'}。請留意最新風暴消息。`,
    timestamp: new Date(),
    read: false,
  };
};

// Generate rain alert notification
export const generateRainAlert = (warning: any): NotificationItem => {
  return {
    id: `rain_${Date.now()}`,
    type: 'rain',
    title: '🌧 天氣警告',
    message: `${warning.type === 'AMBER' ? '黃色' : warning.type === 'RED' ? '紅色' : '黑色'}暴雨警告現正生效：${warning.description.substring(0, 50)}...`,
    timestamp: new Date(),
    read: false,
  };
};

// Simulate sending notification (in production, would use Push API or notification service)
export const sendNotification = async (notification: NotificationItem): Promise<void> => {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.log('Browser does not support notifications');
    return;
  }
  
  // Request permission if not granted
  if (Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      tag: notification.id,
    });
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });
    }
  }
};

// Check notification permission status
export const getNotificationPermissionStatus = (): string => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as string;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<string> => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return await Notification.requestPermission() as string;
};
