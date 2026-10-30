import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import lmsData from '@/latest-lms.json';
import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type SubjectType = {
  courseCode: string;
  courseName: string;
  contentCount: string;
  lmsUrl: string;
  introduction: string;
  content: Array<{ title: string; url: string }>;
  assignments: Array<{ title: string; url: string }>;
  tests: Array<{ title: string; url: string }>;
};

export default function LMSScreen() {
  const router = useRouter();

  const handleSubjectClick = (index: number) => {
    router.push({
      pathname: '/lms-subject',
      params: { subjectIndex: String(index) },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>LMS</ThemedText>

        <ThemedView style={styles.subjectsList}>
          {lmsData.lms.subjects.map((subject: SubjectType, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.subjectCard}
              onPress={() => handleSubjectClick(index)}
            >
              <IconSymbol name="book.fill" size={24} color="#f0a30a" />
              <ThemedView style={styles.subjectInfo}>
                <ThemedText style={styles.subjectName}>{subject.courseName}</ThemedText>
                <ThemedText style={styles.subjectMeta}>
                  {subject.courseCode} • {subject.contentCount}
                </ThemedText>
              </ThemedView>
              <IconSymbol name="chevron.right" size={20} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedText style={styles.lastUpdated}>
          Last updated: {new Date(lmsData.fetchedAt).toLocaleString()}
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  subjectsList: {
    gap: 12,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  subjectMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  lastUpdated: {
    marginTop: 30,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
});
