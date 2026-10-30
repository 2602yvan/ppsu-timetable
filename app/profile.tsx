import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { userProfile } from '@/data/userProfile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={[styles.backButtonText, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>←</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>{userProfile.avatarLetter}</ThemedText>
          </View>
          <ThemedText style={[styles.name, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>{userProfile.name}</ThemedText>
          <ThemedText style={styles.enrollment}>{userProfile.enrollmentNumber}</ThemedText>
        </View>

        <View style={styles.settingCard}>
          <ThemedText style={[styles.settingLabel, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>Theme</ThemedText>
          <ThemedText style={[styles.settingValue, { color: colorScheme === 'light' ? '#666' : '#aaa' }]}>
            {colorScheme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </ThemedText>
          <Switch
            value={colorScheme === 'dark'}
            trackColor={{ false: '#767577', true: '#f0a30a' }}
            thumbColor={colorScheme === 'light' ? '#f4f3f4' : '#f0a30a'}
            style={styles.switch}
          />
        </View>

        <View style={styles.infoCard}>
          <ThemedText style={[styles.cardTitle, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>University</ThemedText>
          <ThemedText style={styles.cardValue}>{userProfile.university}</ThemedText>
        </View>

        <View style={styles.infoCard}>
          <ThemedText style={[styles.cardTitle, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>Course</ThemedText>
          <ThemedText style={styles.cardValue}>{userProfile.course}</ThemedText>
        </View>

        <View style={styles.infoCard}>
          <ThemedText style={[styles.cardTitle, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>Semester</ThemedText>
          <ThemedText style={styles.cardValue}>{userProfile.semester}</ThemedText>
        </View>

        <View style={styles.infoCard}>
          <ThemedText style={[styles.cardTitle, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>About</ThemedText>
          <ThemedText style={styles.cardValue}>{userProfile.bio}</ThemedText>
        </View>

        <View style={styles.infoCard}>
          <ThemedText style={[styles.cardTitle, { color: colorScheme === 'light' ? '#000' : '#fff' }]}>Hobbies</ThemedText>
          <View style={styles.hobbiesContainer}>
            {userProfile.hobbies.map((hobby, index) => (
              <View key={index} style={styles.hobbyTag}>
                <ThemedText style={styles.hobbyText}>{hobby}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

import { View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0a30a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  enrollment: {
    fontSize: 16,
    color: '#f0a30a',
    fontWeight: '600',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 16,
  },
  switch: {},
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hobbyTag: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  hobbyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
