"use client";

import { Check, Zap, Shield, Infinity, Star } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Essential tools for professionals just starting to network.",
    features: [
      "5 Skips per day",
      "Basic Matching",
      "Standard Support",
      "Access to Public Rooms"
    ],
    cta: "Current Plan",
    disabled: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "Perfect for active networkers looking for quality connections.",
    features: [
      "50 Skips per day",
      "Priority Matching",
      "Verified Badge",
      "Ad-free Experience",
      "Visitor Insights"
    ],
    cta: "Upgrade to Pro",
    disabled: false,
    highlight: true,
    icon: Zap,
  },
  {
    name: "Elite",
    price: "₹999",
    period: "/month",
    description: "Unlimited access for power users and industry leaders.",
    features: [
      "Unlimited Skips",
      "Global Access (All Regions)",
      "Dedicated Success Manager",
      "Priority Support (24/7)",
      "Early Access Features"
    ],
    cta: "Get Elite",
    disabled: false,
    highlight: false,
    icon: Infinity,
  }
];

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect } from "react";

export default function UpgradePage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();

  useEffect(() => {
    setActiveSection("Pro Features");
    setActiveSubSection("Upgrade Plan");
  }, [setActiveSection, setActiveSubSection]);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-background/50 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative max-w-6xl mx-auto px-6 text-center space-y-6">
           <Badge variant="secondary" className="px-4 py-1.5 text-sm rounded-full border border-primary/20 bg-primary/5 text-primary">
              <Star className="w-3.5 h-3.5 mr-1.5 fill-primary" />
              Upgrade your experience
           </Badge>
           <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
             Unlock Professional Superpowers
           </h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
             Get more skips, priority matching, and exclusive features to accelerate your professional growth.
           </p>
        </div>
      </div>

      <div className="flex-1 bg-muted/30 p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {PLANS.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative flex flex-col h-full transition-all duration-300 ${
                  plan.highlight 
                    ? 'border-primary shadow-xl shadow-primary/10 scale-105 z-10 bg-background' 
                    : 'border-border bg-card/50 hover:bg-background hover:border-primary/30'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                     <div className="bg-primary text-primary-foreground px-4 py-1.5 text-sm font-semibold rounded-full shadow-lg flex items-center gap-1.5">
                       <Zap className="w-3.5 h-3.5 fill-current" /> Most Popular
                     </div>
                  </div>
                )}
                
                <CardHeader className="space-y-4 pb-8 pt-8">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                        {plan.icon && <plan.icon className="h-6 w-6 text-primary absolute top-8 right-6 opacity-20" />}
                      </div>
                   </div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="text-muted-foreground font-medium">{plan.period}</span>
                   </div>
                   <CardDescription className="text-base pt-2">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                   <div className="space-y-4">
                      <div className="h-px bg-border/50 w-full" />
                      <ul className="space-y-4 text-sm mt-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3.5">
                            <div className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 ${plan.highlight ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <Check className="h-3 w-3" />
                            </div>
                            <span className="text-foreground/80 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                </CardContent>

                <CardFooter className="pt-8 pb-8">
                   <Button 
                      className={`w-full h-12 text-base font-semibold shadow-sm ${plan.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                      variant={plan.highlight ? "default" : "outline"}
                      disabled={plan.disabled}
                   >
                      {plan.cta}
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted p-1 bg-opacity-50">
             <div className="bg-background/40 backdrop-blur-sm rounded-[14px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-3 max-w-2xl">
                   <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
                      <Shield className="h-6 w-6 text-primary" /> 
                      Enterprise & Teams
                   </h3>
                   <p className="text-lg text-muted-foreground">
                      Looking to onboard your entire organization? We offer custom SSO, dedicated support, and bulk pricing.
                   </p>
                </div>
                <Button size="lg" variant="secondary" className="min-w-[160px]">Contact Sales</Button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
