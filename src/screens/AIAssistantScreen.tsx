/**
 * AI Assistant Screen - Multimodal Voice & Visual Ingredient Detection
 * Integrates Gemini Live API for real-time ingredient recognition
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { useLiveAPI, IngredientDetectionResult } from '../services/gemini-live';
import { fetchRecipesFromEdamam } from '../services/edamamService';

interface AIAssistantScreenProps {
  onBack: () => void;
  onIngredientsConfirmed: (ingredients: string[]) => void;
}

type InputMode = 'voice' | 'camera' | 'photo' | 'text';

const categoryColors = {
  vegetables: { background: '#ECFDF5', selected: '#22C55E', text: '#15803D' },
  protein: { background: '#FFF1F2', selected: '#F43F5E', text: '#BE123C' },
  staples: { background: '#FFFBEB', selected: '#F59E0B', text: '#D97706' },
  seasoning: { background: '#EFF6FF', selected: '#3B82F6', text: '#1D4ED8' },
};

export default function AIAssistantScreen({ onBack, onIngredientsConfirmed }: AIAssistantScreenProps) {
  const {
    status,
    connect,
    disconnect,
    startAudioRecording,
    stopAudioRecording,
    captureImage,
    pickImageFromLibrary,
    sendTextMessage,
    detectedIngredients,
    clearIngredients,
    isAudioRecording,
    error,
    logs,
  } = useLiveAPI();

  // Local state
  const [activeMode, setActiveMode] = useState<InputMode>('voice');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [textInput, setTextInput] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);

  // Check camera permissions on mount
  useEffect(() => {
    checkCameraPermissions();
  }, []);

  const checkCameraPermissions = async () => {
    try {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    } catch (error) {
      console.error('Failed to check camera permissions:', error);
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    if (status === 'disconnected') {
      handleConnect();
    }
    
    return () => {
      if (status === 'connected') {
        disconnect();
      }
    };
  }, []);

  // Auto-select detected ingredients
  useEffect(() => {
    detectedIngredients.forEach(ingredient => {
      setSelectedIngredients(prev => new Set([...prev, ingredient.ingredient.toLowerCase()]));
    });
  }, [detectedIngredients]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await connect();
      if (!success) {
        Alert.alert('Connection Failed', 'Unable to connect to Gemini Live API. Please try again.');
      }
    } catch (err) {
      console.error('Connection error:', err);
      Alert.alert('Error', 'Failed to connect to AI Assistant');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVoiceToggle = async () => {
    if (status !== 'connected') {
      Alert.alert('Not Connected', 'Please wait for the AI Assistant to connect.');
      return;
    }

    try {
      if (isAudioRecording) {
        await stopAudioRecording();
      } else {
        const success = await startAudioRecording();
        if (!success) {
          Alert.alert('Recording Failed', 'Unable to start voice recording. Please check permissions.');
        }
      }
    } catch (err) {
      console.error('Voice recording error:', err);
      Alert.alert('Error', 'Voice recording failed');
    }
  };

  const handleCameraCapture = async () => {
    if (!cameraPermission) {
      Alert.alert('Permission Required', 'Camera permission is required to capture images.');
      return;
    }

    if (status !== 'connected') {
      Alert.alert('Not Connected', 'Please wait for the AI Assistant to connect.');
      return;
    }

    try {
      const uri = await captureImage();
      if (uri) {
        setShowCamera(false);
        // Image will be automatically processed by the context
      }
    } catch (err) {
      console.error('Camera capture error:', err);
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const handlePhotoPicker = async () => {
    if (status !== 'connected') {
      Alert.alert('Not Connected', 'Please wait for the AI Assistant to connect.');
      return;
    }

    try {
      const uri = await pickImageFromLibrary();
      if (uri) {
        // Image will be automatically processed by the context
      }
    } catch (err) {
      console.error('Photo picker error:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim() || status !== 'connected') return;

    sendTextMessage(`Please identify ingredients from this description: ${textInput.trim()}`);
    setTextInput('');
  };

  const handleIngredientToggle = (ingredient: string) => {
    const newSelected = new Set(selectedIngredients);
    if (newSelected.has(ingredient)) {
      newSelected.delete(ingredient);
    } else {
      newSelected.add(ingredient);
    }
    setSelectedIngredients(newSelected);
  };

  const handleContinue = () => {
    const ingredients = Array.from(selectedIngredients);
    if (ingredients.length === 0) {
      Alert.alert('No Ingredients', 'Please select at least one ingredient to continue.');
      return;
    }
    onIngredientsConfirmed(ingredients);
  };

  const handleClearAll = () => {
    setSelectedIngredients(new Set());
    clearIngredients();
  };

  const getConnectionStatusColor = () => {
    switch (status) {
      case 'connected': return '#22C55E';
      case 'connecting': return '#F59E0B';
      case 'disconnected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getIngredientsByCategory = () => {
    const categories: Record<string, IngredientDetectionResult[]> = {
      vegetables: [],
      protein: [],
      staples: [],
      seasoning: [],
    };

    detectedIngredients.forEach(ingredient => {
      const category = ingredient.category || 'vegetables';
      categories[category].push(ingredient);
    });

    return categories;
  };

  if (showCamera) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity 
                style={styles.cameraBackBtn} 
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.cameraBackText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Capture Ingredients</Text>
            </View>
            
            <View style={styles.cameraFooter}>
              <TouchableOpacity 
                style={styles.captureBtn} 
                onPress={handleCameraCapture}
              >
                <View style={styles.captureBtnInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
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
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <View style={[styles.statusIndicator, { backgroundColor: getConnectionStatusColor() }]} />
        </View>

        {/* Connection Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>
            {isConnecting ? 'Connecting...' : status === 'connected' ? 'Ready' : 'Disconnected'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {status === 'connected' 
              ? 'AI Assistant is ready for multimodal input' 
              : 'Connecting to Gemini Live API'
            }
          </Text>
          {isConnecting && <ActivityIndicator size="small" color="#FB7185" style={styles.statusLoader} />}
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleConnect}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Mode Selector */}
        <View style={styles.modeSelectorCard}>
          <Text style={styles.modeSelectorTitle}>Choose Input Method:</Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[styles.modeBtn, activeMode === 'voice' && styles.modeBtnActive]}
              onPress={() => setActiveMode('voice')}
              disabled={status !== 'connected'}
            >
              <Text style={styles.modeBtnIcon}>🎤</Text>
              <Text style={styles.modeBtnText}>Voice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeBtn, activeMode === 'camera' && styles.modeBtnActive]}
              onPress={() => setActiveMode('camera')}
              disabled={status !== 'connected'}
            >
              <Text style={styles.modeBtnIcon}>📷</Text>
              <Text style={styles.modeBtnText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeBtn, activeMode === 'photo' && styles.modeBtnActive]}
              onPress={() => setActiveMode('photo')}
              disabled={status !== 'connected'}
            >
              <Text style={styles.modeBtnIcon}>📁</Text>
              <Text style={styles.modeBtnText}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeBtn, activeMode === 'text' && styles.modeBtnActive]}
              onPress={() => setActiveMode('text')}
              disabled={status !== 'connected'}
            >
              <Text style={styles.modeBtnIcon}>✏️</Text>
              <Text style={styles.modeBtnText}>Text</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Controls */}
        <View style={styles.inputCard}>
          {activeMode === 'voice' && (
            <View style={styles.voiceSection}>
              <Text style={styles.inputTitle}>Voice Description</Text>
              <Text style={styles.inputSubtitle}>Describe your ingredients or cooking goals</Text>
              
              <TouchableOpacity
                style={[styles.voiceBtn, isAudioRecording && styles.voiceBtnActive]}
                onPress={handleVoiceToggle}
                disabled={status !== 'connected'}
              >
                <Text style={styles.voiceBtnIcon}>
                  {isAudioRecording ? '⏹️' : '🎤'}
                </Text>
                <Text style={styles.voiceBtnText}>
                  {isAudioRecording ? 'Stop Recording' : 'Start Recording'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {activeMode === 'camera' && (
            <View style={styles.cameraSection}>
              <Text style={styles.inputTitle}>Live Camera</Text>
              <Text style={styles.inputSubtitle}>Capture ingredients in real-time</Text>
              
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setShowCamera(true)}
                disabled={status !== 'connected' || !cameraPermission}
              >
                <Text style={styles.actionBtnIcon}>📷</Text>
                <Text style={styles.actionBtnText}>Open Camera</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeMode === 'photo' && (
            <View style={styles.photoSection}>
              <Text style={styles.inputTitle}>Photo Upload</Text>
              <Text style={styles.inputSubtitle}>Select image from gallery</Text>
              
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handlePhotoPicker}
                disabled={status !== 'connected'}
              >
                <Text style={styles.actionBtnIcon}>📁</Text>
                <Text style={styles.actionBtnText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeMode === 'text' && (
            <View style={styles.textSection}>
              <Text style={styles.inputTitle}>Text Description</Text>
              <Text style={styles.inputSubtitle}>Type your ingredients or cooking preferences</Text>
              
              <View style={styles.textInputRow}>
                <TextInput
                  style={styles.textInput}
                  value={textInput}
                  onChangeText={setTextInput}
                  placeholder="e.g., I have tomatoes, basil, and cheese..."
                  placeholderTextColor="#9CA3AF"
                  onSubmitEditing={handleTextSubmit}
                  editable={status === 'connected'}
                  multiline
                />
                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={handleTextSubmit}
                  disabled={status !== 'connected' || !textInput.trim()}
                >
                  <Text style={styles.sendBtnText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Detected Ingredients */}
        {detectedIngredients.length > 0 && (
          <View style={styles.ingredientsCard}>
            <View style={styles.ingredientsHeader}>
              <Text style={styles.ingredientsTitle}>Detected Ingredients ({detectedIngredients.length})</Text>
              <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
                <Text style={styles.clearBtnText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {Object.entries(getIngredientsByCategory()).map(([category, ingredients]) => (
              ingredients.length > 0 && (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>
                    {category === 'vegetables' && '🥦'} 
                    {category === 'protein' && '🍗'} 
                    {category === 'staples' && '🍞'} 
                    {category === 'seasoning' && '🧂'} 
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  
                  <View style={styles.ingredientTags}>
                    {ingredients.map((ingredient, index) => {
                      const isSelected = selectedIngredients.has(ingredient.ingredient.toLowerCase());
                      const colors = categoryColors[category as keyof typeof categoryColors];
                      
                      return (
                        <TouchableOpacity
                          key={`${ingredient.ingredient}-${index}`}
                          style={[
                            styles.ingredientTag,
                            { backgroundColor: isSelected ? colors.selected : colors.background },
                          ]}
                          onPress={() => handleIngredientToggle(ingredient.ingredient.toLowerCase())}
                        >
                          <Text style={[
                            styles.ingredientTagText,
                            { color: isSelected ? '#FFFFFF' : colors.text }
                          ]}>
                            {ingredient.ingredient}
                          </Text>
                          {ingredient.confidence && (
                            <Text style={[
                              styles.confidenceText,
                              { color: isSelected ? '#FFFFFF' : colors.text }
                            ]}>
                              {Math.round(ingredient.confidence * 100)}%
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )
            ))}
          </View>
        )}

        {/* Continue Button */}
        {selectedIngredients.size > 0 && (
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>
              Continue with {selectedIngredients.size} ingredients
            </Text>
          </TouchableOpacity>
        )}

        {/* Logs for debugging */}
        {__DEV__ && logs.length > 0 && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug Logs:</Text>
            {logs.slice(-3).map((log, index) => (
              <Text key={index} style={styles.debugText}>
                {log.type}: {typeof log.message === 'string' ? log.message : JSON.stringify(log.message)}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF7ED' },
  scrollContainer: { flexGrow: 1, paddingBottom: 24 },
  
  // Header
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 16, 
    paddingBottom: 8, 
    paddingHorizontal: 24 
  },
  backBtn: { 
    padding: 8, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.7)' 
  },
  backBtnText: { fontSize: 18, color: '#FB7185', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', flex: 1, textAlign: 'center' },
  statusIndicator: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: 8 
  },

  // Status Card
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  statusSubtitle: { fontSize: 14, color: '#6B7280' },
  statusLoader: { marginTop: 8 },

  // Error Card
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: { fontSize: 14, color: '#DC2626', marginBottom: 8 },
  retryBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  retryBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },

  // Mode Selector
  modeSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  modeSelectorTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  modeButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modeBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FB7185',
  },
  modeBtnIcon: { fontSize: 20, marginBottom: 4 },
  modeBtnText: { fontSize: 12, fontWeight: 'bold', color: '#374151' },

  // Input Card
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  inputSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },

  // Voice Section
  voiceSection: { alignItems: 'center' },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  voiceBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FB7185',
  },
  voiceBtnIcon: { fontSize: 24, marginRight: 12 },
  voiceBtnText: { fontSize: 16, fontWeight: 'bold', color: '#374151' },

  // Action Button
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FB7185',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  actionBtnIcon: { fontSize: 20, marginRight: 12 },
  actionBtnText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },

  // Text Section
  textSection: {},
  textInputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendBtn: {
    backgroundColor: '#FB7185',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sendBtnText: { color: '#FFFFFF', fontWeight: 'bold' },

  // Camera
  cameraContainer: { flex: 1, backgroundColor: '#000000' },
  camera: { flex: 1 },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  cameraBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBackText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  cameraTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 40,
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },

  // Ingredients
  ingredientsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ingredientsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  clearBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearBtnText: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },

  categorySection: { marginBottom: 16 },
  categoryTitle: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  ingredientTags: { flexDirection: 'row', flexWrap: 'wrap' },
  ingredientTag: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ingredientTagText: { fontSize: 14, fontWeight: 'bold' },
  confidenceText: { fontSize: 10, marginTop: 2 },

  // Continue Button
  continueBtn: {
    backgroundColor: '#FB7185',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  continueBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  // Debug
  debugSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 24,
    marginTop: 16,
  },
  debugTitle: { fontSize: 12, fontWeight: 'bold', color: '#6B7280', marginBottom: 8 },
  debugText: { fontSize: 10, color: '#6B7280', marginBottom: 4 },
}); 