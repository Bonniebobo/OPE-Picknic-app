import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  recipes?: any[]; // RecipeCard type
}

interface MenuPlanningContextState {
  // Chat history
  chatHistory: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;
  
  // Current state
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  
  // Recommendation count
  recommendationCount: number;
  incrementRecommendationCount: () => void;
  resetRecommendationCount: () => void;
}

const MenuPlanningContext = createContext<MenuPlanningContextState | undefined>(undefined);

interface MenuPlanningProviderProps {
  children: ReactNode;
}

export const MenuPlanningProvider: React.FC<MenuPlanningProviderProps> = ({ children }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendationCount, setRecommendationCount] = useState(0);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `${message.role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    console.log('[MenuPlanningContext] Add message:', newMessage.role, newMessage.content.substring(0, 50));
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    setRecommendationCount(0);
    console.log('[MenuPlanningContext] Clear chat history');
  };

  const incrementRecommendationCount = () => {
    setRecommendationCount(prev => prev + 1);
  };

  const resetRecommendationCount = () => {
    setRecommendationCount(0);
  };

  const value: MenuPlanningContextState = {
    chatHistory,
    addMessage,
    clearChatHistory,
    isProcessing,
    setIsProcessing,
    recommendationCount,
    incrementRecommendationCount,
    resetRecommendationCount,
  };

  return (
    <MenuPlanningContext.Provider value={value}>
      {children}
    </MenuPlanningContext.Provider>
  );
};

export const useMenuPlanning = (): MenuPlanningContextState => {
  const context = useContext(MenuPlanningContext);
  if (context === undefined) {
    throw new Error('useMenuPlanning must be used within a MenuPlanningProvider');
  }
  return context;
}; 