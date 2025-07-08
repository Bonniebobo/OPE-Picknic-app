import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';

interface ScanIngredientsScreenProps {
  onBack: () => void;
  onConfirm: (ingredients: string[]) => void;
}

export default function ScanIngredientsScreen({ onBack, onConfirm }: ScanIngredientsScreenProps) {
  const [hasImage, setHasImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedIngredients, setRecognizedIngredients] = useState<string[]>([]);

  const handleTakePhoto = () => {
    Alert.alert(
      'Take Photo',
      'Camera integration will be implemented. For now, this will simulate photo capture.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate Photo', 
          onPress: () => {
            setHasImage(true);
            setImageUri('https://via.placeholder.com/300x400/FFEDD5/1F2937?text=Ingredients+Photo');
            processImage();
          }
        }
      ]
    );
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      'Upload Photo',
      'Gallery integration will be implemented. For now, this will simulate photo upload.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate Upload', 
          onPress: () => {
            setHasImage(true);
            setImageUri('https://via.placeholder.com/300x400/FFEDD5/1F2937?text=Uploaded+Ingredients');
            processImage();
          }
        }
      ]
    );
  };

  const processImage = () => {
    setIsProcessing(true);
    
    // Simulate image processing and ingredient recognition
    setTimeout(() => {
      setIsProcessing(false);
      // Mock recognized ingredients
      setRecognizedIngredients(['tomato', 'basil', 'cheese', 'olive oil', 'garlic', 'onion']);
    }, 2000);
  };

  const handleRetakePhoto = () => {
    setHasImage(false);
    setImageUri(null);
    setRecognizedIngredients([]);
  };

  const handleConfirmIngredients = () => {
    if (recognizedIngredients.length === 0) {
      Alert.alert('No Ingredients Found', 'Please try taking a different photo.');
      return;
    }
    onConfirm(recognizedIngredients);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerBackText}>Scan Ingredients</Text>
        </View>

        {/* Bot Header */}
        <View style={styles.botCard}>
          <Text style={styles.botEmoji}>🔍</Text>
          <Text style={styles.botName}>Ingredient Scanner</Text>
          <Text style={styles.botDesc}>I'll identify ingredients from your photo</Text>
        </View>

        {/* Photo Area */}
        <View style={styles.photoSection}>
          {!hasImage ? (
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
          ) : (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri! }} style={styles.previewImage} />
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
                <Text style={styles.retakeButtonText}>🔄 Retake</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Processing State */}
        {isProcessing && (
          <View style={styles.processingSection}>
            <Text style={styles.processingIcon}>🔍</Text>
            <Text style={styles.processingText}>Analyzing ingredients...</Text>
          </View>
        )}

        {/* Recognized Ingredients */}
        {!isProcessing && recognizedIngredients.length > 0 && (
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Recognized ingredients:</Text>
            <View style={styles.ingredientsList}>
              {recognizedIngredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>• {ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {!isProcessing && hasImage && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmIngredients}>
              <Text style={styles.confirmButtonText}>
                ✅ Confirm ({recognizedIngredients.length} ingredients)
              </Text>
            </TouchableOpacity>
          </View>
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
  botCard: { 
    alignItems: 'center', 
    borderRadius: 24, 
    marginHorizontal: 24, 
    marginBottom: 24, 
    padding: 24, 
    backgroundColor: '#F0F9FF',
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
  processingSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  processingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  processingText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  ingredientsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
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
    fontSize: 16,
    color: '#1F2937',
  },
  actionButtons: {
    paddingHorizontal: 24,
  },
  confirmButton: {
    backgroundColor: '#FB7185',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 