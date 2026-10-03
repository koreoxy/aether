/**
 * Server-Side Authentication & Session Management
 * Uses signed JWT stored in HTTP-only cookies.
 * Adheres strictly to security standards: user identity is derived server-side.
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { findUserById, UserRecord } from "../db/repository";

const AUTH_COOKIE_NAME = "mindfull_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "mindfull_super_secure_jwt_secret_token_key_minimum_32_characters"
);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
}

/**
 * Creates and signs a JWT session token valid for 30 days.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);
}

/**
 * Verifies a JWT session token and returns the payload if valid.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

/**
 * Sets the session cookie in HTTP response headers.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Clears the session cookie (logout).
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Retrieves the currently authenticated user record on the server.
 * Returns null if unauthenticated.
 */
export async function getCurrentUser(): Promise<UserRecord | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return null;
  }

  const payload = await verifySessionToken(sessionCookie.value);
  if (!payload?.userId) {
    return null;
  }

  const user = await findUserById(payload.userId);
  return user;
}

/**
 * Demands an authenticated user or throws an authorization error.
 */
export async function requireAuthUser(): Promise<UserRecord> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }
  return user;
}
