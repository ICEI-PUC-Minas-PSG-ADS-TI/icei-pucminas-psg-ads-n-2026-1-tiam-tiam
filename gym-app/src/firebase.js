import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Substitua com as credenciais do seu projeto Firebase
// Firebase Console → Configurações do projeto → Seus apps → SDK do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTMyo4yd7HaaA-DqtOjb_nwsCdNpd-fd8",
  authDomain: "fittrack-c4a1a.firebaseapp.com",
  projectId: "fittrack-c4a1a",
  storageBucket: "fittrack-c4a1a.appspot.com",
  messagingSenderId: "792314521305",
  appId: "1:792314521305:web:b24ba3290f33fa7c5b00c8"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Fast refresh or re-import can re-run this module; fallback avoids duplicate init crash.
  auth = getAuth(app);
}

export { auth };

export const db = getFirestore(app);
export const storage = getStorage(app);
