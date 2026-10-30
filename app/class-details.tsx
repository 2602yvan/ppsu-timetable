import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ClassDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    courseName,
    courseCode,
    timeStart,
    timeEnd,
    location,
    faculty,
    batch,
    isLab,
  } = params;

  const isLabBool = isLab === 'true';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={[styles.infoCard, { backgroundColor: isLabBool ? '#3d2b1f' : '#1a1a1a' }]}>
          <IconSymbol name="paperplane.fill" size={48} color={isLabBool ? '#f0a30a' : '#0050ef'} />
          <ThemedText style={styles.className}>{String(courseName)}</ThemedText>
          <ThemedText style={styles.classCode}>{String(courseCode)}</ThemedText>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailCard}>
              <ThemedText style={styles.detailLabel}>Time</ThemedText>
              <ThemedText style={styles.detailValue}>{String(timeStart)} - {String(timeEnd)}</ThemedText>
            </View>
            <View style={styles.detailCard}>
              <ThemedText style={styles.detailLabel}>Type</ThemedText>
              <ThemedText style={styles.detailValue}>{isLabBool ? 'Lab' : 'Theory'}</ThemedText>
            </View>
          </View>

          <View style={styles.detailCard}>
            <ThemedText style={styles.detailLabel}>Location</ThemedText>
            <ThemedText style={styles.detailValue}>{String(location)}</ThemedText>
          </View>

          <View style={styles.detailCard}>
            <ThemedText style={styles.detailLabel}>Faculty</ThemedText>
            <ThemedText style={styles.detailValue}>{String(faculty)}</ThemedText>
          </View>

          {batch && (
            <View style={styles.detailCard}>
              <ThemedText style={styles.detailLabel}>Batch</ThemedText>
              <ThemedText style={styles.detailValue}>{String(batch)}</ThemedText>
            </View>
          )}
        </View>
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
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  infoCard: {
    padding: 24,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 24,
  },
  className: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  classCode: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
});
