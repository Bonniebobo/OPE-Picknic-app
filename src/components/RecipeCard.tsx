import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { RecipeCard as RecipeCardType } from '../types/recipe';
import { useToCookList } from '../context/ToCookListContext';

const { width } = Dimensions.get('window');

interface RecipeCardProps {
  recipe: RecipeCardType;
  onViewDetails: (recipe: RecipeCardType) => void;
  onAddToCookList?: (recipe: RecipeCardType) => void;
  onSkip?: (recipe: RecipeCardType) => void;
  showActions?: boolean;
  mode?: 'recommendation' | 'list';
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onViewDetails, 
  onAddToCookList, 
  onSkip,
  showActions = true,
  mode = 'list'
}) => {
  const { addToCookList, isInCookList } = useToCookList();
  const [showFullIngredients, setShowFullIngredients] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isAlreadyInList = isInCookList(recipe.id);

  const handleAddToCookList = () => {
    if (!isAlreadyInList) {
      if (onAddToCookList) {
        onAddToCookList(recipe);
      } else {
        addToCookList(recipe);
      }
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load:', recipe.imageUrl);
    setImageError(true);
  };

  // Ensure ingredients list exists and is valid
  const ingredients = recipe.ingredients || ['Ingredients to be confirmed'];
  const displayIngredients = showFullIngredients 
    ? ingredients 
    : ingredients.slice(0, 3);

  // Get the image source
  const getImageSource = () => {
    if (imageError || !recipe.imageUrl) {
      return require('../../assets/icon.png');
    }
    return { uri: recipe.imageUrl };
  };

  return (
    <View style={styles.card}>
      {/* Recipe Image */}
      <Image 
        source={getImageSource()}
        style={styles.image}
        defaultSource={require('../../assets/icon.png')}
        onError={handleImageError}
      />
      
      {/* 菜谱信息 */}
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.name}</Text>
        
        {/* 制作时间和难度 */}
        <View style={styles.metaRow}>
          {recipe.cookingTime && (
            <Text style={styles.metaText}>⏱️ {recipe.cookingTime}</Text>
          )}
          {recipe.difficulty && (
            <Text style={styles.metaText}>📊 {recipe.difficulty}</Text>
          )}
        </View>

        {/* Ingredients tags */}
        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsLabel}>Ingredients:</Text>
          <View style={styles.ingredientsTags}>
            {displayIngredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientTag}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
            {ingredients.length > 3 && !showFullIngredients && (
              <TouchableOpacity 
                onPress={() => setShowFullIngredients(true)}
                style={styles.moreTag}
              >
                <Text style={styles.moreText}>+{ingredients.length - 3}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action buttons */}
        {showActions && (
          <View style={mode === 'recommendation' ? styles.recommendationButtonRow : styles.buttonRow}>
            {mode === 'recommendation' ? (
              // Recommendation mode: show three buttons
              <>
                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => onViewDetails(recipe)}
                >
                  <Text style={styles.detailButtonText}>Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.addButton, 
                    isAlreadyInList && styles.addedButton
                  ]}
                  onPress={handleAddToCookList}
                  disabled={isAlreadyInList}
                >
                  <Text style={[
                    styles.addButtonText,
                    isAlreadyInList && styles.addedButtonText
                  ]}>
                    {isAlreadyInList ? '✅ Added' : '➕ Add'}
                  </Text>
                </TouchableOpacity>
                
                {onSkip && !isAlreadyInList && (
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => onSkip(recipe)}
                  >
                    <Text style={styles.skipButtonText}>Skip</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              // List mode: show two buttons
              <>
                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => onViewDetails(recipe)}
                >
                  <Text style={styles.detailButtonText}>View Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.addButton, 
                    isAlreadyInList && styles.addedButton
                  ]}
                  onPress={handleAddToCookList}
                  disabled={isAlreadyInList}
                >
                  <Text style={[
                    styles.addButtonText,
                    isAlreadyInList && styles.addedButtonText
                  ]}>
                    {isAlreadyInList ? '✅ Added' : '➕ Add to List'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#636e72',
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 6,
  },
  ingredientsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ingredientText: {
    fontSize: 12,
    color: '#0984e3',
  },
  moreTag: {
    backgroundColor: '#ddd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreText: {
    fontSize: 12,
    color: '#636e72',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendationButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  detailButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#00b894',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  addedButton: {
    backgroundColor: '#95a5a6',
  },
  addedButtonText: {
    color: '#fff',
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#e17055',
    paddingVertical: 12,
    borderRadius: 8,
  },
  skipButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
}); 