import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import ChooseIngredientsScreen from './ChooseIngredientsScreen';
import PhotoDishScreen from './PhotoDishScreen';
import RecipeResultsScreen from './RecipeResultsScreen';
import ScanIngredientsScreen from './ScanIngredientsScreen';
import RecipeChatBoxScreen from './RecipeChatBoxScreen';
import { fetchRecipesFromEdamam } from '../services/edamamService';

const botData: any = {
  'mood-matcher': {
    name: 'Mood Matcher',
    emoji: '🩷',
    background: '#FCE7F3',
    description: 'I understand your emotions and give comforting food suggestions',
    options: [
      { id: 'select-mood', title: 'Tell me your mood', description: ",Select how you're feeling right now", icon: '😊', background: '#FFF1F2' },
      { id: 'upload-selfie', title: 'Upload a selfie', description: ",I'll detect your mood from your expression", icon: '📸', background: '#FFF1F2' },
    ],
  },
  'experienced-explorer': {
    name: 'Experienced Explorer',
    emoji: '🌍',
    background: '#DCFCE7',
    description: 'A wise culinary adventurer who knows hidden gems around the world',
    options: [
      { id: 'share-location', title: 'Share your location', description: 'Discover authentic restaurants nearby', icon: '📍', background: '#ECFDF5' },
      { id: 'upload-scene', title: 'Upload scene photo', description: ",I'll suggest local cuisine from your photo", icon: '🏞️', background: '#ECFDF5' },
      { id: 'explore-flavors', title: 'Explore new flavors', description: 'Try untried flavor profiles and cuisines', icon: '🌶️', background: '#ECFDF5' },
    ],
  },
  'recipe-helper': {
    name: 'Recipe Helper',
    emoji: '🥕',
    background: '#FFEDD5',
    description: 'Your caring kitchen companion who helps you decide what to cook',
    options: [
      { id: 'select-ingredients', title: 'Choose ingredients', description: 'Select what you have or want to use', icon: '🥬', background: '#FFFBEB' },
      { id: 'photo-dish', title: 'Photo your dish', description: "I'll extract ingredients and recipes from your photo", icon: '📷', background: '#FFFBEB' },
    ],
  },
  'play-mode-bot': {
    name: 'Play Mode Bot',
    emoji: '🎮',
    background: '#E9D5FF',
    description: 'A fun, playful bot that helps you choose food through interactive games',
    options: [
      { id: 'spin-wheel', title: 'Spin the wheel', description: 'Let the wheel decide your meal', icon: '🎡', background: '#F5F3FF' },
      { id: 'this-or-that', title: 'This or That', description: 'Quick elimination game to find your pick', icon: '⚖️', background: '#F5F3FF' },
      { id: 'play-with-friend', title: 'Play with a friend', description: 'Multiplayer voting game', icon: '👥', background: '#F5F3FF' },
    ],
  },
};

