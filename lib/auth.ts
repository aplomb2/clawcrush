// Server-side auth helper: verify Firebase ID token from request
import { adminAuth, ADMIN_EMAILS } from "./firebase-admin";

export interface AuthUser {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  isAdmin: boolean;
}

export async function verifyAuth(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email || "",
      name: decoded.name,
      picture: decoded.picture,
      isAdmin: ADMIN_EMAILS.includes(decoded.email || ""),
    };
  } catch {
    return null;
  }
}
