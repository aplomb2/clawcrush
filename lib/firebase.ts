// Firebase Client SDK — for browser auth
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZT9pbZX9h2BiCyY8igT3E8y504GErel0",
  authDomain: "clawcrush.firebaseapp.com",
  projectId: "clawcrush",
  storageBucket: "clawcrush.firebasestorage.app",
  messagingSenderId: "292551853418",
  appId: "1:292551853418:web:153ba55ae6410c94651113",
  measurementId: "G-D3C6CQ0YCW",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
