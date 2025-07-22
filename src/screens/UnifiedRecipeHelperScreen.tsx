import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useIngredients } from '../context/IngredientContext';
import { useToCookList } from '../context/ToCookListContext';
import IngredientInputSection from '../components/IngredientInputSection';
import MenuPlanningSection from '../components/MenuPlanningSection';
import { TodoListScreen as ToCookListScreen } from './TodoListScreen';

type FlowStep = 'ingredient-input' | 'menu-planning' | 'tocook-list';

interface UnifiedRecipeHelperScreenProps {
  onBack: () => void;
  navigation?: any;
}

export default function UnifiedRecipeHelperScreen({ 
  onBack, 
  navigation 
}: UnifiedRecipeHelperScreenProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('ingredient-input');
  const { ingredients, getIngredientNames } = useIngredients();
  const { cookingPlans } = useToCookList();

  const handleStartMenuPlanning = () => {
    if (ingredients.length === 0) {
      Alert.alert(
        'Ingredients Needed',
        'Please add some ingredients first, then start planning your menu.',
        [{ text: 'OK' }]
      );
      return;
    }
    setCurrentStep('menu-planning');
  };

  const handleViewToCookList = () => {
    setCurrentStep('tocook-list');
  };

  const handleBackToIngredients = () => {
    setCurrentStep('ingredient-input');
  };

  const handleBackToPlanning = () => {
    setCurrentStep('menu-planning');
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepRow}>
        <View style={[
          styles.stepDot, 
          currentStep === 'ingredient-input' && styles.stepDotActive
        ]}>
          <Text style={[
            styles.stepNumber,
            currentStep === 'ingredient-input' && styles.stepNumberActive
          ]}>1</Text>
        </View>
        <View style={[
          styles.stepLine,
          (currentStep === 'menu-planning' || currentStep === 'tocook-list') && styles.stepLineActive
        ]} />
        <View style={[
          styles.stepDot,
          (currentStep === 'menu-planning' || currentStep === 'tocook-list') && styles.stepDotActive
        ]}>
          <Text style={[
            styles.stepNumber,
            (currentStep === 'menu-planning' || currentStep === 'tocook-list') && styles.stepNumberActive
          ]}>2</Text>
        </View>
        <View style={[
          styles.stepLine,
          currentStep === 'tocook-list' && styles.stepLineActive
        ]} />
        <View style={[
          styles.stepDot,
          currentStep === 'tocook-list' && styles.stepDotActive
        ]}>
          <Text style={[
            styles.stepNumber,
            currentStep === 'tocook-list' && styles.stepNumberActive
          ]}>3</Text>
        </View>
      </View>
      <View style={styles.stepLabels}>
        <Text style={[
          styles.stepLabel,
          currentStep === 'ingredient-input' && styles.stepLabelActive
        ]}>Add Ingredients</Text>
        <Text style={[
          styles.stepLabel,
          (currentStep === 'menu-planning' || currentStep === 'tocook-list') && styles.stepLabelActive
        ]}>Plan Menu</Text>
        <Text style={[
          styles.stepLabel,
          currentStep === 'tocook-list' && styles.stepLabelActive
        ]}>Start Cooking</Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'ingredient-input':
        return (
          <IngredientInputSection 
            onStartPlanning={handleStartMenuPlanning}
            onViewToCookList={handleViewToCookList}
          />
        );
      case 'menu-planning':
        return (
          <MenuPlanningSection 
            onBackToIngredients={handleBackToIngredients}
            onViewToCookList={handleViewToCookList}
            navigation={navigation}
          />
        );
      case 'tocook-list':
        return (
          <ToCookListScreen 
            navigation={{
              ...navigation,
              goBack: () => {
                if (cookingPlans.length === 0) {
                  handleBackToIngredients();
                } else {
                  handleBackToPlanning();
                }
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Menu Planning</Text>
        <View style={styles.headerRight}>
          {cookingPlans.length > 0 && currentStep !== 'tocook-list' && (
            <TouchableOpacity 
              style={styles.cookListBadge}
              onPress={handleViewToCookList}
            >
              <Text style={styles.cookListBadgeText}>{cookingPlans.length}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <View style={styles.content}>
        {renderCurrentStep()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED', // Project standard warm white background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FB7185', // Project standard pink color
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937', // Project standard dark gray
  },
  headerRight: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  cookListBadge: {
    backgroundColor: '#FB7185', // Use project pink color
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  cookListBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepIndicator: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  stepDotActive: {
    backgroundColor: '#FB7185', // Project standard pink color
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
    borderRadius: 1.5,
  },
  stepLineActive: {
    backgroundColor: '#FB7185', // Project standard pink color
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#FB7185', // Project standard pink color
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
}); 