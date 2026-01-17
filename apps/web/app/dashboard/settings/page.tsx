"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Moon } from "lucide-react";

function SettingsContent() {
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    setActiveSection("Account");
    setActiveSubSection("Settings");
    
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [setActiveSection, setActiveSubSection, searchParams]);

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
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Moon className="h-4 w-4" />
                     <Label>Dark Mode</Label>
                  </div>
                  {/* Custom Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
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
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                   </Avatar>
                   <Button variant="outline" size="sm">Change Avatar</Button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Jay anth" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="m@example.com" disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
               <CardHeader>
                  <CardTitle className="text-destructive">Delete Account</CardTitle>
                  <CardDescription>Permanently remove your account and all data.</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
               </CardContent>
               <CardFooter>
                  <Button variant="destructive">Delete Account</Button>
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
                 {/* Custom Switch */}
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
                 {/* Custom Switch */}
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
