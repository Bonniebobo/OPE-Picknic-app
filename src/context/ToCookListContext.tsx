import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RecipeCard } from '../types/recipe';

export interface CookingPlan {
  id: string;
  recipe: RecipeCard;
  addedAt: Date;
  status: 'planned' | 'cooking' | 'completed';
  notes?: string;
}

interface ToCookListContextState {
  cookingPlans: CookingPlan[];
  addToCookList: (recipe: RecipeCard, notes?: string) => void;
  removeFromCookList: (id: string) => void;
  updateCookingStatus: (id: string, status: CookingPlan['status']) => void;
  clearCookList: () => void;
  isInCookList: (recipeId: string) => boolean;
  getPlanById: (id: string) => CookingPlan | undefined;
  getPlannedRecipes: () => CookingPlan[];
  getCookingRecipes: () => CookingPlan[];
  getCompletedRecipes: () => CookingPlan[];
}

const ToCookListContext = createContext<ToCookListContextState | undefined>(undefined);

interface ToCookListProviderProps {
  children: ReactNode;
}

export const ToCookListProvider: React.FC<ToCookListProviderProps> = ({ children }) => {
  const [cookingPlans, setCookingPlans] = useState<CookingPlan[]>([]);

  const addToCookList = (recipe: RecipeCard, notes?: string) => {
    // Prevent adding duplicate recipes
    if (cookingPlans.some(plan => plan.recipe.id === recipe.id)) {
      return;
    }

    const newPlan: CookingPlan = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      recipe,
      addedAt: new Date(),
      status: 'planned',
      notes,
    };

    setCookingPlans(prev => [...prev, newPlan]);
  };

  const removeFromCookList = (id: string) => {
    setCookingPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const updateCookingStatus = (id: string, status: CookingPlan['status']) => {
    setCookingPlans(prev => 
      prev.map(plan => 
        plan.id === id ? { ...plan, status } : plan
      )
    );
  };

  const clearCookList = () => {
    setCookingPlans([]);
  };

  const isInCookList = (recipeId: string): boolean => {
    return cookingPlans.some(plan => plan.recipe.id === recipeId);
  };

  const getPlanById = (id: string): CookingPlan | undefined => {
    return cookingPlans.find(plan => plan.id === id);
  };

  const getPlannedRecipes = (): CookingPlan[] => {
    return cookingPlans.filter(plan => plan.status === 'planned');
  };

  const getCookingRecipes = (): CookingPlan[] => {
    return cookingPlans.filter(plan => plan.status === 'cooking');
  };

  const getCompletedRecipes = (): CookingPlan[] => {
    return cookingPlans.filter(plan => plan.status === 'completed');
  };

  const value: ToCookListContextState = {
    cookingPlans,
    addToCookList,
    removeFromCookList,
    updateCookingStatus,
    clearCookList,
    isInCookList,
    getPlanById,
    getPlannedRecipes,
    getCookingRecipes,
    getCompletedRecipes,
  };

  return (
    <ToCookListContext.Provider value={value}>
      {children}
    </ToCookListContext.Provider>
  );
};

export const useToCookList = (): ToCookListContextState => {
  const context = useContext(ToCookListContext);
  if (context === undefined) {
    throw new Error('useToCookList must be used within a ToCookListProvider');
  }
  return context;
}; 