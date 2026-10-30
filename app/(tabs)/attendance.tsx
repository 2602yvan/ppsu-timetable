import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAttendanceTracking } from '@/hooks/useAttendanceTracking';
import attendanceData from '@/latest-attendance.json';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AttendanceScreen() {
  const { distance, isBunking, bunkHistory } = useAttendanceTracking();
  const [targetPercentage, setTargetPercentage] = useState(75);

  const overall = attendanceData.attendance.footer;
  const subjects = attendanceData.attendance.subjects;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.title}>Attendance</ThemedText>

        <View style={styles.distanceCard}>
          <IconSymbol name="location" size={24} color={distance && distance <= 2 ? "#4CAF50" : "#F44336"} />
          <ThemedText style={styles.distanceText}>
            {distance ? `${distance.toFixed(2)} km from school` : 'Fetching location...'}
          </ThemedText>
        </View>

        <View style={styles.summaryCard}>
          <ThemedText style={styles.summaryTitle}>Overall</ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{overall.totalPresent}</ThemedText>
              <ThemedText style={styles.statLabel}>Present</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{overall.totalAbsent}</ThemedText>
              <ThemedText style={styles.statLabel}>Absent</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statNumber, { color: isBunking ? "#F44336" : "#4CAF50" }]}>
                {overall.overallAttendancePercentage}%
              </ThemedText>
              <ThemedText style={styles.statLabel}>Attendance</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.targetCard}>
          <ThemedText style={styles.targetTitle}>Target: {targetPercentage}%</ThemedText>
          <View style={styles.targetControls}>
            <TouchableOpacity onPress={() => setTargetPercentage(Math.max(50, targetPercentage - 5))}>
              <ThemedText style={styles.targetButton}>-</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTargetPercentage(Math.min(100, targetPercentage + 5))}>
              <ThemedText style={styles.targetButton}>+</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <ThemedText style={styles.sectionTitle}>Subjects</ThemedText>

        <View style={styles.subjectsList}>
          {subjects.map((subject, index) => {
            const canBunk = calculateCanBunk(subject, targetPercentage);
            return (
              <View key={index} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <ThemedText style={styles.subjectName}>{subject.course}</ThemedText>
                  <ThemedText style={[styles.subjectPercent, { color: subject.attendancePercentage >= targetPercentage ? "#4CAF50" : "#F44336" }]}>
                    {subject.attendancePercentage}%
                  </ThemedText>
                </View>
                <View style={styles.subjectStats}>
                  <ThemedText style={styles.subjectStat}>
                    {subject.present} / {subject.conducted}
                  </ThemedText>
                  <ThemedText style={styles.subjectAdvice}>
                    {canBunk.canBunk
                      ? `Safe to bunk ${canBunk.maxBunks} classes`
                      : `Need ${canBunk.needToAttend} more to reach target`}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>

        {bunkHistory.length > 0 && (
          <View style={styles.historyCard}>
            <ThemedText style={styles.historyTitle}>Recent Activity</ThemedText>
            {bunkHistory.slice(-5).reverse().map((item, index) => (
              <ThemedText key={index} style={styles.historyItem}>{item}</ThemedText>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

function calculateCanBunk(subject: any, target: number) {
  const { present, conducted } = subject;
  const needToAttend = Math.ceil((target * conducted / 100) - present);
  
  if (needToAttend <= 0) {
    const maxBunks = Math.floor((present * 100 / target) - conducted);
    return { canBunk: true, maxBunks: Math.max(0, maxBunks), needToAttend: 0 };
  }
  
  return { canBunk: false, maxBunks: 0, needToAttend: Math.max(0, needToAttend) };
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  distanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  distanceText: {
    fontSize: 16,
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  targetCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  targetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  targetControls: {
    flexDirection: 'row',
    gap: 16,
  },
  targetButton: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f0a30a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  subjectsList: {
    gap: 12,
  },
  subjectCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  subjectPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  subjectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectStat: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  subjectAdvice: {
    fontSize: 14,
    color: '#f0a30a',
    fontWeight: '500',
  },
  historyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  historyItem: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
});
