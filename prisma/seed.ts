/**
 * Database Seed Script
 * Populates realistic exercises, 14 daily challenges, and a sample user with streak history.
 */

import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db/prisma";

export const SEED_EXERCISES = [
  {
    id: "ex-pushups",
    name: "Standard Push-Ups",
    description: "Classic upper body pressing movement developing chest, shoulders, and triceps stability.",
    instructions: "Start in a high plank position with hands slightly wider than shoulder-width. Lower your chest until it nearly touches the floor, keeping elbows at a 45-degree angle. Push back up forcefully.",
    targetMuscle: "Chest, Triceps, Shoulders, Core",
    category: "Upper Body",
  },
  {
    id: "ex-squats",
    name: "Bodyweight Squats",
    description: "Fundamental lower-body compound movement targeting quadriceps, hamstrings, and glutes.",
    instructions: "Stand with feet shoulder-width apart, toes slightly turned out. Push hips back and bend knees until thighs are parallel to the floor. Drive through the midfoot to return to standing.",
    targetMuscle: "Quadriceps, Glutes, Hamstrings",
    category: "Lower Body",
  },
  {
    id: "ex-plank",
    name: "Forearm Plank",
    description: "Isometric core endurance hold bracing the entire abdominal wall and lumbar spine.",
    instructions: "Rest on forearms and toes with elbows directly below shoulders. Keep a rigid straight line from head to heels. Engage glutes and brace your core throughout.",
    targetMuscle: "Rectus Abdominis, Transverse Abdominis, Glutes",
    category: "Core",
  },
  {
    id: "ex-climbers",
    name: "Mountain Climbers",
    description: "Dynamic core and cardiovascular exercise activating hip flexors and stabilizing shoulders.",
    instructions: "From a push-up position, alternate driving knees towards your chest in a running cadence. Keep hips level and shoulders stationary.",
    targetMuscle: "Core, Hip Flexors, Shoulders, Cardio",
    category: "Cardio & Core",
  },
  {
    id: "ex-lunges",
    name: "Walking / Alternating Lunges",
    description: "Unilateral leg exercise enhancing balance, hip mobility, and single-leg strength.",
    instructions: "Step forward with one leg, lowering hips until both knees are bent at roughly 90 degrees. Press through the front heel to return and alternate sides.",
    targetMuscle: "Quadriceps, Glutes, Calves",
    category: "Lower Body",
  },
  {
    id: "ex-burpees",
    name: "Full Burpees",
    description: "High-intensity total body exercise building explosive power and aerobic capacity.",
    instructions: "Drop into a squat, kick feet back into a push-up, perform a quick chest-to-deck push-up, jump feet forward, and explode upward with arms overhead.",
    targetMuscle: "Full Body, Cardio",
    category: "Full Body",
  },
  {
    id: "ex-bicycle-crunches",
    name: "Bicycle Crunches",
    description: "Rotational abdominal exercise activating obliques and upper/lower abs.",
    instructions: "Lie on back with hands behind head and legs lifted. Bring opposite elbow to opposite knee while extending the other leg, alternating in a controlled pedaling rhythm.",
    targetMuscle: "Obliques, Abdominals",
    category: "Core",
  },
  {
    id: "ex-glute-bridge",
    name: "Glute Bridges",
    description: "Posterior chain activation strengthening glutes, lower back, and hamstrings.",
    instructions: "Lie on back with knees bent and feet flat on floor. Drive through heels to raise hips until knees, hips, and shoulders form a straight line. Squeeze glutes at top.",
    targetMuscle: "Glutes, Hamstrings, Lower Back",
    category: "Lower Body",
  },
  {
    id: "ex-diamond-pushups",
    name: "Diamond Push-Ups",
    description: "Close-grip push-up variation placing intense focus on triceps and inner chest.",
    instructions: "Place hands together under chest with index fingers and thumbs forming a diamond. Lower chest to hands and press back up to full extension.",
    targetMuscle: "Triceps, Chest, Anterior Deltoids",
    category: "Upper Body",
  },
  {
    id: "ex-jumping-jacks",
    name: "Jumping Jacks",
    description: "Full body aerobic activator and warmup standard.",
    instructions: "Jump feet out to the sides while raising arms overhead. Jump back to starting position in a continuous rhythm.",
    targetMuscle: "Full Body, Cardio",
    category: "Cardio",
  },
  {
    id: "ex-high-knees",
    name: "High Knees Sprint",
    description: "Intense cardiovascular sprint in place promoting rapid foot cadence and hip flexion.",
    instructions: "Run in place lifting knees up towards waist height as quickly and rhythmically as possible while pumping arms.",
    targetMuscle: "Quads, Calves, Hip Flexors, Heart Rate",
    category: "Cardio",
  },
  {
    id: "ex-wall-sit",
    name: "Isometric Wall Sit",
    description: "Sustained isometric squat hold testing mental grit and quadriceps muscular endurance.",
    instructions: "Slide down against a flat wall until thighs are parallel to ground with knees at 90 degrees. Hold position with back flat against the wall.",
    targetMuscle: "Quadriceps, Glutes",
    category: "Lower Body",
  },
];

