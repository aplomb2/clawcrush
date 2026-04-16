"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { trackSignedUp, trackSignedIn, trackLoginFailed } from "@/lib/tracking";
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

function identify(user: User, isNewUser: boolean) {
  posthog.identify(user.uid, {
    email: user.email || undefined,
    name: user.displayName || undefined,
    is_new_user: isNewUser,
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // Session restore — identify but do NOT fire signed_in
        // (the signInWithGoogle branch handles explicit auth events).
        identify(user, false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result.user) return;

      // New vs returning: accounts created <30s ago are brand new
      const creationTime = result.user.metadata.creationTime;
      const isNewUser = creationTime
        ? Date.now() - new Date(creationTime).getTime() < 30_000
        : false;

      identify(result.user, isNewUser);

      if (isNewUser) {
        trackSignedUp("google"); // PostHog + GA4 + Google Ads conversion
      } else {
        trackSignedIn("google"); // PostHog + GA4
      }
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: unknown }).code)
          : "unknown";
      trackLoginFailed(code);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
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
