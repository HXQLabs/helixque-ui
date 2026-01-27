"use client";

import * as React from "react";
import {
  Briefcase,
  MapPin,
  Search,
  Filter,
  DollarSign,
  Clock,
  Building2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  GlobeIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@workspace/ui/components/sheet";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "sonner";
import {
  searchJobs,
  type Job,
  type JobFilters,
  type ExperienceLevel,
  type JobType,
} from "@/actions/jobs";
import { Loader2 } from "lucide-react";

function OpportunitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = React.useState(
    searchParams.get("q") || "",
  );
  const [page, setPage] = React.useState(Number(searchParams.get("page")) || 1);

  const [filters, setFilters] = React.useState<JobFilters>({
    type: (searchParams.get("type") as JobType) || "all",
    level: (searchParams.get("level") as ExperienceLevel) || "all",
    remote: searchParams.get("remote") === "true",
    location: searchParams.get("location") || "",
    salaryMin: Number(searchParams.get("salary")) || 0,
  });

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  // Sync State to URL
  const updateUrl = React.useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (page > 1) params.set("page", page.toString());
    if (filters.type && filters.type !== "all")
      params.set("type", filters.type);
    if (filters.level && filters.level !== "all")
      params.set("level", filters.level);
    if (filters.remote) params.set("remote", "true");
    if (filters.location) params.set("location", filters.location);
    if (filters.salaryMin) params.set("salary", filters.salaryMin.toString());

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, page, filters, router]);

  // Debounce Search & Fetch
  React.useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl();
      fetchJobs();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, page, filters]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      // Clean filters for API
      const activeFilters: JobFilters = {
        ...(filters.type !== "all" && { type: filters.type }),
        ...(filters.level !== "all" && { level: filters.level }),
        ...(filters.remote && { remote: true }),
        ...(filters.location && { location: filters.location }),
        ...(filters.salaryMin && { salaryMin: filters.salaryMin }),
      };

      const results = await searchJobs(
        searchTerm || "developer",
        page,
        activeFilters,
      );
      setJobs(results);
    } catch (e) {
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (url: string) => {
    window.open(url, "_blank");
    toast.success("Opening Application", {
      description: "Redirecting to job source...",
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast("Saved", {
      description: "Added to your saved items.",
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex flex-col gap-2 p-6 border-b border-border/50">
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground">
          Find your next job, mentorship, or collaboration project.
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Filters */}
        <aside className="w-64 border-r border-border/50 p-4 overflow-y-auto hidden md:block">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>

              {/* Location Filter */}
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="City (e.g. Mumbai)"
                    className="pl-8 h-9 text-sm"
                    value={filters.location || ""}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({ ...filters, location: e.target.value });
                    }}
                  />
                </div>
              </div>

              {/* Remote Toggle */}
              <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg mb-4">
                <input
                  type="checkbox"
                  id="remote"
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  checked={filters.remote || false}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({ ...filters, remote: e.target.checked });
                  }}
                />
                <label
                  htmlFor="remote"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Remote Only
                </label>
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Experience
              </label>
              <div className="space-y-2">
                {[
                  { id: "all", label: "Any Experience" },
                  { id: "0-1", label: "0-1 Years (Fresher)" },
                  { id: "1-3", label: "1-3 Years (Junior)" },
                  { id: "3-5", label: "3-5 Years (Mid-Senior)" },
                  { id: "5+", label: "5+ Years (Lead/Manager)" },
                ].map((level) => (
                  <div key={level.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="jobLevel"
                      id={`level-${level.id}`}
                      checked={filters.level === level.id}
                      onChange={() => {
                        setPage(1);
                        setFilters({
                          ...filters,
                          level: level.id as ExperienceLevel,
                        });
                      }}
                      className="text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`level-${level.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {level.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Filter */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Min Salary
              </label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={filters.salaryMin || 0}
                onChange={(e) => {
                  setPage(1);
                  setFilters({ ...filters, salaryMin: Number(e.target.value) });
                }}
              >
                <option value={0}>Any Salary</option>
                <option value={300000}>Top 3 LPA+</option>
                <option value={600000}>Top 6 LPA+</option>
                <option value={1000000}>Top 10 LPA+</option>
                <option value={1500000}>Top 15 LPA+</option>
                <option value={2500000}>Top 25 LPA+</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content: Search & List */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search Bar */}
          <div className="p-4 border-b border-border/50 bg-background/95 backdrop-blur-sm z-10">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by role (e.g. React Developer, Designer)..."
                className="pl-9 bg-muted/30"
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Job List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Finding the perfect role for you...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p className="text-lg font-medium">No jobs found.</p>
                <p className="text-sm">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setFilters({
                      type: "all",
                      level: "all",
                      remote: false,
                      location: "",
                      salaryMin: 0,
                    });
                    setSearchTerm("");
                    setPage(1);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="group hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="flex gap-4 min-w-0">
                        <div className="h-12 w-12 rounded-lg bg-muted border flex items-center justify-center overflow-hidden shrink-0">
                          {job.logo ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={job.logo}
                              alt={job.company}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <CardTitle
                            className="text-lg font-semibold truncate pr-2"
                            title={job.title}
                          >
                            {job.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1 truncate">
                            {job.company}
                            {job.source === "Adzuna" && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-[10px] h-4 shrink-0"
                              >
                                Verified
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 -mr-2 -mt-2"
                        onClick={handleSave}
                      >
                        <Bookmark className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" /> {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" /> {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {job.posted}
                        </div>
                      </div>

                      {/* Snippet from description (stripped) */}
                      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                        {job.description
                          ? job.description.replace(/<[^>]*>?/gm, "")
                          : "No description available."}
                      </p>

                      <div className="flex gap-2 mt-4 flex-wrap">
                        {job.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="font-normal text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {job.source === "Remotive" && (
                          <Badge
                            variant="outline"
                            className="font-normal text-xs border-blue-200 text-blue-700 bg-blue-50"
                          >
                            Remote
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && jobs.length > 0 && (
              <div className="flex items-center justify-center gap-4 py-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    const el = document.querySelector(".scroll-smooth");
                    if (el) el.scrollTop = 0;
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                  Page {page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((p) => p + 1);
                    const el = document.querySelector(".scroll-smooth");
                    if (el) el.scrollTop = 0;
                  }}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Sheet */}
      <Sheet
        open={!!selectedJob}
        onOpenChange={(open) => !open && setSelectedJob(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col gap-0"
        >
          {selectedJob && (
            <>
              <SheetHeader className="p-6 border-b border-border/50 bg-muted/10">
                <div className="flex gap-4">
                  <div className="h-16 w-16 rounded-lg bg-background border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {selectedJob.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={selectedJob.logo}
                        alt={selectedJob.company}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <SheetTitle className="text-xl">
                      {selectedJob.title}
                    </SheetTitle>
                    <SheetDescription className="text-base mt-1 text-foreground font-medium">
                      {selectedJob.company}
                    </SheetDescription>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {selectedJob.location}
                      <span className="text-border">•</span>
                      <Clock className="h-3.5 w-3.5" /> Posted{" "}
                      {selectedJob.posted}
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Salary
                    </span>
                    <p className="font-medium text-sm flex items-center gap-1.5 mt-1">
                      <DollarSign className="h-4 w-4 text-green-600" />{" "}
                      {selectedJob.salary}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Job Type
                    </span>
                    <p className="font-medium text-sm flex items-center gap-1.5 mt-1">
                      <Briefcase className="h-4 w-4 text-blue-600" />{" "}
                      {selectedJob.type}
                    </p>
                  </div>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h3 className="text-lg font-semibold mb-3">About the job</h3>
                  {selectedJob.source === "Adzuna" ? (
                    <p className="leading-relaxed">
                      {selectedJob.description.replace(/<[^>]*>?/gm, "")}
                      <br />
                      <br />
                      <span className="italic text-muted-foreground">
                        Note: This is a preview. Please click Apply to view the
                        full description on the source website.
                      </span>
                    </p>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedJob.description,
                      }}
                    />
                  )}
                </div>

                {selectedJob.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <h4 className="text-sm font-semibold mb-3">
                      Skills & Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <SheetFooter className="p-6 border-t border-border/50 bg-background sm:justify-between flex-row items-center gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSave}
                >
                  <Bookmark className="h-4 w-4 mr-2" /> Save
                </Button>
                <Button
                  className="flex-[2]"
                  onClick={() => handleApply(selectedJob!.url)}
                >
                  Apply on Company Website
                  <GlobeIcon className="h-4 w-4 ml-2" />
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <OpportunitiesContent />
    </React.Suspense>
  );
}
