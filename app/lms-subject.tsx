import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import lmsData from '@/latest-lms.json';

type ListItemType = { title: string; url: string };
type SubjectType = {
  courseCode: string;
  courseName: string;
  contentCount: string;
  lmsUrl: string;
  introduction: string;
  content: ListItemType[];
  assignments: ListItemType[];
  tests: ListItemType[];
};

export default function SubjectDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { subjectIndex } = params;

  const subject: SubjectType = lmsData.lms.subjects[Number(subjectIndex)];
  const [activeTab, setActiveTab] = useState('content');

  const tabs = [
    { id: 'introduction', label: 'Introduction', icon: 'book' as const },
    { id: 'content', label: 'Content', icon: 'folder' as const },
    { id: 'assignments', label: 'Assignments', icon: 'list.bullet' as const },
    { id: 'tests', label: 'Tests', icon: 'square.and.pencil' as const },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'introduction':
        return (
          <ThemedText style={styles.introText}>
            {subject.introduction}
          </ThemedText>
        );

      case 'content':
        return subject.content.length > 0 ? (
          <ThemedView style={styles.listContainer}>
            {subject.content.map((item: ListItemType, idx: number) => (
              <TouchableOpacity
                key={idx}
                style={styles.listItem}
                onPress={() => item.url && Linking.openURL(item.url)}
              >
                <ThemedText style={styles.listItemText}>{item.title}</ThemedText>
                {item.url && <IconSymbol name="arrow.up.right" size={16} color="#f0a30a" />}
              </TouchableOpacity>
            ))}
          </ThemedView>
        ) : (
          <ThemedText style={styles.emptyText}>No content available yet</ThemedText>
        );

      case 'assignments':
        return subject.assignments.length > 0 ? (
          <ThemedView style={styles.listContainer}>
            {subject.assignments.map((item: ListItemType, idx: number) => (
              <TouchableOpacity
                key={idx}
                style={styles.listItem}
                onPress={() => item.url && Linking.openURL(item.url)}
              >
                <ThemedText style={styles.listItemText}>{item.title}</ThemedText>
                {item.url && <IconSymbol name="arrow.up.right" size={16} color="#f0a30a" />}
              </TouchableOpacity>
            ))}
          </ThemedView>
        ) : (
          <ThemedText style={styles.emptyText}>No assignments available yet</ThemedText>
        );

      case 'tests':
        return subject.tests.length > 0 ? (
          <ThemedView style={styles.listContainer}>
            {subject.tests.map((item: ListItemType, idx: number) => (
              <TouchableOpacity
                key={idx}
                style={styles.listItem}
                onPress={() => item.url && Linking.openURL(item.url)}
              >
                <ThemedText style={styles.listItemText}>{item.title}</ThemedText>
                {item.url && <IconSymbol name="arrow.up.right" size={16} color="#f0a30a" />}
              </TouchableOpacity>
            ))}
          </ThemedView>
        ) : (
          <ThemedText style={styles.emptyText}>No tests available yet</ThemedText>
        );

      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={20} color="#fff" />
        </TouchableOpacity>

        <ThemedText style={styles.title}>{subject.courseName}</ThemedText>
        <ThemedText style={styles.subtitle}>{subject.courseCode}</ThemedText>

        <ThemedView style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <IconSymbol
                name={tab.icon}
                size={16}
                color={activeTab === tab.id ? '#000' : 'rgba(255,255,255,0.3)'}
              />
              <ThemedText style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.contentContainer}>
          {renderContent()}
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0a30a',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
  },
  activeTab: {
    backgroundColor: '#f0a30a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  activeTabText: {
    color: '#000',
  },
  contentContainer: {
    minHeight: 300,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 40,
  },
  lastUpdated: {
    marginTop: 30,
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
});
