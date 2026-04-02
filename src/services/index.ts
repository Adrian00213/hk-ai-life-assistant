export { fetchWeather, getAirQualityAdvice } from './weatherApi';
export { fetchMTRArrival, fetchBusArrival, refreshRoutes, POPULAR_ROUTES, getLineColor, MTR_LINE_COLORS } from './transportApi';
export { fetchMTRArrival as fetchMTRRealTime, MTR_LINE_CODES, MTR_STATIONS, POPULAR_MTR_ROUTES, getStationName, getDestName } from './mtrApi';
export { aiService, AIService } from './aiService';
export { fetchHKOWarnings, fetchGoldPrice, fetchExchangeRates, fetchMarketIndices, fetchAirQuality } from './hkInfoApi';
export { forumService, ForumService } from './forumService';
export { fetchTyphoonInfo, fetchRainWarning, fetchHolidayForecasts, getDailyWeatherAlerts } from './weatherAlertsApi';
export { fetchHKNews, fetchPropertyTransactions, fetchUpcomingIPOs, formatHKPrice, formatSize } from './newsApi';
export { 
  saveNotificationPreferences, 
  loadNotificationPreferences, 
  shouldSendDailyWeatherNotification,
  generateDailyWeatherNotification,
  sendNotification,
  getNotificationPermissionStatus,
  requestNotificationPermission 
} from './notificationService';
export { VoiceInputService, voiceInputService } from './voiceInputService';
