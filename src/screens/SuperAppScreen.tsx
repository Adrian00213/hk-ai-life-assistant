import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { HK_CENTER, SEARCH_CATEGORIES, searchByCategory, searchByQuery, MOCK_SEARCH_RESULTS, SearchResult } from '../services/mapApi';

const { width, height } = Dimensions.get('window');

// Mock restaurants for food delivery
const RESTAURANTS = [
  { id: 'r1', name: '翠華餐廳', category: '茶餐廳', rating: 4.2, deliveryTime: '25-35分鐘', deliveryFee: 0, minOrder: 50, image: '🍜' },
  { id: 'r2', name: '麥當勞', category: '快餐', rating: 4.0, deliveryTime: '20-30分鐘', deliveryFee: 0, minOrder: 30, image: '🍔' },
  { id: 'r3', name: '大家樂', category: '快餐', rating: 3.9, deliveryTime: '30-40分鐘', deliveryFee: 5, minOrder: 40, image: '🍲' },
  { id: 'r4', name: '美心MX', category: '快餐', rating: 4.0, deliveryTime: '25-35分鐘', deliveryFee: 0, minOrder: 35, image: '🥡' },
  { id: 'r5', name: '太興茶餐廳', category: '茶餐廳', rating: 4.3, deliveryTime: '30-40分鐘', deliveryFee: 8, minOrder: 60, image: '🍛' },
];

// Menu items
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

const MENU: { [key: string]: MenuItem[] } = {
  'r1': [
    { id: 'm1', name: '奶茶', price: 22, description: '招牌港式奶茶' },
    { id: 'm2', name: '豬扒包', price: 35, description: '香脆豬扒包' },
    { id: 'm3', name: '常餐', price: 45, description: '火腿通粉+奶茶' },
    { id: 'm4', name: '西多士', price: 28, description: '香甜西多士' },
  ],
  'r2': [
    { id: 'm5', name: '巨無霸餐', price: 45, description: '經典巨無霸' },
    { id: 'm6', name: '麥樂雞餐', price: 38, description: '6件麥樂雞' },
    { id: 'm7', name: '魚柳包餐', price: 42, description: '魚柳包+薯條' },
  ],
};

// Mock drivers/drivers for ride
const NEARBY_DRIVERS = [
  { id: 'd1', name: '陳師傅', rating: 4.8, car: '豐田Camry', plate: 'HK 1234', eta: '2分鐘', lat: 22.320, lng: 114.170 },
  { id: 'd2', name: '李司機', rating: 4.6, car: 'Tesla Model 3', plate: 'HK 5678', eta: '3分鐘', lat: 22.318, lng: 114.168 },
  { id: 'd3', name: '王師傅', rating: 4.9, car: '平治E-Class', plate: 'HK 9012', eta: '4分鐘', lat: 22.321, lng: 114.171 },
];

const TABS = [
  { key: 'map', label: '地圖', emoji: '🗺️' },
  { key: 'delivery', label: '外賣', emoji: '🍜' },
  { key: 'taxi', label: '的士', emoji: '🚕' },
];