export const SEED_CHALLENGES = [
  {
    date: "2026-09-30",
    title: "Endurance Kickoff",
    description: "A fast-paced cardiovascular primer designed to test baseline stamina and rhythm.",
    difficulty: "Beginner",
    estimatedDuration: 15,
    exercises: [
      { exerciseId: "ex-jumping-jacks", order: 1, sets: 3, durationSeconds: 45, restSeconds: 20 },
      { exerciseId: "ex-squats", order: 2, sets: 3, repetitions: 15, restSeconds: 30 },
      { exerciseId: "ex-pushups", order: 3, sets: 3, repetitions: 10, restSeconds: 30 },
      { exerciseId: "ex-plank", order: 4, sets: 3, durationSeconds: 30, restSeconds: 30 },
    ],
  },
  {
    date: "2026-10-01",
    title: "Core Matrix & Stability",
    description: "Targeted abdominal and stability workout reinforcing rotational power and lumbar support.",
    difficulty: "Intermediate",
    estimatedDuration: 20,
    exercises: [
      { exerciseId: "ex-plank", order: 1, sets: 3, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: "ex-bicycle-crunches", order: 2, sets: 3, repetitions: 20, restSeconds: 30 },
      { exerciseId: "ex-climbers", order: 3, sets: 3, durationSeconds: 40, restSeconds: 30 },
      { exerciseId: "ex-glute-bridge", order: 4, sets: 3, repetitions: 15, restSeconds: 30 },
    ],
  },
  {
    date: "2026-10-02",
    title: "Lower Body Torque",
    description: "High-volume leg challenge designed for quad drive, glute power, and unilateral stability.",
    difficulty: "Intermediate",
    estimatedDuration: 22,
    exercises: [
      { exerciseId: "ex-squats", order: 1, sets: 4, repetitions: 20, restSeconds: 45 },
      { exerciseId: "ex-lunges", order: 2, sets: 3, repetitions: 16, restSeconds: 30 },
      { exerciseId: "ex-wall-sit", order: 3, sets: 3, durationSeconds: 45, restSeconds: 45 },
      { exerciseId: "ex-glute-bridge", order: 4, sets: 3, repetitions: 15, restSeconds: 30 },
    ],
  },
  {
    date: "2026-10-03",
    title: "AETHER ™ Full Body Frontier",
    description: "Today's premier workout challenge. Combines compound push mechanics, deep squats, and explosive core intervals.",
    difficulty: "Advanced",
    estimatedDuration: 25,
    exercises: [
      { exerciseId: "ex-pushups", order: 1, sets: 4, repetitions: 15, restSeconds: 45 },
      { exerciseId: "ex-squats", order: 2, sets: 4, repetitions: 20, restSeconds: 45 },
      { exerciseId: "ex-diamond-pushups", order: 3, sets: 3, repetitions: 10, restSeconds: 45 },
      { exerciseId: "ex-climbers", order: 4, sets: 4, durationSeconds: 40, restSeconds: 30 },
      { exerciseId: "ex-burpees", order: 5, sets: 3, repetitions: 10, restSeconds: 60 },
      { exerciseId: "ex-plank", order: 6, sets: 3, durationSeconds: 60, restSeconds: 30 },
    ],
  },
  {
    date: "2026-10-04",
    title: "Upper Body Hypertrophy",
    description: "Pure pressing power and triceps overload emphasizing strict form and peak contraction.",
    difficulty: "Intermediate",
    estimatedDuration: 20,
    exercises: [
      { exerciseId: "ex-pushups", order: 1, sets: 4, repetitions: 15, restSeconds: 45 },
      { exerciseId: "ex-diamond-pushups", order: 2, sets: 3, repetitions: 12, restSeconds: 45 },
      { exerciseId: "ex-plank", order: 3, sets: 3, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: "ex-burpees", order: 4, sets: 3, repetitions: 8, restSeconds: 60 },
    ],
  },
  {
    date: "2026-10-05",
    title: "HIIT Velocity Sprint",
    description: "Maximum output intervals forcing fast recovery and sustained athletic cadence.",
    difficulty: "Advanced",
    estimatedDuration: 18,
    exercises: [
      { exerciseId: "ex-high-knees", order: 1, sets: 4, durationSeconds: 30, restSeconds: 20 },
      { exerciseId: "ex-burpees", order: 2, sets: 4, repetitions: 10, restSeconds: 45 },
      { exerciseId: "ex-climbers", order: 3, sets: 4, durationSeconds: 40, restSeconds: 20 },
      { exerciseId: "ex-jumping-jacks", order: 4, sets: 3, durationSeconds: 60, restSeconds: 30 },
    ],
  },
  {
    date: "2026-10-06",
    title: "Leg Power & Plyometrics",
    description: "Explosive lower body conditioning targeting single-leg strength and joint resilience.",
    difficulty: "Intermediate",
    estimatedDuration: 22,
    exercises: [
      { exerciseId: "ex-lunges", order: 1, sets: 4, repetitions: 20, restSeconds: 45 },
      { exerciseId: "ex-squats", order: 2, sets: 4, repetitions: 20, restSeconds: 45 },
      { exerciseId: "ex-wall-sit", order: 3, sets: 3, durationSeconds: 50, restSeconds: 40 },
      { exerciseId: "ex-glute-bridge", order: 4, sets: 3, repetitions: 18, restSeconds: 30 },
    ],
  },
  {
    date: "2026-10-07",
    title: "Midsection Iron Hold",
    description: "Comprehensive core conditioning isolating the anterior chain and rotational stabilizers.",
    difficulty: "Beginner",
    estimatedDuration: 15,
    exercises: [
      { exerciseId: "ex-plank", order: 1, sets: 3, durationSeconds: 45, restSeconds: 30 },
      { exerciseId: "ex-bicycle-crunches", order: 2, sets: 3, repetitions: 20, restSeconds: 30 },
      { exerciseId: "ex-climbers", order: 3, sets: 3, durationSeconds: 30, restSeconds: 20 },
    ],
  },
];

