"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, 
  Briefcase, 
  Star, 
  Clock, 
  Bell, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  CreditCard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";

interface Service {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
}

interface MentorDetails {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  headline: string;
  about: string;
  expertise: string[];
  rating: number;
  reviews: number;
  status: 'online' | 'offline';
  services: Service[];
}

// Mock Data (In a real app, fetch this by ID)
const MOCK_MENTOR_DETAILS: MentorDetails = {
  id: "1",
  name: "Sarah Chen",
  role: "Senior Product Designer",
  company: "Airbnb",
  avatar: "https://github.com/shadcn.png",
  headline: "Helping designers break into big tech. Ex-Google, Ex-Meta.",
  about: "I have over 10 years of experience in product design, working with top tier tech companies. I specialize in helping junior designers navigate their career paths, improve their portfolios, and prepare for interviews. My mentorship style is direct, actionable, and supportive.",
  expertise: ["UX Design", "Career Guidance", "Portfolio Review", "Interview Prep", "Design Systems"],
  rating: 4.9,
  reviews: 120,
  status: "online",
  services: [
    { id: "s1", title: "1:1 Career Chat", price: 500, duration: "30 min", description: "Quick chat to discuss your career goals and blockers." },
    { id: "s2", title: "Portfolio Review", price: 1500, duration: "60 min", description: "Deep dive into your portfolio. I'll provide actionable feedback on 2-3 case studies." },
    { id: "s3", title: "Mock Interview", price: 2000, duration: "60 min", description: "Real-world interview simulation with detailed feedback." },
  ],
};

import { useNavigation } from "@/contexts/navigation-context";

export default function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // In real app, fetch mentor by params.id
  const mentor = MOCK_MENTOR_DETAILS; // This line remains as per original, assuming the new `useState<typeof MOCK_MENTOR | null>(null)` was a typo/incomplete snippet.

  useEffect(() => {
    setActiveSection("Connect");
    setActiveSubSection("Mentor Profile");
  }, [setActiveSection, setActiveSubSection]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsPaymentOpen(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsPaymentOpen(false);
    
    toast.success("Payment Successful!", {
      description: `You have booked ${selectedService?.title} with ${mentor.name}.`,
    });

    // In a real app, redirect to call or booking confirmation
    // router.push("/dashboard/meet/..."); 
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Header / Nav */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Mentor Profile</h1>
      </div>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative shrink-0">
               <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-background ${mentor.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            
            <div className="space-y-2 flex-1">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold">{mentor.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4" /> {mentor.role} @ <span className="font-medium text-foreground">{mentor.company}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full self-start">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{mentor.rating}</span>
                      <span className="text-muted-foreground text-sm">({mentor.reviews} reviews)</span>
                  </div>
               </div>
               
               <p className="text-lg font-medium leading-relaxed max-w-2xl text-foreground/90">
                 {mentor.headline}
               </p>

               <div className="flex flex-wrap gap-2 pt-2">
                 {mentor.expertise.map(tag => (
                   <Badge key={tag} variant="secondary" className="bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-default">
                     {tag}
                   </Badge>
                 ))}
               </div>
            </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Left Column: About & Services */}
            <div className="space-y-8">
                <section className="space-y-4">
                  <h3 className="text-xl font-semibold">About</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {mentor.about}
                  </p>
                </section>

                <section className="space-y-4">
                   <h3 className="text-xl font-semibold">Available Services</h3>
                   <div className="space-y-4">
                      {mentor.services.map(service => (
                        <Card 
                          key={service.id} 
                          className="hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden"
                          onClick={() => handleServiceClick(service)}
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          <CardHeader>
                            <div className="flex justify-between items-start">
                               <CardTitle className="text-lg group-hover:text-primary transition-colors">{service.title}</CardTitle>
                               <Badge variant="secondary" className="text-sm font-semibold">
                                 {service.price === 0 ? "Free" : `₹${service.price}`}
                               </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                               <Clock className="h-3.5 w-3.5" /> {service.duration}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                             <p className="text-sm text-muted-foreground">{service.description}</p>
                          </CardContent>
                          <CardFooter>
                              <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                 Book Now
                              </Button>
                          </CardFooter>
                        </Card>
                      ))}
                   </div>
                </section>
            </div>

            {/* Right Column: Trust & Info */}
            <div className="space-y-6">
                <Card className="bg-muted/30 border-none shadow-none">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                       <ShieldCheck className="h-5 w-5 text-green-600" /> Verified Mentor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-4">
                    <p>
                       This mentor has been verified by the Helixque team for their identity and professional background.
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                         <CheckCircle2 className="h-4 w-4 text-primary" /> <span>Identity Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <CheckCircle2 className="h-4 w-4 text-primary" /> <span>Employment Verified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
        </div>

        {/* Payment Logic Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
           <DialogContent className="sm:max-w-md">
             <DialogHeader>
               <DialogTitle>Complete Payment</DialogTitle>
               <DialogDescription>
                  You are booking <strong>{selectedService?.title}</strong> for <strong>₹{selectedService?.price}</strong>.
               </DialogDescription>
             </DialogHeader>
             
             <div className="grid gap-4 py-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                   <div className="flex justify-between text-sm">
                      <span>Service Fee</span>
                      <span>₹{selectedService?.price}</span>
                   </div>
                   <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Platform Fee (2%)</span>
                      <span>₹{selectedService ? Math.round(selectedService.price * 0.02) : 0}</span>
                   </div>
                   <Separator />
                   <div className="flex justify-between font-bold">
                       <span>Total</span>
                       <span>₹{selectedService ? selectedService.price + Math.round(selectedService.price * 0.02) : 0}</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="card">Card Details (Mock)</Label>
                   <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="card" placeholder="0000 0000 0000 0000" className="pl-9" />
                   </div>
                </div>
             </div>

             <DialogFooter>
               <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Cancel</Button>
               <Button onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Pay ₹${selectedService ? selectedService.price + Math.round(selectedService.price * 0.02) : 0}`}
               </Button>
             </DialogFooter>
           </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
