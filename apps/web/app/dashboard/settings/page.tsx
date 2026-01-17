"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Moon, Sun, Monitor, Loader2, AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
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

function SettingsContent() {
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  /* Mounted check to avoid hydration mismatch for theme buttons */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-6">Loading settings...</div>; // Or return null/skeleton
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
       toast.error("Cannot delete account: User ID not found");
       setIsDeleting(false);
       return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";
      const response = await fetch(`${backendUrl}/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");
      
      toast.success("Account deleted successfully");
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 space-y-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Custom Tabs */}
        <div className="flex gap-2 border-b">
          {['general', 'account', 'notifications'].map((tab) => (
             <Button 
               key={tab}
               variant={activeTab === tab ? "default" : "ghost"}
               onClick={() => setActiveTab(tab)}
               className="capitalize rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
               data-state={activeTab === tab ? "active" : ""}
             >
               {tab}
             </Button>
          ))}
        </div>

        {activeTab === "general" && (
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground mb-4">Select the color theme for the dashboard.</p>
                  <div className="grid grid-cols-3 gap-2 max-w-md">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"} 
                      className="justify-start gap-2" 
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"} 
                      className="justify-start gap-2" 
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                     <Button 
                      variant={theme === "system" ? "default" : "outline"} 
                      className="justify-start gap-2" 
                      onClick={() => setTheme("system")}
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "account" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                   <Avatar className="h-16 w-16">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback className="text-lg">{(session?.user?.name || "U").charAt(0)}</AvatarFallback>
                   </Avatar>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={session?.user?.name || ""} disabled />
                  <p className="text-xs text-muted-foreground">Managed via Edit Profile.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={session?.user?.email || ""} disabled />
                </div>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" onClick={() => router.push("/dashboard/edit-profile")}>Edit Profile</Button> 
              </CardFooter>
            </Card>
            
            <Card className="border-destructive/20 bg-destructive/5">
               <CardHeader>
                  <CardTitle className="text-destructive">Delete Account</CardTitle>
                  <CardDescription>Permanently remove your account and all data.</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
               </CardContent>
               <CardFooter>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                          Delete Account
                        </DialogTitle>
                        <DialogDescription>
                          Are you absolutely sure? This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Confirm Delete"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
               </CardFooter>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
           <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive via email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                   <Label>Product Updates</Label>
                   <p className="text-sm text-muted-foreground">Receive news about new features and improvements.</p>
                 </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
              </div>
              <Separator />
               <div className="flex items-center justify-between">
                 <div className="space-y-1">
                   <Label>Mentorship Requests</Label>
                   <p className="text-sm text-muted-foreground">Get notified when someone requests a session.</p>
                 </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
              </div>
            </CardContent>
           </Card>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
