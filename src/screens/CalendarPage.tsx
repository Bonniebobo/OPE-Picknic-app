import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const calendarData: Record<string, { bot: string; meal: string; activity: string }> = {
  '2024-01-15': { bot: '🐰', meal: '🍜', activity: 'Comfort ramen chat' },
  '2024-01-16': { bot: '🐱', meal: '🍝', activity: 'Pasta recipe discussion' },
  '2024-01-17': { bot: '🦊', meal: '🎲', activity: 'Food challenge game' },
  '2024-01-18': { bot: '🐶', meal: '🌮', activity: 'Taco Tuesday celebration' },
  '2024-01-19': { bot: '🐰', meal: '🥗', activity: 'Healthy salad suggestions' },
  '2024-01-20': { bot: '🐱', meal: '🍕', activity: 'Pizza making tips' },
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Food Calendar</Text>
          <Text style={styles.headerSubtitle}>Track your AI companion chats and meals</Text>
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
                      <Text style={styles.calendarCellEmoji}>{dayData.bot}</Text>
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
                <Text style={styles.detailCardEmoji}>{calendarData[selectedDate].bot}</Text>
                <Text style={styles.detailCardEmoji}>{calendarData[selectedDate].meal}</Text>
              </View>
              <Text style={styles.detailCardActivity}>{calendarData[selectedDate].activity}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF7ED' },
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
}); 