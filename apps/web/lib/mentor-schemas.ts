import { z } from "zod";

export const MentorServiceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string(),
});

export const MentorSocialsSchema = z.object({
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter/X URL").optional().or(z.literal("")),
  website: z.string().url("Invalid Website URL").optional().or(z.literal("")),
});

export const MentorProfileSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  about: z.string().min(50, "About section must be at least 50 characters"),
  company: z.string().optional(),
  role: z.string().optional(),
  expertise: z.array(z.string()).min(1, "Add at least one area of expertise"),
  services: z.array(MentorServiceSchema),
  socials: MentorSocialsSchema.optional(),
});

export type MentorProfile = z.infer<typeof MentorProfileSchema>;
export type MentorService = z.infer<typeof MentorServiceSchema>;