export async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed Exercises
  for (const ex of SEED_EXERCISES) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: ex,
      create: ex,
    });
  }
  console.log(`✓ Seeded ${SEED_EXERCISES.length} exercises`);

  // 2. Seed Challenges & Exercises
  for (const challengeData of SEED_CHALLENGES) {
    const { exercises, ...challengeInfo } = challengeData;
    const challenge = await prisma.dailyChallenge.upsert({
      where: { date: challengeInfo.date },
      update: challengeInfo,
      create: challengeInfo,
    });

    // Clean existing challenge exercise mappings
    await prisma.challengeExercise.deleteMany({
      where: { challengeId: challenge.id },
    });

    // Create challenge exercises
    for (const item of exercises) {
      await prisma.challengeExercise.create({
        data: {
          challengeId: challenge.id,
          exerciseId: item.exerciseId,
          order: item.order,
          sets: item.sets,
          repetitions: item.repetitions,
          durationSeconds: item.durationSeconds,
          restSeconds: item.restSeconds,
        },
      });
    }
  }
  console.log(`✓ Seeded ${SEED_CHALLENGES.length} daily challenges`);

  // 3. Seed Demo Test User
  const defaultPassword = await bcrypt.hash("password123", 10);
  const testUser = await prisma.user.upsert({
    where: { email: "alex@example.com" },
    update: {
      name: "Alex Vance",
      passwordHash: defaultPassword,
      timezone: "Asia/Jakarta",
    },
    create: {
      email: "alex@example.com",
      name: "Alex Vance",
      passwordHash: defaultPassword,
      timezone: "Asia/Jakarta",
    },
  });
  console.log(`✓ Seeded test user: ${testUser.email} (password: password123)`);

  // 4. Seed Historical Completions (2026-10-01 and 2026-10-02)
  const challenge1 = await prisma.dailyChallenge.findUnique({ where: { date: "2026-10-01" } });
  const challenge2 = await prisma.dailyChallenge.findUnique({ where: { date: "2026-10-02" } });

  if (challenge1) {
    await prisma.workoutCompletion.upsert({
      where: {
        userId_challengeId: {
          userId: testUser.id,
          challengeId: challenge1.id,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        challengeId: challenge1.id,
        challengeDate: "2026-10-01",
        completedAt: new Date("2026-10-01T10:00:00Z"),
      },
    });
  }

  if (challenge2) {
    await prisma.workoutCompletion.upsert({
      where: {
        userId_challengeId: {
          userId: testUser.id,
          challengeId: challenge2.id,
        },
      },
      update: {},
      create: {
        userId: testUser.id,
        challengeId: challenge2.id,
        challengeDate: "2026-10-02",
        completedAt: new Date("2026-10-02T10:00:00Z"),
      },
    });
  }

  // Seed cached stats for test user
  await prisma.userStats.upsert({
    where: { userId: testUser.id },
    update: {
      currentStreak: 2,
      longestStreak: 2,
      totalCompletedDays: 2,
      lastCompletedDate: "2026-10-02",
    },
    create: {
      userId: testUser.id,
      currentStreak: 2,
      longestStreak: 2,
      totalCompletedDays: 2,
      lastCompletedDate: "2026-10-02",
    },
  });

  console.log("✓ Seeded sample completion history (streak: 2 days)");
  console.log("🎉 Seed finished successfully!");
}

if (process.argv[1]?.endsWith("seed.ts")) {
  main()
    .catch((e) => {
      console.error("Seed error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
