import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Image } from 'react-native';

interface PhotoDishScreenProps {
  onBack: () => void;
  onGetRecipe: (imageData: any) => void;
}

export default function PhotoDishScreen({ onBack, onGetRecipe }: PhotoDishScreenProps) {
  const [hasImage, setHasImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTakePhoto = () => {
    Alert.alert(
      'Take Photo',
      'Camera integration will be implemented. For now, this is a mock photo.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mock Photo', 
          onPress: () => {
            setHasImage(true);
            setImageUri('https://via.placeholder.com/300x400/FFEDD5/1F2937?text=Your+Dish+Photo');
          }
        }
      ]
    );
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      'Upload Photo',
      'Gallery integration will be implemented. For now, this is a mock photo.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mock Upload', 
          onPress: () => {
            setHasImage(true);
            setImageUri('https://via.placeholder.com/300x400/FFEDD5/1F2937?text=Uploaded+Dish+Photo');
          }
        }
      ]
    );
  };

  const handleRetakePhoto = () => {
    setHasImage(false);
    setImageUri(null);
  };

  const handleGetRecipe = () => {
    if (!hasImage) {
      Alert.alert('No Photo', 'Please take or upload a photo first.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API processing
    setTimeout(() => {
      setIsProcessing(false);
      onGetRecipe({ imageUri, ingredients: ['tomato', 'basil', 'cheese'] });
    }, 2000);
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
          <Text style={styles.botName}>Photo Analysis</Text>
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