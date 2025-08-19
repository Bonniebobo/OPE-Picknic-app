import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useIngredients } from '../context/IngredientContext';
import { useToCookList } from '../context/ToCookListContext';
import { identify_food_from_image_gemini } from '../services/geminiImageAnalysis';

interface IngredientInputSectionProps {
  onStartPlanning: () => void;
  onViewToCookList: () => void;
}

interface RecognizedItem {
  id: string;
  name: string;
  type: 'ingredient' | 'dish';
  isEditing?: boolean;
  editValue?: string;
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
  
  // Common ingredients collapsible state
  const [commonIngredientsExpanded, setCommonIngredientsExpanded] = useState(false);

  // Photo recognition state
  const [showPhotoRecognition, setShowPhotoRecognition] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([]);
  const [recognitionResult, setRecognitionResult] = useState<{type: string, dishName?: string} | null>(null);

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
    handlePhotoRecognition();
  };

  // Photo recognition functions
  const handlePhotoRecognition = () => {
    setShowPhotoRecognition(true);
    setHasImage(false);
    setImageUri(null);
    setImageBase64(null);
    setRecognizedItems([]);
    setRecognitionResult(null);
  };

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
        setRecognizedItems([]);
        processImage(asset.base64 || '');
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
        setRecognizedItems([]);
        processImage(asset.base64 || '');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    }
  };

  const processImage = async (base64: string) => {
    if (!base64) return;
    
    setIsProcessingImage(true);
    
    try {
      console.log('Analyzing image for food items...');
      const result = await identify_food_from_image_gemini(base64);
      
      if (result.type === 'dish' && result.dishName) {
        // Dish recognized
        setRecognitionResult({ type: 'dish', dishName: result.dishName });
        
        const dishItem: RecognizedItem = {
          id: `dish_${Date.now()}`,
          name: result.dishName,
          type: 'dish',
        };
        
        const ingredientItems: RecognizedItem[] = result.ingredients.map((ingredient: string, index: number) => ({
          id: `ingredient_${Date.now()}_${index}`,
          name: ingredient,
          type: 'ingredient' as const,
        }));
        
        setRecognizedItems([dishItem, ...ingredientItems]);
      } else {
        // Ingredients recognized
        setRecognitionResult({ type: 'ingredients' });
        
        const ingredientItems: RecognizedItem[] = result.ingredients.map((ingredient: string, index: number) => ({
          id: `ingredient_${Date.now()}_${index}`,
          name: ingredient,
          type: 'ingredient' as const,
        }));
        
        setRecognizedItems(ingredientItems);
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert(
        'Processing Error',
        'Failed to analyze the image. Please try again with a clearer photo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRetakePhoto = () => {
    setHasImage(false);
    setImageUri(null);
    setImageBase64(null);
    setRecognizedItems([]);
    setRecognitionResult(null);
  };

  const handleEditItem = (id: string) => {
    setRecognizedItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isEditing: true, editValue: item.name }
        : item
    ));
  };

  const handleSaveEdit = (id: string) => {
    setRecognizedItems(prev => prev.map(item => {
      if (item.id === id) {
        const newName = item.editValue?.trim() || item.name;
        return { ...item, name: newName, isEditing: false, editValue: undefined };
      }
      return item;
    }));
  };

  const handleCancelEdit = (id: string) => {
    setRecognizedItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isEditing: false, editValue: undefined }
        : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setRecognizedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateEditValue = (id: string, value: string) => {
    setRecognizedItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, editValue: value }
        : item
    ));
  };

  const handleConfirmRecognition = () => {
    const ingredientsToAdd = recognizedItems
      .filter(item => item.type === 'ingredient')
      .map(item => item.name);
    
    // Add recognized ingredients to the ingredient list
    ingredientsToAdd.forEach(ingredient => {
      addIngredient(ingredient, 'camera');
    });
    
    // Close photo recognition and navigate to menu planning
    setShowPhotoRecognition(false);
    
    // Small delay to ensure state updates, then start planning directly
    setTimeout(() => {
      onStartPlanning();
    }, 100);
  };

  const handleCancelRecognition = () => {
    setShowPhotoRecognition(false);
    setHasImage(false);
    setImageUri(null);
    setImageBase64(null);
    setRecognizedItems([]);
    setRecognitionResult(null);
  };

  const renderInputMethods = () => (
    <View style={styles.inputMethods}>
      <Text style={styles.sectionTitle}>📝 Add Ingredients</Text>
      
      {/* Main Photo Recognition Button */}
      <TouchableOpacity 
        style={styles.photoRecognitionButton}
        onPress={handlePhotoRecognition}
      >
        <Text style={styles.photoRecognitionButtonIcon}>📷</Text>
        <Text style={styles.photoRecognitionButtonText}>Recognize from Photo</Text>
      </TouchableOpacity>

      {/* Conditional Text Input */}
      {inputMode === 'manual' && (
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
      )}

      {/* Secondary Input Options */}
      <View style={styles.secondaryInputContainer}>
        <TouchableOpacity onPress={() => setInputMode(inputMode === 'manual' ? 'camera' : 'manual')}>
          <Text style={styles.secondaryInputLink}>
            {inputMode === 'manual' ? 'Cancel' : '✏️ Type manually'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleVoiceInput}>
          <Text style={styles.secondaryInputLink}>🎤 Use voice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCommonIngredients = () => (
    <View style={styles.commonIngredients}>
      <TouchableOpacity 
        style={styles.collapsibleHeader}
        onPress={() => setCommonIngredientsExpanded(!commonIngredientsExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>
          🥬 Common Ingredients
        </Text>
        <View style={styles.expandIconContainer}>
          <Text style={styles.expandIcon}>
            {commonIngredientsExpanded ? '🔼' : '🔽'}
          </Text>
        </View>
      </TouchableOpacity>
      
      {commonIngredientsExpanded && (
        <View style={styles.collapsibleContent}>
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
      )}
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

  const renderPhotoRecognitionModal = () => (
    <View style={styles.photoRecognitionModal}>
      <View style={styles.photoModalContent}>
        {/* Header */}
        <View style={styles.photoModalHeader}>
          <Text style={styles.photoModalTitle}>📷 Photo Recognition</Text>
          <TouchableOpacity 
            style={styles.photoModalCloseButton}
            onPress={handleCancelRecognition}
          >
            <Text style={styles.photoModalCloseText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.photoModalScroll} showsVerticalScrollIndicator={false}>
          {!hasImage ? (
            <View style={styles.photoUploadSection}>
              <Text style={styles.photoUploadTitle}>Take / upload photo</Text>
              <Text style={styles.photoUploadSubtitle}>
                We'll identify ingredients and dishes from your photo
              </Text>
              
              <View style={styles.photoUploadButtons}>
                <TouchableOpacity style={styles.photoUploadButton} onPress={handleTakePhoto}>
                  <Text style={styles.photoUploadButtonIcon}>📷</Text>
                  <Text style={styles.photoUploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.photoUploadButton} onPress={handleUploadPhoto}>
                  <Text style={styles.photoUploadButtonIcon}>📁</Text>
                  <Text style={styles.photoUploadButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.photoResultSection}>
              {/* Image Preview */}
              <View style={styles.photoPreview}>
                <Image source={{ uri: imageUri! }} style={styles.photoPreviewImage} />
                <TouchableOpacity style={styles.photoRetakeButton} onPress={handleRetakePhoto}>
                  <Text style={styles.photoRetakeButtonText}>🔄 Retake</Text>
                </TouchableOpacity>
              </View>

              {/* Processing State */}
              {isProcessingImage ? (
                <View style={styles.photoProcessing}>
                  <Text style={styles.photoProcessingIcon}>🔍</Text>
                  <Text style={styles.photoProcessingText}>AI is analyzing your photo...</Text>
                </View>
              ) : recognizedItems.length > 0 ? (
                <View style={styles.photoResults}>
                  {/* Recognition Result Header */}
                  {recognitionResult?.type === 'dish' && recognitionResult.dishName ? (
                    <View style={styles.photoResultHeader}>
                      <Text style={styles.photoResultTitle}>🍽️ Dish Recognized</Text>
                      <Text style={styles.photoResultDish}>{recognitionResult.dishName}</Text>
                      <Text style={styles.photoResultSubtitle}>Ingredients identified:</Text>
                    </View>
                  ) : (
                    <View style={styles.photoResultHeader}>
                      <Text style={styles.photoResultTitle}>🥬 Ingredients Recognized</Text>
                      <Text style={styles.photoResultSubtitle}>You can edit or remove ingredients:</Text>
                    </View>
                  )}

                  {/* Ingredient List */}
                  <View style={styles.ingredientListView}>
                    {recognizedItems.filter(item => item.type === 'ingredient').map((item, index) => (
                      <View key={item.id} style={styles.ingredientRow}>
                        <Text style={styles.ingredientNumber}>{index + 1}.</Text>
                        {item.isEditing ? (
                          <View style={styles.ingredientEditContainer}>
                            <TextInput
                              style={styles.ingredientEditInput}
                              value={item.editValue}
                              onChangeText={(text) => handleUpdateEditValue(item.id, text)}
                              onSubmitEditing={() => handleSaveEdit(item.id)}
                              autoFocus
                            />
                            <TouchableOpacity 
                              style={styles.ingredientSaveButton}
                              onPress={() => handleSaveEdit(item.id)}
                            >
                              <Text style={styles.ingredientSaveText}>✓</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.ingredientCancelButton}
                              onPress={() => handleCancelEdit(item.id)}
                            >
                              <Text style={styles.ingredientCancelText}>✕</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={styles.ingredientDisplayContainer}>
                            <Text style={styles.ingredientNameText}>{item.name}</Text>
                            <TouchableOpacity 
                              style={styles.ingredientEditButton}
                              onPress={() => handleEditItem(item.id)}
                            >
                              <Text style={styles.ingredientEditButtonText}>✎</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.ingredientDeleteButton}
                              onPress={() => handleDeleteItem(item.id)}
                            >
                              <Text style={styles.ingredientDeleteButtonText}>×</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.photoActionButtons}>
                    <TouchableOpacity 
                      style={styles.photoSecondaryButton}
                      onPress={handleRetakePhoto}
                    >
                      <Text style={styles.photoSecondaryButtonText}>📷 Take Another Photo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.photoDeleteButton}
                      onPress={handleCancelRecognition}
                    >
                      <Text style={styles.photoDeleteButtonText}>🗑️ Delete & Start Over</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.photoNextButton}
                      onPress={handleConfirmRecognition}
                    >
                      <Text style={styles.photoNextButtonText}>➡️ Next Step</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.photoNoResults}>
                  <Text style={styles.photoNoResultsIcon}>😅</Text>
                  <Text style={styles.photoNoResultsText}>
                    Couldn't identify any food items. Try a clearer photo or different angle.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderInputMethods()}
        {renderCommonIngredients()}
        {renderCurrentIngredients()}
        {renderActionButtons()}
      </ScrollView>

      {/* Photo Recognition Modal */}
      {showPhotoRecognition && renderPhotoRecognitionModal()}
    </>
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
    marginTop: 16, // Add margin top
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
  photoRecognitionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E7FF', // Project standard light blue background
    paddingVertical: 18, // Increased padding
    borderRadius: 20, // Increased border radius
    marginTop: 16,
    marginHorizontal: 0, // Removed horizontal margin
    shadowColor: '#C7D2FE',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  photoRecognitionButtonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  photoRecognitionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6', // Project standard blue color
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
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 4,
  },
  expandIconContainer: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#e3f2fd',
  },
  expandIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  collapsibleContent: {
    marginTop: 8,
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
  // Photo Recognition Modal Styles
  photoRecognitionModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  photoModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    height: '80%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  photoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  photoModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  photoModalCloseButton: {
    padding: 5,
  },
  photoModalCloseText: {
    fontSize: 24,
    color: '#6B7280',
  },
  photoModalScroll: {
    flex: 1,
  },
  photoUploadSection: {
    padding: 20,
    alignItems: 'center',
  },
  photoUploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  photoUploadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  photoUploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  photoUploadButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    marginHorizontal: 10,
  },
  photoUploadButtonIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  photoUploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  photoResultSection: {
    padding: 20,
  },
  photoPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoPreviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  photoRetakeButton: {
    backgroundColor: '#E0E7FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  photoRetakeButtonText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  photoProcessing: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  photoProcessingIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  photoProcessingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  photoResults: {
    marginTop: 10,
  },
  photoResultHeader: {
    marginBottom: 15,
  },
  photoResultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  photoResultDish: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  photoResultSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  recognizedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recognizedChip: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recognizedChipDish: {
    backgroundColor: '#FFE0E0', // Project standard light red background
  },
  chipDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  chipTextDish: {
    color: '#E74C3C', // Project standard red color
  },
  chipEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipEditInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 0,
  },
  chipEditSaveButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#10B981', // Modern green color
    marginLeft: 5,
  },
  chipEditSaveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chipEditCancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E74C3C', // Project standard red color
    marginLeft: 5,
  },
  chipEditCancelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chipEditButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E0E7FF',
    marginLeft: 5,
  },
  chipEditButtonText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  chipDeleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFE0E0', // Project standard light red background
    marginLeft: 5,
  },
  chipDeleteButtonText: {
    fontSize: 14,
    color: '#E74C3C', // Project standard red color
  },
  photoNoResults: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  photoNoResultsIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  photoNoResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  photoModalActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoConfirmButton: {
    backgroundColor: '#10B981', // Modern green color
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  photoConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  secondaryInputLink: {
    fontSize: 14,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  // New ingredient list styles for photo recognition
  ingredientListView: {
    marginVertical: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#F9FAFB',
    marginVertical: 2,
    borderRadius: 8,
  },
  ingredientNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 12,
    minWidth: 24,
  },
  ingredientEditContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ingredientEditInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 0,
  },
  ingredientSaveButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#10B981',
    marginLeft: 8,
  },
  ingredientSaveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ingredientCancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    marginLeft: 4,
  },
  ingredientCancelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ingredientDisplayContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientNameText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  ingredientEditButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E0E7FF',
    marginLeft: 8,
  },
  ingredientEditButtonText: {
    fontSize: 12,
    color: '#3B82F6',
  },
  ingredientDeleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    marginLeft: 4,
  },
  ingredientDeleteButtonText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  // Photo action buttons
  photoActionButtons: {
    marginTop: 20,
    gap: 12,
  },
  photoSecondaryButton: {
    backgroundColor: '#E0E7FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  photoSecondaryButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  photoDeleteButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  photoDeleteButtonText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  photoNextButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  photoNextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});