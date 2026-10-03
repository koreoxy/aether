"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  createSessionToken,
  getCurrentUser,
  requireAuthUser,
  setSessionCookie,
} from "../lib/auth/session";
import {
  createUser,
  findUserByEmail,
  recordWorkoutCompletion,
  updateUser,
} from "../lib/db/repository";
import {
  completeChallengeSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../lib/validation/schemas";

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function loginAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);
  if (!user) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  await setSessionCookie(token);
  redirect("/dashboard");
}

export async function registerAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    timezone: formData.get("timezone") || "Asia/Jakarta",
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  const { name, email, password, timezone } = parsed.data;
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await createUser({
    name,
    email,
    passwordHash,
    timezone,
  });

  const token = await createSessionToken({
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
  });

  await setSessionCookie(token);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}

export async function completeChallengeAction(payload: {
  challengeId: string;
  challengeDate: string;
}): Promise<ActionResult> {
  try {
    const user = await requireAuthUser();

    const parsed = completeChallengeSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid challenge completion payload",
      };
    }

    const result = await recordWorkoutCompletion({
      userId: user.id,
      challengeId: parsed.data.challengeId,
      challengeDate: parsed.data.challengeDate,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/challenge/${parsed.data.challengeDate}`);
    revalidatePath("/history");

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to record workout completion",
    };
  }
}

export async function updateProfileAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const user = await requireAuthUser();

    const rawData = {
      name: formData.get("name") || undefined,
      timezone: formData.get("timezone") || undefined,
    };

    const parsed = updateProfileSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid profile data",
      };
    }

    await updateUser(user.id, parsed.data);

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/history");

    return {
      success: true,
      data: { message: "Profile updated successfully" },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to update profile",
    };
  }
}
