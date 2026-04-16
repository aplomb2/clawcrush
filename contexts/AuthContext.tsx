"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { trackSignUp, trackLogin } from "@/lib/tracking";
import posthog from "posthog-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  getIdToken: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // Session restore — lightweight login event (GA4 only)
        trackLogin("firebase_auto");
        // Identify the user in PostHog so all subsequent events are attributed
        posthog.identify(user.uid, {
          email: user.email || undefined,
          name: user.displayName || undefined,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Detect new vs returning user: account created in last 30 seconds = new
      const creationTime = result.user.metadata.creationTime;
      const isNewUser = creationTime
        ? Date.now() - new Date(creationTime).getTime() < 30_000
        : false;

      if (isNewUser) {
        trackSignUp("google"); // GA4 + Google Ads conversion
      } else {
        trackLogin("google"); // GA4 only
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    // Reset PostHog identity so the next visitor isn't attributed to this user
    posthog.reset();
  };

  const getIdToken = async () => {
    if (!user) return null;
    return user.getIdToken();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signOut, getIdToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
