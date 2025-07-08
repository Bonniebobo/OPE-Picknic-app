import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { generateRecipes, Recipe } from '../services/recipeService';

interface RecipeResultsScreenProps {
  onBack: () => void;
  ingredients?: string[];
  imageData?: any;
  onChatMore: () => void;
}



export default function RecipeResultsScreen({ onBack, ingredients, imageData, onChatMore }: RecipeResultsScreenProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await generateRecipes({
          ingredients,
          imageData,
        });
        setRecipes(response.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredients, imageData]);

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToResults = () => {
    setSelectedRecipe(null);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i <= rating && styles.starFilled]}>
          {i <= rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderDifficultyBadge = (difficulty: string) => {
    const colors = {
      Easy: '#D1FAE5',
      Medium: '#FEF3C7',
      Hard: '#FECACA',
    };
    return (
      <View style={[styles.difficultyBadge, { backgroundColor: colors[difficulty as keyof typeof colors] }]}>
        <Text style={styles.difficultyText}>{difficulty}</Text>
      </View>
    );
  };

  if (selectedRecipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBackToResults}>
              <Text style={styles.backBtnText}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.headerBackText}>Recipe Details</Text>
          </View>

          {/* Recipe Details */}
          <View style={styles.recipeDetailCard}>
            <Text style={styles.recipeDetailName}>{selectedRecipe.name}</Text>
            <Text style={styles.recipeDetailDescription}>{selectedRecipe.description}</Text>
            
            <View style={styles.recipeMeta}>
              {renderStars(selectedRecipe.rating)}
              {renderDifficultyBadge(selectedRecipe.difficulty)}
            </View>

            <View style={styles.timeInfo}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Prep</Text>
                <Text style={styles.timeValue}>{selectedRecipe.prepTime}</Text>
              </View>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Cook</Text>
                <Text style={styles.timeValue}>{selectedRecipe.cookTime}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientBullet}>•</Text>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {selectedRecipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>{index + 1}</Text>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerBackText}>Recipe Results</Text>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>🍽️ Recipe Suggestions</Text>
          <Text style={styles.resultsSubtitle}>
            Based on {ingredients ? `${ingredients.length} ingredients` : 'your photo'}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingIcon}>🔍</Text>
            <Text style={styles.loadingText}>Finding perfect recipes...</Text>
          </View>
        ) : (
          <>
            <View style={styles.recipesContainer}>
              {recipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeCard}
                  onPress={() => handleRecipeSelect(recipe)}
                  activeOpacity={0.85}
                >
                  <View style={styles.recipeCardContent}>
                    <View style={styles.recipeHeader}>
                      <Text style={styles.recipeName}>{recipe.name}</Text>
                      {renderDifficultyBadge(recipe.difficulty)}
                    </View>
                    
                    <Text style={styles.recipeDescription}>{recipe.description}</Text>
                    
                    <View style={styles.recipeFooter}>
                      <View style={styles.recipeMeta}>
                        {renderStars(recipe.rating)}
                        <Text style={styles.recipeTime}>
                          ⏱️ {recipe.prepTime} + {recipe.cookTime}
                        </Text>
                      </View>
                      
                      <Text style={styles.viewRecipeText}>View Recipe →</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {/* Chat More Button */}
            <TouchableOpacity style={styles.chatMoreBtn} onPress={onChatMore}>
              <Text style={styles.chatMoreBtnText}>💬 Chat more about your preferences</Text>
            </TouchableOpacity>
          </>
        )}
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
  resultsHeader: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  recipesContainer: {
    paddingHorizontal: 24,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  recipeCardContent: {
    padding: 20,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  starFilled: {
    color: '#FBBF24',
  },
  recipeTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewRecipeText: {
    fontSize: 14,
    color: '#FB7185',
    fontWeight: '600',
  },
  recipeDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  recipeDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  recipeDetailDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeInfo: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientBullet: {
    fontSize: 16,
    color: '#FB7185',
    marginRight: 12,
    fontWeight: 'bold',
  },
  ingredientText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FB7185',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    lineHeight: 22,
  },
  chatMoreBtn: {
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 24,
    shadowColor: '#D8B4FE',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  chatMoreBtnText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 