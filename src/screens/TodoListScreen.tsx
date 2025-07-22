import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useToCookList } from '../context/ToCookListContext';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeCard as RecipeCardType } from '../types/recipe';

interface TodoListScreenProps {
  navigation: any;
}

export const TodoListScreen: React.FC<TodoListScreenProps> = ({ navigation }) => {
  const { cookingPlans, clearCookList, removeFromCookList } = useToCookList();

  const handleViewDetails = (recipe: RecipeCardType) => {
    navigation.navigate('RecipeDetail', { recipe });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Cooking List',
      'Are you sure you want to clear all recipes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: clearCookList, style: 'destructive' },
      ]
    );
  };

  const renderRecipeItem = ({ item }: { item: any }) => (
    <View style={styles.recipeItem}>
      <RecipeCard 
        recipe={item.recipe} 
        onViewDetails={handleViewDetails}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCookList(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>Your cooking list is empty</Text>
      <Text style={styles.emptySubtitle}>
        When using the AI assistant to recommend recipes, click the "Add to List" button to add recipes
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to AI Assistant</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrowText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Cooking List</Text>
        
        {cookingPlans.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cookingPlans.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {cookingPlans.length} recipes to cook
          </Text>
          
          <FlatList
            data={cookingPlans}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

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
  backArrow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
  },
  backArrowText: {
    fontSize: 16,
    color: '#FB7185', // Project standard pink color
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937', // Project standard dark gray
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#EF4444', // Modern red color
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#636e72',
    textAlign: 'center',
    paddingVertical: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  recipeItem: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 20,
    right: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 1,
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // Project standard dark gray
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#FB7185', // Project standard pink color
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#FB7185',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 