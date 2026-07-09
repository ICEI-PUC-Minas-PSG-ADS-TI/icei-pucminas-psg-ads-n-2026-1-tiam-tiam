import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';

const ACHIEVEMENTS = [
  { id: 1, icon: '🔥', name: 'Começando', minWorkouts: 1 },
  { id: 2, icon: '💪', name: 'Dedicado', minWorkouts: 5 },
  { id: 3, icon: '🏆', name: 'Campeão', minWorkouts: 10 },
  { id: 4, icon: '⭐', name: 'Estrela', minStreak: 3 },
  { id: 5, icon: '👑', name: 'Rei do Treino', minStreak: 7 },
  { id: 6, icon: '🎯', name: 'Consistente', minWorkouts: 20 },
];

const weekDayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export default function StatsScreen() {
  const { history, stats } = useApp();

  const unlockedIds = new Set(
    ACHIEVEMENTS
      .filter((a) => {
        if (a.minWorkouts && stats.total < a.minWorkouts) return false;
        if (a.minStreak && stats.streak < a.minStreak) return false;
        return true;
      })
      .map((a) => a.id)
  );

  const monthLabels = stats.weekDays.map((d) => {
    const day = new Date(d + 'T12:00:00');
    return weekDayLabels[day.getDay()];
  });

  const maxBar = Math.max(...stats.weekProgress, 1);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Estatísticas</Text>
        <Text style={styles.subtitle}>Acompanhe seu progresso</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Sequência atual</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{stats.weeklyDone}/7</Text>
            <Text style={styles.statLabel}>Dias esta semana</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏋️</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total de treinos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{history.reduce((s, h) => s + (h.kcal ?? 0), 0)}</Text>
            <Text style={styles.statLabel}>Kcal totais</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividade semanal</Text>
            <Text style={styles.sectionIcon}>📈</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.chart}>
              {stats.weekProgress.map((p, i) => (
                <View key={i} style={styles.barCol}>
                  <View style={[styles.bar, { height: `${Math.max(4, (p / maxBar) * 100)}%`, backgroundColor: p > 0 ? colors.primary : colors.card }]} />
                  <Text style={styles.barLabel}>{monthLabels[i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.achievementHeader}>
            <Text style={styles.sectionTitle}>🏅 Conquistas</Text>
          </View>
          <View style={styles.achievementGrid}>
            {ACHIEVEMENTS.map((a) => (
              <View key={a.id} style={[styles.achievementBox, !unlockedIds.has(a.id) && styles.achievementLocked]}>
                <Text style={[styles.achievementIcon, !unlockedIds.has(a.id) && { opacity: 0.3 }]}>{a.icon}</Text>
                {!unlockedIds.has(a.id) && <Text style={styles.lockIcon}>🔒</Text>}
              </View>
            ))}
          </View>
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
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statIcon: { fontSize: 28, marginBottom: spacing.sm },
  statValue: { color: colors.text, fontSize: font.xxl, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: font.sm, marginTop: 4, textAlign: 'center' },
  section: { marginBottom: spacing.lg, marginTop: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  sectionIcon: { fontSize: 18 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  chart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120 },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: '60%', borderRadius: 4, marginBottom: spacing.xs },
  barLabel: { color: colors.textMuted, fontSize: font.sm - 1 },
  achievementHeader: { marginBottom: spacing.md },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  achievementBox: { width: '31%', aspectRatio: 1, backgroundColor: colors.warningLight, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  achievementLocked: { backgroundColor: colors.card },
  achievementIcon: { fontSize: 32 },
  lockIcon: { fontSize: 14, position: 'absolute', bottom: 6, right: 6 },
});
