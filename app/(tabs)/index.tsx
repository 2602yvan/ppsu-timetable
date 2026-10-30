import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import timetableData from '@/latest-timetable.json' assert { type: 'json' };
import { userProfile } from '@/data/userProfile';

import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function TimetableScreen() {
  const router = useRouter();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayDate = new Date().getDate();

  const [selectedDay, setSelectedDay] = useState(today);

  // Process timetable data
  const schedule = timetableData.timetable.schedule;
  const days = [...new Set(schedule.map((item: any) => item.day))];

  // Get classes for selected day
  const selectedClasses = schedule.filter((item: any) => item.day === selectedDay);

  const handleClassClick = (cls: any) => {
    router.push({
      pathname: '/class-details',
      params: {
        courseName: cls.courseName,
        courseCode: cls.courseCode,
        timeStart: cls.time.start,
        timeEnd: cls.time.end,
        location: cls.location,
        faculty: cls.faculty,
        batch: cls.batch,
        isLab: cls.isLab ? 'true' : 'false',
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerTop}>
          <ThemedText style={styles.headerTitle}>Timetable</ThemedText>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <View style={styles.avatarPlaceholder}>
              <ThemedText style={styles.avatarText}>{userProfile.avatarLetter}</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </ThemedText>

        <View style={styles.calendarRow}>
          {days.map((day: string) => {
            const isSelected = day === selectedDay;
            const dayName = day.slice(0, 3);
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, isSelected && styles.dayButtonActive]}
                onPress={() => setSelectedDay(day)}
              >
                <ThemedText style={[styles.dayText, isSelected && styles.dayTextActive]}>{dayName}</ThemedText>
                <ThemedText style={[styles.dateTextDay, isSelected && styles.dateTextActive]}>
                  {days.indexOf(day) + todayDate - days.indexOf(today)}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.classList}>
          {selectedClasses.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.classCard}
              onPress={() => handleClassClick(item)}
            >
              <View style={[styles.classIcon, { backgroundColor: item.isLab ? '#3d2b1f' : '#0050ef' }]}>
                <IconSymbol name="paperplane.fill" size={20} color="#fff" />
              </View>
              <View style={styles.classInfo}>
                <ThemedText style={styles.className}>{item.courseName}</ThemedText>
                <ThemedText style={styles.classMeta}>
                  {item.time.start} - {item.time.end} • {item.location} • {item.faculty}
                  {item.batch ? ` • ${item.batch}` : ''}
                </ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={16} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          ))}

          {selectedClasses.length === 0 && (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>No classes on {selectedDay}!</ThemedText>
            </View>
          )}
        </View>

        <ThemedText style={styles.lastUpdated}>
          Last updated: {new Date(timetableData.fetchedAt).toLocaleString()}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0a30a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  dateText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 24,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    gap: 8,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
  },
  dayButtonActive: {
    backgroundColor: '#f0a30a',
  },
  dayText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
  },
  dayTextActive: {
    color: '#000',
  },
  dateTextDay: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  dateTextActive: {
    color: '#000',
  },
  classList: {
    gap: 12,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
  },
  classIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  classMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  lastUpdated: {
    marginTop: 30,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
});
function useState(today: string): [any, any] {
  throw new Error('Function not implemented.');
}

