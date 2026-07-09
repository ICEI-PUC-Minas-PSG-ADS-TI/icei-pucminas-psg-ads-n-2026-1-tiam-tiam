import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';

export default function MissionsScreen() {
  const { missions, updateMissions, xp } = useApp();

  if (!missions) return null;

  const missionList = [
    {
      id: 'workout',
      title: 'Complete um treino',
      xp: 50,
      progress: missions.workoutDone ? 100 : 0,
      completed: missions.workoutDone,
      onAdd: null,
    },
    {
      id: 'water',
      title: 'Beba 2L de água',
      xp: 20,
      progress: missions.waterProgress,
      completed: missions.waterProgress >= 100,
      onAdd: async () => {
        if (missions.waterProgress < 100) {
          await updateMissions({ ...missions, waterProgress: Math.min(100, missions.waterProgress + 25) });
        }
      },
    },
    {
      id: 'steps',
      title: 'Faça 10.000 passos',
      xp: 30,
      progress: missions.stepsProgress,
      completed: missions.stepsProgress >= 100,
      onAdd: async () => {
        if (missions.stepsProgress < 100) {
          await updateMissions({ ...missions, stepsProgress: Math.min(100, missions.stepsProgress + 20) });
        }
      },
    },
  ];

  const completedCount = missionList.filter((m) => m.completed).length;
  const dailyXP = missionList.filter((m) => m.completed).reduce((s, m) => s + m.xp, 0);
  const xpPercent = Math.min(100, (xp.xpInLevel / xp.xpForNext) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Gamificação</Text>
        <Text style={styles.subtitle}>Complete missões e ganhe recompensas</Text>

        <LinearGradient
          colors={['#3D1A7A', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.levelCard}
        >
          <View style={styles.levelContent}>
            <View>
              <Text style={styles.levelLabel}>Nível Atual</Text>
              <Text style={styles.levelValue}>{xp.level}</Text>
            </View>
            <Text style={styles.levelStar}>⭐</Text>
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpText}>{xp.xpInLevel} / {xp.xpForNext} XP</Text>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
            </View>
          </View>
          {dailyXP > 0 && (
            <View style={styles.dailyBonus}>
              <Text style={styles.dailyIcon}>⚡</Text>
              <Text style={styles.dailyText}>+{dailyXP} XP hoje</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.missionsSection}>
          <View style={styles.missionHeader}>
            <Text style={styles.missionTitle}>Missões Diárias</Text>
            <Text style={styles.missionCount}>{completedCount}/{missionList.length}</Text>
          </View>
          {missionList.map((mission) => (
            <View key={mission.id} style={[styles.missionCard, mission.completed && styles.missionCardCompleted]}>
              <View style={styles.missionInfo}>
                <Text style={styles.missionName}>{mission.title}</Text>
                <Text style={styles.missionXp}>⚡ +{mission.xp} XP</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${mission.progress}%` }]} />
                </View>
                <Text style={styles.progressPct}>{mission.progress}%</Text>
              </View>
              {mission.completed ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : mission.onAdd ? (
                <TouchableOpacity style={styles.addBtn} onPress={mission.onAdd}>
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: colors.textSecondary, fontSize: font.md, marginBottom: spacing.lg },
  levelCard: { borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  levelContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  levelLabel: { color: 'rgba(255,255,255,0.7)', fontSize: font.sm, marginBottom: 2 },
  levelValue: { color: '#fff', fontSize: font.xxxl, fontWeight: '800' },
  levelStar: { fontSize: 40 },
  xpInfo: { marginBottom: spacing.md },
  xpText: { color: 'rgba(255,255,255,0.9)', fontSize: font.sm, marginBottom: 6 },
  xpBar: { height: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#fff' },
  dailyBonus: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,80,255,0.25)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  dailyIcon: { fontSize: 16, marginRight: spacing.sm },
  dailyText: { color: '#fff', fontSize: font.sm, fontWeight: '600' },
  missionsSection: { marginBottom: spacing.lg },
  missionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  missionTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  missionCount: { color: colors.textSecondary, fontSize: font.sm },
  missionCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  missionCardCompleted: { backgroundColor: colors.successLight, borderColor: colors.success + '60' },
  missionInfo: { flex: 1 },
  missionName: { color: colors.text, fontSize: font.md, fontWeight: '600' },
  missionXp: { color: colors.warning, fontSize: font.sm, marginTop: 2, marginBottom: 4 },
  progressBar: { height: 6, backgroundColor: colors.card, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.success },
  progressPct: { color: colors.textMuted, fontSize: font.sm, marginTop: 2 },
  checkmark: { color: colors.success, fontSize: font.xl, fontWeight: '700', marginLeft: spacing.sm },
  addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm },
  addBtnText: { color: '#fff', fontSize: font.lg, fontWeight: '800', lineHeight: 32 },
});
