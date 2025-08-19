import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// AI Characters data matching HomePage and ChatPage
const aiCharacters = [
  {
    id: 'mood-matcher',
    name: 'Mood Matcher',
    emoji: '🩷',
    background: '#FCE7F3',
    avatarColors: {
      body: '#FBCFE8',
      head: '#F9A8D4',
      cheeks: '#F472B6',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
  {
    id: 'recipe-helper',
    name: 'Recipe Helper',
    emoji: '🥕',
    background: '#FFEDD5',
    avatarColors: {
      body: '#FED7AA',
      head: '#FDBA74',
      cheeks: '#FB923C',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
  {
    id: 'experienced-explorer',
    name: 'Experienced Explorer',
    emoji: '🌍',
    background: '#DCFCE7',
    avatarColors: {
      body: '#BBF7D0',
      head: '#86EFAC',
      cheeks: '#4ADE80',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
  {
    id: 'play-mode-bot',
    name: 'Play Mode Bot',
    emoji: '🎮',
    background: '#F3E8FF',
    avatarColors: {
      body: '#E9D5FF',
      head: '#D8B4FE',
      cheeks: '#A78BFA',
      eyes: '#1F2937',
      mouth: '#374151',
    },
  },
];

const calendarData: Record<string, { botId: string; meal: string; activity: string }> = {
  '2024-01-15': { botId: 'mood-matcher', meal: '🍜', activity: 'Comfort ramen chat' },
  '2024-01-16': { botId: 'recipe-helper', meal: '🍝', activity: 'Pasta recipe tips' },
  '2024-01-17': { botId: 'play-mode-bot', meal: '🎲', activity: 'Food challenge game' },
  '2024-01-18': { botId: 'experienced-explorer', meal: '🌮', activity: 'Taco Tuesday spots' },
  '2024-01-19': { botId: 'mood-matcher', meal: '🥗', activity: 'Healthy salad ideas' },
  '2024-01-20': { botId: 'recipe-helper', meal: '🍕', activity: 'Pizza making tips' },
};

// FlatAvatar component matching HomePage and ChatPage
const FlatAvatar = ({ colors, size = 'small' }: { colors: any; size?: 'small' | 'large' }) => {
  const isSmall = size === 'small';
  const containerSize = isSmall ? 20 : 32;
  const headSize = isSmall ? 14 : 24;
  const bodySize = isSmall ? 10 : 16;
  const eyeSize = isSmall ? 2 : 3;
  const mouthWidth = isSmall ? 3 : 5;
  const cheekSize = isSmall ? 2 : 3;
  const armSize = isSmall ? 4 : 6;
  
  return (
    <View style={[styles.avatarContainer, { width: containerSize, height: containerSize }]}>
      {/* Body */}
      <View style={[
        styles.avatarBody, 
        { 
          backgroundColor: colors.body,
          width: bodySize,
          height: bodySize * 0.8,
          left: (containerSize - bodySize) / 2,
          borderRadius: bodySize / 2
        }
      ]} />
      {/* Head */}
      <View style={[
        styles.avatarHead, 
        { 
          backgroundColor: colors.head,
          width: headSize,
          height: headSize,
          left: (containerSize - headSize) / 2,
          borderRadius: headSize / 2
        }
      ]}>
        {/* Eyes */}
        <View style={[
          styles.avatarEye, 
          { 
            left: headSize * 0.25,
            backgroundColor: colors.eyes,
            width: eyeSize,
            height: eyeSize,
            borderRadius: eyeSize / 2,
            top: headSize * 0.35
          }
        ]} />
        <View style={[
          styles.avatarEye, 
          { 
            right: headSize * 0.25,
            backgroundColor: colors.eyes,
            width: eyeSize,
            height: eyeSize,
            borderRadius: eyeSize / 2,
            top: headSize * 0.35
          }
        ]} />
        {/* Mouth */}
        <View style={[
          styles.avatarMouth, 
          { 
            backgroundColor: colors.mouth,
            width: mouthWidth,
            height: eyeSize,
            left: (headSize - mouthWidth) / 2,
            borderRadius: eyeSize / 2,
            top: headSize * 0.6
          }
        ]} />
        {/* Cheeks */}
        <View style={[
          styles.avatarCheek, 
          { 
            left: headSize * 0.15,
            backgroundColor: colors.cheeks,
            width: cheekSize,
            height: cheekSize * 0.8,
            borderRadius: cheekSize / 2,
            top: headSize * 0.45,
            opacity: 0.6
          }
        ]} />
        <View style={[
          styles.avatarCheek, 
          { 
            right: headSize * 0.15,
            backgroundColor: colors.cheeks,
            width: cheekSize,
            height: cheekSize * 0.8,
            borderRadius: cheekSize / 2,
            top: headSize * 0.45,
            opacity: 0.6
          }
        ]} />
      </View>
      {/* Arms - only for larger size */}
      {!isSmall && (
        <>
          <View style={[
            styles.avatarArm, 
            { 
              left: 0,
              backgroundColor: colors.body,
              width: armSize,
              height: armSize * 2,
              borderRadius: armSize / 2,
              top: containerSize * 0.7,
              transform: [{ rotate: '-12deg' }]
            }
          ]} />
          <View style={[
            styles.avatarArm, 
            { 
              right: 0,
              backgroundColor: colors.body,
              width: armSize,
              height: armSize * 2,
              borderRadius: armSize / 2,
              top: containerSize * 0.7,
              transform: [{ rotate: '12deg' }]
            }
          ]} />
        </>
      )}
    </View>
  );
};

// Helper function to get character by ID
const getCharacterById = (botId: string) => {
  return aiCharacters.find(char => char.id === botId) || aiCharacters[0];
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // January 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Food Calendar</Text>
          <Text style={styles.headerSubtitle}>Track your AI chats and meals</Text>
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Month Navigation */}
          <View style={styles.monthNavRow}>
            <TouchableOpacity style={styles.monthNavBtn} onPress={() => navigateMonth('prev')}>
              {/* <ChevronLeft /> */}
              <Text style={styles.chevronIcon}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity style={styles.monthNavBtn} onPress={() => navigateMonth('next')}>
              {/* <ChevronRight /> */}
              <Text style={styles.chevronIcon}>➡️</Text>
            </TouchableOpacity>
          </View>

          {/* Days of Week */}
          <View style={styles.daysOfWeekRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.dayOfWeekText}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <View key={`empty-${i}`} style={styles.calendarCell} />
            ))}
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayData = calendarData[dateKey];
              const isSelected = selectedDate === dateKey;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.calendarCell, isSelected ? styles.selectedCell : dayData ? styles.hasDataCell : styles.defaultCell]}
                  onPress={() => handleDateSelect(dateKey)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.calendarCellDay}>{day}</Text>
                  {dayData && (
                    <View style={styles.calendarCellEmojis}>
                      <FlatAvatar colors={getCharacterById(dayData.botId).avatarColors} size="small" />
                      <Text style={styles.calendarCellEmoji}>{dayData.meal}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Details */}
        {selectedDate && calendarData[selectedDate] && (
          <View style={styles.detailCard}>
            <View style={styles.detailCardContent}>
              <Text style={styles.detailCardTitle}>
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </Text>
              <View style={styles.detailCardEmojisRow}>
                <FlatAvatar colors={getCharacterById(calendarData[selectedDate].botId).avatarColors} size="large" />
                <Text style={styles.detailCardEmoji}>{calendarData[selectedDate].meal}</Text>
              </View>
              <Text style={styles.detailCardActivity}>{calendarData[selectedDate].activity}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  scrollContainer: { flexGrow: 1, paddingBottom: 24 },
  header: { alignItems: 'center', paddingTop: 48, paddingBottom: 24, paddingHorizontal: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  headerSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  calendarCard: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 24, marginHorizontal: 24, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 8, elevation: 2, padding: 16 },
  monthNavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  monthNavBtn: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(243,244,246,0.7)' },
  chevronIcon: { fontSize: 20, color: '#6B7280' },
  monthTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  daysOfWeekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  dayOfWeekText: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#6B7280', paddingVertical: 6 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 4, borderRadius: 12 },
  defaultCell: { backgroundColor: 'transparent' },
  hasDataCell: { backgroundColor: '#FCE7F3' },
  selectedCell: { backgroundColor: '#FB7185', shadowColor: '#FB7185', shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },
  calendarCellDay: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  calendarCellEmojis: { flexDirection: 'row', marginTop: 2 },
  calendarCellEmoji: { fontSize: 13, marginRight: 2 },
  detailCard: { backgroundColor: '#FCE7F3', borderRadius: 24, marginHorizontal: 24, marginTop: 16, shadowColor: '#FB7185', shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },
  detailCardContent: { alignItems: 'center', padding: 20 },
  detailCardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 8, textAlign: 'center' },
  detailCardEmojisRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  detailCardEmoji: { fontSize: 28, marginHorizontal: 8 },
  detailCardActivity: { fontSize: 15, color: '#6B7280', fontWeight: '500', textAlign: 'center' },
  // FlatAvatar styles
  avatarContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  avatarBody: { position: 'absolute', bottom: 0 },
  avatarHead: { position: 'absolute', top: 0, alignItems: 'center', justifyContent: 'center' },
  avatarEye: { position: 'absolute' },
  avatarMouth: { position: 'absolute' },
  avatarCheek: { position: 'absolute' },
  avatarArm: { position: 'absolute' },
}); 