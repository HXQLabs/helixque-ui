"use client";

import { useNavigation } from "@/contexts/navigation-context";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton"; // Assuming we have or will use basic divs if missing
import { ExternalLink, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  social_image: string;
  tag_list: string[];
  url: string;
  positive_reactions_count: number;
  comments_count: number;
  readable_publish_date: string;
  user: {
    name: string;
    profile_image: string;
  };
}

export default function BlogsPage() {
  const { setActiveSection, setActiveSubSection } = useNavigation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setActiveSection("Resources");
    setActiveSubSection("Blogs");

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://dev.to/api/articles?tag=career&top=1&per_page=9&page=${page}`,
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setActiveSection, setActiveSubSection, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of the content area
    const contentArea = document.querySelector(".overflow-y-auto");
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tech & Career Insights
        </h1>
        <p className="text-muted-foreground mt-2">
          Curated articles from the developer community.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-48 bg-muted rounded-xl animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col overflow-hidden group hover:border-primary/50 transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {post.cover_image || post.social_image ? (
                    <img
                      src={post.cover_image || post.social_image}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {post.tag_list.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.title}
                    </a>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.description}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center border-t pt-4 bg-muted/10">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.user.profile_image}
                      alt={post.user.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {post.user.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />{" "}
                      {post.positive_reactions_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />{" "}
                      {post.comments_count}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-8 pb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "ghost"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
