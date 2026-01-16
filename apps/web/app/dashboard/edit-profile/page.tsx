"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Camera,
  Save,
  Loader2,
  Briefcase,
  Code,
  Globe,
  Clock,
  MapPin,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import {
  UserProfileSchema,
  UserAvailabilitySchema,
  UserSchema,
} from "@/lib/schemas";
import { useNavigation } from "@/contexts/navigation-context";

// Combined schema for the form
const EditProfileFormSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  profile: UserProfileSchema,
  availability: UserAvailabilitySchema,
  customDomain: z.string().optional(), // Temporary field for custom domain input
});

type EditProfileFormValues = z.infer<typeof EditProfileFormSchema>;

// Mock data
const defaultValues: EditProfileFormValues = {
  displayName: "Alex Morgan",
  email: "alex@helixque.com",
  profile: {
    language: "TypeScript",
    role: "Senior Frontend Engineer",
    domain: "Fintech",
    techStack: ["React", "Next.js", "Node.js", "TailwindCSS"],
    experience: "5-8",
  },
  availability: {
    timezone: "PST (UTC-8)",
    workingHours: "09:00 - 17:00",
    status: "Available",
  },
};

export default function EditProfilePage() {
  const { setActiveSection } = useNavigation();
  
  React.useEffect(() => {
    setActiveSection("Account", "Edit Profile");
  }, [setActiveSection]);

  const [avatarUrl, setAvatarUrl] = React.useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const techStack = watch("profile.techStack");
  const selectedDomain = watch("profile.domain");
  // Predefined domains
  const domains = [
    "Fintech",
    "Edtech",
    "HealthTech",
    "E-commerce",
    "SaaS",
    "Artificial Intelligence",
    "Cybersecurity", 
    "Blockchain",
    "Gaming",
    "Other"
  ];

  const [newTech, setNewTech] = React.useState("");

  const onSubmit = async (data: EditProfileFormValues) => {
    let finalData = { ...data };
    
    // Handle custom domain
    if (data.profile.domain === "Other" && data.customDomain) {
      finalData.profile.domain = data.customDomain;
    }
    
    // Remove temporary field
    delete (finalData as any).customDomain;

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form Data:", finalData);
    toast.success("Profile updated successfully");
    setIsSaving(false);
  };

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTech.trim()) {
      e.preventDefault();
      if (!techStack.includes(newTech.trim())) {
        setValue("profile.techStack", [...techStack, newTech.trim()]);
      }
      setNewTech("");
    }
  };

  const removeTech = (tech: string) => {
    setValue(
      "profile.techStack",
      techStack.filter((t) => t !== tech)
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground mt-2">
          Update your profile information and matching preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Header / Basic Info */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl">AM</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-[150px]">
                Click to change profile photo
              </p>
            </div>

            {/* Basic Fields */}
            <div className="flex-1 w-full grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  {...register("displayName")}
                  className={errors.displayName ? "border-destructive" : ""}
                />
                {errors.displayName && (
                  <p className="text-destructive text-sm">{errors.displayName.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Professional Details */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Professional Details</h2>
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Current Role</Label>
                <Input
                  id="profile.role"
                  {...register("profile.role")}
                  placeholder="e.g. Senior Frontend Engineer"
                />
                {errors.profile?.role && (
                  <p className="text-destructive text-sm">{errors.profile.role.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="domain">Industry Domain</Label>
                <div className="flex gap-2">
                  <select
                    id="domain"
                    {...register("profile.domain")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select a domain</option>
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
                {errors.profile?.domain && (
                  <p className="text-destructive text-sm">{errors.profile.domain.message}</p>
                )}
                
                {selectedDomain === "Other" && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Label htmlFor="customDomain" className="text-xs text-muted-foreground mb-1 block">Specify Domain</Label>
                    <Input
                      id="customDomain"
                      {...register("customDomain")}
                      placeholder="e.g. Biotech"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="experience">Experience Level</Label>
                <select
                  id="experience"
                  {...register("profile.experience")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="0-1">0-1 Years</option>
                  <option value="1-3">1-3 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5-8">5-8 Years</option>
                  <option value="8+">8+ Years</option>
                </select>
                {errors.profile?.experience && (
                  <p className="text-destructive text-sm">{errors.profile.experience.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Skills</h2>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Primary Skills</Label>
                <Input
                  id="profile.language"
                  {...register("profile.language")}
                  placeholder="e.g. TypeScript, Python"
                />
                {errors.profile?.language && (
                  <p className="text-destructive text-sm">{errors.profile.language.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="gap-1">
                      {tech}
                      <span
                        className="cursor-pointer hover:text-destructive ml-1"
                        onClick={() => removeTech(tech)}
                      >
                        ×
                      </span>
                    </Badge>
                  ))}
                </div>
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={handleAddTech}
                  placeholder="Type skill and press Enter..."
                />
                {errors.profile?.techStack && (
                  <p className="text-destructive text-sm">{errors.profile.techStack.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold">Availability & Status</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="availability.timezone"
                  {...register("availability.timezone")}
                  className="pl-9"
                  placeholder="e.g. PST (UTC-8)"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="workingHours">Working Hours</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="availability.workingHours"
                  {...register("availability.workingHours")}
                  className="pl-9"
                  placeholder="e.g. 09:00 - 17:00"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Current Status</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="availability.status"
                  {...register("availability.status")}
                  className="pl-9"
                  placeholder="e.g. Available, Busy"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
