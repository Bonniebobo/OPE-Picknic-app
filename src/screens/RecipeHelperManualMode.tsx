import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  TextInput
} from 'react-native';
import { fetchRecipesFromEdamam } from '../services/edamamService';

interface RecipeHelperManualModeProps {
  onIngredientsConfirmed: (ingredients: string[]) => void;
}

type CategoryType = 'vegetables' | 'protein' | 'staples' | 'seasoning';

type CategoryColors = {
  [K in CategoryType]: {
    bg: string;
    bgSelected: string;
    text: string;
    textSelected: string;
  }
};

// Add color scheme for categories
const categoryColors: CategoryColors = {
  vegetables: {
    bg: '#F0FDF4',
    bgSelected: '#86EFAC',
    text: '#166534',
    textSelected: '#FFF'
  },
  protein: {
    bg: '#FFF1F2',
    bgSelected: '#FB7185',
    text: '#9F1239',
    textSelected: '#FFF'
  },
  staples: {
    bg: '#FEFCE8',
    bgSelected: '#FCD34D',
    text: '#854D0E',
    textSelected: '#FFF'
  },
  seasoning: {
    bg: '#F0F9FF',
    bgSelected: '#60A5FA',
    text: '#1E40AF',
    textSelected: '#FFF'
  }
};

type IngredientCategory = {
  type: CategoryType;
  label: string;
  ingredients: string[];
};

// Update ingredient categories with type information
const ingredientCategories: IngredientCategory[] = [
  {
    type: 'vegetables',
    label: '🥦 Vegetables',
    ingredients: ['broccoli', 'tomato', 'spinach', 'carrot', 'lettuce', 'potato', 'mushroom', 'bell pepper', 'cucumber', 'zucchini', 'eggplant', 'cauliflower', 'corn', 'peas'],
  },
  {
    type: 'protein',
    label: '🍗 Protein',
    ingredients: ['chicken', 'egg', 'tofu', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'lentils', 'chickpeas', 'beans', 'yogurt'],
  },
  {
    type: 'staples',
    label: '🍞 Staples',
    ingredients: ['rice', 'noodles', 'bread', 'pasta', 'quinoa', 'oatmeal', 'flour'],
  },
  {
    type: 'seasoning',
    label: '🧂 Seasoning',
    ingredients: ['salt', 'pepper', 'olive oil', 'garlic', 'soy sauce', 'basil', 'oregano', 'thyme', 'rosemary', 'lemon', 'lime', 'honey', 'butter', 'sugar', 'cream', 'parmesan', 'mozzarella', 'cheddar', 'feta', 'nuts', 'almonds', 'walnuts', 'peanuts'],
  },
];

export default function RecipeHelperManualMode({ onIngredientsConfirmed }: RecipeHelperManualModeProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim()) {
      const ingredient = customIngredient.trim().toLowerCase();
      if (!selectedIngredients.includes(ingredient)) {
        setSelectedIngredients(prev => [...prev, ingredient]);
        setCustomIngredient('');
      }
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert(
      'Photo Upload',
      'Photo upload functionality will be implemented. For now, this simulates photo processing.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate', 
          onPress: () => {
            // Simulate photo processing
            const mockIngredients = ['tomato', 'basil', 'cheese'];
            setSelectedIngredients(prev => {
              const combined = [...new Set([...prev, ...mockIngredients])];
              return combined;
            });
            Alert.alert('Success', `Detected ingredients: ${mockIngredients.join(', ')}`);
          }
        }
      ]
    );
  };

  const handleContinue = async () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('No Ingredients', 'Please select at least one ingredient.');
      return;
    }

    setIsProcessing(true);
    
    // Simply pass ingredients to parent component
    // The parent will handle recipe fetching and navigation
    onIngredientsConfirmed(selectedIngredients);
    setIsProcessing(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Custom Ingredient Input */}
      <View style={styles.customInputCard}>
        <Text style={styles.customInputTitle}>Add Custom Ingredient</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={customIngredient}
            onChangeText={setCustomIngredient}
            placeholder="Type ingredient name..."
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={addCustomIngredient}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addCustomIngredient}
            disabled={!customIngredient.trim()}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selected Ingredients Display */}
      {selectedIngredients.length > 0 && (
        <View style={styles.selectedCard}>
          <Text style={styles.selectedTitle}>Selected Ingredients ({selectedIngredients.length})</Text>
          <View style={styles.selectedList}>
            {selectedIngredients.map((ingredient, index) => (
              <TouchableOpacity
                key={index}
                style={styles.selectedItem}
                onPress={() => toggleIngredient(ingredient)}
              >
                <Text style={styles.selectedItemText}>{ingredient}</Text>
                <Text style={styles.removeIcon}>✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Categorized Common Ingredients */}
      <View style={styles.ingredientsSection}>
        {ingredientCategories.map((cat) => (
          <View key={cat.label} style={styles.ingredientCategory}>
            <Text style={[
              styles.categoryLabel,
              { color: categoryColors[cat.type].text }
            ]}>
              {cat.label}
            </Text>
            <View style={styles.ingredientsGrid}>
              {cat.ingredients.map((ingredient) => {
                const isSelected = selectedIngredients.includes(ingredient);
                return (
                  <TouchableOpacity
                    key={ingredient}
                    style={[
                      styles.ingredientButton,
                      { backgroundColor: isSelected 
                        ? categoryColors[cat.type].bgSelected 
                        : categoryColors[cat.type].bg 
                      },
                      isSelected && styles.ingredientButtonSelected
                    ]}
                    onPress={() => toggleIngredient(ingredient)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.ingredientButtonText,
                      { color: isSelected 
                        ? categoryColors[cat.type].textSelected 
                        : categoryColors[cat.type].text 
                      }
                    ]}>
                      {ingredient}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          (selectedIngredients.length === 0 || isProcessing) && styles.continueButtonDisabled
        ]}
        onPress={handleContinue}
        disabled={selectedIngredients.length === 0 || isProcessing}
      >
        <Text style={styles.continueButtonText}>
          {isProcessing ? 'Processing...' : `Continue with ${selectedIngredients.length} ingredients`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customInputCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  customInputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9F1239',
  },
  selectedCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedItem: {
    backgroundColor: '#FB7185',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedItemText: {
    fontSize: 16,
    color: '#1F2937',
    marginRight: 8,
  },
  removeIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ingredientsSection: {
    marginBottom: 24,
  },
  ingredientCategory: {
    marginBottom: 24,
  },
  categoryLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 8,
  },
  ingredientButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  ingredientButtonSelected: {
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ scale: 1.02 }],
  },
  ingredientButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#FFF1F2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButtonDisabled: {
    backgroundColor: '#F3F4F6',
    shadowOpacity: 0.05,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9F1239',
  },
}); 