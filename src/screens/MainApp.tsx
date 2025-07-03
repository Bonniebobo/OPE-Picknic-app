import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import HomePage from './HomePage';
import ChatPage from './ChatPage';
import CalendarPage from './CalendarPage';
import CollectionPage from './CollectionPage';
import BotInteractionScreen from './BotInteractionScreen';

// type TabType = 'home' | 'chat' | 'calendar' | 'collection';

interface MainAppProps {
  eatingPreference?: string;
}

export default function MainApp({ eatingPreference = 'unsure' }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'calendar' | 'collection'>('home');
  const [selectedBot, setSelectedBot] = useState<string | null>(null);

  const handleBotSelect = (botId: string) => {
    setSelectedBot(botId);
  };

  const handleBackToHome = () => {
    setSelectedBot(null);
    setActiveTab('home');
  };

  const renderCurrentTab = () => {
    if (selectedBot) {
      return <BotInteractionScreen botId={selectedBot} eatingPreference={eatingPreference} onBack={handleBackToHome} />;
    }
    switch (activeTab) {
      case 'home':
        return <HomePage eatingPreference={eatingPreference} onBotSelect={handleBotSelect} />;
      case 'chat':
        return <ChatPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'collection':
        return <CollectionPage />;
      default:
        return <HomePage eatingPreference={eatingPreference} onBotSelect={handleBotSelect} />;
    }
  };

  // Hide bottom navigation when in bot interaction
  const showBottomNav = !selectedBot;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Main Content Area */}
        <View style={styles.contentArea}>{renderCurrentTab()}</View>
        {/* Bottom Navigation Bar */}
        {showBottomNav && (
          <View style={styles.bottomNavBar}>
            <View style={styles.bottomNavRow}>
              <TouchableOpacity
                onPress={() => setActiveTab('home')}
                style={[styles.navBtn, activeTab === 'home' && styles.navBtnActive]}
                activeOpacity={0.85}
              >
                {/* <Home /> */}
                <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>🏠</Text>
                <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('chat')}
                style={[styles.navBtn, activeTab === 'chat' && styles.navBtnActive]}
                activeOpacity={0.85}
              >
                {/* <MessageCircle /> */}
                <Text style={[styles.navIcon, activeTab === 'chat' && styles.navIconActive]}>💬</Text>
                <Text style={[styles.navLabel, activeTab === 'chat' && styles.navLabelActive]}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('calendar')}
                style={[styles.navBtn, activeTab === 'calendar' && styles.navBtnActive]}
                activeOpacity={0.85}
              >
                {/* <Calendar /> */}
                <Text style={[styles.navIcon, activeTab === 'calendar' && styles.navIconActive]}>📅</Text>
                <Text style={[styles.navLabel, activeTab === 'calendar' && styles.navLabelActive]}>Calendar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('collection')}
                style={[styles.navBtn, activeTab === 'collection' && styles.navBtnActive]}
                activeOpacity={0.85}
              >
                {/* <FolderOpen /> */}
                <Text style={[styles.navIcon, activeTab === 'collection' && styles.navIconActive]}>📁</Text>
                <Text style={[styles.navLabel, activeTab === 'collection' && styles.navLabelActive]}>Collection</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF7ED' },
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  contentArea: { flex: 1 },
  bottomNavBar: { backgroundColor: 'rgba(255,255,255,0.9)', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: 24, paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  bottomNavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  navBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 18 },
  navBtnActive: { backgroundColor: '#FCE7F3', shadowColor: '#FB7185', shadowOpacity: 0.10, shadowRadius: 6, elevation: 2 },
  navIcon: { fontSize: 22, color: '#6B7280', marginBottom: 2 },
  navIconActive: { color: '#FB7185' },
  navLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  navLabelActive: { color: '#FB7185' },
}); 