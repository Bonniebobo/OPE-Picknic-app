import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView
} from 'react-native';
import ManualInputMode from './RecipeHelperManualMode';
import AIAssistantMode from './RecipeHelperAIMode';

type Mode = 'manual' | 'ai';

interface RecipeHelperScreenProps {
  onBack: () => void;
  onIngredientsConfirmed: (ingredients: string[]) => void;
}

export default function RecipeHelperScreen({ onBack, onIngredientsConfirmed }: RecipeHelperScreenProps) {
  const [activeMode, setActiveMode] = useState<'manual' | 'ai'>('manual');

  const handleIngredientsConfirmed = (ingredients: string[]) => {
    onIngredientsConfirmed(ingredients);
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Recipe Helper</Text>
        </View>

        {/* Mode Switcher */}
        <View style={styles.modeSwitcherContainer}>
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                activeMode === 'manual' && styles.modeButtonActive
              ]}
              onPress={() => setActiveMode('manual')}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.modeButtonText,
                activeMode === 'manual' && styles.modeButtonTextActive
              ]}>
                🥬 Manual Input
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modeButton,
                activeMode === 'ai' && styles.modeButtonActive
              ]}
              onPress={() => setActiveMode('ai')}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.modeButtonText,
                activeMode === 'ai' && styles.modeButtonTextActive
              ]}>
                🤖 AI Assistant
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode Content */}
        <View style={styles.contentContainer}>
          {activeMode === 'manual' ? (
            <ManualInputMode onIngredientsConfirmed={handleIngredientsConfirmed} />
          ) : (
            <AIAssistantMode onIngredientsConfirmed={handleIngredientsConfirmed} />
          )}
        </View>
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
    flex: 1 
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
  modeSwitcherContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#FB7185',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
}); 