export default function BotInteractionScreen({ botId, eatingPreference, onBack }: { botId: string; eatingPreference: string; onBack: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<any>(null);
  const [showChooseIngredients, setShowChooseIngredients] = useState(false);
  const [showPhotoDish, setShowPhotoDish] = useState(false);
  const [showScanIngredients, setShowScanIngredients] = useState(false);
  const [showRecipeResults, setShowRecipeResults] = useState(false);
  const [showRecipeChat, setShowRecipeChat] = useState(false);
  const [recipeData, setRecipeData] = useState<any>(null);
  const [previousScreen, setPreviousScreen] = useState<string | null>(null);

  const bot = botData[botId as keyof typeof botData];

  if (showRecipeChat) {
    return (
      <RecipeChatBoxScreen 
        onBack={() => setShowRecipeChat(false)}
        onPicnic={(chatHistory) => {
          // Handle final recipe generation with chat history
          console.log('Chat history for final recipe:', chatHistory);
          setShowRecipeChat(false);
          // Could navigate to final recipe results here
        }}
        initialIngredients={recipeData?.ingredients}
      />
    );
  }

  if (showRecipeResults) {
    return (
      <RecipeResultsScreen 
        onBack={() => {
          setShowRecipeResults(false);
          // Return to the previous screen based on what led to recipe results
          if (previousScreen === 'choose-ingredients') {
            setShowChooseIngredients(true);
          } else if (previousScreen === 'photo-dish') {
            setShowPhotoDish(true);
          } else if (previousScreen === 'scan-ingredients') {
            setShowScanIngredients(true);
          }
        }}
        ingredients={recipeData?.ingredients}
        imageData={recipeData?.imageData}
        recipes={recipeData?.recipes}
        onChatMore={() => setShowRecipeChat(true)}
      />
    );
  }

  if (showScanIngredients) {
    return (
      <ScanIngredientsScreen 
        onBack={() => setShowScanIngredients(false)}
        onConfirm={(ingredients) => {
          setRecipeData({ ingredients });
          setPreviousScreen('scan-ingredients');
          setShowScanIngredients(false);
          setShowRecipeResults(true);
        }}
      />
    );
  }

  if (showChooseIngredients) {
    return (
      <ChooseIngredientsScreen 
        onBack={() => setShowChooseIngredients(false)}
        onContinue={async (ingredients) => {
          // 调用Edamam API获取真实菜谱
          const recipes = await fetchRecipesFromEdamam(ingredients);
          setRecipeData({ ingredients, recipes });
          setPreviousScreen('choose-ingredients');
          setShowChooseIngredients(false);
          setShowRecipeResults(true);
        }}
        onScanIngredients={() => {
          setShowChooseIngredients(false);
          setShowScanIngredients(true);
        }}
      />
    );
  }

  if (showPhotoDish) {
    return (
      <PhotoDishScreen 
        onBack={() => setShowPhotoDish(false)}
        onGetRecipe={(imageData) => {
          setRecipeData({ imageData });
          setPreviousScreen('photo-dish');
          setShowPhotoDish(false);
          setShowRecipeResults(true);
        }}
      />
    );
  }



  if (!bot) {
    return (
      <SafeAreaView style={styles.safeArea}><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Bot not found</Text></View></SafeAreaView>
    );
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    if (optionId === 'photo-dish') {
      setShowPhotoDish(true);
      return;
    }
    if (optionId === 'select-ingredients') {
      setShowChooseIngredients(true);
      return;
    }
    // Simulate collecting user context based on the option
    const mockContext: any = {
      'select-mood': 'cozy',
      'upload-selfie': 'happy',
      'share-location': 'downtown',
      'upload-scene': 'local_market',
      'explore-flavors': 'spicy',
      'select-ingredients': ['tomato', 'basil', 'cheese'],
      'photo-dish': ['eggs', 'milk', 'vegetables'],
    };
    setUserContext(mockContext[optionId]);
  };





  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            {/* <ArrowLeft /> */}
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerBackText}>Back to Home</Text>
        </View>
        {/* Bot Header */}
        <View style={[styles.botCard, { backgroundColor: bot.background }] }>
          <Text style={styles.botEmoji}>{bot.emoji}</Text>
          <Text style={styles.botName}>{bot.name}</Text>
          <Text style={styles.botDesc}>{bot.description}</Text>
        </View>
        {/* Interaction Options */}
        <Text style={styles.optionsTitle}>How would you like to start?</Text>
        <View style={{ marginBottom: 24 }}>
          {bot.options.map((option: any) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, { backgroundColor: option.background }, selectedOption === option.id && styles.optionCardSelected]}
              onPress={() => handleOptionSelect(option.id)}
              activeOpacity={0.85}
            >
              <View style={styles.optionRow}>
                <View style={styles.optionIconBox}>
                  {/* 图标可用 emoji 或后续用 vector-icons 替换 */}
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDesc}>{option.description}</Text>
                </View>
                {selectedOption === option.id && (
                  <View style={styles.selectedDotOuter}>
                    <View style={styles.selectedDotInner} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
  botEmoji: { fontSize: 48, marginBottom: 8 },
  botName: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  botDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  optionsTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginLeft: 24, marginBottom: 12 },
  optionCard: { borderRadius: 24, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2, padding: 16 },
  optionCardSelected: { borderWidth: 2, borderColor: '#FB7185', shadowOpacity: 0.18, elevation: 3, transform: [{ scale: 1.02 }] },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  optionIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center', marginRight: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  optionIcon: { fontSize: 28 },
  optionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  optionDesc: { fontSize: 13, color: '#6B7280' },
  selectedDotOuter: { width: 24, height: 24, backgroundColor: '#FB7185', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  selectedDotInner: { width: 8, height: 8, backgroundColor: '#fff', borderRadius: 4 },
}); 