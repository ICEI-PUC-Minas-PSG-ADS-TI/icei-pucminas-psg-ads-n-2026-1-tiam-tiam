import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';

const weekDayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export default function DashboardScreen({ navigation }) {
  const { user, workouts, stats, missions, updateMissions } = useApp();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Atleta';
  const nextWorkout = workouts[0] ?? null;

  const weekLabels = stats.weekDays.map((d) => {
    const day = new Date(d + 'T12:00:00');
    return weekDayLabels[day.getDay()];
  });

  async function handleStartWorkout() {
    if (!nextWorkout) return;
    navigation.navigate('Workout', { screen: 'WorkoutDetail', params: { workout: nextWorkout } });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {firstName}! 👋</Text>
            <Text style={styles.subtitle}>Vamos treinar hoje?</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <LinearGradient
            colors={['#1A3A8F', '#5B8BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Dias seguidos</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#4B0D8C', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Treinos completos</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximo treino</Text>
            <Text style={styles.sectionIcon}>⏰</Text>
          </View>
          <View style={styles.card}>
            {nextWorkout ? (
              <>
                <Text style={styles.workoutName}>{nextWorkout.name}</Text>
                <Text style={styles.workoutDetails}>{nextWorkout.exercises} exercícios • {nextWorkout.time} min</Text>
                <TouchableOpacity style={styles.btnPrimary} onPress={handleStartWorkout}>
                  <Text style={styles.btnPrimaryText}>▶  Iniciar treino</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.workoutDetails}>Nenhum treino cadastrado.</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progresso semanal</Text>
            <Text style={styles.sectionIcon}>📈</Text>
          </View>
          <View style={styles.card}>
            {weekLabels.map((day, i) => (
              <View key={i} style={styles.progressRow}>
                <Text style={styles.progressLabel}>{day}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${stats.weekProgress[i]}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Missões de hoje</Text>
            <Text style={styles.sectionIcon}>⚡</Text>
          </View>
          <View style={styles.card}>
            <MissionRow
              label="Completar um treino"
              done={missions?.workoutDone}
              onToggle={async () => {
                if (!missions?.workoutDone) {
                  await updateMissions({ ...missions, workoutDone: true });
                }
              }}
            />
            <MissionRow
              label={`Beber água (${missions?.waterProgress ?? 0}%)`}
              done={missions?.waterProgress >= 100}
              onToggle={async () => {
                const current = missions?.waterProgress ?? 0;
                if (current < 100) {
                  await updateMissions({ ...missions, waterProgress: Math.min(100, current + 25) });
                }
              }}
            />
            <MissionRow
              label={`Passos (${missions?.stepsProgress ?? 0}%)`}
              done={missions?.stepsProgress >= 100}
              onToggle={async () => {
                const current = missions?.stepsProgress ?? 0;
                if (current < 100) {
                  await updateMissions({ ...missions, stepsProgress: Math.min(100, current + 20) });
                }
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MissionRow({ label, done, onToggle }) {
  return (
    <TouchableOpacity style={mStyles.row} onPress={onToggle} activeOpacity={0.7}>
      <View style={[mStyles.check, done && mStyles.checkDone]}>
        {done && <Text style={mStyles.checkIcon}>✓</Text>}
      </View>
      <Text style={[mStyles.label, done && mStyles.labelDone]}>{label}</Text>
    </TouchableOpacity>
  );
}

const mStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2 },
  check: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.border, marginRight: spacing.md, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: colors.success, borderColor: colors.success },
  checkIcon: { color: '#fff', fontSize: 13, fontWeight: '800' },
  label: { color: colors.text, fontSize: font.md, flex: 1 },
  labelDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg, marginTop: spacing.sm },
  greeting: { color: colors.text, fontSize: font.xl, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: font.md, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'flex-start' },
  statIcon: { fontSize: 28, marginBottom: spacing.sm },
  statValue: { color: '#fff', fontSize: font.xxl, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: font.sm, marginTop: 4 },
  section: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  sectionIcon: { fontSize: 18 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  workoutName: { color: colors.text, fontSize: font.md, fontWeight: '700', marginBottom: 4 },
  workoutDetails: { color: colors.textSecondary, fontSize: font.sm, marginBottom: spacing.lg },
  btnPrimary: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontSize: font.md, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  progressLabel: { width: 32, color: colors.textSecondary, fontSize: font.sm, fontWeight: '600' },
  progressBar: { flex: 1, height: 6, backgroundColor: colors.card, borderRadius: 3, marginLeft: spacing.md },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
});
