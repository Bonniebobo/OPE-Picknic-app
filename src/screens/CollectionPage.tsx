import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const likedItems = [
  { id: '1', name: 'Homemade Ramen', type: 'recipe', emoji: '🍜', category: 'Comfort Food', mood: 'Cozy', background: '#FFEDD5' },
  { id: '2', name: 'Sakura Sushi', type: 'restaurant', emoji: '🍣', category: 'Japanese', mood: 'Adventurous', background: '#FCE7F3' },
  { id: '3', name: 'Thai Green Curry', type: 'recipe', emoji: '🍛', category: 'Spicy', mood: 'Energetic', background: '#DCFCE7' },
  { id: '4', name: 'Artisan Pizza Co.', type: 'restaurant', emoji: '🍕', category: 'Italian', mood: 'Social', background: '#FECACA' },
];

const dislikedItems = [
  { id: '1', name: 'Spicy Szechuan Noodles', type: 'dish', emoji: '🍜', reason: 'Too spicy for my taste', background: '#FECACA', category: 'Chinese' },
  { id: '2', name: 'Raw Oysters', type: 'dish', emoji: '🦪', reason: 'Texture and seafood allergy', background: '#DBEAFE', category: 'Seafood' },
  { id: '3', name: 'Liver and Onions', type: 'dish', emoji: '🍽️', reason: 'Strong flavor preference', background: '#F3F4F6', category: 'Traditional' },
  { id: '4', name: 'Blue Cheese Salad', type: 'dish', emoji: '🥗', reason: 'Too pungent for me', background: '#FEF3C7', category: 'Salads' },
  { id: '5', name: 'Fermented Tofu Hotpot', type: 'dish', emoji: '🍲', reason: 'Strong fermented smell', background: '#E0E7FF', category: 'Asian' },
];

export default function CollectionPage() {
  const [activeSection, setActiveSection] = useState<'liked' | 'disliked'>('liked');
  const [showFilters, setShowFilters] = useState(false);

  const handleAddNew = () => {
    console.log('Adding new item to', activeSection);
  };

  const handleRemoveItem = (itemId: string, section: 'liked' | 'disliked') => {
    console.log('Removing item', itemId, 'from', section);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Collection</Text>
          <Text style={styles.headerSubtitle}>Your food preferences</Text>
        </View>

        {/* Section Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleButton, activeSection === 'liked' && styles.toggleButtonActive]}
            onPress={() => setActiveSection('liked')}
            activeOpacity={0.85}
          >
            <Text style={[styles.toggleButtonText, activeSection === 'liked' && styles.toggleButtonTextActive]}>❤️ Liked</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeSection === 'disliked' && styles.toggleButtonActive]}
            onPress={() => setActiveSection('disliked')}
            activeOpacity={0.85}
          >
            <Text style={[styles.toggleButtonText, activeSection === 'disliked' && styles.toggleButtonTextActive]}>🚫 Disliked</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Button */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.85}
          >
            {/* <Filter /> */}
            <Text style={styles.filterIcon}>🔍</Text>
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentRow}>
          {activeSection === 'liked' ? (
            <View>
              {likedItems.map((item) => (
                <View key={item.id} style={[styles.card, { backgroundColor: item.background }] }>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <View style={styles.cardTagsRow}>
                        <Text style={styles.cardTag}>{item.type}</Text>
                        <Text style={styles.cardTag}>{item.category}</Text>
                      </View>
                      <Text style={styles.cardMood}>{item.mood}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.cardActionBtn}
                      onPress={() => handleRemoveItem(item.id, 'liked')}
                      activeOpacity={0.7}
                    >
                      {/* <Heart /> */}
                      <Text style={styles.heartIcon}>❤️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View>
              {dislikedItems.map((item) => (
                <View key={item.id} style={[styles.card, { backgroundColor: item.background }] }>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <View style={styles.cardTagsRow}>
                        <Text style={styles.cardTag}>{item.type}</Text>
                        <Text style={styles.cardTag}>{item.category}</Text>
                      </View>
                      <Text style={styles.cardMood}>{item.reason}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.cardActionBtn}
                      onPress={() => handleRemoveItem(item.id, 'disliked')}
                      activeOpacity={0.7}
                    >
                      {/* <X /> */}
                      <Text style={styles.xIcon}>✖️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Add New Button */}
          <TouchableOpacity
            style={styles.addNewBtn}
            onPress={handleAddNew}
            activeOpacity={0.85}
          >
            {/* <Plus /> */}
            <Text style={styles.plusIcon}>➕</Text>
            <Text style={styles.addNewBtnText}>Add {activeSection === 'liked' ? 'Favorite' : 'Dislike'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  scrollContainer: { flexGrow: 1, paddingBottom: 24 },
  header: { alignItems: 'center', paddingTop: 48, paddingBottom: 24, paddingHorizontal: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  headerSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  toggleRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32, marginHorizontal: 24, marginBottom: 24, padding: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  toggleButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  toggleButtonActive: { backgroundColor: '#FB7185', shadowColor: '#FB7185', shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },
  toggleButtonText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  toggleButtonTextActive: { color: '#fff' },
  filterRow: { flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 24, marginBottom: 12 },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 16 },
  filterIcon: { fontSize: 18, marginRight: 6 },
  filterButtonText: { fontSize: 15, color: '#6B7280', fontWeight: '600' },
  contentRow: { marginHorizontal: 24 },
  card: { borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2 },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  cardEmoji: { fontSize: 32, marginRight: 16 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  cardTagsRow: { flexDirection: 'row', gap: 6, marginBottom: 2 },
  cardTag: { fontSize: 12, backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, color: '#374151', marginRight: 6, marginBottom: 2 },
  cardMood: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  cardActionBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.4)' },
  heartIcon: { fontSize: 20, color: '#FB7185' },
  xIcon: { fontSize: 20, color: '#6B7280' },
  plusIcon: { fontSize: 20, color: '#fff', marginRight: 8 },
  addNewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FB7185', borderRadius: 32, paddingVertical: 16, marginTop: 32, marginBottom: 16, shadowColor: '#FB7185', shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },
  addNewBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
}); 