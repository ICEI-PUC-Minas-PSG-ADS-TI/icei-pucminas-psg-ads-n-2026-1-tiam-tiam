import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { colors, font, spacing, radius } from '../theme';
import { useApp } from '../context/AppContext';

export default function WorkoutDetailScreen({ route, navigation }) {
  const { saveHistory, updateMissions, missions } = useApp();
  const workout = route?.params?.workout;

  const exercises = workout?.exerciseList?.length
    ? workout.exerciseList
    : [
        { id: 1, name: 'Supino', sets: 3, reps: 10, icon: '🏋️' },
        { id: 2, name: 'Rosca Direta', sets: 3, reps: 12, icon: '💪' },
        { id: 3, name: 'Remada Alta', sets: 4, reps: 10, icon: '🔝' },
      ];

  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [finished, setFinished] = useState(false);

  // Elapsed workout timer
  const [elapsed, setElapsed] = useState(0);

  // Rest timer between sets
  const [restTime, setRestTime] = useState(0);
  const restRef = useRef(null);

  // Per-exercise countdown timer (max 60s)
  const EXERCISE_MAX_TIME = 60;
  const [exerciseTime, setExerciseTime] = useState(EXERCISE_MAX_TIME);
  const exerciseTimerRef = useRef(null);

  const exercise = exercises[currentExercise];
  const isLastExercise = currentExercise === exercises.length - 1;
  const isFirstExercise = currentExercise === 0;
  const isSetsDone = completedSets >= exercise.sets;

  // Elapsed timer: starts on mount, stops when finished
  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [finished]);

  // Exercise countdown timer: resets and starts on each exercise change
  useEffect(() => {
    if (finished) return;
    if (exerciseTimerRef.current) clearInterval(exerciseTimerRef.current);
    setExerciseTime(EXERCISE_MAX_TIME);
    exerciseTimerRef.current = setInterval(() => {
      setExerciseTime(t => {
        if (t <= 1) {
          clearInterval(exerciseTimerRef.current);
          exerciseTimerRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (exerciseTimerRef.current) clearInterval(exerciseTimerRef.current); };
  }, [currentExercise, finished]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (restRef.current) clearInterval(restRef.current);
      if (exerciseTimerRef.current) clearInterval(exerciseTimerRef.current);
    };
  }, []);

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function startRest(seconds = 60) {
    if (restRef.current) clearInterval(restRef.current);
    setRestTime(seconds);
    restRef.current = setInterval(() => {
      setRestTime(t => {
        if (t <= 1) {
          clearInterval(restRef.current);
          restRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function skipRest() {
    if (restRef.current) { clearInterval(restRef.current); restRef.current = null; }
    setRestTime(0);
  }

  function handleMarkSet() {
    const next = completedSets + 1;
    setCompletedSets(next);
    if (next < exercise.sets) {
      startRest(60);
    } else {
      skipRest();
    }
  }

  async function handleFinish() {
    const today = new Date().toISOString().split('T')[0];
    const totalSets = exercises.reduce((sum, e) => sum + e.sets, 0);
    const entry = {
      id: Date.now().toString(),
      date: today,
      note: workout?.name ?? 'Treino',
      sets: totalSets,
      kcal: Math.round(totalSets * 12 + (workout?.time ?? 30) * 5),
      icon: workout?.icon ?? '🏋️',
      duration: elapsed,
    };
    await saveHistory(entry);
    if (missions && !missions.workoutDone) {
      await updateMissions({ ...missions, workoutDone: true });
    }
    setFinished(true);
  }

  function handleNextExercise() {
    skipRest();
    if (isLastExercise) {
      handleFinish();
    } else {
      setCurrentExercise(currentExercise + 1);
      setCompletedSets(0);
    }
  }

  function handlePrevExercise() {
    if (isFirstExercise) return;
    skipRest();
    setCurrentExercise(currentExercise - 1);
    setCompletedSets(0);
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.finishContainer}>
          <Text style={styles.finishIcon}>🏆</Text>
          <Text style={styles.finishTitle}>Treino Concluído!</Text>
          <View style={styles.finishStats}>
            <View style={styles.finishStatBox}>
              <Text style={styles.finishStatValue}>{formatTime(elapsed)}</Text>
              <Text style={styles.finishStatLabel}>Duração</Text>
            </View>
            <View style={styles.finishStatDivider} />
            <View style={styles.finishStatBox}>
              <Text style={styles.finishStatValue}>{exercises.reduce((s, e) => s + e.sets, 0)}</Text>
              <Text style={styles.finishStatLabel}>Séries</Text>
            </View>
          </View>
          <Text style={styles.finishSub}>Parabéns! Seu progresso foi salvo.</Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => {
              setCurrentExercise(0);
              setCompletedSets(0);
              setElapsed(0);
              setFinished(false);
              navigation.goBack();
            }}
          >
            <Text style={styles.btnPrimaryText}>Voltar aos treinos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header: workout name + elapsed timer */}
        <View style={styles.header}>
          <Text style={styles.workoutTitle}>{workout?.name ?? 'Treino'}</Text>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>⏱ {formatTime(elapsed)}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Exercício {currentExercise + 1} de {exercises.length}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentExercise + 1) / exercises.length) * 100}%` }]} />
          </View>
        </View>

        <View style={styles.exerciseCard}>
          <View style={styles.exerciseIcon}>
            <Text style={styles.icon}>{exercise.icon}</Text>
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>

          {/* Per-exercise countdown timer */}
          <View style={styles.exerciseTimerContainer}>
            <Text style={[styles.exerciseTimerText, exerciseTime === 0 && styles.exerciseTimerDone]}>
              {exerciseTime === 0 ? '⏰ Tempo esgotado!' : `⏱ ${exerciseTime}s`}
            </Text>
            <View style={styles.exerciseTimerBar}>
              <View style={[
                styles.exerciseTimerFill,
                { width: `${(exerciseTime / EXERCISE_MAX_TIME) * 100}%` },
                exerciseTime <= 10 && styles.exerciseTimerFillUrgent,
              ]} />
            </View>
          </View>

          <View style={styles.repsContainer}>
            <View style={styles.repsBox}>
              <Text style={styles.repsLabel}>Séries</Text>
              <Text style={styles.repsValue}>{exercise.sets}</Text>
            </View>
            <View style={styles.repsBox}>
              <Text style={styles.repsLabel}>Reps</Text>
              <Text style={styles.repsValue}>{exercise.reps}</Text>
            </View>
          </View>
        </View>

        {/* Rest timer card */}
        {restTime > 0 && (
          <View style={styles.restContainer}>
            <Text style={styles.restLabel}>Tempo de Descanso</Text>
            <Text style={styles.restCountdown}>{formatTime(restTime)}</Text>
            <View style={styles.restProgressBar}>
              <View style={[styles.restProgressFill, { width: `${(restTime / 60) * 100}%` }]} />
            </View>
            <TouchableOpacity style={styles.skipBtn} onPress={skipRest} activeOpacity={0.7}>
              <Text style={styles.skipText}>Pular descanso →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.setProgressContainer}>
          <Text style={styles.setProgressLabel}>Séries completadas</Text>
          <View style={styles.setDotsContainer}>
            {Array.from({ length: exercise.sets }).map((_, i) => (
              <View key={i} style={[styles.setDot, i < completedSets && styles.setDotCompleted]} />
            ))}
          </View>
        </View>

        {!isSetsDone ? (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleMarkSet} activeOpacity={0.7}>
            <Text style={styles.btnPrimaryText}>✓ Marcar Set</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.btnSuccess}>
            <Text style={styles.btnSuccessText}>✓ {completedSets} / {exercise.sets} Completo</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btnSecondary} onPress={handleNextExercise} activeOpacity={0.7}>
          <Text style={styles.btnSecondaryText}>
            {isLastExercise ? '🏆 Concluir Treino' : '➜ Próximo Exercício'}
          </Text>
        </TouchableOpacity>

        {!isFirstExercise && (
          <TouchableOpacity style={styles.btnBack} onPress={handlePrevExercise} activeOpacity={0.7}>
            <Text style={styles.btnBackText}>← Exercício Anterior</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  workoutTitle: { color: colors.text, fontSize: font.lg, fontWeight: '800', flex: 1, marginRight: spacing.sm },
  timerBadge: { backgroundColor: colors.primaryLight, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  timerText: { color: colors.primary, fontSize: font.sm, fontWeight: '700' },
  progressContainer: { marginBottom: spacing.lg },
  progressText: { color: colors.textSecondary, fontSize: font.sm, marginBottom: spacing.sm },
  progressBar: { height: 6, backgroundColor: colors.card, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  exerciseCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  exerciseIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  icon: { fontSize: 40 },
  exerciseName: { color: colors.text, fontSize: font.lg, fontWeight: '700', textAlign: 'center', marginBottom: spacing.lg },
  repsContainer: { flexDirection: 'row', gap: spacing.md },
  repsBox: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  repsLabel: { color: colors.textSecondary, fontSize: font.sm },
  repsValue: { color: colors.text, fontSize: font.xl, fontWeight: '700', marginTop: 4 },
  restContainer: { backgroundColor: colors.warningLight, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.warning },
  restLabel: { color: colors.warning, fontSize: font.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xs },
  restCountdown: { color: colors.text, fontSize: font.xxxl, fontWeight: '800', marginBottom: spacing.sm },
  restProgressBar: { width: '100%', height: 6, backgroundColor: colors.card, borderRadius: 3, overflow: 'hidden', marginBottom: spacing.md },
  restProgressFill: { height: '100%', backgroundColor: colors.warning, borderRadius: 3 },
  skipBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full, backgroundColor: colors.warning },
  skipText: { color: '#fff', fontSize: font.sm, fontWeight: '700' },
  setProgressContainer: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  setProgressLabel: { color: colors.textSecondary, fontSize: font.sm, marginBottom: spacing.md },
  setDotsContainer: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  setDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.border },
  setDotCompleted: { backgroundColor: colors.success, borderColor: colors.success },
  btnPrimary: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', marginBottom: spacing.md },
  btnPrimaryText: { color: '#fff', fontSize: font.md, fontWeight: '700' },
  btnSuccess: { backgroundColor: colors.success, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', marginBottom: spacing.md },
  btnSuccessText: { color: '#fff', fontSize: font.md, fontWeight: '700' },
  btnSecondary: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  btnSecondaryText: { color: colors.text, fontSize: font.md, fontWeight: '700' },
  btnBack: { backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  btnBackText: { color: colors.textSecondary, fontSize: font.sm, fontWeight: '600' },
  exerciseTimerContainer: { width: '100%', alignItems: 'center', marginBottom: spacing.lg },
  exerciseTimerText: { color: colors.primary, fontSize: font.md, fontWeight: '700', marginBottom: spacing.sm },
  exerciseTimerDone: { color: colors.error },
  exerciseTimerBar: { width: '100%', height: 6, backgroundColor: colors.card, borderRadius: 3, overflow: 'hidden' },
  exerciseTimerFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  exerciseTimerFillUrgent: { backgroundColor: colors.error },
  finishContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  finishIcon: { fontSize: 72, marginBottom: spacing.lg },
  finishTitle: { color: colors.text, fontSize: font.xxl, fontWeight: '800', marginBottom: spacing.lg },
  finishStats: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border, width: '100%' },
  finishStatBox: { flex: 1, alignItems: 'center' },
  finishStatValue: { color: colors.primary, fontSize: font.xl, fontWeight: '800' },
  finishStatLabel: { color: colors.textSecondary, fontSize: font.sm, marginTop: 2 },
  finishStatDivider: { width: 1, height: 40, backgroundColor: colors.border, marginHorizontal: spacing.md },
  finishSub: { color: colors.textSecondary, fontSize: font.md, marginBottom: spacing.xl, textAlign: 'center' },
});
