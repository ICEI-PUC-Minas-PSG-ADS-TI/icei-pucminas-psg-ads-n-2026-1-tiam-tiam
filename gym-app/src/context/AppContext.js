import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { loginUser, registerUser, logoutUser } from '../auth';
import {
  getUserProfile, saveUserProfile,
  getWorkouts, saveWorkout, deleteWorkout as deleteWorkoutFromDB,
  getHistory, addHistoryEntry, clearHistory,
  getSettings, saveSettings,
  getMissions, saveMissions,
} from '../firestore';
import { calcStats, calcXP } from '../storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // undefined = auth state still loading, null = not authenticated
  const [authUser, setAuthUser] = useState(undefined);
  const [user, setUserState] = useState(null);
  const [workouts, setWorkoutsState] = useState([]);
  const [history, setHistoryState] = useState([]);
  const [settings, setSettingsState] = useState({ notifications: true });
  const [missions, setMissionsState] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser ?? null);
      if (!firebaseUser) {
        setUserState(null);
        setWorkoutsState([]);
        setHistoryState([]);
        setMissionsState(null);
        setDataLoaded(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!authUser) return;
    setDataLoaded(false);
    async function load() {
      try {
        const uid = authUser.uid;
        const [profile, w, h, s, m] = await Promise.all([
          getUserProfile(uid),
          getWorkouts(uid),
          getHistory(uid),
          getSettings(uid),
          getMissions(uid),
        ]);
        setUserState(profile ?? {
          name: authUser.displayName ?? '',
          email: authUser.email ?? '',
          weight: '',
          height: '',
          age: '',
          photoURL: authUser.photoURL ?? null,
        });
        setWorkoutsState(w);
        setHistoryState(h);
        setSettingsState(s);
        setMissionsState(m);
      } catch (err) {
        console.warn('Failed to load user data:', err?.message ?? err);
        setUserState({
          name: authUser.displayName ?? '',
          email: authUser.email ?? '',
          weight: '',
          height: '',
          age: '',
          photoURL: authUser.photoURL ?? null,
        });
        setWorkoutsState([]);
        setHistoryState([]);
        setSettingsState({ notifications: true });
        setMissionsState({ date: new Date().toISOString().split('T')[0], workoutDone: false, waterProgress: 0, stepsProgress: 0 });
      } finally {
        setDataLoaded(true);
      }
    }
    load();
  }, [authUser]);

  const signIn = useCallback(async (email, password) => {
    await loginUser(email, password);
  }, []);

  const signUp = useCallback(async (name, email, password) => {
    await registerUser(name, email, password);
  }, []);

  const signOut = useCallback(async () => {
    await logoutUser();
  }, []);

  const updateUser = useCallback(async (data) => {
    if (!authUser) return;
    await saveUserProfile(authUser.uid, data);
    setUserState(data);
  }, [authUser]);

  const addWorkout = useCallback(async (workout) => {
    if (!authUser) return;
    await saveWorkout(authUser.uid, workout);
    setWorkoutsState((prev) => [...prev, workout]);
  }, [authUser]);

  const updateWorkout = useCallback(async (workout) => {
    if (!authUser) return;
    await saveWorkout(authUser.uid, workout);
    setWorkoutsState((prev) => prev.map((w) => w.id === workout.id ? workout : w));
  }, [authUser]);

  const removeWorkout = useCallback(async (workoutId) => {
    if (!authUser) return;
    await deleteWorkoutFromDB(authUser.uid, workoutId);
    setWorkoutsState((prev) => prev.filter((w) => w.id !== workoutId));
  }, [authUser]);

  const saveHistory = useCallback(async (entry) => {
    if (!authUser) return;
    await addHistoryEntry(authUser.uid, entry);
    setHistoryState((prev) => [entry, ...prev]);
  }, [authUser]);

  const wipeHistory = useCallback(async () => {
    if (!authUser) return;
    await clearHistory(authUser.uid);
    setHistoryState([]);
  }, [authUser]);

  const updateSettings = useCallback(async (data) => {
    if (!authUser) return;
    await saveSettings(authUser.uid, data);
    setSettingsState(data);
  }, [authUser]);

  const updateMissions = useCallback(async (data) => {
    if (!authUser) return;
    await saveMissions(authUser.uid, data);
    setMissionsState(data);
  }, [authUser]);

  const authLoading = authUser === undefined;
  const loaded = !authLoading && dataLoaded;

  const stats = calcStats(history);
  const xp = missions
    ? calcXP(history, missions)
    : { xp: 0, level: 1, xpInLevel: 0, xpForNext: 200 };

  return (
    <AppContext.Provider value={{
      authUser,
      authLoading,
      user, updateUser,
      workouts, addWorkout, updateWorkout, removeWorkout,
      history, saveHistory, wipeHistory,
      settings, updateSettings,
      missions, updateMissions,
      stats, xp,
      loaded,
      signIn, signUp, signOut,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
