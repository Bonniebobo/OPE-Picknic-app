import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useIngredients } from '../context/IngredientContext';
import { useToCookList } from '../context/ToCookListContext';

interface IngredientInputSectionProps {
  onStartPlanning: () => void;
  onViewToCookList: () => void;
}

export default function IngredientInputSection({ 
  onStartPlanning, 
  onViewToCookList 
}: IngredientInputSectionProps) {
  const { 
    ingredients, 
    addIngredient, 
    removeIngredient, 
    clearIngredients 
  } = useIngredients();
  const { cookingPlans } = useToCookList();
  
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'manual' | 'voice' | 'camera'>('manual');

  // Common ingredient categories
  const commonIngredients = {
    'Vegetables': ['Tomato', 'Potato', 'Onion', 'Carrot', 'Cabbage', 'Spinach', 'Bell Pepper', 'Eggplant', 'Cucumber'],
    'Proteins': ['Pork', 'Beef', 'Chicken', 'Fish', 'Shrimp', 'Eggs'],
    'Seasonings': ['Salt', 'Sugar', 'Soy Sauce', 'Dark Soy Sauce', 'Vinegar', 'Cooking Wine', 'Garlic', 'Ginger', 'Green Onion'],
    'Staples': ['Rice', 'Noodles', 'Bread', 'Buns'],
  };

  const handleAddIngredient = () => {
    if (inputText.trim()) {
      addIngredient(inputText.trim(), inputMode);
      setInputText('');
    }
  };

  const handleQuickAdd = (ingredient: string) => {
    addIngredient(ingredient, 'manual');
  };

  const handleVoiceInput = () => {
    setInputMode('voice');
    Alert.alert('Voice Input', 'Voice input feature is under development...', [
      { text: 'OK', onPress: () => setInputMode('manual') }
    ]);
  };

  const handleCameraInput = () => {
    setInputMode('camera');
    Alert.alert('Photo Recognition', 'Photo recognition feature is under development...', [
      { text: 'OK', onPress: () => setInputMode('manual') }
    ]);
  };

  const renderInputMethods = () => (
    <View style={styles.inputMethods}>
      <Text style={styles.sectionTitle}>📝 Add Ingredients</Text>
      
      {/* Input method selection */}
      <View style={styles.inputModeSelector}>
        <TouchableOpacity 
          style={[styles.inputModeButton, inputMode === 'manual' && styles.inputModeButtonActive]}
          onPress={() => setInputMode('manual')}
        >
          <Text style={[styles.inputModeText, inputMode === 'manual' && styles.inputModeTextActive]}>
            ✏️ Manual Input
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.inputModeButton, inputMode === 'voice' && styles.inputModeButtonActive]}
          onPress={handleVoiceInput}
        >
          <Text style={[styles.inputModeText, inputMode === 'voice' && styles.inputModeTextActive]}>
            🎤 Voice Input
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.inputModeButton, inputMode === 'camera' && styles.inputModeButtonActive]}
          onPress={handleCameraInput}
        >
          <Text style={[styles.inputModeText, inputMode === 'camera' && styles.inputModeTextActive]}>
            📷 Photo Recognition
          </Text>
        </TouchableOpacity>
      </View>

      {/* Text input field */}
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Enter ingredient name..."
          placeholderTextColor="#9CA3AF"
          onSubmitEditing={handleAddIngredient}
          returnKeyType="done"
        />
        <TouchableOpacity 
          style={[styles.addButton, !inputText.trim() && styles.addButtonDisabled]}
          onPress={handleAddIngredient}
          disabled={!inputText.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCommonIngredients = () => (
    <View style={styles.commonIngredients}>
      <Text style={styles.sectionTitle}>🥬 Common Ingredients</Text>
      {Object.entries(commonIngredients).map(([category, items]) => (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <View style={styles.ingredientTags}>
            {items.map((ingredient) => (
              <TouchableOpacity
                key={ingredient}
                style={[
                  styles.ingredientTag,
                  ingredients.some(ing => ing.name === ingredient) && styles.ingredientTagSelected
                ]}
                onPress={() => handleQuickAdd(ingredient)}
                disabled={ingredients.some(ing => ing.name === ingredient)}
              >
                <Text style={[
                  styles.ingredientTagText,
                  ingredients.some(ing => ing.name === ingredient) && styles.ingredientTagTextSelected
                ]}>
                  {ingredient}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderCurrentIngredients = () => (
    <View style={styles.currentIngredients}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🛒 My Ingredients ({ingredients.length})</Text>
        {ingredients.length > 0 && (
          <TouchableOpacity onPress={clearIngredients} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {ingredients.length === 0 ? (
        <Text style={styles.emptyText}>No ingredients added yet</Text>
      ) : (
        <View style={styles.ingredientList}>
          {ingredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.ingredientItem}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientSource}>
                {ingredient.source === 'manual' && '✏️'}
                {ingredient.source === 'voice' && '🎤'}
                {ingredient.source === 'camera' && '📷'}
                {ingredient.source === 'ai' && '🤖'}
              </Text>
              <TouchableOpacity 
                onPress={() => removeIngredient(ingredient.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={[styles.planningButton, ingredients.length === 0 && styles.planningButtonDisabled]}
        onPress={onStartPlanning}
        disabled={ingredients.length === 0}
      >
        <Text style={styles.planningButtonText}>
          🍳 Start Menu Planning ({ingredients.length} ingredients)
        </Text>
      </TouchableOpacity>
      
      {cookingPlans.length > 0 && (
        <TouchableOpacity 
          style={styles.viewCookListButton}
          onPress={onViewToCookList}
        >
          <Text style={styles.viewCookListButtonText}>
            📝 View Cooking List ({cookingPlans.length} recipes)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderInputMethods()}
      {renderCommonIngredients()}
      {renderCurrentIngredients()}
      {renderActionButtons()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED', // Project standard warm white background
  },
  inputMethods: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937', // Project standard dark gray
    marginBottom: 16,
  },
  inputModeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 6,
  },
  inputModeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  inputModeButtonActive: {
    backgroundColor: '#FB7185', // Project standard pink color
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  inputModeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  inputModeTextActive: {
    color: '#FFFFFF',
  },
  textInputContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#FB7185', // Project standard pink color
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  addButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commonIngredients: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  ingredientTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientTagSelected: {
    backgroundColor: '#d4edda',
  },
  ingredientTagText: {
    fontSize: 12,
    color: '#0984e3',
  },
  ingredientTagTextSelected: {
    color: '#155724',
  },
  currentIngredients: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f8d7da',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#721c24',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    paddingVertical: 20,
  },
  ingredientList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    color: '#2d3436',
  },
  ingredientSource: {
    fontSize: 12,
    marginRight: 8,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  planningButton: {
    backgroundColor: '#FB7185', // Project standard pink color
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  planningButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  planningButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewCookListButton: {
    backgroundColor: '#10B981', // Modern green color
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  viewCookListButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 