import {
  doc, getDoc, setDoc, collection,
  getDocs, addDoc, writeBatch, deleteDoc,
  query, orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_WORKOUTS, DEFAULT_MISSIONS, DEFAULT_SETTINGS } from './storage';

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'profile'));
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid, profile) {
  await setDoc(doc(db, 'users', uid, 'data', 'profile'), profile);
}

export async function getWorkouts(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'workouts'));
  if (snap.empty) {
    const batch = writeBatch(db);
    DEFAULT_WORKOUTS.forEach((w) => {
      batch.set(doc(db, 'users', uid, 'workouts', w.id), w);
    });
    await batch.commit();
    return DEFAULT_WORKOUTS;
  }
  return snap.docs.map((d) => d.data());
}

export async function saveWorkout(uid, workout) {
  await setDoc(doc(db, 'users', uid, 'workouts', workout.id), workout);
}

export async function deleteWorkout(uid, workoutId) {
  await deleteDoc(doc(db, 'users', uid, 'workouts', workoutId));
}

export async function getHistory(uid) {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'history'), orderBy('date', 'desc'))
  );
  return snap.docs.map((d) => ({ ...d.data() }));
}

export async function addHistoryEntry(uid, entry) {
  await addDoc(collection(db, 'users', uid, 'history'), entry);
}

export async function clearHistory(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'history'));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export async function getSettings(uid) {
  const snap = await getDoc(doc(db, 'users', uid, 'data', 'settings'));
  return snap.exists() ? snap.data() : { ...DEFAULT_SETTINGS };
}

export async function saveSettings(uid, settings) {
  await setDoc(doc(db, 'users', uid, 'data', 'settings'), settings);
}

export async function getMissions(uid) {
  const today = new Date().toISOString().split('T')[0];
  const ref = doc(db, 'users', uid, 'missions', today);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const fresh = { ...DEFAULT_MISSIONS, date: today };
    await setDoc(ref, fresh);
    return fresh;
  }
  return snap.data();
}

export async function saveMissions(uid, missions) {
  await setDoc(doc(db, 'users', uid, 'missions', missions.date), missions);
}
