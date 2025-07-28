import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { identify_food_from_image_gemini } from '../services/geminiImageAnalysis';
import { fetchRecipesFromEdamam } from '../services/edamamService';

interface PhotoDishScreenProps {
  onBack: () => void;
  onGetRecipe: (imageData: any) => void;
}

export default function PhotoDishScreen({ onBack, onGetRecipe }: PhotoDishScreenProps) {
  const [hasImage, setHasImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [identifiedIngredients, setIdentifiedIngredients] = useState<string[]>([]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library permissions are required to use this feature.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setHasImage(true);
        setImageUri(asset.uri);
        setImageBase64(asset.base64 || null);
        setIdentifiedIngredients([]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleUploadPhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setHasImage(true);
        setImageUri(asset.uri);
        setImageBase64(asset.base64 || null);
        setIdentifiedIngredients([]);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    }
  };

  const handleRetakePhoto = () => {
    setHasImage(false);
    setImageUri(null);
    setImageBase64(null);
    setIdentifiedIngredients([]);
  };

  // Helper: fuzzy ingredient match (ignores case, plurals, adjectives)
  function isIngredientMatch(recipeIngredient: string, userIngredients: string[]) {
    // Normalize: lowercase, remove punctuation, trim, singularize (basic)
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\bes?\b/g, '').trim();
    const recipeWords = normalize(recipeIngredient).split(' ');
    // Try to find a user ingredient that matches any word in the recipe ingredient
    return userIngredients.some(userIng => {
      const userNorm = normalize(userIng);
      // If any word in the recipe ingredient matches the user ingredient
      return recipeWords.some(word => word && userNorm.includes(word));
    });
  }

  // Helper: check if recipe uses only user ingredients (strict filtering)
  function recipeUsesOnlyUserIngredients(recipe: any, userIngredients: string[]) {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      console.log('Recipe has no ingredients array:', recipe.name);
      return false;
    }
    
    console.log(`Checking recipe "${recipe.name}" with ${recipe.ingredients.length} ingredients`);
    console.log('Recipe ingredients:', recipe.ingredients);
    console.log('User ingredients:', userIngredients);
    
    // Check if every ingredient in the recipe matches a user ingredient
    const allIngredientsMatch = recipe.ingredients.every((ingredient: string) => {
      const matches = isIngredientMatch(ingredient, userIngredients);
      if (!matches) {
        console.log(`❌ Ingredient "${ingredient}" not found in user ingredients`);
      }
      return matches;
    });
    
    if (allIngredientsMatch) {
      console.log(`✅ Recipe "${recipe.name}" uses only user ingredients`);
    } else {
      console.log(`❌ Recipe "${recipe.name}" requires additional ingredients`);
    }
    
    return allIngredientsMatch;
  }

  const handleGetRecipe = async () => {
    if (!hasImage || !imageBase64) {
      Alert.alert('No Photo', 'Please take or upload a photo first.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Step 1: Identify ingredients from image using Gemini Vision
      console.log('Analyzing image for ingredients...');
      const result = await identify_food_from_image_gemini(imageBase64);
      
      let ingredients = [];
      if (result.type === 'dish') {
        console.log('Detected dish:', result.dishName);
        ingredients = result.ingredients;
        setIdentifiedIngredients(ingredients);
      } else {
        console.log('Detected ingredients:', result.ingredients);
        ingredients = result.ingredients;
        setIdentifiedIngredients(ingredients);
      }
      
      // Step 2: Fetch recipes from Edamam API
      console.log('Fetching recipes for ingredients:', ingredients);
      let recipes = await fetchRecipesFromEdamam(ingredients);

      // Step 2.5: Filter recipes to only those using only user-selected ingredients
      console.log(`Filtering ${recipes.length} recipes to only use user ingredients...`);
      const filteredRecipes = recipes.filter((recipe: any) => 
        recipeUsesOnlyUserIngredients(recipe, ingredients)
      );
      console.log(`Found ${filteredRecipes.length} recipes that use only user ingredients`);

      // Step 3: Pass data to parent component
      onGetRecipe({
        imageUri,
        imageBase64,
        ingredients,
        recipes: filteredRecipes,
        source: 'photo-analysis'
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert(
        'Processing Error',
        'Failed to analyze the image. Please try again with a clearer photo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerBackText}>Photo Your Dish</Text>
        </View>

        {/* Bot Header */}
        <View style={styles.botCard}>
          <Text style={styles.botEmoji}>📷</Text>
          <Text style={styles.botName}>Photo Your Dish</Text>
          <Text style={styles.botDesc}>I'll identify ingredients and suggest recipes from your photo</Text>
        </View>

        {/* Photo Area */}
        <View style={styles.photoSection}>
          {!hasImage ? (
            <View style={styles.uploadArea}>
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadTitle}>Take a photo of your dish</Text>
              <Text style={styles.uploadSubtitle}>Or upload from your gallery</Text>
              
              <View style={styles.uploadButtons}>
                <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto}>
                  <Text style={styles.uploadButtonIcon}>📷</Text>
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
                  <Text style={styles.uploadButtonIcon}>📁</Text>
                  <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri! }} style={styles.previewImage} />
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
                <Text style={styles.retakeButtonText}>🔄 Retake</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Identified Ingredients */}
        {identifiedIngredients.length > 0 && (
          <View style={styles.ingredientsSection}>
            <Text style={styles.ingredientsTitle}>Identified ingredients:</Text>
            <View style={styles.ingredientsList}>
              {identifiedIngredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>• {ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>Tips for best results:</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>💡</Text>
              <Text style={styles.instructionText}>Ensure good lighting</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>📐</Text>
              <Text style={styles.instructionText}>Capture the full dish</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🎯</Text>
              <Text style={styles.instructionText}>Focus on ingredients</Text>
            </View>
          </View>
        </View>

        {/* Get Recipe Button */}
        <TouchableOpacity
          style={[styles.getRecipeButton, (!hasImage || isProcessing) && styles.getRecipeButtonDisabled]}
          onPress={handleGetRecipe}
          disabled={!hasImage || isProcessing}
        >
          <Text style={styles.getRecipeButtonText}>
            {isProcessing ? '🔍 Analyzing...' : '🍽️ Get Recipe'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFF7ED' 
  },
  scrollContainer: { 
    flexGrow: 1, 
    paddingBottom: 24 
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 32, 
    paddingBottom: 8, 
    paddingHorizontal: 24, 
    gap: 12 
  },
  backBtn: { 
    padding: 8, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.7)', 
    marginRight: 8 
  },
  backBtnText: { 
    fontSize: 18, 
    color: '#FB7185', 
    fontWeight: 'bold' 
  },
  headerBackText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1F2937' 
  },
  botCard: { 
    alignItems: 'center', 
    borderRadius: 24, 
    marginHorizontal: 24, 
    marginBottom: 24, 
    padding: 24, 
    backgroundColor: '#FFFBEB',
    shadowColor: '#000', 
    shadowOpacity: 0.10, 
    shadowRadius: 8, 
    elevation: 2 
  },
  botEmoji: { 
    fontSize: 48, 
    marginBottom: 8 
  },
  botName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    marginBottom: 4 
  },
  botDesc: { 
    fontSize: 15, 
    color: '#6B7280', 
    textAlign: 'center' 
  },
  photoSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  uploadArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  uploadButton: {
    backgroundColor: '#FB7185',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  uploadButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  imagePreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  retakeButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retakeButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  ingredientsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  ingredientsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  ingredientItem: {
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: '#6B7280',
  },
  instructionsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  instructionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  getRecipeButton: {
    backgroundColor: '#FB7185',
    borderRadius: 24,
    paddingVertical: 16,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  getRecipeButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  getRecipeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 