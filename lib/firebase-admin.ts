// Firebase Admin SDK — server-side only
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Admin emails that bypass payment checks
export const ADMIN_EMAILS = ["simple.shen@gmail.com"];

let adminApp: App;

if (getApps().length === 0) {
  // In production, use env var; locally use the key file
  const serviceAccount = process.env.FIREBASE_ADMIN_KEY
    ? JSON.parse(process.env.FIREBASE_ADMIN_KEY)
    : undefined;

  adminApp = initializeApp(
    serviceAccount
      ? { credential: cert(serviceAccount) }
      : { projectId: "clawcrush" }
  );
} else {
  adminApp = getApps()[0];
}

const adminAuth = getAuth(adminApp);
const db = getFirestore(adminApp);

export { adminApp, adminAuth, db };
