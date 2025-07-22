import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Ingredient {
  id: string;
  name: string;
  category?: string;
  source?: 'manual' | 'voice' | 'camera' | 'ai';
  addedAt: Date;
}

interface IngredientContextState {
  ingredients: Ingredient[];
  addIngredient: (name: string, source?: Ingredient['source']) => void;
  addIngredients: (names: string[], source?: Ingredient['source']) => void;
  removeIngredient: (id: string) => void;
  clearIngredients: () => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  getIngredientNames: () => string[];
  hasIngredient: (name: string) => boolean;
}

const IngredientContext = createContext<IngredientContextState | undefined>(undefined);

interface IngredientProviderProps {
  children: ReactNode;
}

export const IngredientProvider: React.FC<IngredientProviderProps> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const addIngredient = (name: string, source: Ingredient['source'] = 'manual') => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Prevent duplicate additions
    if (ingredients.some(ing => ing.name.toLowerCase() === trimmedName.toLowerCase())) {
      return;
    }

    const newIngredient: Ingredient = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: trimmedName,
      source,
      addedAt: new Date(),
    };

    setIngredients(prev => [...prev, newIngredient]);
  };

  const addIngredients = (names: string[], source: Ingredient['source'] = 'manual') => {
    names.forEach(name => addIngredient(name, source));
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const clearIngredients = () => {
    setIngredients([]);
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setIngredients(prev => 
      prev.map(ing => 
        ing.id === id ? { ...ing, ...updates } : ing
      )
    );
  };

  const getIngredientNames = (): string[] => {
    return ingredients.map(ing => ing.name);
  };

  const hasIngredient = (name: string): boolean => {
    return ingredients.some(ing => 
      ing.name.toLowerCase() === name.toLowerCase()
    );
  };

  const value: IngredientContextState = {
    ingredients,
    addIngredient,
    addIngredients,
    removeIngredient,
    clearIngredients,
    updateIngredient,
    getIngredientNames,
    hasIngredient,
  };

  return (
    <IngredientContext.Provider value={value}>
      {children}
    </IngredientContext.Provider>
  );
};

export const useIngredients = (): IngredientContextState => {
  const context = useContext(IngredientContext);
  if (context === undefined) {
    throw new Error('useIngredients must be used within an IngredientProvider');
  }
  return context;
}; 