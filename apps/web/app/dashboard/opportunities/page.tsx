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
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "sonner";

// Mock Data
const OPPORTUNITIES = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechFlow Systems",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $150k",
    posted: "2h ago",
    tags: ["React", "TypeScript", "Next.js"],
    logo: "https://avatar.vercel.sh/techflow",
  },
  {
    id: 2,
    title: "Mentorship Session: Career Growth",
    company: "Jane Doe (Staff Engineer)",
    location: "Video Call",
    type: "Mentorship",
    salary: "Free",
    posted: "5h ago",
    tags: ["Career", "Leadership", "1:1"],
    logo: "https://avatar.vercel.sh/jane",
  },
  {
    id: 3,
    title: "Freelance UI Designer",
    company: "Creative Studio",
    location: "Hybrid (NY)",
    type: "Contract",
    salary: "$80/hr",
    posted: "1d ago",
    tags: ["Figma", "Design Systems"],
    logo: "https://avatar.vercel.sh/creative",
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "DataStream",
    location: "Remote",
    type: "Full-time",
    salary: "$130k - $160k",
    posted: "1d ago",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    logo: "https://avatar.vercel.sh/datastream",
  },
  {
    id: 5,
    title: "Product Manager",
    company: "Helixque Internal",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140k - $170k",
    posted: "2d ago",
    tags: ["Product", "Strategy", "Agile"],
    logo: "https://avatar.vercel.sh/helixque",
  },
  {
    id: 6,
    title: "Open Source Contributor",
    company: "Community Project",
    location: "Remote",
    type: "Volunteer",
    salary: "Unpaid",
    posted: "3d ago",
    tags: ["Open Source", "Community"],
    logo: "https://avatar.vercel.sh/opensource",
  },
];

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOpportunities = OPPORTUNITIES.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = () => {
    toast.success("Application Sent", {
      description: "Your profile has been shared with the poster.",
    });
  };

  const handleSave = () => {
    toast("Saved", {
      description: "Added to your saved items.",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="text-muted-foreground">
          Find your next job, mentorship, or collaboration project.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters / Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by role, company, or keyword..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <select 
                className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                defaultValue="all"
             >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="contract">Contract</option>
                <option value="mentorship">Mentorship</option>
             </select>
           </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main List */}
        <div className="md:col-span-4 grid gap-4">
            {filteredOpportunities.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    No opportunities found matching your search.
                </div>
            )}
          {filteredOpportunities.map((job) => (
            <Card key={job.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted border flex items-center justify-center overflow-hidden">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={job.logo} alt={job.company} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3" /> {job.company}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleSave}>
                        <Bookmark className="h-4 w-4 text-muted-foreground" />
                    </Button>
                     <Button size="sm" onClick={handleApply}>Easy Apply</Button>
                </div>
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
                <div className="flex gap-2 mt-4">
                    {job.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
