import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';

interface PicknicResultsScreenProps {
  botId: string;
  eatingPreference: string;
  onBack: () => void;
  userContext?: any;
}

const diningModes = [
  { id: 'cook', name: 'Cook at Home', emoji: '🍳', background: '#FFEDD5' },
  { id: 'delivery', name: 'Order Delivery', emoji: '🛵', background: '#DBEAFE' },
  { id: 'restaurant', name: 'Go Out', emoji: '🍽️', background: '#E9D5FF' },
];

const botContextData: any = {
  'mood-matcher': {
    name: 'Mood Matcher',
    emoji: '🩷',
    background: '#FCE7F3',
    getSuggestions: (mood = 'cozy') => ({
      cook: {
        dish: 'Comforting Chicken Soup',
        description: 'Perfect comfort dish to warm your heart on a quiet evening',
        image: undefined,
        reason: 'Matches your cozy mood',
      },
      delivery: {
        dish: 'Thai Comfort Curry',
        description: 'Soothing flavors delivered to your doorstep',
        image: undefined,
        reason: 'Gentle spices for emotional comfort',
      },
      restaurant: {
        dish: 'Cozy Café Brunch',
        description: 'Warm atmosphere perfect for your current mood',
        image: undefined,
        reason: 'Peaceful dining environment',
      },
    }),
  },
  'experienced-explorer': {
    name: 'Experienced Explorer',
    emoji: '🌍',
    background: '#DCFCE7',
    getSuggestions: (location = 'local') => ({
      cook: {
        dish: 'Authentic Sichuan Mapo Tofu',
        description: 'Master this regional classic with traditional techniques',
        image: undefined,
        reason: 'Authentic cultural experience',
      },
      delivery: {
        dish: 'Hidden Gem Dumplings',
        description: 'Family-run restaurant with 30-year secret recipe',
        image: undefined,
        reason: 'Local culinary treasure',
      },
      restaurant: {
        dish: 'Underground Ramen Bar',
        description: 'Hidden local ramen gem in a quiet alley nearby',
        image: undefined,
        reason: 'Authentic neighborhood discovery',
      },
    }),
  },
  'recipe-helper': {
    name: 'Recipe Helper',
    emoji: '🥕',
    background: '#FFEDD5',
    getSuggestions: (ingredients: string[] = ['tomato', 'basil']) => ({
      cook: {
        dish: 'Fresh Tomato Basil Pasta',
        description: 'Perfect use of your fresh ingredients in 20 minutes',
        image: undefined,
        reason: 'Uses your available ingredients',
      },
      delivery: {
        dish: 'Italian Trattoria Special',
        description: 'Similar flavors professionally prepared and delivered',
        image: undefined,
        reason: 'Matches your ingredient preferences',
      },
      restaurant: {
        dish: 'Farm-to-Table Italian',
        description: 'Restaurant specializing in fresh, seasonal ingredients',
        image: undefined,
        reason: 'Celebrates fresh ingredients like yours',
      },
    }),
  },
};

