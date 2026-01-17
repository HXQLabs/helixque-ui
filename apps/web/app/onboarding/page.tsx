"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Combobox } from "@/components/ui/combobox";
import { UserProfileSchema } from "@/lib/schemas";
import { 
  ROLES, 
  DOMAINS, 
  TECH_STACK, 
  SPOKEN_LANGUAGES, 
  EXPERIENCE_LEVELS 
} from "@/lib/constants";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// Extend schema for onboarding steps if needed, or use parts of UserProfileSchema
// For onboarding, we focus on: Domain, Skills (TechStack), Languages, Experience. 
// We might also want Role.

const OnboardingSchema = UserProfileSchema.pick({
  domain: true,
  role: true,
  techStack: true,
  languages: true,
  experience: true,
});

type OnboardingFormData = z.infer<typeof OnboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      domain: undefined,
      role: undefined,
      techStack: [],
      languages: [],
      experience: undefined,
    },
    mode: "onChange", // Validate on change to enable Next button
  });

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      // Logic to submit data to backend
      // Use backend ID from session (if available) or assume user is logged in
      const userId = (session?.user as any)?.id; 
      
      console.log("Submitting Onboarding Data:", {
          userId,
          sessionUser: session?.user,
          formData: data
      });

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        console.error("User ID missing from session");
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";
      console.log(`Sending PUT request to ${backendUrl}/users/${userId}`);

      const response = await fetch(`${backendUrl}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // schema: domain, role, skills, languages, yearsExperience
            domain: data.domain,
            role: data.role,
            skills: data.techStack, // Map techStack -> skills
            languages: data.languages,
            yearsExperience: data.experience, // Map experience -> yearsExperience (already string)
            status: "ONLINE" 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error Response:", response.status, errorText);
        throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log("Backend Success Response:", responseData);

      toast.success("Profile updated!");
      
      // Update session to reflect new onboarding status
      await update({ isOnboarded: true });
      
      // Force a hard reload if needed, but router push should work if middleware re-evaluates
      router.push("/dashboard?tour=true");
      router.refresh(); // Ensure server components refresh
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Onboarding Submit Error:", error);
    }
  };

  const nextStep = async () => {
    // Validate current step fields before moving
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];
    if (step === 1) fieldsToValidate = ["domain", "role"];
    if (step === 2) fieldsToValidate = ["techStack"];
    if (step === 3) fieldsToValidate = ["languages"];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg bg-background border rounded-xl shadow-sm p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
             <h1 className="text-2xl font-bold">Welcome to Helixque</h1>
             <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          </div>
          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
            <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                 <h2 className="text-lg font-semibold mb-1">What do you do?</h2>
                 <p className="text-sm text-muted-foreground mb-4">Tell us about your professional background.</p>
               </div>

               <div className="space-y-3">
                  <Label>Current Role <span className="text-red-500">*</span></Label>
                  <Combobox
                    options={ROLES}
                    value={form.watch("role")}
                    onChange={(val) => form.setValue("role", val as any, { shouldValidate: true })}
                    placeholder="Select Role"
                    searchPlaceholder="Search roles..."
                    allowCustom
                  />
                  {form.formState.errors.role && <p className="text-xs text-red-500">{form.formState.errors.role.message}</p>}
               </div>

               <div className="space-y-3">
                  <Label>Industry Domain <span className="text-red-500">*</span></Label>
                  <Combobox
                    options={DOMAINS}
                    value={form.watch("domain")}
                    onChange={(val) => form.setValue("domain", val as any, { shouldValidate: true })}
                    placeholder="Select Domain"
                     searchPlaceholder="Search domains..."
                    allowCustom
                  />
                  {form.formState.errors.domain && <p className="text-xs text-red-500">{form.formState.errors.domain.message}</p>}
               </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                 <h2 className="text-lg font-semibold mb-1">Your Skills</h2>
                 <p className="text-sm text-muted-foreground mb-4">What technologies do you work with?</p>
               </div>
               
               <div className="space-y-3">
                  <Label>Tech Stack <span className="text-red-500">*</span></Label>
                  <Combobox
                    options={TECH_STACK}
                    value={form.watch("techStack")}
                    onChange={(val) => form.setValue("techStack", val as any, { shouldValidate: true })}
                    placeholder="Select Skills"
                    searchPlaceholder="Search skills..."
                    multiple
                    allowCustom
                  />
                  {form.formState.errors.techStack && <p className="text-xs text-red-500">{form.formState.errors.techStack.message}</p>}
               </div>
            </div>
          )}

          {step === 3 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                 <h2 className="text-lg font-semibold mb-1">Communication</h2>
                 <p className="text-sm text-muted-foreground mb-4">Which languages do you speak?</p>
               </div>
               
               <div className="space-y-3">
                  <Label>Spoken Languages <span className="text-red-500">*</span></Label>
                  <Combobox
                    options={SPOKEN_LANGUAGES}
                    value={form.watch("languages")}
                    onChange={(val) => form.setValue("languages", val as any, { shouldValidate: true })}
                    placeholder="Select Languages"
                    searchPlaceholder="Search..."
                    multiple
                    allowCustom
                  />
                  {form.formState.errors.languages && <p className="text-xs text-red-500">{form.formState.errors.languages.message}</p>}
               </div>
            </div>
          )}

          {step === 4 && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                 <h2 className="text-lg font-semibold mb-1">Experience</h2>
                 <p className="text-sm text-muted-foreground mb-4">How long have you been in the industry?</p>
               </div>
               
               <div className="space-y-3">
                  <Label>Years of Experience <span className="text-red-500">*</span></Label>
                  <Combobox
                    options={EXPERIENCE_LEVELS}
                    value={form.watch("experience")}
                    onChange={(val) => form.setValue("experience", val as any, { shouldValidate: true })}
                    placeholder="Select Level"
                    searchPlaceholder="Search level..."
                  />
                  {form.formState.errors.experience && <p className="text-xs text-red-500">{form.formState.errors.experience.message}</p>}
               </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t mt-6">
            {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>
                    Back
                </Button>
            ) : (
                <div /> // Spacer
            )}

            {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                    Next
                </Button>
            ) : (
                <Button type="submit">
                    Complete Setup
                </Button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
