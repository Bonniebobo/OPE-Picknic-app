import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { DetailedRecipe } from '../services/fetchRecipeDetails';

interface RecipeDetailModalProps {
  visible: boolean;
  onClose: () => void;
  recipe: DetailedRecipe | null;
  isLoading?: boolean;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  visible,
  onClose,
  recipe,
  isLoading = false,
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleOpenUrl = async () => {
    if (recipe?.url) {
      try {
        const supported = await Linking.canOpenURL(recipe.url);
        if (supported) {
          await Linking.openURL(recipe.url);
        } else {
          Alert.alert('Error', 'Unable to open link');
        }
      } catch (error) {
        console.error('Failed to open link:', error);
        Alert.alert('Error', 'Failed to open link');
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB7185" />
          <Text style={styles.loadingText}>Loading recipe details...</Text>
        </View>
      );
    }

    if (!recipe) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>😔</Text>
          <Text style={styles.errorText}>Failed to get recipe details</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Recipe image */}
        {recipe.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: recipe.image }}
              style={styles.recipeImage}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            {imageLoading && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
          </View>
        )}

        {/* Basic recipe information */}
        <View style={styles.infoSection}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          
          <View style={styles.metaRow}>
            {recipe.cookTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>⏱️</Text>
                <Text style={styles.metaText}>{recipe.cookTime}</Text>
              </View>
            )}
            {recipe.servings && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>👥</Text>
                <Text style={styles.metaText}>{recipe.servings}</Text>
              </View>
            )}
            {recipe.calories && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>🔥</Text>
                <Text style={styles.metaText}>{recipe.calories} cal</Text>
              </View>
            )}
          </View>

          {recipe.source && (
            <View style={styles.sourceContainer}>
              <Text style={styles.sourceText}>Source: {recipe.source}</Text>
            </View>
          )}
        </View>

        {/* Ingredients list */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🥕 Ingredients</Text>
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientBullet}>•</Text>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Cooking instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👩‍🍳 Instructions</Text>
            <View style={styles.instructionsList}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* View original recipe link */}
        {recipe.url && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.urlButton} onPress={handleOpenUrl}>
              <Text style={styles.urlButtonText}>🔗 View Full Recipe</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Top navigation bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe Details</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content area */}
        {renderContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  headerRight: {
    width: 32,
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  sourceContainer: {
    marginTop: 8,
  },
  sourceText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredientBullet: {
    fontSize: 16,
    color: '#007bff',
    marginRight: 8,
    marginTop: 2,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  urlButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  urlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 32,
  },
}); 