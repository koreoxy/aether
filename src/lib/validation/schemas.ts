/**
 * Runtime Input Validation Schemas with Zod
 */

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  timezone: z.string().optional().default("Asia/Jakarta"),
});

export const completeChallengeSchema = z.object({
  challengeId: z.string().min(1, "Challenge ID is required"),
  challengeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (must be YYYY-MM-DD)"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  timezone: z.string().min(2, "Invalid timezone").optional(),
});