export default function PicknicResultsScreen({ botId, eatingPreference, onBack, userContext }: PicknicResultsScreenProps) {
  const [selectedMode, setSelectedMode] = useState<string>(eatingPreference || '');
  const [showModeSelector, setShowModeSelector] = useState(!eatingPreference || eatingPreference === 'unsure');

  const botData = botContextData[botId as keyof typeof botContextData];
  if (!botData) {
    return (
      <SafeAreaView style={styles.safeArea}><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Bot not found</Text></View></SafeAreaView>
    );
  }
  const suggestions = botData.getSuggestions(userContext);

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    setShowModeSelector(false);
  };

  const handleSuggestionAction = (modeId: string, suggestion: any) => {
    // Can integrate navigation to detail page
  };

  const handleSwitchMode = () => {
    setShowModeSelector(true);
  };

  // If no mode selected, show mode selector
  if (showModeSelector) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={onBack}>
              {/* <ArrowLeft /> */}
              <Text style={styles.backBtnText}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.headerBackText}>Choose Dining Mode</Text>
          </View>
          {/* Bot Header */}
          <View style={[styles.botCard, { backgroundColor: botData.background }] }>
            <Text style={styles.botEmoji}>{botData.emoji}</Text>
            <Text style={styles.botName}>{botData.name}</Text>
            <Text style={styles.botDesc}>How would you like to enjoy your meal?</Text>
          </View>
          {/* Mode Selection */}
          <View style={{ marginBottom: 24 }}>
            {diningModes.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[styles.modeCard, { backgroundColor: mode.background }]}
                onPress={() => handleModeSelect(mode.id)}
                activeOpacity={0.85}
              >
                <View style={styles.modeRow}>
                  <View style={styles.modeIconBox}>
                    {/* Icon can use emoji or vector-icons later */}
                    <Text style={styles.modeIcon}>{mode.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modeTitle}>{mode.name}</Text>
                    <Text style={styles.modeDesc}>
                      {mode.id === 'cook' && 'Prepare something delicious at home'}
                      {mode.id === 'delivery' && 'Get your favorites delivered'}
                      {mode.id === 'restaurant' && 'Discover a great place to dine'}
                    </Text>
                  </View>
                  <Text style={styles.modeEmoji}>{mode.emoji}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Show suggestions for selected mode
  const currentMode = diningModes.find((mode) => mode.id === selectedMode);
  const currentSuggestions = Object.entries(suggestions).map(([key, value]) => ({
    modeId: key,
    ...value,
    mode: diningModes.find((m) => m.id === key),
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            {/* <ArrowLeft /> */}
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerBackText}>Your Picknic Results</Text>
        </View>
        {/* Bot Context Header */}
        <View style={[styles.botCard, { backgroundColor: botData.background }] }>
          <Text style={styles.botEmoji}>{botData.emoji}</Text>
          <Text style={styles.botName}>{botData.name} Suggestions</Text>
          <Text style={styles.botDesc}>Curated just for you</Text>
          <TouchableOpacity style={styles.switchModeBtn} onPress={handleSwitchMode} activeOpacity={0.7}>
            <Text style={styles.switchModeBtnText}>Switch Mode</Text>
          </TouchableOpacity>
        </View>
        {/* Current Mode Indicator */}
        {currentMode && (
          <View style={styles.currentModeRow}>
            <View style={[styles.currentModeBadge, { backgroundColor: currentMode.background }] }>
              <Text style={styles.currentModeIcon}>{currentMode.emoji}</Text>
              <Text style={styles.currentModeName}>{currentMode.name}</Text>
            </View>
          </View>
        )}
        {/* Suggestions */}
        <View style={{ marginBottom: 24 }}>
          {currentSuggestions.map((suggestion) => (
            <View key={suggestion.modeId} style={[styles.suggestionCard, { backgroundColor: suggestion.mode?.background || '#FFF' }] }>
              {/* Image */}
              <View style={styles.suggestionImageBox}>
                {/* <Image source={{ uri: suggestion.image || undefined }} style={styles.suggestionImage} /> */}
                <View style={styles.suggestionImagePlaceholder}><Text style={{ color: '#9CA3AF' }}>Image</Text></View>
                <View style={styles.suggestionModeBadge}><Text style={styles.suggestionModeBadgeText}>{suggestion.mode?.name}</Text></View>
              </View>
              {/* Content */}
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionDish}>{suggestion.dish}</Text>
                <Text style={styles.suggestionDesc}>{suggestion.description}</Text>
                <View style={styles.suggestionReasonRow}>
                  <Text style={styles.suggestionReason}>💡 {suggestion.reason}</Text>
                </View>
                <TouchableOpacity style={styles.suggestionActionBtn} onPress={() => handleSuggestionAction(suggestion.modeId, suggestion)} activeOpacity={0.85}>
                  <Text style={styles.suggestionActionBtnText}>
                    {suggestion.modeId === 'cook' && 'Get Recipe'}
                    {suggestion.modeId === 'delivery' && 'Order Now'}
                    {suggestion.modeId === 'restaurant' && 'See Details'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        {/* Bottom Action */}
        <TouchableOpacity style={styles.tryOtherBtn} onPress={onBack} activeOpacity={0.85}>
          <Text style={styles.tryOtherBtnText}>Try Different Options</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF7ED' },
  scrollContainer: { flexGrow: 1, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 32, paddingBottom: 8, paddingHorizontal: 24, gap: 12 },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.7)', marginRight: 8 },
  backBtnText: { fontSize: 18, color: '#FB7185', fontWeight: 'bold' },
  headerBackText: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  botCard: { alignItems: 'center', borderRadius: 24, marginHorizontal: 24, marginBottom: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2 },
  botEmoji: { fontSize: 44, marginBottom: 8 },
  botName: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  botDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  switchModeBtn: { marginTop: 8, backgroundColor: '#FCE7F3', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 18 },
  switchModeBtnText: { color: '#FB7185', fontWeight: 'bold', fontSize: 14 },
  modeCard: { borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2, padding: 16 },
  modeRow: { flexDirection: 'row', alignItems: 'center' },
  modeIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center', marginRight: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  modeIcon: { fontSize: 28 },
  modeTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  modeDesc: { fontSize: 13, color: '#6B7280' },
  modeEmoji: { fontSize: 24, marginLeft: 8 },
  currentModeRow: { alignItems: 'center', marginBottom: 12 },
  currentModeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  currentModeIcon: { fontSize: 18, marginRight: 6 },
  currentModeName: { fontSize: 14, fontWeight: 'bold', color: '#374151' },
  suggestionCard: { borderRadius: 24, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2 },
  suggestionImageBox: { height: 120, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  suggestionImagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  suggestionModeBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  suggestionModeBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  suggestionContent: { padding: 16 },
  suggestionDish: { fontSize: 17, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  suggestionDesc: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  suggestionReasonRow: { marginBottom: 8 },
  suggestionReason: { fontSize: 12, backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, color: '#374151', fontWeight: '500' },
  suggestionActionBtn: { backgroundColor: '#FB7185', borderRadius: 16, paddingVertical: 12, alignItems: 'center', marginTop: 4, shadowColor: '#FB7185', shadowOpacity: 0.12, shadowRadius: 8, elevation: 2 },
  suggestionActionBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  tryOtherBtn: { marginHorizontal: 24, marginTop: 8, backgroundColor: '#F3F4F6', borderRadius: 32, paddingVertical: 16, alignItems: 'center', shadowColor: '#FB7185', shadowOpacity: 0.08, shadowRadius: 8, elevation: 1 },
  tryOtherBtnText: { color: '#FB7185', fontSize: 15, fontWeight: 'bold' },
}); 