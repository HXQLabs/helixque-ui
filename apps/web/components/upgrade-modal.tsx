"use client";

import * as React from "react";
import { Check, Zap, Infinity, Star } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";

const PRO_FEATURES = [
  "50 Skips per day",
  "Priority Matching",
  "Verified Badge",
  "Ad-free Experience",
  "Visitor Insights",
];

const ELITE_FEATURES = [
  "Unlimited Skips",
  "Global Access (All Regions)",
  "Dedicated Success Manager",
  "Priority Support (24/7)",
  "Early Access Features",
];

const PRICING = {
  monthly: { pro: 499, elite: 999 },
  yearly: { pro: 399, elite: 799 },
};

export function UpgradeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [billing, setBilling] = React.useState<"monthly" | "yearly">("monthly");
  const prices = PRICING[billing];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden"
      >
        {/* Hero with matrix background */}
        <div className="relative overflow-hidden px-6 pt-8 pb-6">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="relative text-center space-y-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary"
            >
              <Star className="w-3 h-3 mr-1 fill-primary" />
              Upgrade your experience
            </Badge>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Unlock Professional Superpowers
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground max-w-md mx-auto">
              Get more skips, priority matching, and exclusive features.
            </DialogDescription>

            {/* Billing toggle */}
            <div className="flex justify-center pt-2">
              <div className="inline-flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    billing === "monthly"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling("yearly")}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    billing === "yearly"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Yearly
                  <span className="ml-1 text-[10px] text-primary font-semibold">
                    -20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-2 gap-4 px-6 pb-6">
          {/* Pro */}
          <div className="relative flex flex-col rounded-xl border-2 border-primary bg-background p-5 shadow-md shadow-primary/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-primary text-primary-foreground px-3 py-0.5 text-[10px] font-semibold rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" /> Popular
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-bold">Pro</h3>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-extrabold tracking-tight">
                  ₹{prices.pro}
                </span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
            </div>
            <ul className="space-y-2.5 flex-1 mb-5">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="shrink-0 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" size="sm">
              Upgrade to Pro
            </Button>
          </div>

          {/* Elite */}
          <div className="flex flex-col rounded-xl border border-border bg-card/50 p-5">
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-bold">Elite</h3>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-extrabold tracking-tight">
                  ₹{prices.elite}
                </span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
            </div>
            <ul className="space-y-2.5 flex-1 mb-5">
              {ELITE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="shrink-0 w-4 h-4 rounded-full bg-muted text-muted-foreground flex items-center justify-center mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant="outline" size="sm">
              Get Elite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