export const SuperAppScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>(MOCK_SEARCH_RESULTS);
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);
  
  // Delivery state
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [showRestaurant, setShowRestaurant] = useState(false);
  
  // Taxi state
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [showTaxiConfirm, setShowTaxiConfirm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  useEffect(() => {
    if (searchQuery) {
      setSearchResults(searchByQuery(searchQuery));
    } else {
      setSearchResults(searchByCategory(category));
    }
  }, [searchQuery, category]);

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const getCartTotal = () => {
    if (!selectedRestaurant) return 0;
    const items = MENU[selectedRestaurant.id] || [];
    return items.reduce((sum, item) => sum + (item.price * (cart[item.id] || 0)), 0);
  };

  const getCartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);

  // Map View
  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapText}>香港地圖</Text>
        <Text style={styles.mapSubtext}>實時位置：22.3193°N, 114.1694°E</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋餐廳、地點..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
        {SEARCH_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryChip, category === cat.key && styles.categoryChipActive]}
            onPress={() => setCategory(cat.key)}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text style={[styles.categoryText, category === cat.key && styles.categoryTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        style={styles.resultsList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultCard} onPress={() => setSelectedPlace(item)}>
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultCategory}>{item.category} · {item.distance}</Text>
              <Text style={styles.resultAddress}>{item.address}</Text>
            </View>
            {item.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {item.rating}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Place Detail Modal */}
      <Modal visible={!!selectedPlace} animationType="slide" transparent>
        {selectedPlace && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
                <TouchableOpacity onPress={() => setSelectedPlace(null)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.modalCategory}>{selectedPlace.category}</Text>
                <Text style={styles.modalAddress}>📍 {selectedPlace.address}</Text>
                {selectedPlace.phone && <Text style={styles.modalPhone}>📞 {selectedPlace.phone}</Text>}
                {selectedPlace.openingHours && <Text style={styles.modalHours}>🕐 {selectedPlace.openingHours}</Text>}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>🚕 叫車</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButtonPrimary}>
                    <Text style={styles.modalButtonTextPrimary}>🍜 外賣</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );

  // Food Delivery View
  const renderDeliveryView = () => (
    <View style={styles.deliveryContainer}>
      <View style={styles.deliveryHeader}>
        <Text style={styles.deliveryTitle}>🍜 外賣</Text>
        <View style={styles.deliveryAddress}>
          <Text style={styles.deliveryAddressText}>送至：中環皇后大道中99號</Text>
          <TouchableOpacity><Text style={styles.changeText}>更改</Text></TouchableOpacity>
        </View>
      </View>

      {/* Restaurant List */}
      <FlatList
        data={RESTAURANTS}
        keyExtractor={(item) => item.id}
        style={styles.restaurantList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.restaurantCard} onPress={() => { setSelectedRestaurant(item); setShowRestaurant(true); }}>
            <View style={styles.restaurantImage}>
              <Text style={styles.restaurantEmoji}>{item.image}</Text>
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text style={styles.restaurantMeta}>{item.category} · ⭐{item.rating} · {item.deliveryTime}</Text>
              <View style={styles.restaurantFooter}>
                <Text style={styles.deliveryFee}>{item.deliveryFee === 0 ? '免運費' : `運費$${item.deliveryFee}`}</Text>
                <Text style={styles.minOrder}>最低消費${item.minOrder}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Restaurant Menu Modal */}
      <Modal visible={showRestaurant} animationType="slide">
        {selectedRestaurant && (
          <View style={styles.fullModal}>
            <View style={styles.fullModalHeader}>
              <TouchableOpacity onPress={() => setShowRestaurant(false)}>
                <Text style={styles.backText}>← 返回</Text>
              </TouchableOpacity>
              <Text style={styles.fullModalTitle}>{selectedRestaurant.name}</Text>
              <View style={{ width: 50 }} />
            </View>
            <ScrollView style={styles.menuList}>
              {(MENU[selectedRestaurant.id] || []).map(item => (
                <View key={item.id} style={styles.menuItem}>
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuName}>{item.name}</Text>
                    <Text style={styles.menuDesc}>{item.description}</Text>
                    <Text style={styles.menuPrice}>${item.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item.id)}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            {getCartCount() > 0 && (
              <View style={styles.cartBar}>
                <View style={styles.cartInfo}>
                  <Text style={styles.cartCount}>{getCartCount()} 件</Text>
                  <Text style={styles.cartTotal}>共 $${getCartTotal()}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                  <Text style={styles.checkoutText}>落單</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </Modal>
    </View>
  );

  // Taxi View
  const renderTaxiView = () => (
    <View style={styles.taxiContainer}>
      <View style={styles.taxiHeader}>
        <Text style={styles.taxiTitle}>🚕 出行</Text>
      </View>

      <View style={styles.taxiForm}>
        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Text style={styles.inputIconText}>📍</Text>
          </View>
          <TextInput
            style={styles.taxiInput}
            placeholder="你喺邊？"
            placeholderTextColor={colors.textMuted}
            value={pickup}
            onChangeText={setPickup}
          />
        </View>
        <View style={styles.inputDivider} />
        <View style={styles.inputGroup}>
          <View style={[styles.inputIcon, { backgroundColor: colors.error + '20' }]}>
            <Text style={styles.inputIconText}>📍</Text>
          </View>
          <TextInput
            style={styles.taxiInput}
            placeholder="你想去邊？"
            placeholderTextColor={colors.textMuted}
            value={destination}
            onChangeText={setDestination}
          />
        </View>
      </View>

      <View style={styles.taxiOptions}>
        <Text style={styles.taxiOptionsTitle}>選擇車型</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.taxiOption, styles.taxiOptionActive]}>
            <Text style={styles.taxiOptionEmoji}>🚕</Text>
            <Text style={styles.taxiOptionName}>普通的士</Text>
            <Text style={styles.taxiOptionPrice}>$27 起步</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.taxiOption}>
            <Text style={styles.taxiOptionEmoji}>🚗</Text>
            <Text style={styles.taxiOptionName}>優選轎車</Text>
            <Text style={styles.taxiOptionPrice}>$45 起步</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.taxiOption}>
            <Text style={styles.taxiOptionEmoji}>🚙</Text>
            <Text style={styles.taxiOptionName}>豪華轎車</Text>
            <Text style={styles.taxiOptionPrice}>$80 起步</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={[styles.confirmButton, (!pickup || !destination) && styles.confirmButtonDisabled]}
        disabled={!pickup || !destination}
        onPress={() => setShowTaxiConfirm(true)}
      >
        <Text style={styles.confirmButtonText}>確認呼叫</Text>
      </TouchableOpacity>

      {/* Nearby Drivers */}
      <View style={styles.nearbyDrivers}>
        <Text style={styles.nearbyTitle}>附近司機</Text>
        {NEARBY_DRIVERS.map(driver => (
          <View key={driver.id} style={styles.driverCard}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverEmoji}>👨‍✈️</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverCar}>{driver.car} · {driver.plate}</Text>
              <View style={styles.driverRating}>
                <Text style={styles.driverRatingText}>⭐ {driver.rating}</Text>
              </View>
            </View>
            <View style={styles.driverEta}>
              <Text style={styles.driverEtaText}>{driver.eta}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Taxi Confirm Modal */}
      <Modal visible={showTaxiConfirm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>確認行程</Text>
            <View style={styles.confirmRoute}>
              <Text style={styles.confirmFrom}>📍 {pickup || '你喺邊'}</Text>
              <Text style={styles.confirmTo}>📍 {destination || '你想去邊'}</Text>
            </View>
            <View style={styles.confirmPrice}>
              <Text style={styles.confirmPriceLabel}>預計車費</Text>
              <Text style={styles.confirmPriceValue}>$85-120</Text>
            </View>
            <TouchableOpacity style={styles.confirmTaxiButton} onPress={() => setShowTaxiConfirm(false)}>
              <Text style={styles.confirmTaxiButtonText}>確認呼叫 🚕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTaxiConfirm(false)}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <View style={styles.container}>
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

      {/* Content */}
      {activeTab === 'map' && renderMapView()}
      {activeTab === 'delivery' && renderDeliveryView()}
      {activeTab === 'taxi' && renderTaxiView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.secondary },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: borderRadius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabEmoji: { fontSize: 20 },
  tabLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  tabLabelActive: { color: colors.text },
  // Map
  mapContainer: { flex: 1 },
  mapPlaceholder: { height: 250, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  mapEmoji: { fontSize: 64 },
  mapText: { color: colors.text, fontSize: 18, fontWeight: '600', marginTop: spacing.sm },
  mapSubtext: { color: colors.textMuted, fontSize: 13 },
  searchContainer: { position: 'absolute', top: 60, left: spacing.md, right: spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: spacing.md, marginLeft: spacing.sm },
  clearIcon: { color: colors.textMuted, fontSize: 16 },
  categoryFilter: { maxHeight: 50 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.xl, marginLeft: spacing.sm },
  categoryChipActive: { backgroundColor: colors.primary },
  categoryEmoji: { fontSize: 14 },
  categoryText: { color: colors.textMuted, fontSize: 12, marginLeft: 4 },
  categoryTextActive: { color: colors.text },
  resultsList: { flex: 1, padding: spacing.md },
  resultCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  resultInfo: { flex: 1 },
  resultName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  resultCategory: { color: colors.primary, fontSize: 12, marginTop: 2 },
  resultAddress: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  ratingBadge: { backgroundColor: colors.surfaceLight, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  ratingText: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg, padding: spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  modalClose: { color: colors.textMuted, fontSize: 20 },
  modalBody: {},
  modalCategory: { color: colors.primary, fontSize: 14, marginBottom: spacing.sm },
  modalAddress: { color: colors.text, fontSize: 14, marginBottom: 4 },
  modalPhone: { color: colors.text, fontSize: 14, marginBottom: 4 },
  modalHours: { color: colors.text, fontSize: 14, marginBottom: spacing.md },
  modalActions: { flexDirection: 'row', marginTop: spacing.md },
  modalButton: { flex: 1, backgroundColor: colors.surfaceLight, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', marginRight: spacing.sm },
  modalButtonPrimary: { flex: 1, backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center' },
  modalButtonText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  modalButtonTextPrimary: { color: colors.text, fontSize: 14, fontWeight: '600' },
  // Delivery
  deliveryContainer: { flex: 1 },
  deliveryHeader: { padding: spacing.md },
  deliveryTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: spacing.sm },
  deliveryAddress: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.md },
  deliveryAddressText: { flex: 1, color: colors.text, fontSize: 14 },
  changeText: { color: colors.primary, fontSize: 13 },
  restaurantList: { flex: 1, padding: spacing.md },
  restaurantCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.md, marginBottom: spacing.md, overflow: 'hidden' },
  restaurantImage: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceLight },
  restaurantEmoji: { fontSize: 40 },
  restaurantInfo: { flex: 1, padding: spacing.md },
  restaurantName: { color: colors.text, fontSize: 16, fontWeight: '600' },
  restaurantMeta: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  restaurantFooter: { flexDirection: 'row', marginTop: spacing.sm },
  deliveryFee: { color: colors.success, fontSize: 12, marginRight: spacing.md },
  minOrder: { color: colors.textMuted, fontSize: 12 },
  // Full Modal
  fullModal: { flex: 1, backgroundColor: colors.background },
  fullModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.surface },
  backText: { color: colors.primary, fontSize: 16 },
  fullModalTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  menuList: { flex: 1, padding: spacing.md },
  menuItem: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  menuInfo: { flex: 1 },
  menuName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  menuDesc: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  menuPrice: { color: colors.primary, fontSize: 15, fontWeight: '600', marginTop: 4 },
  addButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: colors.text, fontSize: 20, fontWeight: '600' },
  cartBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, padding: spacing.md },
  cartInfo: { flex: 1 },
  cartCount: { color: colors.text, fontSize: 14 },
  cartTotal: { color: colors.text, fontSize: 16, fontWeight: '700' },
  checkoutButton: { backgroundColor: colors.text, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: borderRadius.md },
  checkoutText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  // Taxi
  taxiContainer: { flex: 1, padding: spacing.md },
  taxiHeader: { marginBottom: spacing.md },
  taxiTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  taxiForm: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md },
  inputGroup: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.success + '20', justifyContent: 'center', alignItems: 'center' },
  inputIconText: { fontSize: 16 },
  taxiInput: { flex: 1, color: colors.text, fontSize: 16, marginLeft: spacing.md, paddingVertical: spacing.sm },
  inputDivider: { width: 2, height: 20, backgroundColor: colors.surfaceLight, marginLeft: 17, marginVertical: spacing.sm },
  taxiOptions: { marginTop: spacing.lg },
  taxiOptionsTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  taxiOption: { width: 120, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginRight: spacing.sm, alignItems: 'center' },
  taxiOptionActive: { borderWidth: 2, borderColor: colors.primary },
  taxiOptionEmoji: { fontSize: 28 },
  taxiOptionName: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 4 },
  taxiOptionPrice: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  confirmButton: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.lg },
  confirmButtonDisabled: { backgroundColor: colors.surfaceLight },
  confirmButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  nearbyDrivers: { marginTop: spacing.lg },
  nearbyTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  driverEmoji: { fontSize: 24 },
  driverInfo: { flex: 1, marginLeft: spacing.md },
  driverName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  driverCar: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  driverRating: {},
  driverRatingText: { color: colors.accent, fontSize: 12 },
  driverEta: { backgroundColor: colors.success + '20', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  driverEtaText: { color: colors.success, fontSize: 13, fontWeight: '600' },
  // Confirm Modal
  confirmModal: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg, padding: spacing.lg },
  confirmTitle: { color: colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: spacing.lg },
  confirmRoute: { backgroundColor: colors.surfaceLight, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md },
  confirmFrom: { color: colors.text, fontSize: 14, marginBottom: 4 },
  confirmTo: { color: colors.text, fontSize: 14 },
  confirmPrice: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  confirmPriceLabel: { color: colors.textMuted, fontSize: 14 },
  confirmPriceValue: { color: colors.primary, fontSize: 24, fontWeight: '700' },
  confirmTaxiButton: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center' },
  confirmTaxiButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  cancelText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.md },
});
