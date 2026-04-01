import { create } from 'zustand';
import { WeatherData, TransportRoute, ExplorePlace, ChatMessage } from '../types';

interface AppState {
  // Weather
  weather: WeatherData | null;
  setWeather: (weather: WeatherData) => void;
  
  // Transport
  savedRoutes: TransportRoute[];
  addRoute: (route: TransportRoute) => void;
  removeRoute: (id: string) => void;
  
  // Explore
  savedPlaces: ExplorePlace[];
  toggleSavePlace: (place: ExplorePlace) => void;
  
  // Chat
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export const useStore = create<AppState>((set) => ({
  weather: null,
  setWeather: (weather) => set({ weather }),
  
  savedRoutes: [],
  addRoute: (route) => set((state) => ({
    savedRoutes: [...state.savedRoutes, route]
  })),
  removeRoute: (id) => set((state) => ({
    savedRoutes: state.savedRoutes.filter((r) => r.id !== id)
  })),
  
  savedPlaces: [],
  toggleSavePlace: (place) => set((state) => {
    const exists = state.savedPlaces.find((p) => p.id === place.id);
    if (exists) {
      return { savedPlaces: state.savedPlaces.filter((p) => p.id !== place.id) };
    }
    return { savedPlaces: [...state.savedPlaces, place] };
  }),
  
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({ messages: [] }),
}));
