"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { DiscussionCard } from "@/components/discussion-card";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface Discussion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string | null;
    imageUrl: string | null;
  };
  _count: {
    comments: number;
    reactions: number;
  };
  reactions: any[];
  isSaved?: boolean;
}

export default function SavedPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const { data: session } = useSession();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";

  useEffect(() => {
    setActiveSection("Resources");
    setActiveSubSection("Saved Items");
  }, [setActiveSection, setActiveSubSection]);

  const {
    data: discussions,
    isLoading: loading,
    mutate,
  } = useSWR<Discussion[]>(
    session?.user?.id
      ? `${backendUrl}/discussions/saved?userId=${session.user.id}`
      : null,
    fetcher,
    {
      fallbackData: [],
    },
  );

  const handleSaveToggle = (postId: string, isSaved: boolean) => {
    // Optimistic update: if unsaved, remove from list immediately
    if (!isSaved && discussions) {
      mutate(
        discussions.filter((p) => p.id !== postId),
        false,
      );
      // The DiscussionCard component handles the actual API call, so we just need to update the local list view
      // We should ideally verify the API call succeeded, but DiscussionCard manages that state.
      // However, since we are removing it, if the API call fails in DiscussionCard, we might be out of sync.
      // For now, this is a good optimistic UX for the "Saved" page.

      // Revalidate after a short delay to ensure backend state consistency
      setTimeout(() => mutate(), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
        <p className="text-muted-foreground mt-1">
          Your collection of bookmarked discussions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !discussions || discussions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>You haven't saved any items yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {discussions.map((post) => (
            <DiscussionCard
              key={post.id}
              post={{ ...post, isSaved: true }} // Ensure isSaved is true for items in this list
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
