"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { MentorProfileSchema, type MentorProfile } from "@/lib/mentor-schemas";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { ChevronRight, ChevronLeft, Plus, X, Globe, Linkedin, Twitter, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigation } from "@/contexts/navigation-context";
import * as React from "react";

const STEPS = [
  { id: "profile", title: "Profile Details", description: "Tell us about yourself" },
  { id: "expertise", title: "Expertise", description: "What can you help with?" },
  { id: "services", title: "Services", description: "Set up your offerings" },
  { id: "socials", title: "Socials", description: "Where can people find you?" },
];

export default function JoinMentorPage() {
  const router = useRouter();
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setActiveSection("Connect");
    setActiveSubSection("Join as a Mentor");
  }, [setActiveSection, setActiveSubSection]);

  const form = useForm<MentorProfile>({
    resolver: zodResolver(MentorProfileSchema),
    defaultValues: {
      headline: "",
      about: "",
      company: "",
      role: "",
      expertise: [],
      services: [
        { title: "1:1 Mentorship", description: "30 min video call to discuss your career.", duration: "30 min", price: 0, currency: "USD" }
      ],
      socials: { linkedin: "", twitter: "", website: "" },
    },
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const [tagInput, setTagInput] = useState("");
  const expertiseKeys = watch("expertise") || [];

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleSubmit(onSubmit)();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["headline", "about", "company", "role"];
      case 1: return ["expertise"];
      case 2: return ["services"];
      case 3: return ["socials"];
      default: return [];
    }
  };

  const onSubmit = (data: MentorProfile) => {
    console.log("Mentor Application:", data);
    toast.success("Application Submitted!", {
      description: "You have successfully successfully applied as a mentor.",
    });
  };

  const addExpertise = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = getValues("expertise") || [];
      if (!currentTags.includes(tagInput.trim())) {
        setValue("expertise", [...currentTags, tagInput.trim()]);
        trigger("expertise");
      }
      setTagInput("");
    }
  };

  const removeExpertise = (tagToRemove: string) => {
    const currentTags = getValues("expertise");
    setValue("expertise", currentTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="shrink-0 px-6 py-4 border-b border-border bg-background flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-semibold tracking-tight">Join as a Mentor</h1>
           <p className="text-sm text-muted-foreground mt-0.5">Share your knowledge and guide others.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress Steps */}
          <div className="relative flex justify-between mb-8">
             <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -translate-y-1/2" />
             <div 
                className="absolute top-4 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
             />
             {STEPS.map((step, index) => (
               <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
                 <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                      index <= currentStep 
                        ? "border-primary bg-primary text-primary-foreground" 
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                 >
                   {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                 </div>
                 <span className={`text-xs font-medium ${index === currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                   {step.title}
                 </span>
               </div>
             ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{STEPS[currentStep]?.title}</CardTitle>
              <CardDescription>{STEPS[currentStep]?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                
                {/* STEP 1: Profile */}
                {currentStep === 0 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="role">Current Role</Label>
                        <Input id="role" placeholder="e.g. Senior Product Designer" {...register("role")} />
                        {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="e.g. Acme Corp" {...register("company")} />
                        {errors.company && <p className="text-destructive text-sm">{errors.company.message}</p>}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="headline">Headline</Label>
                      <Input id="headline" placeholder="Experienced Designer helping startups grow..." {...register("headline")} />
                      <p className="text-xs text-muted-foreground">This will appear on your public mentor card.</p>
                      {errors.headline && <p className="text-destructive text-sm">{errors.headline.message}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="about">About</Label>
                      <textarea
                        id="about"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Share your journey, achievements, and how you can help..."
                        {...register("about")}
                      />
                      {errors.about && <p className="text-destructive text-sm">{errors.about.message}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 2: Expertise */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid gap-2">
                      <Label>Areas of Expertise</Label>
                      <div className="space-y-3">
                        <Input 
                          placeholder="Type and press Enter (e.g. UX Design, React, Leadership)" 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={addExpertise}
                        />
                        <div className="flex flex-wrap gap-2">
                          {expertiseKeys.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="px-2 py-1 gap-1">
                              {tag}
                              <button 
                                type="button" 
                                onClick={() => removeExpertise(tag)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <X size={14} />
                              </button>
                            </Badge>
                          ))}
                          {expertiseKeys.length === 0 && (
                            <span className="text-sm text-muted-foreground italic">No tags added yet.</span>
                          )}
                        </div>
                      </div>
                      {errors.expertise && <p className="text-destructive text-sm">{errors.expertise.message}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 3: Services */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-border rounded-lg bg-card space-y-4 relative group">
                          <button 
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                          <div className="grid grid-cols-[2fr_1fr] gap-4">
                            <div className="grid gap-2">
                              <Label>Service Title</Label>
                              <Input placeholder="e.g. 1:1 Call" {...register(`services.${index}.title`)} />
                              {errors.services?.[index]?.title && <p className="text-destructive text-sm">{errors.services[index]?.title?.message}</p>}
                            </div>
                            <div className="grid gap-2">
                              <Label>Price ({watch(`services.${index}.currency`)})</Label>
                              <Input 
                                type="number" 
                                {...register(`services.${index}.price`, { valueAsNumber: true })}
                              />
                              {errors.services?.[index]?.price && <p className="text-destructive text-sm">{errors.services[index]?.price?.message}</p>}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Duration</Label>
                              <Input placeholder="e.g. 30 min" {...register(`services.${index}.duration`)} />
                              {errors.services?.[index]?.duration && <p className="text-destructive text-sm">{errors.services[index]?.duration?.message}</p>}
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>Description</Label>
                            <Input placeholder="What will be covered?" {...register(`services.${index}.description`)} />
                            {errors.services?.[index]?.description && <p className="text-destructive text-sm">{errors.services[index]?.description?.message}</p>}
                          </div>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => append({ title: "", description: "", duration: "", price: 0, currency: "USD" })}
                        className="w-full border-dashed"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Another Service
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Socials */}
                {currentStep === 3 && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="grid gap-2">
                        <Label>LinkedIn URL</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="https://linkedin.com/in/..." {...register("socials.linkedin")} />
                        </div>
                        {errors.socials?.linkedin && <p className="text-destructive text-sm">{errors.socials.linkedin.message}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Twitter/X URL</Label>
                        <div className="relative">
                          <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="https://x.com/..." {...register("socials.twitter")} />
                        </div>
                        {errors.socials?.twitter && <p className="text-destructive text-sm">{errors.socials.twitter.message}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>Personal Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="https://..." {...register("socials.website")} />
                        </div>
                        {errors.socials?.website && <p className="text-destructive text-sm">{errors.socials.website.message}</p>}
                      </div>
                   </div>
                )}

                <div className="flex justify-between pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleBack} 
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    {currentStep === STEPS.length - 1 ? "Submit Application" : "Next Step"}
                    {currentStep !== STEPS.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
