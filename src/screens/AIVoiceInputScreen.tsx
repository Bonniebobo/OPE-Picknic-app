import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import AIVoiceService from '../services/aiVoiceService';

interface AIVoiceInputScreenProps {
  onBack: () => void;
  onIngredientsDetected: (ingredients: string[]) => void;
}

const { width } = Dimensions.get('window');

export default function AIVoiceInputScreen({ onBack, onIngredientsDetected }: AIVoiceInputScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Simulate voice recording animation
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    startPulseAnimation();
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      handleStopRecording();
    }, 3000);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    stopPulseAnimation();
    setIsProcessing(true);
    
    try {
      // Use AIVoiceService to process voice input
      const result = await AIVoiceService.processVoiceInput();
      
      setTranscription(result.transcription);
      setIsProcessing(false);
      
      // Show confirmation dialog
      Alert.alert(
        'Ingredients Detected',
        `I heard: "${result.transcription}"\n\nDetected ingredients: ${result.ingredients.join(', ')}`,
        [
          { text: 'Edit', style: 'cancel' },
          { 
            text: 'Confirm', 
            onPress: () => onIngredientsDetected(result.ingredients)
          }
        ]
      );
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to process voice input. Please try again.');
      console.error('Voice processing error:', error);
    }
  };

  const handleManualInput = () => {
    Alert.prompt(
      'Manual Input',
      'Describe your ingredients:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: async (text) => {
            if (text) {
              try {
                setIsProcessing(true);
                const result = await AIVoiceService.processTextInput(text);
                setIsProcessing(false);
                
                Alert.alert(
                  'Ingredients Detected',
                  `From your text: "${result.transcription}"\n\nDetected ingredients: ${result.ingredients.join(', ')}`,
                  [
                    { text: 'Edit', style: 'cancel' },
                    { 
                      text: 'Confirm', 
                      onPress: () => onIngredientsDetected(result.ingredients)
                    }
                  ]
                );
              } catch (error) {
                setIsProcessing(false);
                Alert.alert('Error', 'Failed to process text input. Please try again.');
                console.error('Text processing error:', error);
              }
            }
          }
        }
      ],
      'plain-text'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>AI Voice Input</Text>
        </View>

        {/* Bot Header */}
        <View style={styles.botCard}>
          <Text style={styles.botEmoji}>🎙️</Text>
          <Text style={styles.botName}>AI Voice Assistant</Text>
          <Text style={styles.botDesc}>Tell me what ingredients you have, and I'll help you find recipes!</Text>
        </View>

        {/* Recording Area */}
        <View style={styles.recordingSection}>
          {!isRecording && !isProcessing && (
            <View style={styles.instructionCard}>
              <Text style={styles.instructionTitle}>How to use:</Text>
              <Text style={styles.instructionText}>
                • Tap the microphone to start recording{'\n'}
                • Describe your ingredients naturally{'\n'}
                • Example: "I have tomatoes, basil, and cheese"{'\n'}
                • Or use manual input for text
              </Text>
            </View>
          )}

          {/* Recording Button */}
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
              isProcessing && styles.recordButtonDisabled
            ]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <Animated.View style={[
              styles.recordButtonInner,
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <Text style={styles.recordButtonIcon}>
                {isRecording ? '⏹️' : isProcessing ? '⏳' : '🎤'}
              </Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Status Text */}
          <Text style={styles.statusText}>
            {isRecording ? 'Recording... Speak now!' : 
             isProcessing ? 'Processing your voice...' : 
             'Tap to start recording'}
          </Text>

          {/* Manual Input Option */}
          {!isRecording && !isProcessing && (
            <TouchableOpacity style={styles.manualButton} onPress={handleManualInput}>
              <Text style={styles.manualButtonText}>✏️ Type manually instead</Text>
            </TouchableOpacity>
          )}

          {/* Transcription Display */}
          {transcription && (
            <View style={styles.transcriptionCard}>
              <Text style={styles.transcriptionTitle}>What I heard:</Text>
              <Text style={styles.transcriptionText}>{transcription}</Text>
            </View>
          )}
        </View>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color="#FB7185" />
            <Text style={styles.processingText}>AI is analyzing your ingredients...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFF7ED' 
  },
  container: { 
    flex: 1, 
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
  headerText: { 
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
  recordingSection: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 24 
  },
  instructionCard: { 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 32, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 6, 
    elevation: 2 
  },
  instructionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    marginBottom: 8 
  },
  instructionText: { 
    fontSize: 14, 
    color: '#6B7280', 
    lineHeight: 20 
  },
  recordButton: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: '#FB7185', 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#FB7185', 
    shadowOpacity: 0.3, 
    shadowRadius: 12, 
    elevation: 8, 
    marginBottom: 24 
  },
  recordButtonActive: { 
    backgroundColor: '#E11D48' 
  },
  recordButtonDisabled: { 
    backgroundColor: '#9CA3AF' 
  },
  recordButtonInner: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  recordButtonIcon: { 
    fontSize: 36 
  },
  statusText: { 
    fontSize: 16, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginBottom: 24 
  },
  manualButton: { 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    borderRadius: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 4, 
    elevation: 2 
  },
  manualButtonText: { 
    fontSize: 14, 
    color: '#6B7280', 
    fontWeight: '600' 
  },
  transcriptionCard: { 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    borderRadius: 16, 
    padding: 16, 
    marginTop: 24, 
    width: '100%', 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 6, 
    elevation: 2 
  },
  transcriptionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    marginBottom: 8 
  },
  transcriptionText: { 
    fontSize: 14, 
    color: '#6B7280', 
    fontStyle: 'italic' 
  },
  processingCard: { 
    position: 'absolute', 
    top: '50%', 
    left: 24, 
    right: 24, 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    borderRadius: 16, 
    padding: 24, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.15, 
    shadowRadius: 12, 
    elevation: 8 
  },
  processingText: { 
    fontSize: 16, 
    color: '#6B7280', 
    marginTop: 12, 
    textAlign: 'center' 
  }
}); 