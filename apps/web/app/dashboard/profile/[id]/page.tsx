"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  MapPin,
  Briefcase,
  Globe,
  UserPlus,
  MessageSquare,
  Check,
  Clock,
  Calendar,
  Code,
  Languages,
} from "lucide-react";
import { toast } from "sonner";

const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";

export default function ProfileViewPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "FRIENDS"
  >("NONE");
  const [requestId, setRequestId] = useState<string | null>(null);

  const currentUserId = session?.user?.id;
  const isOwnProfile = currentUserId === id;

  useEffect(() => {
    if (id && currentUserId) {
      fetchAllData();
    }
  }, [id, currentUserId]);

  const fetchAllData = async () => {
    try {
      const profileRes = await fetch(`${BACKEND_URI}/users/${id}`);

      // Profile Data
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
      } else {
        throw new Error("User not found");
      }
      // Connection check removed for performance pivot
    } catch (e) {
      console.error(e);
      toast.error("Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAction = () => {
    toast("Connections updating...", {
      description:
        "We are upgrading our social infrastructure. Connecting will be back soon!",
      icon: <Clock className="w-4 h-4 text-primary" />,
    });
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  if (!user) return <div className="p-8 text-center">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header Card */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-violet-600" />
        <CardContent className="relative pt-0 px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="text-3xl">
                {user.username?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 pt-2 md:pt-0">
              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-muted-foreground font-medium">
                  {user.headline || user.role || "Member"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {user.domain && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {user.domain}
                  </div>
                )}
                {user.preferences?.timezone && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {user.preferences.timezone}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {user.yearsExperience} Exp
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-2 md:mb-0">
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/edit-profile")}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button onClick={handleConnectAction}>
                  <UserPlus className="w-4 h-4 mr-2" /> Connect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: About & Skills */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {user.bio || "No bio provided yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" /> Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No skills listed.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-green-500" /> Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.languages && user.languages.length > 0 ? (
                  user.languages.map((lang: string) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">
                    No languages listed.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <Badge
                  variant={user.status === "ONLINE" ? "default" : "secondary"}
                >
                  {user.status || "OFFLINE"}
                </Badge>
              </div>
              {user.preferences?.workingHours && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">
                    Working Hours
                  </span>
                  <span className="text-sm font-medium">
                    {user.preferences.workingHours}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
