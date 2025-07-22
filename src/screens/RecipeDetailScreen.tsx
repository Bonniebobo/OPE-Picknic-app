import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { RecipeCard } from '../types/recipe';
import { useToCookList } from '../context/ToCookListContext';

interface RecipeDetailScreenProps {
  route: {
    params: {
      recipe: RecipeCard;
    };
  };
  navigation: any;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { recipe } = route.params;
  const { addToCookList, removeFromCookList, isInCookList } = useToCookList();
  
  const isAlreadyInList = isInCookList(recipe.id);

  const handleToggleTodoList = () => {
    if (isAlreadyInList) {
      // Find the cooking plan by recipe ID and remove it
      const { cookingPlans } = useToCookList();
      const cookingPlan = cookingPlans.find(plan => plan.recipe.id === recipe.id);
      if (cookingPlan) {
        removeFromCookList(cookingPlan.id);
      }
    } else {
      addToCookList(recipe);
    }
  };

  const handleOpenSource = () => {
    if (recipe.url) {
      Linking.openURL(recipe.url);
    }
  };

  const formatInstructions = (instructions: string) => {
    // 将制作步骤按行分割并格式化
    const steps = instructions.split('\n').filter(step => step.trim());
    return steps.map((step, index) => (
      <View key={index} style={styles.stepContainer}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.stepText}>{step.trim()}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.todoButton,
            isAlreadyInList && styles.todoButtonActive
          ]}
          onPress={handleToggleTodoList}
        >
          <Text style={[
            styles.todoButtonText,
            isAlreadyInList && styles.todoButtonTextActive
          ]}>
            {isAlreadyInList ? '✅ 已在清单' : '➕ 加入待做'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 菜谱图片 */}
        <Image 
          source={{ uri: recipe.imageUrl }} 
          style={styles.image}
          defaultSource={require('../../assets/icon.png')}
        />

        {/* 菜谱标题和基本信息 */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{recipe.name}</Text>
          
          <View style={styles.metaContainer}>
            {recipe.cookingTime && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>⏱️ 制作时间</Text>
                <Text style={styles.metaValue}>{recipe.cookingTime}</Text>
              </View>
            )}
            
            {recipe.difficulty && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>📊 难度</Text>
                <Text style={styles.metaValue}>{recipe.difficulty}</Text>
              </View>
            )}
            
            {recipe.servings && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>👥 份量</Text>
                <Text style={styles.metaValue}>{recipe.servings}</Text>
              </View>
            )}
            
            {recipe.calories && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>🔥 热量</Text>
                <Text style={styles.metaValue}>{recipe.calories}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 食材清单 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥬 所需食材</Text>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientBullet}>•</Text>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 制作步骤 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🍳 制作步骤</Text>
          <View style={styles.stepsContainer}>
            {formatInstructions(recipe.instructions)}
          </View>
        </View>

        {/* 来源链接 */}
        {recipe.url && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sourceButton}
              onPress={handleOpenSource}
            >
              <Text style={styles.sourceButtonText}>
                🔗 查看原始菜谱
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  todoButton: {
    backgroundColor: '#00b894',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todoButtonActive: {
    backgroundColor: '#95a5a6',
  },
  todoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  todoButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#f5f5f5',
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    minWidth: '40%',
  },
  metaLabel: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
  },
  ingredientsContainer: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredientBullet: {
    fontSize: 16,
    color: '#00b894',
    marginRight: 8,
    marginTop: 2,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 24,
  },
  stepsContainer: {
    gap: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00b894',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 24,
  },
  sourceButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  sourceButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
}); 