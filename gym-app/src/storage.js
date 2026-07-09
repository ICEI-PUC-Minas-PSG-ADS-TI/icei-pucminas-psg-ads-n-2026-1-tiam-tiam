export const DEFAULT_WORKOUTS = [
  { id: '1', name: 'Treino A - Superior', exercises: 8, time: 45, category: 'Força', icon: '💪',
    exerciseList: [
      { id: 1, name: 'Supino Reto', sets: 4, reps: 10, icon: '🏋️' },
      { id: 2, name: 'Supino Inclinado', sets: 3, reps: 12, icon: '🏋️' },
      { id: 3, name: 'Crucifixo', sets: 3, reps: 15, icon: '💪' },
      { id: 4, name: 'Desenvolvimento', sets: 4, reps: 10, icon: '🔝' },
      { id: 5, name: 'Elevação Lateral', sets: 3, reps: 15, icon: '💪' },
      { id: 6, name: 'Tríceps Pulley', sets: 3, reps: 12, icon: '💪' },
      { id: 7, name: 'Tríceps Testa', sets: 3, reps: 12, icon: '💪' },
      { id: 8, name: 'Abdominal', sets: 3, reps: 20, icon: '🔥' },
    ]},
  { id: '2', name: 'Treino B - Inferior', exercises: 7, time: 40, category: 'Força', icon: '🦵',
    exerciseList: [
      { id: 1, name: 'Agachamento', sets: 4, reps: 10, icon: '🦵' },
      { id: 2, name: 'Leg Press', sets: 4, reps: 12, icon: '🦵' },
      { id: 3, name: 'Cadeira Extensora', sets: 3, reps: 15, icon: '🦵' },
      { id: 4, name: 'Mesa Flexora', sets: 3, reps: 12, icon: '🦵' },
      { id: 5, name: 'Panturrilha em Pé', sets: 4, reps: 20, icon: '🦵' },
      { id: 6, name: 'Stiff', sets: 3, reps: 12, icon: '🦵' },
      { id: 7, name: 'Abdominal', sets: 3, reps: 20, icon: '🔥' },
    ]},
  { id: '3', name: 'Treino C - Push', exercises: 6, time: 50, category: 'Hipertrofia', icon: '🏋️',
    exerciseList: [
      { id: 1, name: 'Supino Reto', sets: 4, reps: 8, icon: '🏋️' },
      { id: 2, name: 'Desenvolvimento', sets: 4, reps: 10, icon: '🔝' },
      { id: 3, name: 'Elevação Lateral', sets: 4, reps: 15, icon: '💪' },
      { id: 4, name: 'Tríceps Pulley', sets: 3, reps: 12, icon: '💪' },
      { id: 5, name: 'Tríceps Francês', sets: 3, reps: 12, icon: '💪' },
      { id: 6, name: 'Supino Fechado', sets: 3, reps: 10, icon: '💪' },
    ]},
  { id: '4', name: 'Treino D - Pull', exercises: 7, time: 45, category: 'Hipertrofia', icon: '🔝',
    exerciseList: [
      { id: 1, name: 'Barra Fixa', sets: 4, reps: 8, icon: '🔝' },
      { id: 2, name: 'Remada Curvada', sets: 4, reps: 10, icon: '🔝' },
      { id: 3, name: 'Puxada Frontal', sets: 3, reps: 12, icon: '🔝' },
      { id: 4, name: 'Remada Unilateral', sets: 3, reps: 12, icon: '🔝' },
      { id: 5, name: 'Rosca Direta', sets: 4, reps: 10, icon: '💪' },
      { id: 6, name: 'Rosca Martelo', sets: 3, reps: 12, icon: '💪' },
      { id: 7, name: 'Rosca Concentrada', sets: 3, reps: 15, icon: '💪' },
    ]},
  { id: '5', name: 'Cardio HIIT', exercises: 5, time: 30, category: 'Cardio', icon: '⚡',
    exerciseList: [
      { id: 1, name: 'Burpee', sets: 4, reps: 10, icon: '⚡' },
      { id: 2, name: 'Jumping Jack', sets: 3, reps: 30, icon: '⚡' },
      { id: 3, name: 'Mountain Climber', sets: 4, reps: 20, icon: '⚡' },
      { id: 4, name: 'Prancha', sets: 3, reps: 1, icon: '🔥' },
      { id: 5, name: 'Corrida Estacionária', sets: 4, reps: 30, icon: '⚡' },
    ]},
];

export const DEFAULT_SETTINGS = { notifications: true };

export const DEFAULT_MISSIONS = {
  date: '',
  workoutDone: false,
  waterProgress: 0,
  stepsProgress: 0,
};

export function calcStats(history) {
  const total = history.length;

  const today = new Date();
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    weekDays.push(d.toISOString().split('T')[0]);
  }
  const weekProgress = weekDays.map((day) =>
    history.some((h) => h.date === day) ? 100 : 0
  );

  let streak = 0;
  const check = new Date(today);
  while (true) {
    const dateStr = check.toISOString().split('T')[0];
    if (history.some((h) => h.date === dateStr)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  const weeklyDone = weekProgress.filter((p) => p > 0).length;

  return { total, streak, weekProgress, weekDays, weeklyDone };
}

export function calcXP(history, missions) {
  let xp = history.length * 50;
  if (missions.workoutDone) xp += 50;
  if (missions.waterProgress >= 100) xp += 20;
  if (missions.stepsProgress >= 100) xp += 30;
  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;
  return { xp, level, xpInLevel, xpForNext: 200 };
}
