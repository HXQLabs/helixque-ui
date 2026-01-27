"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserCriteriaSchema } from "@/lib/schemas";
import {
  SPOKEN_LANGUAGES,
  ROLES,
  DOMAINS,
  TECH_STACK,
  EXPERIENCE_LEVELS,
} from "@/lib/constants";
import { Button } from "@workspace/ui/components/button";
// field imports removed

import { Combobox } from "@/components/ui/combobox";
import { Label } from "@workspace/ui/components/label";

interface PreferenceSelectorProps {
  onJoin: (data: z.infer<typeof UserCriteriaSchema>) => void;
}

export default function PreferenceSelector({
  onJoin,
}: PreferenceSelectorProps) {
  const form = useForm<z.infer<typeof UserCriteriaSchema>>({
    resolver: zodResolver(UserCriteriaSchema),
    defaultValues: {
      languages: [],
      role: undefined,
      domain: undefined,
      techStack: [],
      minExperience: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof UserCriteriaSchema>) => {
    onJoin(data);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border/50 p-5 flex-shrink-0 bg-background/95 backdrop-blur-sm">
        <h2 className="text-xl font-semibold tracking-tight">Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Customize your match criteria
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 [scrollbar-width:thin]">
        <form
          id="preference-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Languages */}
          <div className="space-y-2">
            <Label>
              Spoken Languages <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={SPOKEN_LANGUAGES}
              value={form.watch("languages")}
              onChange={(val) => form.setValue("languages", val as any)}
              placeholder="Select Spoken Languages"
              searchPlaceholder="Search language..."
              multiple
              allowCustom
            />
            {form.formState.errors.languages && (
              <p className="text-xs text-red-500">
                {form.formState.errors.languages.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>
              Target Role <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={ROLES}
              value={form.watch("role")}
              onChange={(val) => form.setValue("role", val as any)}
              placeholder="Select Role"
              searchPlaceholder="Search role..."
              allowCustom
            />
            {form.formState.errors.role && (
              <p className="text-xs text-red-500">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          {/* Domain */}
          <div className="space-y-2">
            <Label>
              Target Domain <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={DOMAINS}
              value={form.watch("domain")}
              onChange={(val) => form.setValue("domain", val as any)}
              placeholder="Select Domain"
              searchPlaceholder="Search domain..."
              allowCustom
            />
            {form.formState.errors.domain && (
              <p className="text-xs text-red-500">
                {form.formState.errors.domain.message}
              </p>
            )}
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <Label>
              Tech Stack <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={TECH_STACK}
              value={form.watch("techStack")}
              onChange={(val) => form.setValue("techStack", val as any)}
              placeholder="Select Tech Stack"
              searchPlaceholder="Search technologies..."
              multiple
              allowCustom
            />
            {form.formState.errors.techStack && (
              <p className="text-xs text-red-500">
                {form.formState.errors.techStack.message}
              </p>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label>
              Minimum Experience <span className="text-red-500">*</span>
            </Label>
            <Combobox
              options={EXPERIENCE_LEVELS}
              value={form.watch("minExperience")}
              onChange={(val) => form.setValue("minExperience", val as any)}
              placeholder="Select Experience"
              searchPlaceholder="Search level..."
            />
            {form.formState.errors.minExperience && (
              <p className="text-xs text-red-500">
                {form.formState.errors.minExperience.message}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="border-t border-border/50 p-5 flex-shrink-0 bg-background/95 backdrop-blur-sm">
        <Button type="submit" form="preference-form" className="w-full">
          Join Meeting
        </Button>
      </div>
    </div>
  );
}
