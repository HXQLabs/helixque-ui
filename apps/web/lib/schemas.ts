import { z } from "zod";
import {
  ROLES,
  DOMAINS,
  TECH_STACK,
  EXPERIENCE_LEVELS,
  SPOKEN_LANGUAGES,
} from "./constants";

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
// User Preferences Schema
export const UserProfileSchema = z.object({
  languages: z.array(z.union([z.enum(SPOKEN_LANGUAGES), z.string()])).describe("Spoken languages"),
  role: z.union([z.enum(ROLES), z.string()]).describe("Current role"),
  domain: z.union([z.enum(DOMAINS), z.string()]).describe("Industry domain"),
  techStack: z.array(z.union([z.enum(TECH_STACK), z.string()])).describe("List of known technologies"),
  experience: z.enum(EXPERIENCE_LEVELS).describe("Experience Range (Years)"),
});

export const UserCriteriaSchema = z.object({
  languages: z.array(z.union([z.enum(SPOKEN_LANGUAGES), z.string()])).describe("Target spoken languages"),
  role: z.union([z.enum(ROLES), z.string()]).describe("Target role"),
  domain: z.union([z.enum(DOMAINS), z.string()]).describe("Target domain"),
  techStack: z.array(z.union([z.enum(TECH_STACK), z.string()])).describe("List of desired technologies"),
  minExperience: z.enum(EXPERIENCE_LEVELS).describe("Minimum experience range"),
});

export const MatchRequestSchema = z.object({
  lookingFor: UserCriteriaSchema,
  requestId: z.string(),
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
