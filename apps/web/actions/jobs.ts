"use server";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  url: string;
  description: string; // HTML or Text
  tags: string[];
  logo?: string;
  source: "Adzuna" | "Remotive" | "Mock";
}

export type ExperienceLevel = "all" | "fresher" | "0-1" | "1-3" | "3-5" | "5+";
export type JobType = "all" | "full-time" | "contract" | "part-time";

export interface JobFilters {
  type?: JobType;
  level?: ExperienceLevel;
  remote?: boolean;
  location?: string;
  salaryMin?: number;
}

/**
 * Fetch jobs from Adzuna (Primary) or Remotive (Fallback)
 */
export async function searchJobs(
  query: string = "",
  page: number = 1,
  filters: JobFilters = {},
): Promise<Job[]> {
  try {
    // 1. Try Adzuna if keys exist
    if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_API_KEY) {
      try {
        return await fetchAdzunaJobs(query, page, filters);
      } catch (e) {
        console.warn("Adzuna failed, falling back to Remotive", e);
      }
    } else {
      console.warn("No Adzuna keys found, using Remotive.");
    }

    // 2. Fallback to Remotive (Free, No Key, Remote Only)
    // Remotive doesn't support pagination well in free API, so we just return page 1
    if (page === 1) {
      return await fetchRemotiveJobs(query, filters);
    }
    return [];
  } catch (error) {
    console.error("All job fetchers failed:", error);
    return [];
  }
}

// --- ADZUNA API (Primary - Global & Local) ---
async function fetchAdzunaJobs(
  query: string,
  page: number,
  filters: JobFilters,
): Promise<Job[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_API_KEY;
  const country = "in"; // Default to India, but search location can override

  const baseUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
  const url = new URL(baseUrl);

  url.searchParams.set("app_id", appId!);
  url.searchParams.set("app_key", appKey!);
  url.searchParams.set("results_per_page", "20");
  url.searchParams.set("content-type", "application/json");

  // Construct Smart Query
  let finalQuery = query || "developer";

  // Smart Keywords for Experience (since API lacks explicit filter)
  // We append these to the 'what' parameter to filter by relevance
  if (filters.level === "fresher" || filters.level === "0-1")
    finalQuery += " (fresher OR intern OR graduate OR trainee OR entry level)";
  if (filters.level === "1-3")
    finalQuery += " (junior OR associate OR 1 year OR 2 years)";
  if (filters.level === "3-5")
    finalQuery += " (mid level OR senior OR 3 years OR 4 years OR 5 years)";
  if (filters.level === "5+")
    finalQuery += " (lead OR principal OR manager OR senior OR architect)";

  if (filters.remote) finalQuery += " remote";

  url.searchParams.set("what", finalQuery);

  // Location Filter
  if (filters.location) {
    url.searchParams.set("where", filters.location);
  }

  // Salary Filter (Adzuna supports 'salary_min')
  if (filters.salaryMin) {
    url.searchParams.set("salary_min", filters.salaryMin.toString());
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Adzuna Error: ${res.status}`);

  const data = await res.json();

  return data.results.map((job: any) => ({
    id: String(job.id),
    title: job.title.replace(/<\/?[^>]+(>|$)/g, ""),
    company: job.company.display_name,
    location: job.location.display_name,
    type: job.contract_time === "full_time" ? "Full-time" : "Contract",
    salary: job.salary_min
      ? `₹${Math.round(job.salary_min).toLocaleString()} - ₹${Math.round(job.salary_max).toLocaleString()}`
      : "Not disclosed",
    posted: new Date(job.created).toLocaleDateString(),
    url: job.redirect_url,
    description: job.description.replace(/<\/?[^>]+(>|$)/g, ""), // Adzuna gives simple snippet
    tags: job.category?.label ? [job.category.label] : [],
    logo: undefined,
    source: "Adzuna",
  }));
}

// --- REMOTIVE API (Fallback - Remote Only) ---
async function fetchRemotiveJobs(
  query: string,
  filters: JobFilters,
): Promise<Job[]> {
  const url = `https://remotive.com/api/remote-jobs?limit=50&search=${encodeURIComponent(query || "developer")}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Remotive Error: ${res.status}`);

  const data = await res.json();

  // Client-side filtering for Remotive
  let jobs = data.jobs;

  if (filters.level) {
    // Very rough keyword match
    if (filters.level === "fresher" || filters.level === "0-1")
      jobs = jobs.filter((j: any) =>
        /junior|entry|graduate|intern/i.test(j.title),
      );
    if (filters.level === "5+")
      jobs = jobs.filter((j: any) =>
        /senior|lead|principal|staff/i.test(j.title),
      );
  }

  if (filters.location) {
    jobs = jobs.filter((j: any) =>
      j.candidate_required_location
        ?.toLowerCase()
        .includes(filters.location!.toLowerCase()),
    );
  }

  return jobs.slice(0, 20).map((job: any) => ({
    id: String(job.id),
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || "Remote",
    type: job.job_type || "Full-time",
    salary: job.salary || "Not disclosed",
    posted: new Date(job.publication_date).toLocaleDateString(),
    url: job.url,
    description: job.description, // Remotive gives full HTML
    tags: job.tags || [],
    logo: job.company_logo,
    source: "Remotive",
  }));
}
