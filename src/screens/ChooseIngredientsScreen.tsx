import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { identify_image_ingredients } from '../services/imageAnalysis';

interface ChooseIngredientsScreenProps {
  onBack: () => void;
  onContinue: (ingredients: string[]) => void;
  onScanIngredients: () => void;
}

const commonIngredients = [
  { id: 'tomato', name: 'Tomato', emoji: '🍅', color: '#FECACA' },
  { id: 'onion', name: 'Onion', emoji: '🧅', color: '#FEF3C7' },
  { id: 'garlic', name: 'Garlic', emoji: '🧄', color: '#FEF3C7' },
  { id: 'rice', name: 'Rice', emoji: '🍚', color: '#FED7AA' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', color: '#FED7AA' },
  { id: 'chicken', name: 'Chicken', emoji: '🍗', color: '#FBCFE8' },
  { id: 'beef', name: 'Beef', emoji: '🥩', color: '#FBCFE8' },
  { id: 'fish', name: 'Fish', emoji: '🐟', color: '#BFDBFE' },
  { id: 'eggs', name: 'Eggs', emoji: '🥚', color: '#FED7AA' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', color: '#FEF3C7' },
  { id: 'milk', name: 'Milk', emoji: '🥛', color: '#BFDBFE' },
  { id: 'bread', name: 'Bread', emoji: '🍞', color: '#FEF3C7' },
  { id: 'potato', name: 'Potato', emoji: '🥔', color: '#FEF3C7' },
  { id: 'carrot', name: 'Carrot', emoji: '🥕', color: '#FED7AA' },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', color: '#D1FAE5' },
  { id: 'spinach', name: 'Spinach', emoji: '🥬', color: '#D1FAE5' },
];

export default function ChooseIngredientsScreen({ onBack, onContinue, onScanIngredients }: ChooseIngredientsScreenProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [identifiedIngredients, setIdentifiedIngredients] = useState<string[]>([]);

  const handleIngredientToggle = (ingredientId: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredientId) 
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleManualAdd = () => {
    const trimmed = manualInput.trim();
    if (trimmed && !selectedIngredients.includes(trimmed.toLowerCase())) {
      setSelectedIngredients(prev => [...prev, trimmed.toLowerCase()]);
      setManualInput('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => prev.filter(id => id !== ingredient));
  };

  const handleSpeak = () => {
    Alert.alert(
      'Voice Input',
      'Speech-to-text functionality will be implemented. For now, you can type or select ingredients.',
      [{ text: 'OK' }]
    );
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
        setIdentifiedIngredients([]);
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
        setIdentifiedIngredients([]);
        processImage(asset.base64 || '');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    }
  };

  const processImage = async (base64: string) => {
    if (!base64) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Analyzing image for ingredients...');
      const ingredients = await identify_image_ingredients(base64);
      setIdentifiedIngredients(ingredients);
      
      // Automatically add recognized ingredients to selection list
      const newIngredients = ingredients.filter((ingredient: string) => 
        !selectedIngredients.includes(ingredient.toLowerCase())
      );
      
      if (newIngredients.length > 0) {
        setSelectedIngredients(prev => [...prev, ...newIngredients.map((ing: string) => ing.toLowerCase())]);
        Alert.alert(
          'Ingredients Identified!',
          `Added ${newIngredients.length} new ingredients: ${newIngredients.join(', ')}`,
          [{ text: 'OK' }]
        );
      }
      
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

  const handleRetakePhoto = () => {
    setHasImage(false);
    setImageUri(null);
    setImageBase64(null);
    setIdentifiedIngredients([]);
  };

  const handleScanIngredients = () => {
    onScanIngredients();
  };

  const handleContinue = () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('No Ingredients Selected', 'Please select at least one ingredient to continue.');
      return;
    }
    onContinue(selectedIngredients);
  };

  const getIngredientName = (id: string) => {
    const ingredient = commonIngredients.find(ing => ing.id === id);
    return ingredient ? ingredient.name : id;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerBackText}>Choose Ingredients</Text>
        </View>

        {/* Suggested Ingredients */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Suggested ingredients:</Text>
          <View style={styles.ingredientsGrid}>
            {commonIngredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient.id}
                style={[
                  styles.ingredientTag,
                  { backgroundColor: ingredient.color },
                  selectedIngredients.includes(ingredient.id) && styles.ingredientTagSelected
                ]}
                onPress={() => handleIngredientToggle(ingredient.id)}
              >
                <Text style={styles.ingredientEmoji}>{ingredient.emoji}</Text>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add More Ingredients */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Add more ingredients:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={manualInput}
              onChangeText={setManualInput}
              placeholder="e.g., basil, mushrooms, tofu..."
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={handleManualAdd}
            />
            <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
              <Text style={styles.speakButtonIcon}>🎤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleManualAdd}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Photo Recognition */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Or use AI to recognize ingredients from photo:</Text>
          
          {!hasImage ? (
            <View style={styles.photoSection}>
              <View style={styles.uploadArea}>
                <Text style={styles.uploadIcon}>📸</Text>
                <Text style={styles.uploadTitle}>Take a photo of your ingredients</Text>
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
            </View>
          ) : (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri! }} style={styles.previewImage} />
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
                <Text style={styles.retakeButtonText}>🔄 Retake</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Processing State */}
          {isProcessing && (
            <View style={styles.processingSection}>
              <Text style={styles.processingIcon}>🔍</Text>
              <Text style={styles.processingText}>AI is analyzing ingredients...</Text>
            </View>
          )}

          {/* Identified Ingredients */}
          {identifiedIngredients.length > 0 && (
            <View style={styles.identifiedSection}>
              <Text style={styles.identifiedTitle}>AI identified ingredients:</Text>
              <View style={styles.identifiedList}>
                {identifiedIngredients.map((ingredient, index) => (
                  <View key={index} style={styles.identifiedItem}>
                    <Text style={styles.identifiedText}>• {ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Legacy Scan Button (keeping for compatibility) */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Or use the old scan method:</Text>
          <TouchableOpacity style={styles.scanButton} onPress={handleScanIngredients}>
            <Text style={styles.scanButtonIcon}>📷</Text>
            <Text style={styles.scanButtonText}>Scan Ingredients (Legacy)</Text>
            <Text style={styles.scanButtonSubtext}>Take a photo or upload from gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Selected Ingredients:</Text>
            <View style={styles.selectedIngredientsList}>
              {selectedIngredients.map((ingredient) => (
                <View key={ingredient} style={styles.selectedIngredient}>
                  <Text style={styles.selectedIngredientText}>{getIngredientName(ingredient)}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveIngredient(ingredient)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, selectedIngredients.length === 0 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={selectedIngredients.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue ({selectedIngredients.length} ingredients)
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

  contentSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ingredientTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ingredientTagSelected: {
    borderColor: '#FB7185',
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  speakButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakButtonIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  addButton: {
    backgroundColor: '#FB7185',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  scanButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  scanButtonSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Photo recognition styles
  photoSection: {
    marginBottom: 16,
  },
  uploadArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    backgroundColor: '#FB7185',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  uploadButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imagePreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  retakeButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  processingSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  processingIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  processingText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
  },
  identifiedSection: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  identifiedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  identifiedList: {
    gap: 4,
  },
  identifiedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identifiedText: {
    fontSize: 14,
    color: '#065F46',
  },
  selectedSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  selectedIngredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedIngredient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FB7185',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedIngredientText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
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
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 