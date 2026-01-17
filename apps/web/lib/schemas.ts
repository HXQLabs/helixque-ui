import { z } from "zod";

// Enums
export const UserStatus = z.enum([
  "OFFLINE",
  "ONLINE",
  "WAITING_STRICT",
  "WAITING_LOOSE",
  "IN_CALL",
]);

export const MatchMode = z.enum(["STRICT", "LOOSE"]);

// User Preferences Schema
export const UserProfileSchema = z.object({
  language: z.string().describe("Primary programming language"),
  role: z.string().describe("Current role (e.g., Junior, Senior, Mentor)"),
  domain: z.string().describe("Industry domain (e.g., Fintech, Edtech)"),
  techStack: z.array(z.string()).describe("List of known technologies"),
  experience: z.enum(["0-1", "1-3", "3-5", "5-8", "8+"]).describe("Experience Range (Years)"),
});

export const UserCriteriaSchema = z.object({
  language: z.union([z.string(), z.array(z.string())]).describe("Target language (or list of languages)"),
  role: z.array(z.string()).describe("List of acceptable roles"),
  domain: z.array(z.string()).describe("List of acceptable domains"),
  techStack: z.array(z.string()).describe("List of desired technologies"),
  minExperience: z.enum(["0-1", "1-3", "3-5", "5-8", "8+"]).optional().describe("Minimum experience range"),
});

export const UserAvailabilitySchema = z.object({
  timezone: z.string().optional(),
  workingHours: z.string().optional(),
  status: z.string().optional(),
});

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  myProfile: UserProfileSchema,
  lookingFor: UserCriteriaSchema,
  availability: UserAvailabilitySchema.optional(),
  strictPrefKey: z.string().optional().describe("Normalized preference string for strict matching"),
  ratingScore: z.number().default(0),
  ratingCount: z.number().default(0),
  reportsCount: z.number().default(0),
  status: UserStatus.default("OFFLINE"),
  lastSeen: z.date().optional(),
  currentMatchId: z.string().optional(),
});

// Match Schema
export const MatchSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  endedAt: z.date().optional(),
  mode: MatchMode,
  prefKey: z.string().optional(),
  userAId: z.string(),
  userBId: z.string(),
  ratingA: z.number().min(1).max(5).optional(),
  ratingB: z.number().min(1).max(5).optional(),
  tagsA: z.array(z.string()).optional(),
  tagsB: z.array(z.string()).optional(),
});
